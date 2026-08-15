import { describe, expect, it } from "vitest";
import type { DatabaseClient } from "./shared";
import { createCategory, deleteCategory, listAdminCategories, toggleCategory, updateCategory } from "./categories.repository";
import { updateBusinessSettings } from "./business.repository";

function clientWith(result: Record<string, unknown> = { data: null, error: null, count: 0 }) {
  const calls: unknown[][] = [];
  const builder = new Proxy({}, { get: (_target, property) => property === "then" ? (resolve: (value: unknown) => unknown) => Promise.resolve(resolve(result)) : (...args: unknown[]) => { calls.push([property, ...args]); return builder; } }) as unknown as Record<string, (...args: unknown[]) => unknown>;
  const client = { from: (table: string) => { calls.push(["from", table]); return builder; } } as unknown as DatabaseClient;
  return { client, calls };
}

describe("admin repositories", () => {
  it("whitelists and updates business settings by id", async () => { const fake = clientWith(); await updateBusinessSettings(fake.client, "id", { name: "Pet" }); expect(fake.calls).toContainEqual(["update", { name: "Pet" }]); expect(fake.calls).toContainEqual(["eq", "id", "id"]); });
  it("lists inactive categories and maps product count", async () => { const fake = clientWith({ data: [{ id: "1", name: "A", slug: "a", sort_order: 0, is_active: false, products: [{ count: 2 }] }], error: null }); await expect(listAdminCategories(fake.client)).resolves.toMatchObject([{ is_active: false, product_count: 2 }]); expect(fake.calls.some((call) => call[0] === "eq" && call[1] === "is_active")).toBe(false); });
  it("creates, updates and toggles categories", async () => { const fake = clientWith(); const values = { name: "A", slug: "a", sort_order: 0, is_active: true }; await createCategory(fake.client, values); await updateCategory(fake.client, "id", values); await toggleCategory(fake.client, "id", false); expect(fake.calls).toContainEqual(["insert", values]); expect(fake.calls).toContainEqual(["update", values]); expect(fake.calls).toContainEqual(["update", { is_active: false }]); });
  it("blocks deletion when products exist", async () => { const fake = clientWith({ data: null, error: null, count: 1 }); await expect(deleteCategory(fake.client, "id")).resolves.toBe("in_use"); expect(fake.calls.some((call) => call[0] === "delete")).toBe(false); });
  it("deletes a category without products", async () => { const fake = clientWith(); await expect(deleteCategory(fake.client, "id")).resolves.toBe("deleted"); expect(fake.calls.some((call) => call[0] === "delete")).toBe(true); });
});
