import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const requested = request.nextUrl.searchParams.get("next") || "/customer";
  const safeNext = requested.startsWith("/") && !requested.startsWith("//") ? requested : "/customer";
  if (!code) return NextResponse.redirect(new URL("/customer/login?error=invite", request.url));
  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) return NextResponse.redirect(new URL("/customer/login?error=invite", request.url));
    return NextResponse.redirect(new URL(safeNext, request.url));
  } catch {
    return NextResponse.redirect(new URL("/customer/login?error=invite", request.url));
  }
}
