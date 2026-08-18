import type { PublicCategoryRow } from "@/data/repositories/categories.repository";
import type { Category } from "@/types/domain";
export const toCategory = (row: PublicCategoryRow): Category => ({ id: row.id, name: row.name, slug: row.slug, sortOrder: row.sort_order });
