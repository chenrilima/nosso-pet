import type { ProductRow } from "@/data/repositories/products.repository";
import type { Category, Product } from "@/types/domain";
export function toProduct(row: ProductRow, category: Category, assetUrl: (path: string) => string): Product {
  return { id: row.id, slug: row.slug, name: row.name, description: row.description, category, price: row.price === null ? null : Number(row.price), imageUrl: row.image_path === null ? null : assetUrl(row.image_path), isFeatured: row.is_featured, sortOrder: row.sort_order };
}
