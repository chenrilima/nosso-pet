import { describe, expect, it } from "vitest";
import type { CategoryRow } from "@/data/repositories/categories.repository";
import type { ProductRow } from "@/data/repositories/products.repository";
import { mapPublicProducts } from "./products.query";

const timestamps = { created_at: "2026-01-01", updated_at: "2026-01-01" };
const category = (overrides: Partial<CategoryRow> = {}): CategoryRow => ({ ...timestamps, id: "category", name: "Rações", slug: "racoes", sort_order: 0, is_active: true, ...overrides });
const product = (overrides: Partial<ProductRow> = {}): ProductRow => ({ ...timestamps, id: "product", category_id: "category", name: "Ração", slug: "racao", description: "Completa", price: 10, image_path: null, is_active: true, is_featured: false, sort_order: 0, ...overrides });
const assetUrl = (path: string) => `https://assets.test/${path}`;

describe("public products", () => {
  it("maps an active product with a publicly active category", () => {
    expect(mapPublicProducts([product()], [category()], assetUrl)).toHaveLength(1);
  });

  it("omits a product when its category is inactive or invisible to public RLS", () => {
    expect(mapPublicProducts([product()], [], assetUrl)).toEqual([]);
  });

  it("returns the product again when its category becomes public", () => {
    expect(mapPublicProducts([product()], [], assetUrl)).toEqual([]);
    expect(mapPublicProducts([product()], [category()], assetUrl).map(({ slug }) => slug)).toEqual(["racao"]);
  });

  it("preserves a valid empty product list", () => {
    expect(mapPublicProducts([], [category()], assetUrl)).toEqual([]);
  });
});
