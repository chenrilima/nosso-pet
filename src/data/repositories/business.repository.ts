import type { BusinessSettings } from "@/types/domain";
import { repositoryError, type DatabaseClient } from "./shared";

export async function getBusinessSettings(client: DatabaseClient): Promise<BusinessSettings | null> {
  const { data, error } = await client.from("business_settings").select("*").maybeSingle();
  if (error) throw repositoryError("as configurações da empresa", error.message);
  if (!data) return null;
  return { id: data.id, name: data.name, shortName: data.short_name, phone: data.phone, phoneRaw: data.phone_raw, whatsapp: data.whatsapp, whatsappRaw: data.whatsapp_raw, instagramHandle: data.instagram_handle, instagramUrl: data.instagram_url, addressLine: data.address_line, district: data.district, city: data.city, state: data.state, postalCode: data.postal_code, mapsUrl: data.maps_url, mapsEmbedUrl: data.maps_embed_url, hours: data.hours as BusinessSettings["hours"] };
}
