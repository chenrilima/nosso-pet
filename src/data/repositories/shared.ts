import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
export type DatabaseClient = SupabaseClient<Database>;
export class RepositoryError extends Error {
  constructor(readonly entity: string, readonly operation: "read", readonly infrastructureCode?: string, options?: ErrorOptions) {
    super(`Falha de infraestrutura ao consultar ${entity}.`, options);
    this.name = "RepositoryError";
  }
}
export function repositoryError(entity: string, error: { code?: string; message: string }): RepositoryError {
  return new RepositoryError(entity, "read", error.code, { cause: new Error(error.message) });
}
