import type { BusinessSettingsRow } from "@/data/repositories/business.repository";
import type { BusinessHours, BusinessSettings } from "@/types/domain";

function mapHours(value: BusinessSettingsRow["hours"]): BusinessHours | null {
  if (value === null) return null;
  if (typeof value !== "object" || Array.isArray(value)) throw new Error("Formato de horários inválido.");
  const entries = Object.entries(value);
  if (!entries.every(([, interval]) => typeof interval === "string")) throw new Error("Formato de horários inválido.");
  return Object.fromEntries(entries) as BusinessHours;
}

export function toBusinessSettings(row: BusinessSettingsRow, assetUrl: (path: string) => string): BusinessSettings {
  return { id: row.id, name: row.name, shortName: row.short_name, phone: row.phone, phoneRaw: row.phone_raw, whatsapp: row.whatsapp, whatsappRaw: row.whatsapp_raw, instagram: { handle: row.instagram_handle, url: row.instagram_url }, address: { line: row.address_line, district: row.district, city: row.city, state: row.state, postalCode: row.postal_code }, maps: { url: row.maps_url, embedUrl: row.maps_embed_url }, hours: mapHours(row.hours), heroImagePath: row.hero_image_path, heroImageUrl: row.hero_image_path ? assetUrl(row.hero_image_path) : null };
}
