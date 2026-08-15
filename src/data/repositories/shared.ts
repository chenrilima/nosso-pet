import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
export type DatabaseClient = SupabaseClient<Database>;
export class RepositoryError extends Error {
  constructor(readonly entity: string, readonly operation: "read" | "write", readonly infrastructureCode?: string, options?: ErrorOptions) {
    super(`Falha de infraestrutura ao ${operation === "read" ? "consultar" : "alterar"} ${entity}.`, options);
    this.name = "RepositoryError";
  }
}
export function repositoryError(entity: string, error: { code?: string; message: string }): RepositoryError {
  return new RepositoryError(entity, "read", error.code, { cause: new Error(error.message) });
}
export function repositoryWriteError(entity: string, error: { code?: string; message: string }): RepositoryError {
  return new RepositoryError(entity, "write", error.code, { cause: new Error(error.message) });
}
