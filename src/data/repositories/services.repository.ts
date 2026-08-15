import type { Database } from "@/types/database";
import { repositoryError, type DatabaseClient } from "./shared";
export type ServiceRow = Database["public"]["Tables"]["services"]["Row"];
async function listServiceRows(client: DatabaseClient, bookableOnly: boolean): Promise<ServiceRow[]> {
  let query = client.from("services").select("*").eq("is_active", true);
  if (bookableOnly) query = query.eq("is_bookable", true);
  const { data, error } = await query.order("sort_order").order("name");
  if (error) throw repositoryError("services", error);
  return data;
}
export const listActiveServiceRows = (client: DatabaseClient) => listServiceRows(client, false);
export const listBookableServiceRows = (client: DatabaseClient) => listServiceRows(client, true);
