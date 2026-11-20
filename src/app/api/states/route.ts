import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const responseHeaders = {
  "Cache-Control": "no-store, no-cache, must-revalidate",
};

export async function GET() {
  if (!supabase) {
    return NextResponse.json(
      { error: "State availability is temporarily unavailable." },
      { status: 503, headers: responseHeaders },
    );
  }

  const { data, error } = await supabase
    .from("service_states")
    .select("state_code,state_name")
    .eq("status", "active")
    .order("state_name");

  if (error) {
    console.error("Public service-state lookup failed", { code: error.code });
    return NextResponse.json(
      { error: "State availability is temporarily unavailable." },
      { status: 503, headers: responseHeaders },
    );
  }

  return NextResponse.json(
    { rows: data ?? [] },
    { headers: responseHeaders },
  );
}
