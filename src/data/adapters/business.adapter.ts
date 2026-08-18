import type { PublicBusinessSettingsRow } from "@/data/repositories/business.repository";
import type { BusinessHours, BusinessSettings } from "@/types/domain";
import { safeImagePosition } from "@/lib/image-position";

function mapHours(value: PublicBusinessSettingsRow["hours"]): BusinessHours | null {
  if (value === null) return null;
  if (typeof value !== "object" || Array.isArray(value)) throw new Error("Formato de horários inválido.");
  const entries = Object.entries(value);
  if (!entries.every(([, interval]) => typeof interval === "string")) throw new Error("Formato de horários inválido.");
  return Object.fromEntries(entries) as BusinessHours;
}

export function toBusinessSettings(row: PublicBusinessSettingsRow, assetUrl: (path: string) => string): BusinessSettings {
  return {
    id: row.id, name: row.name, shortName: row.short_name, phone: row.phone, phoneRaw: row.phone_raw, whatsapp: row.whatsapp, whatsappRaw: row.whatsapp_raw,
    instagram: { handle: row.instagram_handle, url: row.instagram_url },
    address: { line: row.address_line, district: row.district, city: row.city, state: row.state, postalCode: row.postal_code },
    maps: { url: row.maps_url, embedUrl: row.maps_embed_url }, hours: mapHours(row.hours), heroImagePath: row.hero_image_path,
    heroImageUrl: row.hero_image_path ? assetUrl(row.hero_image_path) : null, heroImagePosition: safeImagePosition(row.hero_position_x, row.hero_position_y),
    content: {
      hero: { title: row.hero_title, highlight: row.hero_highlight, description: row.hero_description, primaryCta: row.hero_primary_cta, secondaryCta: row.hero_secondary_cta },
      about: { title: row.about_title, description: row.about_description, featureOneTitle: row.about_feature_one_title, featureTwoTitle: row.about_feature_two_title },
      footer: { description: row.footer_description, contactTitle: row.footer_contact_title, locationTitle: row.footer_location_title },
      taxipet: { title: row.taxipet_title, region: row.taxipet_region, note: row.taxipet_note, cta: row.taxipet_cta },
    },
  };
}
