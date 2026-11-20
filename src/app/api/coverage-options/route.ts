import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const headers = { "Cache-Control": "no-store, no-cache, must-revalidate" };

export async function GET() {
  if (!supabase) return NextResponse.json({ error: "Coverage options are temporarily unavailable." }, { status: 503, headers });
  const { data, error } = await supabase
    .from("quote_coverage_options")
    .select("id,amount,label")
    .eq("active", true)
    .order("sort_order", { ascending: true })
    .order("amount", { ascending: true });
  if (error) {
    console.error("Public coverage-option lookup failed", { code: error.code });
    return NextResponse.json({ error: "Coverage options are temporarily unavailable." }, { status: 503, headers });
  }
  return NextResponse.json({ rows: data ?? [] }, { headers });
}
