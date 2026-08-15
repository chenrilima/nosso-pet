import type { CategoryRow } from "@/data/repositories/categories.repository";
import type { Category } from "@/types/domain";
export const toCategory = (row: CategoryRow): Category => ({ id: row.id, name: row.name, slug: row.slug, sortOrder: row.sort_order });
