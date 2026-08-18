import { toBusinessSettings } from "@/data/adapters/business.adapter";
import { getPublicBusinessSettingsRow } from "@/data/repositories/business.repository";
import { createPublicQueryContext, type PublicQueryContext } from "./context";
import { runPublicQuery } from "./result";
export async function getPublicBusinessSettings(context?: PublicQueryContext) {
  const ctx = context ?? await createPublicQueryContext();
  return runPublicQuery("business", async () => { const row = await getPublicBusinessSettingsRow(ctx.client); return row ? toBusinessSettings(row, ctx.assetUrl) : null; });
}
