import {NextResponse} from "next/server";
import {createClient} from "@supabase/supabase-js";
import {runtimeEnv} from "@/lib/runtime-env";

export const dynamic = "force-dynamic";

const fallbackStates = [
  ["AL","Alabama"],["AK","Alaska"],["AZ","Arizona"],["AR","Arkansas"],["CA","California"],
  ["CO","Colorado"],["CT","Connecticut"],["DE","Delaware"],["DC","District of Columbia"],
  ["FL","Florida"],["GA","Georgia"],["HI","Hawaii"],["ID","Idaho"],["IL","Illinois"],
  ["IN","Indiana"],["IA","Iowa"],["KS","Kansas"],["KY","Kentucky"],["LA","Louisiana"],
  ["ME","Maine"],["MD","Maryland"],["MA","Massachusetts"],["MI","Michigan"],["MN","Minnesota"],
  ["MS","Mississippi"],["MO","Missouri"],["MT","Montana"],["NE","Nebraska"],["NV","Nevada"],
  ["NH","New Hampshire"],["NJ","New Jersey"],["NM","New Mexico"],["NY","New York"],
  ["NC","North Carolina"],["ND","North Dakota"],["OH","Ohio"],["OK","Oklahoma"],["OR","Oregon"],
  ["PA","Pennsylvania"],["RI","Rhode Island"],["SC","South Carolina"],["SD","South Dakota"],
  ["TN","Tennessee"],["TX","Texas"],["UT","Utah"],["VT","Vermont"],["VA","Virginia"],
  ["WA","Washington"],["WV","West Virginia"],["WI","Wisconsin"],["WY","Wyoming"],
].map(([state_code, state_name]) => ({state_code, state_name}));

const responseHeaders = {"Cache-Control":"no-store"};

export async function GET() {
  const url = runtimeEnv("NEXT_PUBLIC_SUPABASE_URL");
  const key = runtimeEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");

  if (url && key) {
    try {
      const db = createClient(url, key, {auth:{persistSession:false,autoRefreshToken:false}});
      const {data,error} = await db
        .from("service_states")
        .select("state_code,state_name")
        .eq("status","active")
        .order("state_name");

      if (!error && data && data.length > 0) {
        return NextResponse.json({rows:data}, {headers:responseHeaders});
      }
    } catch {
      // Use the built-in list if the database is temporarily unavailable.
    }
  }

  // Keep the appointment form usable if the service_states table or query is unavailable.
  return NextResponse.json({rows:fallbackStates}, {headers:responseHeaders});
}
