import type { Database } from "@/types/database";
import { repositoryError, type DatabaseClient } from "./shared";
export type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];
export async function listActiveCategoryRows(client: DatabaseClient): Promise<CategoryRow[]> {
  const { data, error } = await client.from("categories").select("*").eq("is_active", true).order("sort_order").order("name");
  if (error) throw repositoryError("categories", error);
  return data;
}
