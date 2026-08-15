import { toFaq } from "@/data/adapters/faq.adapter";
import { listPublishedFaqRows } from "@/data/repositories/faqs.repository";
import { createPublicQueryContext, type PublicQueryContext } from "./context";
import { runPublicQuery } from "./result";
export async function getPublishedFaqs(context?: PublicQueryContext) {
  const ctx = context ?? await createPublicQueryContext();
  return runPublicQuery("faqs", async () => (await listPublishedFaqRows(ctx.client)).map(toFaq));
}
