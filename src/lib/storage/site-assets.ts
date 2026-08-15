import type { DatabaseClient } from "@/data/repositories/shared";

export const SITE_ASSETS_BUCKET = "site-assets";

export function getPublicSiteAssetUrl(client: DatabaseClient, path: string): string {
  return client.storage.from(SITE_ASSETS_BUCKET).getPublicUrl(path).data.publicUrl;
}
