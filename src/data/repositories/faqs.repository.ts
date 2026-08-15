import type { Database } from "@/types/database";
import { repositoryError, type DatabaseClient } from "./shared";
export type FaqRow = Database["public"]["Tables"]["faqs"]["Row"];
export async function listPublishedFaqRows(client: DatabaseClient): Promise<FaqRow[]> {
  const { data, error } = await client.from("faqs").select("*").eq("is_published", true).order("sort_order").order("question");
  if (error) throw repositoryError("faqs", error);
  return data;
}
