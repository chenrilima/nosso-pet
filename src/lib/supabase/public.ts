import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { getSupabaseEnvironment } from "./env";

export function createPublicClient() {
  const environment = getSupabaseEnvironment();
  return createSupabaseClient<Database>(
    environment.url,
    environment.publishableKey,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
