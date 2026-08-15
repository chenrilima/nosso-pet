import { toCategory } from "@/data/adapters/category.adapter";
import { toProduct } from "@/data/adapters/product.adapter";
import { listActiveCategoryRows } from "@/data/repositories/categories.repository";
import { listActiveProductRows } from "@/data/repositories/products.repository";
import { createPublicQueryContext, type PublicQueryContext } from "./context";
import { runPublicQuery } from "./result";
export async function getPublicProducts(context?: PublicQueryContext) {
  const ctx = context ?? await createPublicQueryContext();
  return runPublicQuery("products", async () => {
    const [rows, categoryRows] = await Promise.all([listActiveProductRows(ctx.client), listActiveCategoryRows(ctx.client)]);
    const categories = new Map(categoryRows.map((row) => [row.id, toCategory(row)]));
    return rows.map((row) => { const category = categories.get(row.category_id); if (!category) throw new Error(`Categoria ausente para produto ${row.id}.`); return toProduct(row, category, ctx.assetUrl); });
  });
}
