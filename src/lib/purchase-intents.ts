import type { CatalogCategory, PurchaseIntent, PurchaseIntentSelection } from "@/types/domain";

export type SelectionValues = Readonly<Record<string, string>>;

export function createPurchaseIntent(category: CatalogCategory, values: SelectionValues): PurchaseIntent | null {
  const selections = category.optionGroups.flatMap<PurchaseIntentSelection>((group) => {
    const option = group.options.find((item) => item.isActive && item.id === values[group.id]);
    return option ? [{ groupId: group.id, groupName: group.name, optionId: option.id, optionName: option.name }] : [];
  });
  if (category.optionGroups.some((group) => group.isRequired && !selections.some((item) => item.groupId === group.id))) return null;
  const signature = selections.map((item) => `${item.groupId}:${item.optionId}`).join("|");
  return { id: `${category.id}|${signature}`, categoryId: category.id, categoryName: category.name, selections, quantity: 1 };
}

export const addPurchaseIntent = (cart: PurchaseIntent[], intent: PurchaseIntent): PurchaseIntent[] =>
  cart.some((item) => item.id === intent.id)
    ? cart.map((item) => item.id === intent.id ? { ...item, quantity: item.quantity + 1 } : item)
    : [...cart, intent];

export const setPurchaseIntentQuantity = (cart: PurchaseIntent[], id: string, quantity: number): PurchaseIntent[] =>
  cart.map((item) => item.id === id ? { ...item, quantity } : item).filter((item) => item.quantity > 0);
