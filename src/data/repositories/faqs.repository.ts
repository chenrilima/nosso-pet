import type { Faq } from "@/types/domain";
import { repositoryError, type DatabaseClient } from "./shared";

export async function listPublishedFaqs(client: DatabaseClient): Promise<Faq[]> {
  const { data, error } = await client.from("faqs").select("id,question,answer,sort_order").eq("is_published", true).order("sort_order");
  if (error) throw repositoryError("as perguntas frequentes", error.message);
  return data.map((row) => ({ id: row.id, question: row.question, answer: row.answer, sortOrder: row.sort_order }));
}
