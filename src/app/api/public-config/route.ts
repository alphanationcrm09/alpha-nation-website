import { NextResponse } from "next/server";
import { runtimeEnv } from "@/lib/runtime-env";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  // This endpoint is public and only supplies the browser-visible Turnstile
  // site key. Never expose privileged service configuration or DB diagnostics.
  const turnstileSiteKey = runtimeEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY") || "";

  return NextResponse.json(
    { turnstileSiteKey },
    { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } },
  );
}
