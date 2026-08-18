import type { GalleryImage } from "@/types/domain";
import type { ImagePosition } from "./image-position";

export type GalleryPresentationImage = {
  id: string;
  imageUrl: string;
  altText: string;
  imagePosition?: ImagePosition;
  caption: string | null;
};
export function galleryForPresentation(
  images: GalleryImage[],
): GalleryPresentationImage[] {
  return images.map(({ id, imageUrl, altText, imagePosition, caption }) => ({ id, imageUrl, altText, imagePosition, caption }));
}
