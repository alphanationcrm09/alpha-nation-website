import { NextRequest, NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const allowedTypes: EmailOtpType[] = ["invite", "recovery", "signup", "magiclink", "email_change", "email"];

export async function GET(request: NextRequest) {
  const tokenHash = request.nextUrl.searchParams.get("token_hash");
  const requestedType = request.nextUrl.searchParams.get("type") || "";
  const requestedNext = request.nextUrl.searchParams.get("next") || "/set-password?next=%2Fcustomer";
  const candidate = new URL(requestedNext, request.url);
  const safeNext = candidate.origin === request.nextUrl.origin
    ? candidate.pathname + candidate.search + candidate.hash
    : "/set-password?next=%2Fcustomer";
  const failurePath = requestedType === "invite" ? "/customer/login?error=invite" : "/customer/login?error=recovery";

  if (!tokenHash || !allowedTypes.includes(requestedType as EmailOtpType)) {
    return NextResponse.redirect(new URL(failurePath, request.url));
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: requestedType as EmailOtpType,
    });
    if (error) return NextResponse.redirect(new URL(failurePath, request.url));
    return NextResponse.redirect(new URL(safeNext, request.url));
  } catch {
    return NextResponse.redirect(new URL(failurePath, request.url));
  }
}
