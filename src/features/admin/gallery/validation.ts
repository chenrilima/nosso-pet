import type { GalleryMetadataValues } from "@/data/repositories/gallery.repository";
import { validateNonNegativeInteger } from "@/features/admin/mutations/validation";

export const GALLERY_PATH_PATTERN = /^gallery\/[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.(webp|png)$/i;
export function validateGalleryMetadata(data: FormData): { values?: GalleryMetadataValues; fieldErrors: Record<string, string> } {
  const fieldErrors: Record<string, string> = {};
  const altText = String(data.get("altText") ?? "").trim(); const captionValue = String(data.get("caption") ?? "").trim(); const sortOrder = validateNonNegativeInteger(data.get("sortOrder")); const isPublished = data.get("isPublished") === "on";
  if ((!altText && isPublished) || !altText) fieldErrors.altText = "Informe o texto alternativo."; else if (altText.length > 300) fieldErrors.altText = "Use no máximo 300 caracteres.";
  if (captionValue.length > 1000) fieldErrors.caption = "Use no máximo 1.000 caracteres.";
  if (sortOrder.error) fieldErrors.sortOrder = sortOrder.error;
  if (Object.keys(fieldErrors).length) return { fieldErrors };
  return { fieldErrors, values: { alt_text: altText, caption: captionValue || null, sort_order: sortOrder.value!, is_published: isPublished } };
}
