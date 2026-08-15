import type { Database } from "@/types/database";
import { repositoryError, repositoryWriteError, type DatabaseClient } from "./shared";
export type ProductRow = Database["public"]["Tables"]["products"]["Row"];
export type AdminProduct = ProductRow & { categories: Pick<Database["public"]["Tables"]["categories"]["Row"], "name" | "is_active"> | null };
export type ProductWriteValues = { category_id: string; name: string; slug: string; description: string; price: string | null; is_active: boolean; is_featured: boolean; sort_order: number };
export async function listActiveProductRows(client: DatabaseClient): Promise<ProductRow[]> {
  const { data, error } = await client.from("products").select("*").eq("is_active", true).order("sort_order").order("name");
  if (error) throw repositoryError("products", error);
  return data;
}

export async function listAdminProducts(client: DatabaseClient): Promise<AdminProduct[]> {
  const { data, error } = await client.from("products").select("*, categories(name, is_active)").order("sort_order").order("name");
  if (error) throw repositoryError("products", error);
  return data;
}
export async function getAdminProduct(client: DatabaseClient, id: string): Promise<ProductRow | null> {
  const { data, error } = await client.from("products").select("*").eq("id", id).maybeSingle();
  if (error) throw repositoryError("products", error);
  return data;
}
export async function createProduct(client: DatabaseClient, values: ProductWriteValues): Promise<void> {
  const { error } = await client.from("products").insert(values as unknown as Database["public"]["Tables"]["products"]["Insert"]);
  if (error) throw repositoryWriteError("products", error);
}
export async function updateProduct(client: DatabaseClient, id: string, values: ProductWriteValues): Promise<void> {
  const { error } = await client.from("products").update(values as unknown as Database["public"]["Tables"]["products"]["Update"]).eq("id", id);
  if (error) throw repositoryWriteError("products", error);
}
export async function toggleProduct(client: DatabaseClient, id: string, isActive: boolean): Promise<void> {
  const { error } = await client.from("products").update({ is_active: isActive }).eq("id", id);
  if (error) throw repositoryWriteError("products", error);
}
export async function deleteProduct(client: DatabaseClient, id: string): Promise<void> {
  const { error } = await client.from("products").delete().eq("id", id);
  if (error) throw repositoryWriteError("products", error);
}
