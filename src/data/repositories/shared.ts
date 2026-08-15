import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

export type DatabaseClient = SupabaseClient<Database>;

export function repositoryError(entity: string, message: string): Error {
  return new Error(`Não foi possível carregar ${entity}: ${message}`);
}
