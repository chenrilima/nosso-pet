import { listPublicCatalog } from "@/data/repositories/catalog.repository";
import { createPublicQueryContext, type PublicQueryContext } from "./context";
import { runPublicQuery } from "./result";
export async function getPublicCatalog(context?: PublicQueryContext) { const ctx = context ?? await createPublicQueryContext(); return runPublicQuery("catalog", () => listPublicCatalog(ctx.client)); }
