import type { Database } from "@/types/database";
import { repositoryError, repositoryWriteError, type DatabaseClient } from "./shared";
export type GalleryImageRow = Database["public"]["Tables"]["gallery_images"]["Row"];
export type GalleryMetadataValues = Pick<GalleryImageRow, "alt_text" | "caption" | "sort_order" | "is_published">;
export async function listPublishedGalleryImageRows(client: DatabaseClient): Promise<GalleryImageRow[]> {
  const { data, error } = await client.from("gallery_images").select("*").eq("is_published", true).order("sort_order").order("alt_text");
  if (error) throw repositoryError("gallery_images", error);
  return data;
}
export async function listAdminGallery(client: DatabaseClient): Promise<GalleryImageRow[]> { const { data, error } = await client.from("gallery_images").select("*").order("sort_order").order("alt_text"); if (error) throw repositoryError("gallery_images", error); return data; }
export async function getAdminGalleryImage(client: DatabaseClient, id: string): Promise<GalleryImageRow | null> { const { data, error } = await client.from("gallery_images").select("*").eq("id", id).maybeSingle(); if (error) throw repositoryError("gallery_images", error); return data; }
export async function createGalleryImage(client: DatabaseClient, storagePath: string, values: GalleryMetadataValues): Promise<void> { const { error } = await client.from("gallery_images").insert({ storage_path: storagePath, ...values }); if (error) throw repositoryWriteError("gallery_images", error); }
export async function updateGalleryMetadata(client: DatabaseClient, id: string, values: GalleryMetadataValues): Promise<void> { const { error } = await client.from("gallery_images").update(values).eq("id", id); if (error) throw repositoryWriteError("gallery_images", error); }
export async function toggleGalleryPublished(client: DatabaseClient, id: string, isPublished: boolean): Promise<void> { const { error } = await client.from("gallery_images").update({ is_published: isPublished }).eq("id", id); if (error) throw repositoryWriteError("gallery_images", error); }
export async function updateGalleryStoragePath(client: DatabaseClient, id: string, storagePath: string): Promise<void> { const { error } = await client.from("gallery_images").update({ storage_path: storagePath }).eq("id", id); if (error) throw repositoryWriteError("gallery_images", error); }
export async function deleteGalleryImage(client: DatabaseClient, id: string): Promise<void> { const { error } = await client.from("gallery_images").delete().eq("id", id); if (error) throw repositoryWriteError("gallery_images", error); }
