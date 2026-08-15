import type { GalleryImage } from "@/types/domain";
import { repositoryError, type DatabaseClient } from "./shared";

export async function listPublishedGalleryImages(client: DatabaseClient): Promise<GalleryImage[]> {
  const { data, error } = await client.from("gallery_images").select("id,storage_path,alt_text,caption,sort_order").eq("is_published", true).order("sort_order");
  if (error) throw repositoryError("a galeria", error.message);
  return data.map((row) => ({ id: row.id, storagePath: row.storage_path, altText: row.alt_text, caption: row.caption, sortOrder: row.sort_order }));
}
