import { toCategory } from "@/data/adapters/category.adapter";
import { listActiveCategoryRows } from "@/data/repositories/categories.repository";
import { createPublicQueryContext, type PublicQueryContext } from "./context";
import { runPublicQuery } from "./result";
export async function getActiveCategories(context?: PublicQueryContext) {
  const ctx = context ?? await createPublicQueryContext();
  return runPublicQuery("categories", async () => (await listActiveCategoryRows(ctx.client)).map(toCategory));
}
