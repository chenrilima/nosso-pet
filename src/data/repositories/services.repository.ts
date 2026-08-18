import type { Database } from "@/types/database";
import { repositoryError, repositoryWriteError, type DatabaseClient } from "./shared";
export type ServiceRow = Database["public"]["Tables"]["services"]["Row"];
export type PublicServiceRow = Pick<ServiceRow, "id" | "name" | "slug" | "description" | "icon_key" | "pricing_type" | "price" | "price_from" | "is_bookable" | "sort_order">;
export type ServiceWriteValues = { name: string; slug: string; description: string; icon_key: string; pricing_type: Database["public"]["Enums"]["pricing_type"]; price: string | null; price_from: string | null; is_active: boolean; is_bookable: boolean; sort_order: number };
async function listServiceRows(client: DatabaseClient, bookableOnly: boolean): Promise<PublicServiceRow[]> {
  let query = client.from("services").select("id, name, slug, description, icon_key, pricing_type, price, price_from, is_bookable, sort_order").eq("is_active", true);
  if (bookableOnly) query = query.eq("is_bookable", true);
  const { data, error } = await query.order("sort_order").order("name");
  if (error) throw repositoryError("services", error);
  return data;
}
export const listActiveServiceRows = (client: DatabaseClient) => listServiceRows(client, false);
export const listBookableServiceRows = (client: DatabaseClient) => listServiceRows(client, true);
export async function listAdminServices(client: DatabaseClient): Promise<ServiceRow[]> {
  const { data, error } = await client.from("services").select("*").order("sort_order").order("name");
  if (error) throw repositoryError("services", error);
  return data;
}
export async function getAdminService(client: DatabaseClient, id: string): Promise<ServiceRow | null> {
  const { data, error } = await client.from("services").select("*").eq("id", id).maybeSingle();
  if (error) throw repositoryError("services", error);
  return data;
}
export async function createService(client: DatabaseClient, values: ServiceWriteValues): Promise<void> {
  const { error } = await client.from("services").insert(values as unknown as Database["public"]["Tables"]["services"]["Insert"]);
  if (error) throw repositoryWriteError("services", error);
}
export async function updateService(client: DatabaseClient, id: string, values: ServiceWriteValues): Promise<void> {
  const { error } = await client.from("services").update(values as unknown as Database["public"]["Tables"]["services"]["Update"]).eq("id", id);
  if (error) throw repositoryWriteError("services", error);
}
export async function toggleService(client: DatabaseClient, id: string, isActive: boolean): Promise<void> {
  const { error } = await client.from("services").update({ is_active: isActive, ...(!isActive ? { is_bookable: false } : {}) }).eq("id", id);
  if (error) throw repositoryWriteError("services", error);
}
export async function deleteService(client: DatabaseClient, id: string): Promise<void> {
  const { error } = await client.from("services").delete().eq("id", id);
  if (error) throw repositoryWriteError("services", error);
}
