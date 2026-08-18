import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";
import { getSupabaseEnvironment } from "./env";

export function createClient() {
  const environment = getSupabaseEnvironment();
  return createBrowserClient<Database>(
    environment.url,
    environment.publishableKey,
  );
}
