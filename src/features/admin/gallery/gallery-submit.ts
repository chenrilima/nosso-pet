import type { OptimizedImage } from "@/lib/images/optimize-image";

export function prepareGallerySubmission(form: HTMLFormElement, image: OptimizedImage) {
  return { image, formData: new FormData(form) };
}
