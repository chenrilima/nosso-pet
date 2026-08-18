import type { Database } from "@/types/database";
import { repositoryError, repositoryWriteError, type DatabaseClient } from "./shared";
export type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];
export type AdminCategory = Pick<CategoryRow, "id" | "name" | "slug" | "description" | "sort_order" | "is_active"> & { product_count: number };
export async function listActiveCategoryRows(client: DatabaseClient): Promise<CategoryRow[]> {
  const { data, error } = await client.from("categories").select("*").eq("is_active", true).order("sort_order").order("name");
  if (error) throw repositoryError("categories", error);
  return data;
}

export async function listAdminCategories(client: DatabaseClient): Promise<AdminCategory[]> {
  const { data, error } = await client.from("categories").select("id, name, slug, description, sort_order, is_active, products(count)").order("sort_order").order("name");
  if (error) throw repositoryError("categories", error);
  return data.map((row) => ({ ...row, product_count: row.products[0]?.count ?? 0 }));
}

export async function createCategory(client: DatabaseClient, values: { name: string; slug: string; description: string; sort_order: number; is_active: boolean }): Promise<void> {
  const { error } = await client.from("categories").insert(values);
  if (error) throw repositoryWriteError("categories", error);
}

export async function updateCategory(client: DatabaseClient, id: string, values: { name: string; slug: string; description: string; sort_order: number; is_active: boolean }): Promise<void> {
  const { error } = await client.from("categories").update(values).eq("id", id);
  if (error) throw repositoryWriteError("categories", error);
}

export async function toggleCategory(client: DatabaseClient, id: string, isActive: boolean): Promise<void> {
  const { error } = await client.from("categories").update({ is_active: isActive }).eq("id", id);
  if (error) throw repositoryWriteError("categories", error);
}

export async function deleteCategory(client: DatabaseClient, id: string): Promise<"deleted" | "in_use"> {
  const { count, error: countError } = await client.from("products").select("id", { count: "exact", head: true }).eq("category_id", id);
  if (countError) throw repositoryError("products", countError);
  if ((count ?? 0) > 0) return "in_use";
  const { count: groupCount, error: groupError } = await client.from("product_option_groups").select("id", { count: "exact", head: true }).eq("category_id", id);
  if (groupError) throw repositoryError("grupos", groupError);
  if ((groupCount ?? 0) > 0) return "in_use";
  const { error } = await client.from("categories").delete().eq("id", id);
  if (error) throw repositoryWriteError("categories", error);
  return "deleted";
}
