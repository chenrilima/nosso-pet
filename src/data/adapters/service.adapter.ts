import type { ServiceRow } from "@/data/repositories/services.repository";
import type { Service } from "@/types/domain";
export function toService(row: ServiceRow, assetUrl: (path: string) => string): Service {
  return { id: row.id, name: row.name, slug: row.slug, description: row.description, iconKey: row.icon_key, imageUrl: row.image_path === null ? null : assetUrl(row.image_path), pricingType: row.pricing_type, price: row.price === null ? null : Number(row.price), priceFrom: row.price_from === null ? null : Number(row.price_from), durationMinutes: row.duration_minutes, isBookable: row.is_bookable, isFeatured: row.is_featured, sortOrder: row.sort_order };
}
