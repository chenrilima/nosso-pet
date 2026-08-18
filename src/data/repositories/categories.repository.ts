import type { Database } from "@/types/database";
import { repositoryError, repositoryWriteError, type DatabaseClient } from "./shared";
export type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];
export type PublicCategoryRow = Pick<CategoryRow, "id" | "name" | "slug" | "sort_order">;
export type AdminCategory = Pick<CategoryRow, "id" | "name" | "slug" | "description" | "sort_order" | "is_active"> & { dependency_count: number };
export async function listActiveCategoryRows(client: DatabaseClient): Promise<PublicCategoryRow[]> {
  const { data, error } = await client.from("categories").select("id, name, slug, sort_order").eq("is_active", true).order("sort_order").order("name");
  if (error) throw repositoryError("categories", error);
  return data;
}

export async function listAdminCategories(client: DatabaseClient): Promise<AdminCategory[]> {
  const { data, error } = await client.from("categories").select("id, name, slug, description, sort_order, is_active, product_option_groups(count)").order("sort_order").order("name");
  if (error) throw repositoryError("categories", error);
  return data.map((row) => ({ ...row, dependency_count: row.product_option_groups[0]?.count ?? 0 }));
}

export async function getAdminCategory(client: DatabaseClient, id: string): Promise<CategoryRow | null> { const { data, error } = await client.from("categories").select("*").eq("id", id).maybeSingle(); if (error) throw repositoryError("categories", error); return data; }

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
  const { count: groupCount, error: groupError } = await client.from("product_option_groups").select("id", { count: "exact", head: true }).eq("category_id", id);
  if (groupError) throw repositoryError("grupos", groupError);
  if ((groupCount ?? 0) > 0) return "in_use";
  const { error } = await client.from("categories").delete().eq("id", id);
  if (error) throw repositoryWriteError("categories", error);
  return "deleted";
}
