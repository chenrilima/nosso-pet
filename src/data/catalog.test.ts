import { describe, expect, it } from "vitest";
import { buildCatalog } from "./catalog";

describe("catalog configuration", () => {
  it("maps category-specific groups and only exposes active, ordered metadata", () => {
    const [food, toys] = buildCatalog([
      { id: "toys", name: "Brinquedos", slug: "brinquedos", sortOrder: 2 },
      { id: "food", name: "Rações", slug: "racoes", sortOrder: 1 },
    ]);
    expect(food.name).toBe("Rações");
    expect(food.optionGroups.map((group) => group.name)).toEqual(["Pet", "Marca", "Fase", "Tamanho desejado"]);
    expect(toys.optionGroups.map((group) => group.name)).toEqual(["Pet", "Tipo", "Porte"]);
    expect(food.optionGroups[1].options).toContainEqual(expect.objectContaining({ name: "Royal Canin", isActive: true }));
  });

  it("gives newly administered categories a safe guided fallback", () => {
    const [category] = buildCatalog([{ id: "new", name: "Novidades", slug: "novidades", sortOrder: 0 }]);
    expect(category.optionGroups[0].options[0].name).toBe("Quero ajuda para escolher");
  });
});
