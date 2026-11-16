import { NextResponse } from "next/server";
import { runtimeEnv } from "@/lib/runtime-env";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || runtimeEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY") || "";
  const configStatus = {
    supabaseUrl: Boolean(runtimeEnv("NEXT_PUBLIC_SUPABASE_URL")),
    supabaseAdminKey: Boolean(runtimeEnv("SUPABASE_SECRET_KEY") || runtimeEnv("SUPABASE_SERVICE_ROLE_KEY")),
    turnstileSecret: Boolean(runtimeEnv("TURNSTILE_SECRET_KEY")),
    allowedHostnames: Boolean(runtimeEnv("TURNSTILE_ALLOWED_HOSTNAMES")),
  };

  return NextResponse.json(
    { turnstileSiteKey, configStatus },
    { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } },
  );
}
