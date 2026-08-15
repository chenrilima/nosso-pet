import type { FaqWriteValues } from "@/data/repositories/faqs.repository";
import { validateNonNegativeInteger } from "@/features/admin/mutations/validation";

export function validateFaq(data: FormData): { values?: FaqWriteValues; fieldErrors: Record<string, string> } {
  const fieldErrors: Record<string, string> = {};
  const question = String(data.get("question") ?? "").trim();
  const answer = String(data.get("answer") ?? "").trim();
  const sortOrder = validateNonNegativeInteger(data.get("sortOrder"));
  if (!question) fieldErrors.question = "Informe a pergunta."; else if (question.length > 300) fieldErrors.question = "Use no máximo 300 caracteres.";
  if (!answer) fieldErrors.answer = "Informe a resposta."; else if (answer.length > 5000) fieldErrors.answer = "Use no máximo 5.000 caracteres.";
  if (sortOrder.error) fieldErrors.sortOrder = sortOrder.error;
  if (Object.keys(fieldErrors).length) return { fieldErrors };
  return { fieldErrors, values: { question, answer, sort_order: sortOrder.value!, is_published: data.get("isPublished") === "on" } };
}
