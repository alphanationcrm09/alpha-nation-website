import { createHash, createHmac } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import type { NextRequest } from "next/server";
import { runtimeEnv } from "@/lib/runtime-env";

export type SubmissionKind = "appointment" | "inquiry";

export function isPublicSubmissionConfigured() {
  return Boolean(
    runtimeEnv("NEXT_PUBLIC_SUPABASE_URL")
    && (runtimeEnv("SUPABASE_SECRET_KEY") || runtimeEnv("SUPABASE_SERVICE_ROLE_KEY"))
    && runtimeEnv("TURNSTILE_SECRET_KEY"),
  );
}

export function getPrivilegedSubmissionClient() {
  const url = runtimeEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceKey = runtimeEnv("SUPABASE_SECRET_KEY") || runtimeEnv("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceKey) return null;
  return createClient<any>(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
  });
}

export function getClientIpHash(request: NextRequest) {
  const rawIp = request.headers.get("cf-connecting-ip")
    || (process.env.NODE_ENV !== "production" ? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() : null);
  if (!rawIp) return null;
  return createHash("sha256").update(rawIp).digest("hex");
}

export type TurnstileVerification = { ok: true } | { ok: false; code: string };

export async function verifyTurnstileDetailed(
  request: NextRequest,
  token: unknown,
  action: SubmissionKind,
): Promise<TurnstileVerification> {
  const secret = runtimeEnv("TURNSTILE_SECRET_KEY");
  const configuredHosts = (runtimeEnv("TURNSTILE_ALLOWED_HOSTNAMES") || "")
    .split(",").map((host) => host.trim().toLowerCase()).filter(Boolean);

  if (!secret) return { ok: false, code: "TURNSTILE_SECRET_MISSING" };
  if (typeof token !== "string" || token.length < 10 || token.length > 2048) {
    return { ok: false, code: "TURNSTILE_TOKEN_MISSING_OR_INVALID" };
  }

  const origin = request.headers.get("origin");
  let requestHost = "";
  try {
    // On Cloudflare, use the incoming Host header as the canonical public host.
    // request.url can be normalized by the adapter and is not a reliable source
    // for comparing the browser's Origin scheme and port.
    const hostHeader = request.headers.get("host");
    requestHost = (hostHeader
      ? new URL(`https://${hostHeader}`).hostname
      : new URL(request.url).hostname).toLowerCase();
    if (!requestHost) return { ok: false, code: "TURNSTILE_ORIGIN_INVALID" };

    // A browser POST includes Origin. Compare hostnames only: HTTPS termination
    // and default-port normalization can make full-origin strings differ even
    // when the request is same-origin.
    if (origin) {
      const originUrl = new URL(origin);
      if (originUrl.hostname.toLowerCase() !== requestHost) {
        return { ok: false, code: "TURNSTILE_ORIGIN_MISMATCH" };
      }
    }
    if (configuredHosts.length && !configuredHosts.includes(requestHost)) {
      return { ok: false, code: "TURNSTILE_REQUEST_HOST_NOT_ALLOWED" };
    }
  } catch {
    return { ok: false, code: "TURNSTILE_ORIGIN_INVALID" };
  }

  const form = new URLSearchParams({ secret, response: token });
  const ip = request.headers.get("cf-connecting-ip");
  if (ip) form.set("remoteip", ip);

  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: form,
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return { ok: false, code: "TURNSTILE_SITEVERIFY_HTTP_ERROR" };

    const result = await response.json() as {
      success?: boolean;
      hostname?: string;
      action?: string;
      "error-codes"?: string[];
    };

    if (result.success !== true) {
      const errors = Array.isArray(result["error-codes"]) ? result["error-codes"] : [];
      if (errors.includes("invalid-input-secret")) return { ok: false, code: "TURNSTILE_SECRET_INVALID" };
      if (errors.includes("timeout-or-duplicate")) return { ok: false, code: "TURNSTILE_TOKEN_EXPIRED_OR_DUPLICATE" };
      if (errors.includes("invalid-input-response")) return { ok: false, code: "TURNSTILE_TOKEN_INVALID" };
      if (errors.includes("missing-input-response")) return { ok: false, code: "TURNSTILE_TOKEN_MISSING" };
      return { ok: false, code: "TURNSTILE_SITEVERIFY_REJECTED" };
    }

    if (result.action !== action) return { ok: false, code: "TURNSTILE_ACTION_MISMATCH" };
    if (typeof result.hostname !== "string" || result.hostname.toLowerCase() !== requestHost) {
      return { ok: false, code: "TURNSTILE_HOSTNAME_MISMATCH" };
    }
    if (configuredHosts.length && !configuredHosts.includes(result.hostname.toLowerCase())) {
      return { ok: false, code: "TURNSTILE_VERIFIED_HOST_NOT_ALLOWED" };
    }
    return { ok: true };
  } catch {
    return { ok: false, code: "TURNSTILE_SITEVERIFY_NETWORK_ERROR" };
  }
}

export async function verifyTurnstile(request: NextRequest, token: unknown, action: SubmissionKind) {
  return (await verifyTurnstileDetailed(request, token, action)).ok;
}

export function cleanText(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export function validPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  return /^[0-9+() .-]{7,32}$/.test(value) && digits.length >= 7 && digits.length <= 15;
}

export function createSubmissionFingerprint(kind: SubmissionKind, values: Record<string, string>) {
  const secret = runtimeEnv("SUPABASE_SECRET_KEY") || runtimeEnv("SUPABASE_SERVICE_ROLE_KEY");
  if (!secret) return null;
  const day = new Date().toISOString().slice(0, 10);
  const canonical = JSON.stringify({ kind, day, values });
  return createHmac("sha256", secret).update(canonical).digest("hex");
}

export async function isActiveServiceState(client: any, stateCode: string) {
  const { data, error } = await client
    .from("service_states")
    .select("state_code")
    .eq("state_code", stateCode)
    .eq("status", "active")
    .maybeSingle();
  return !error && Boolean(data);
}

export function validEmail(value: string) {
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function consumeRateLimit(request: NextRequest, kind: SubmissionKind, client: any) {
  const ipHash = getClientIpHash(request);
  if (!ipHash) return false;

  // Keep rpc() bound to the Supabase client. Extracting it into a standalone
  // function loses its client context and can cause "reading 'rest'" errors.
  const { data, error } = await client.rpc("consume_website_submission_limit", {
    p_ip_hash: ipHash,
    p_submission_type: kind,
    p_max: 5,
    p_window_seconds: 3600,
  });
  return !error && data === true;
}

export async function sendOwnerNotification(kind: "appointment" | "inquiry", summary: string) {
  const apiKey = runtimeEnv("RESEND_API_KEY");
  const from = runtimeEnv("RESEND_FROM_EMAIL");
  const to = runtimeEnv("LEAD_NOTIFICATION_EMAIL") || "khanbahi202502@gmail.com";
  const site = runtimeEnv("NEXT_PUBLIC_SITE_URL") || "https://alpha-nation-website.workers.dev";
  if (!apiKey || !from) return false;
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        from, to: [to],
        subject: kind === "appointment" ? "New Alpha Nation appointment request" : "New Alpha Nation website inquiry",
        text: `A new ${kind} has been submitted on the Alpha Nation website.\\n\\n${summary}\\n\\nOpen the secure admin panel to review customer details: ${site}/admin\\n\\nThis notification intentionally excludes personal customer details.`,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(6000),
    });
    return response.ok;
  } catch {
    return false;
  }
}
