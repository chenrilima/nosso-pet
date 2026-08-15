import type { ProductWriteValues } from "@/data/repositories/products.repository";
import { normalizeSlug } from "@/features/admin/categories/validation";
import { normalizeDecimal, validateNonNegativeInteger } from "@/features/admin/mutations/validation";

export const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function validateProduct(data: FormData): { values?: ProductWriteValues; fieldErrors: Record<string, string> } {
  const fieldErrors: Record<string, string> = {};
  const name = String(data.get("name") ?? "").trim();
  const slug = normalizeSlug(String(data.get("slug") ?? "") || name);
  const description = String(data.get("description") ?? "").trim();
  const categoryId = String(data.get("categoryId") ?? "");
  const price = normalizeDecimal(data.get("price"));
  const sortOrder = validateNonNegativeInteger(data.get("sortOrder"));
  if (!name) fieldErrors.name = "Informe o nome."; else if (name.length > 120) fieldErrors.name = "Use no máximo 120 caracteres.";
  if (!slug || slug.length > 120 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) fieldErrors.slug = "Informe um slug válido.";
  if (description.length > 4000) fieldErrors.description = "Use no máximo 4.000 caracteres.";
  if (!categoryId) fieldErrors.categoryId = "Selecione uma categoria."; else if (!UUID_PATTERN.test(categoryId)) fieldErrors.categoryId = "Selecione uma categoria válida.";
  if (price.error) fieldErrors.price = price.error;
  if (sortOrder.error) fieldErrors.sortOrder = sortOrder.error;
  if (Object.keys(fieldErrors).length) return { fieldErrors };
  return { fieldErrors, values: { name, slug, description, category_id: categoryId, price: price.value, sort_order: sortOrder.value!, is_active: data.get("isActive") === "on", is_featured: data.get("isFeatured") === "on" } };
}
