import type { PublicFaqRow } from "@/data/repositories/faqs.repository";
import type { Faq } from "@/types/domain";
export const toFaq = (row: PublicFaqRow): Faq => ({ id: row.id, question: row.question, answer: row.answer, sortOrder: row.sort_order });
