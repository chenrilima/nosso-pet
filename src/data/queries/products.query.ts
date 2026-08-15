import { toCategory } from "@/data/adapters/category.adapter";
import { toProduct } from "@/data/adapters/product.adapter";
import { listActiveCategoryRows } from "@/data/repositories/categories.repository";
import { listActiveProductRows } from "@/data/repositories/products.repository";
import { createPublicQueryContext, type PublicQueryContext } from "./context";
import { runPublicQuery } from "./result";

export function mapPublicProducts(
  rows: Awaited<ReturnType<typeof listActiveProductRows>>,
  categoryRows: Awaited<ReturnType<typeof listActiveCategoryRows>>,
  assetUrl: PublicQueryContext["assetUrl"],
) {
  const categories = new Map(categoryRows.map((row) => [row.id, toCategory(row)]));
  return rows.flatMap((row) => {
    const category = categories.get(row.category_id);
    // An active product whose category is hidden by public RLS is not public content.
    return category ? [toProduct(row, category, assetUrl)] : [];
  });
}

export async function getPublicProducts(context?: PublicQueryContext) {
  const ctx = context ?? await createPublicQueryContext();
  return runPublicQuery("products", async () => {
    const [rows, categoryRows] = await Promise.all([listActiveProductRows(ctx.client), listActiveCategoryRows(ctx.client)]);
    return mapPublicProducts(rows, categoryRows, ctx.assetUrl);
  });
}
