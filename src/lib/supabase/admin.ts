import { createClient } from "@supabase/supabase-js";
import { runtimeEnv } from "@/lib/runtime-env";

export function createSupabaseAdminClient() {
  const url = runtimeEnv("NEXT_PUBLIC_SUPABASE_URL");
  const key = runtimeEnv("SUPABASE_SECRET_KEY") || runtimeEnv("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) throw new Error("Server-side Supabase secret is not configured.");
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
  });
}
