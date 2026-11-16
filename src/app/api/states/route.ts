import {NextResponse} from "next/server";
import {createClient} from "@supabase/supabase-js";
import {runtimeEnv} from "@/lib/runtime-env";
export const dynamic="force-dynamic";
export async function GET(){const url=runtimeEnv("NEXT_PUBLIC_SUPABASE_URL");const key=runtimeEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");if(!url||!key)return NextResponse.json({rows:[]},{headers:{"Cache-Control":"no-store"}});const db=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});const {data,error}=await db.from("service_states").select("state_code,state_name").eq("status","active").order("state_name");if(error)return NextResponse.json({rows:[]},{headers:{"Cache-Control":"no-store"}});return NextResponse.json({rows:data||[]},{headers:{"Cache-Control":"no-store"}});}
