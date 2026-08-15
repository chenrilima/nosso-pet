import type { Database } from "@/types/database";
import { repositoryError, type DatabaseClient } from "./shared";
export type BusinessSettingsRow = Database["public"]["Tables"]["business_settings"]["Row"];
export async function getBusinessSettingsRow(client: DatabaseClient): Promise<BusinessSettingsRow | null> {
  const { data, error } = await client.from("business_settings").select("*").maybeSingle();
  if (error) throw repositoryError("business_settings", error);
  return data;
}
