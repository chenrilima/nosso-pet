import type { CatalogCategory, Category } from "@/types/domain";

export function buildCatalogFallback(categories: Category[]): CatalogCategory[] {
  return [...categories]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((category) => ({ ...category, description: "", optionGroups: [] }));
}
