import { RepositoryError } from "@/data/repositories/shared";

export type DataEntity = "business" | "categories" | "products" | "services" | "gallery" | "faqs";
export type DataAccessError = { code: "DATA_ACCESS_ERROR"; entity: DataEntity; operation: "read"; retryable: boolean };
export type PublicDataResult<T> = { ok: true; data: T } | { ok: false; error: DataAccessError };

export async function runPublicQuery<T>(entity: DataEntity, query: () => Promise<T>): Promise<PublicDataResult<T>> {
  try {
    return { ok: true, data: await query() };
  } catch (cause) {
    const retryable = cause instanceof RepositoryError ? !cause.infrastructureCode?.startsWith("4") : false;
    return { ok: false, error: { code: "DATA_ACCESS_ERROR", entity, operation: "read", retryable } };
  }
}
