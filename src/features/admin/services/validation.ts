import type { ServiceWriteValues } from "@/data/repositories/services.repository";
import { normalizeSlug } from "@/features/admin/categories/validation";
import { normalizeDecimal, validateNonNegativeInteger } from "@/features/admin/mutations/validation";
import { isSupportedServiceIcon } from "@/lib/service-icons";

const PRICING_TYPES = ["fixed", "starting_at", "quote"] as const;
export function validateService(data: FormData, currentIconKey?: string): { values?: ServiceWriteValues; fieldErrors: Record<string, string> } {
  const fieldErrors: Record<string, string> = {};
  const name = String(data.get("name") ?? "").trim();
  const slug = normalizeSlug(String(data.get("slug") ?? "") || name);
  const description = String(data.get("description") ?? "").trim();
  const iconKey = String(data.get("iconKey") ?? "");
  const pricingType = String(data.get("pricingType") ?? "");
  const price = normalizeDecimal(data.get("price"));
  const priceFrom = normalizeDecimal(data.get("priceFrom"));
  const sortOrder = validateNonNegativeInteger(data.get("sortOrder"));
  if (!name) fieldErrors.name = "Informe o nome."; else if (name.length > 120) fieldErrors.name = "Use no máximo 120 caracteres.";
  if (!slug || slug.length > 120 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) fieldErrors.slug = "Informe um slug válido.";
  if (description.length > 4000) fieldErrors.description = "Use no máximo 4.000 caracteres.";
  if (!isSupportedServiceIcon(iconKey) && iconKey !== currentIconKey) fieldErrors.iconKey = "Selecione um ícone disponível.";
  if (!PRICING_TYPES.includes(pricingType as typeof PRICING_TYPES[number])) fieldErrors.pricingType = "Selecione um tipo de preço.";
  if (price.error) fieldErrors.price = price.error;
  if (priceFrom.error) fieldErrors.priceFrom = priceFrom.error;
  if (pricingType === "fixed" && price.value === null) fieldErrors.price = "Informe o preço fixo.";
  if (pricingType === "starting_at" && priceFrom.value === null) fieldErrors.priceFrom = "Informe o preço inicial.";
  if (sortOrder.error) fieldErrors.sortOrder = sortOrder.error;
  if (Object.keys(fieldErrors).length) return { fieldErrors };
  const isActive = data.get("isActive") === "on";
  return { fieldErrors, values: { name, slug, description, icon_key: iconKey, pricing_type: pricingType as ServiceWriteValues["pricing_type"], price: pricingType === "fixed" ? price.value : null, price_from: pricingType === "starting_at" ? priceFrom.value : null, is_active: isActive, is_bookable: isActive && data.get("isBookable") === "on", sort_order: sortOrder.value! } };
}
