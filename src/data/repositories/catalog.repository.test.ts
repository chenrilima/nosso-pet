import { describe, expect, it } from "vitest";
import type { DatabaseClient } from "./shared";
import { listPublicCatalog } from "./catalog.repository";

function clientWith(results: unknown[]) { let index = 0; return { from: () => { const result = results[index++]; const builder = new Proxy({}, { get: (_target, key) => key === "then" ? (resolve: (value: unknown) => unknown) => Promise.resolve(resolve(result)) : () => builder }); return builder; } } as unknown as DatabaseClient; }
describe("dynamic public catalog", () => {
  it("groups ordered active database rows generically", async () => {
    const client = clientWith([
      { data: [{ id: "c", name: "Rações", slug: "racoes", description: "Desc", sort_order: 0 }], error: null },
      { data: [{ id: "g", category_id: "c", name: "Necessidade", is_required: false, is_active: true, sort_order: 2, created_at: "", updated_at: "" }], error: null },
      { data: [{ id: "o", group_id: "g", name: "Urinário", image_path: "options/u.webp", is_active: true, sort_order: 1, created_at: "", updated_at: "" }], error: null },
    ]);
    await expect(listPublicCatalog(client)).resolves.toEqual([{ id: "c", name: "Rações", slug: "racoes", description: "Desc", sortOrder: 0, optionGroups: [{ id: "g", name: "Necessidade", isRequired: false, sortOrder: 2, options: [{ id: "o", name: "Urinário", isActive: true, sortOrder: 1 }] }] }]);
  });
});
