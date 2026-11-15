import { createHash } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import type { NextRequest } from "next/server";
import { runtimeEnv } from "@/lib/runtime-env";

export type SubmissionKind = "appointment" | "inquiry";

export function isPublicSubmissionConfigured() {
  return Boolean(
    runtimeEnv("NEXT_PUBLIC_SUPABASE_URL")
    && (runtimeEnv("SUPABASE_SECRET_KEY") || runtimeEnv("SUPABASE_SERVICE_ROLE_KEY"))
    && runtimeEnv("TURNSTILE_SECRET_KEY")
    && runtimeEnv("TURNSTILE_ALLOWED_HOSTNAMES"),
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

export async function verifyTurnstile(request: NextRequest, token: unknown, action: SubmissionKind) {
  const secret = runtimeEnv("TURNSTILE_SECRET_KEY");
  const allowedHosts = (runtimeEnv("TURNSTILE_ALLOWED_HOSTNAMES") || "")
    .split(",").map((host) => host.trim().toLowerCase()).filter(Boolean);
  if (!secret || !allowedHosts.length || typeof token !== "string" || token.length < 10 || token.length > 2048) {
    return false;
  }

  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    const originUrl = new URL(origin);
    const requestUrl = new URL(request.url);
    const originHost = originUrl.hostname.toLowerCase();
    const requestHost = requestUrl.hostname.toLowerCase();
    if (originUrl.origin !== requestUrl.origin || !allowedHosts.includes(originHost) || !allowedHosts.includes(requestHost)) return false;
  } catch {
    return false;
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
    if (!response.ok) return false;
    const result = await response.json() as {
      success?: boolean;
      hostname?: string;
      action?: string;
    };
    return result.success === true
      && result.action === action
      && typeof result.hostname === "string"
      && allowedHosts.includes(result.hostname.toLowerCase());
  } catch {
    return false;
  }
}

export function cleanText(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export function validPhone(value: string) {
  return /^[0-9+() .-]{7,32}$/.test(value);
}

export function validEmail(value: string) {
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function consumeRateLimit(request: NextRequest, kind: SubmissionKind, client: NonNullable<ReturnType<typeof getPrivilegedSubmissionClient>>) {
  const ipHash = getClientIpHash(request);
  if (!ipHash) return false;
  const { data, error } = await client.rpc("consume_website_submission_limit", {
    p_ip_hash: ipHash,
    p_submission_type: kind,
    p_max: 5,
    p_window_seconds: 3600,
  });
  return !error && data === true;
}
