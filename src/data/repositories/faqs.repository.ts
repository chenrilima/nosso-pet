import type { Database } from "@/types/database";
import { repositoryError, repositoryWriteError, type DatabaseClient } from "./shared";
export type FaqRow = Database["public"]["Tables"]["faqs"]["Row"];
export type FaqWriteValues = Pick<FaqRow, "question" | "answer" | "sort_order" | "is_published">;
export async function listPublishedFaqRows(client: DatabaseClient): Promise<FaqRow[]> {
  const { data, error } = await client.from("faqs").select("*").eq("is_published", true).order("sort_order").order("question");
  if (error) throw repositoryError("faqs", error);
  return data;
}
export async function listAdminFaqs(client: DatabaseClient): Promise<FaqRow[]> { const { data, error } = await client.from("faqs").select("*").order("sort_order").order("question"); if (error) throw repositoryError("faqs", error); return data; }
export async function getAdminFaq(client: DatabaseClient, id: string): Promise<FaqRow | null> { const { data, error } = await client.from("faqs").select("*").eq("id", id).maybeSingle(); if (error) throw repositoryError("faqs", error); return data; }
export async function createFaq(client: DatabaseClient, values: FaqWriteValues): Promise<void> { const { error } = await client.from("faqs").insert(values); if (error) throw repositoryWriteError("faqs", error); }
export async function updateFaq(client: DatabaseClient, id: string, values: FaqWriteValues): Promise<void> { const { error } = await client.from("faqs").update(values).eq("id", id); if (error) throw repositoryWriteError("faqs", error); }
export async function toggleFaqPublished(client: DatabaseClient, id: string, isPublished: boolean): Promise<void> { const { error } = await client.from("faqs").update({ is_published: isPublished }).eq("id", id); if (error) throw repositoryWriteError("faqs", error); }
export async function deleteFaq(client: DatabaseClient, id: string): Promise<void> { const { error } = await client.from("faqs").delete().eq("id", id); if (error) throw repositoryWriteError("faqs", error); }
