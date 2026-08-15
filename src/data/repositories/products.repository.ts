import type { Database } from "@/types/database";
import { repositoryError, type DatabaseClient } from "./shared";
export type ProductRow = Database["public"]["Tables"]["products"]["Row"];
export async function listActiveProductRows(client: DatabaseClient): Promise<ProductRow[]> {
  const { data, error } = await client.from("products").select("*").eq("is_active", true).order("sort_order").order("name");
  if (error) throw repositoryError("products", error);
  return data;
}
