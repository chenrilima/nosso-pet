import { describe, expect, it } from "vitest";
import { buildCatalogFallback } from "./catalog";

describe("catalog fallback", () => {
  it("keeps categories ordered without inventing parallel groups or options", () => {
    const [food, toys] = buildCatalogFallback([
      { id: "toys", name: "Brinquedos", slug: "brinquedos", sortOrder: 2 },
      { id: "food", name: "Rações", slug: "racoes", sortOrder: 1 },
    ]);
    expect(food.name).toBe("Rações");
    expect(food.optionGroups).toEqual([]);
    expect(toys.optionGroups).toEqual([]);
  });
});
