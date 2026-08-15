import { describe, expect, it } from "vitest";
import { validateProduct } from "./validation";
const categoryId = "20000000-0000-4000-8000-000000000001";
function form(overrides: Record<string, string> = {}) { const data = new FormData(); Object.entries({ name: "Ração Premium", categoryId, price: "129,90", sortOrder: "2", ...overrides }).forEach(([key, value]) => data.set(key, value)); return data; }
describe("product validation", () => {
  it("generates slug and keeps money as a canonical decimal", () => expect(validateProduct(form()).values).toMatchObject({ slug: "racao-premium", price: "129.90" }));
  it("allows a product without price", () => expect(validateProduct(form({ price: "" })).values?.price).toBeNull());
  it("requires a category", () => expect(validateProduct(form({ categoryId: "" })).fieldErrors.categoryId).toBe("Selecione uma categoria."));
  it.each(["-1", "1.234", "abc"])("rejects invalid price %s", (price) => expect(validateProduct(form({ price })).fieldErrors.price).toBeTruthy());
  it("validates order and featured/status flags", () => { const data = form(); data.set("isActive", "on"); data.set("isFeatured", "on"); expect(validateProduct(data).values).toMatchObject({ is_active: true, is_featured: true, sort_order: 2 }); });
});
