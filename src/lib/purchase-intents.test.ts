import { describe, expect, it } from "vitest";
import type { CatalogCategory } from "@/types/domain";
import { addPurchaseIntent, createPurchaseIntent, setPurchaseIntentQuantity } from "./purchase-intents";

const category: CatalogCategory = {
  id: "category", name: "Rações", slug: "racoes", description: "", sortOrder: 0,
  optionGroups: [
    ["animal", "Pet", [["caes", "Cães"], ["gatos", "Gatos"]]],
    ["marca", "Marca", [["premier", "Premier"], ["golden", "Golden"]]],
    ["fase", "Fase", [["adulto", "Adulto"]]],
    ["tamanho", "Tamanho desejado", [["grande", "Grande"], ["pequeno", "Pequeno"]]],
  ].map(([id, name, options], sortOrder) => ({ id: String(id), name: String(name), isRequired: true, sortOrder, options: (options as string[][]).map(([optionId, optionName], optionSortOrder) => ({ id: optionId, name: optionName, isActive: true, sortOrder: optionSortOrder })) })),
};

describe("purchase intents", () => {
  it("creates an intent from dynamic groups without fixed product fields", () => {
    const intent = createPurchaseIntent(category, { animal: "caes", marca: "premier", fase: "adulto", tamanho: "grande" });
    expect(intent).toMatchObject({ categoryName: "Rações", quantity: 1 });
    expect(intent?.selections.map((selection) => [selection.groupName, selection.optionName])).toEqual([
      ["Pet", "Cães"], ["Marca", "Premier"], ["Fase", "Adulto"], ["Tamanho desejado", "Grande"],
    ]);
  });

  it("requires every configured required group and rejects unknown or inactive choices", () => {
    expect(createPurchaseIntent(category, { animal: "caes" })).toBeNull();
    expect(createPurchaseIntent(category, { animal: "unknown", marca: "premier", fase: "adulto", tamanho: "grande" })).toBeNull();
  });

  it("merges equal consultations, keeps different variants, updates quantity and removes at zero", () => {
    const first = createPurchaseIntent(category, { animal: "caes", marca: "premier", fase: "adulto", tamanho: "grande" })!;
    const second = createPurchaseIntent(category, { animal: "gatos", marca: "golden", fase: "adulto", tamanho: "pequeno" })!;
    const cart = addPurchaseIntent(addPurchaseIntent(addPurchaseIntent([], first), first), second);
    expect(cart.map((item) => item.quantity)).toEqual([2, 1]);
    expect(setPurchaseIntentQuantity(cart, first.id, 0)).toEqual([second]);
  });
});
