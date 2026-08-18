import type { Database } from "@/types/database";
import { repositoryError, repositoryWriteError, type DatabaseClient } from "./shared";
export type BusinessSettingsRow = Database["public"]["Tables"]["business_settings"]["Row"];
export type PublicBusinessSettingsRow = Omit<BusinessSettingsRow, "singleton_key" | "created_at" | "updated_at">;
export type BusinessSettingsUpdate = Pick<Database["public"]["Tables"]["business_settings"]["Update"], "name" | "short_name" | "phone" | "phone_raw" | "whatsapp" | "whatsapp_raw" | "instagram_handle" | "instagram_url" | "address_line" | "district" | "city" | "state" | "postal_code" | "maps_url" | "maps_embed_url" | "hours">;
export type HomeContentUpdate = Pick<Database["public"]["Tables"]["business_settings"]["Update"], "hero_title" | "hero_highlight" | "hero_description" | "hero_primary_cta" | "hero_secondary_cta" | "about_title" | "about_description" | "about_feature_one_title" | "about_feature_two_title" | "footer_description" | "footer_contact_title" | "footer_location_title" | "taxipet_title" | "taxipet_region" | "taxipet_note" | "taxipet_cta">;
export async function getPublicBusinessSettingsRow(client: DatabaseClient): Promise<PublicBusinessSettingsRow | null> {
  const { data, error } = await client.from("business_settings").select("id, name, short_name, phone, phone_raw, whatsapp, whatsapp_raw, instagram_handle, instagram_url, address_line, district, city, state, postal_code, maps_url, maps_embed_url, hours, hero_image_path, hero_position_x, hero_position_y, hero_title, hero_highlight, hero_description, hero_primary_cta, hero_secondary_cta, about_title, about_description, about_feature_one_title, about_feature_two_title, footer_description, footer_contact_title, footer_location_title, taxipet_title, taxipet_region, taxipet_note, taxipet_cta").maybeSingle();
  if (error) throw repositoryError("business_settings", error);
  return data;
}

export async function getBusinessSettingsForAdmin(client: DatabaseClient): Promise<BusinessSettingsRow | null> {
  const { data, error } = await client.from("business_settings").select("*").maybeSingle();
  if (error) throw repositoryError("business_settings", error);
  return data;
}

export async function updateBusinessSettings(client: DatabaseClient, id: string, values: BusinessSettingsUpdate): Promise<boolean> {
  const { data, error } = await client.from("business_settings").update(values).eq("id", id).select("id").maybeSingle();
  if (error) throw repositoryWriteError("business_settings", error);
  return data !== null;
}
export async function updateHomeContent(client: DatabaseClient, id: string, values: HomeContentUpdate): Promise<void> {
  const { error } = await client.from("business_settings").update(values).eq("id", id);
  if (error) throw repositoryWriteError("business_settings", error);
}
export async function updateHeroImagePath(client: DatabaseClient, id: string, heroImagePath: string | null): Promise<void> {
  const { error } = await client.from("business_settings").update({ hero_image_path: heroImagePath, hero_position_x: 50, hero_position_y: 50 }).eq("id", id);
  if (error) throw repositoryWriteError("business_settings", error);
}
export async function updateHeroImagePosition(client: DatabaseClient, id: string, x: number, y: number): Promise<void> {
  const { error } = await client.from("business_settings").update({ hero_position_x: x, hero_position_y: y }).eq("id", id);
  if (error) throw repositoryWriteError("business_settings", error);
}
