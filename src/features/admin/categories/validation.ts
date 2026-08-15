export type CategoryValues = { name: string; slug: string; sort_order: number; is_active: boolean };
export function normalizeSlug(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
export function validateCategory(data: FormData): { values?: CategoryValues; fieldErrors: Record<string, string> } {
  const fieldErrors: Record<string, string> = {};
  const name = String(data.get("name") ?? "").trim();
  const slug = normalizeSlug(String(data.get("slug") ?? "") || name);
  const sortOrderRaw = String(data.get("sortOrder") ?? "0");
  const sortOrder = Number(sortOrderRaw);
  if (!name) fieldErrors.name = "Informe o nome."; else if (name.length > 80) fieldErrors.name = "Use no máximo 80 caracteres.";
  if (!slug || slug.length > 80 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) fieldErrors.slug = "Informe um slug válido.";
  if (!/^\d+$/.test(sortOrderRaw) || !Number.isSafeInteger(sortOrder) || sortOrder < 0) fieldErrors.sortOrder = "Informe uma ordem inteira não negativa.";
  return Object.keys(fieldErrors).length ? { fieldErrors } : { fieldErrors, values: { name, slug, sort_order: sortOrder, is_active: data.get("isActive") === "on" } };
}
