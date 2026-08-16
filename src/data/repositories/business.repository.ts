import type { Database } from "@/types/database";
import { repositoryError, repositoryWriteError, type DatabaseClient } from "./shared";
export type BusinessSettingsRow = Database["public"]["Tables"]["business_settings"]["Row"];
export type BusinessSettingsUpdate = Pick<Database["public"]["Tables"]["business_settings"]["Update"], "name" | "short_name" | "phone" | "phone_raw" | "whatsapp" | "whatsapp_raw" | "instagram_handle" | "instagram_url" | "address_line" | "district" | "city" | "state" | "postal_code" | "maps_url" | "maps_embed_url" | "hours">;
export async function getBusinessSettingsRow(client: DatabaseClient): Promise<BusinessSettingsRow | null> {
  const { data, error } = await client.from("business_settings").select("*").maybeSingle();
  if (error) throw repositoryError("business_settings", error);
  return data;
}

export const getBusinessSettingsForAdmin = getBusinessSettingsRow;

export async function updateBusinessSettings(client: DatabaseClient, id: string, values: BusinessSettingsUpdate): Promise<void> {
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
