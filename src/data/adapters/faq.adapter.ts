import type { FaqRow } from "@/data/repositories/faqs.repository";
import type { Faq } from "@/types/domain";
export const toFaq = (row: FaqRow): Faq => ({ id: row.id, question: row.question, answer: row.answer, sortOrder: row.sort_order });
