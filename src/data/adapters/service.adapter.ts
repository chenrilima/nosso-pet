import type { PublicServiceRow } from "@/data/repositories/services.repository";
import type { Service } from "@/types/domain";
export function toService(row: PublicServiceRow): Service {
  return { id: row.id, name: row.name, slug: row.slug, description: row.description, iconKey: row.icon_key, pricingType: row.pricing_type, price: row.price === null ? null : Number(row.price), priceFrom: row.price_from === null ? null : Number(row.price_from), isBookable: row.is_bookable, sortOrder: row.sort_order };
}
