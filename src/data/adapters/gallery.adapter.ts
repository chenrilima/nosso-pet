import type { GalleryImageRow } from "@/data/repositories/gallery.repository";
import type { GalleryImage } from "@/types/domain";
import { safeImagePosition } from "@/lib/image-position";
export const toGalleryImage = (row: GalleryImageRow, assetUrl: (path: string) => string): GalleryImage => ({ id: row.id, imageUrl: assetUrl(row.storage_path), altText: row.alt_text, caption: row.caption, sortOrder: row.sort_order, imagePosition: safeImagePosition(row.position_x, row.position_y) });
