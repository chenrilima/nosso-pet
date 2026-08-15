import type { Product } from "@/types/domain";
import { repositoryError, type DatabaseClient } from "./shared";

export async function listActiveProducts(client: DatabaseClient): Promise<Product[]> {
  const { data, error } = await client.from("products").select("id,category_id,name,slug,description,price,image_path,is_featured,sort_order").eq("is_active", true).order("sort_order").order("name");
  if (error) throw repositoryError("os produtos", error.message);
  return data.map((row) => ({ id: row.id, categoryId: row.category_id, name: row.name, slug: row.slug, description: row.description, price: row.price, imagePath: row.image_path, isFeatured: row.is_featured, sortOrder: row.sort_order }));
}
