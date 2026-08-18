import { toService } from "@/data/adapters/service.adapter";
import { listActiveServiceRows, listBookableServiceRows } from "@/data/repositories/services.repository";
import { createPublicQueryContext, type PublicQueryContext } from "./context";
import { runPublicQuery } from "./result";
async function getServices(context: PublicQueryContext | undefined, bookable: boolean) {
  const ctx = context ?? await createPublicQueryContext();
  return runPublicQuery("services", async () => (await (bookable ? listBookableServiceRows(ctx.client) : listActiveServiceRows(ctx.client))).map(toService));
}
export const getPublicServices = (context?: PublicQueryContext) => getServices(context, false);
export const getBookableServices = (context?: PublicQueryContext) => getServices(context, true);
