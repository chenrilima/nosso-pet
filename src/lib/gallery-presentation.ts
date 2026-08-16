import type { GalleryImage } from "@/types/domain";
import type { ImagePosition } from "./image-position";

export type GalleryPresentationImage = {
  id: string;
  imageUrl: string;
  altText: string;
  objectPosition?: string;
  imagePosition?: ImagePosition;
};

const localGallery: GalleryPresentationImage[] = [
  "object-[70%_50%]",
  "object-[92%_55%]",
  "object-[55%_50%]",
  "object-[80%_50%]",
].map((objectPosition, index) => ({
  id: `local-gallery-${index}`,
  imageUrl: "/images/hero-pets.png",
  altText: "Pet bem cuidado pela Nosso Pet",
  objectPosition,
}));

// Exceção editorial temporária: preserve a galeria atual enquanto não há fotos cadastradas.
export function galleryForPresentation(
  images: GalleryImage[],
): GalleryPresentationImage[] {
  return images.length > 0
    ? images.map(({ id, imageUrl, altText, imagePosition }) => ({ id, imageUrl, altText, imagePosition }))
    : localGallery;
}
