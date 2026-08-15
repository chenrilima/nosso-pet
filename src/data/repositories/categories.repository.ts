import type { Category } from "@/types/domain";
import { repositoryError, type DatabaseClient } from "./shared";

export async function listActiveCategories(client: DatabaseClient): Promise<Category[]> {
  const { data, error } = await client.from("categories").select("id,name,slug,sort_order").eq("is_active", true).order("sort_order").order("name");
  if (error) throw repositoryError("as categorias", error.message);
  return data.map((row) => ({ id: row.id, name: row.name, slug: row.slug, sortOrder: row.sort_order }));
}
