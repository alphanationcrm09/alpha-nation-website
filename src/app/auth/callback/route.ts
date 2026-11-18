import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const requested = request.nextUrl.searchParams.get("next") || "/customer";
  const safeNext = requested.startsWith("/") && !requested.startsWith("//") ? requested : "/customer";
  const failurePath = safeNext.includes("/admin") ? "/admin/login?error=invite" : "/customer/login?error=invite";
  if (!code) return NextResponse.redirect(new URL(failurePath, request.url));
  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) return NextResponse.redirect(new URL(failurePath, request.url));
    return NextResponse.redirect(new URL(safeNext, request.url));
  } catch {
    return NextResponse.redirect(new URL(failurePath, request.url));
  }
}
