import { createPublicClient } from "@/lib/supabase/public";
import { getPublicSiteAssetUrl } from "@/lib/storage/site-assets";
import type { DatabaseClient } from "@/data/repositories/shared";
export type PublicQueryContext = { client: DatabaseClient; assetUrl: (path: string) => string };
export async function createPublicQueryContext(): Promise<PublicQueryContext> {
  const client = createPublicClient();
  return { client, assetUrl: (path) => getPublicSiteAssetUrl(client, path) };
}
