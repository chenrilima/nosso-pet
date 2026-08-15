import type { Database } from "@/types/database";
import { repositoryError, type DatabaseClient } from "./shared";
export type GalleryImageRow = Database["public"]["Tables"]["gallery_images"]["Row"];
export async function listPublishedGalleryImageRows(client: DatabaseClient): Promise<GalleryImageRow[]> {
  const { data, error } = await client.from("gallery_images").select("*").eq("is_published", true).order("sort_order").order("alt_text");
  if (error) throw repositoryError("gallery_images", error);
  return data;
}
