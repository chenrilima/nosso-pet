export const ORIGINAL_IMAGE_LIMIT = 20 * 1024 * 1024;
export const OPTIMIZED_IMAGE_LIMIT = 5 * 1024 * 1024;
export const DEFAULT_MAX_SIDE = 1920;
export const DEFAULT_QUALITY = 0.82;
export const INPUT_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"] as const;

export type OptimizedImage = { file: File; width: number; height: number; originalBytes: number; optimizedBytes: number; mimeType: "image/webp" | "image/png" };
export function fittedDimensions(width: number, height: number, maxSide = DEFAULT_MAX_SIDE) { const scale = Math.min(1, maxSide / Math.max(width, height)); return { width: Math.max(1, Math.round(width * scale)), height: Math.max(1, Math.round(height * scale)) }; }
export function optimizedFilename(mimeType: "image/webp" | "image/png", id = crypto.randomUUID(), directory = "gallery") { return `${directory}/${id}.${mimeType === "image/png" ? "png" : "webp"}`; }
export function validateImageInput(file: File): string | null { if (!INPUT_IMAGE_TYPES.includes(file.type as (typeof INPUT_IMAGE_TYPES)[number])) return "Escolha uma imagem JPEG, PNG, WebP ou AVIF compatível."; if (file.size > ORIGINAL_IMAGE_LIMIT) return "A imagem original deve ter no máximo 20 MiB."; if (!file.size) return "A imagem selecionada está vazia."; return null; }

async function hasTransparency(bitmap: ImageBitmap, width: number, height: number) { const canvas = document.createElement("canvas"); canvas.width = width; canvas.height = height; const context = canvas.getContext("2d", { willReadFrequently: true }); if (!context) throw new Error("Canvas indisponível."); context.drawImage(bitmap, 0, 0, width, height); const pixels = context.getImageData(0, 0, width, height).data; for (let index = 3; index < pixels.length; index += 4) if (pixels[index] < 255) return true; return false; }
function canvasBlob(canvas: HTMLCanvasElement, type: string, quality?: number) { return new Promise<Blob>((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Não foi possível gerar a imagem otimizada.")), type, quality)); }
export async function optimizeImage(file: File): Promise<OptimizedImage> {
  const invalid = validateImageInput(file); if (invalid) throw new Error(invalid);
  let bitmap: ImageBitmap;
  try { bitmap = await createImageBitmap(file, { imageOrientation: "from-image" }); } catch { throw new Error("O navegador não conseguiu decodificar esta imagem."); }
  try {
    const dimensions = fittedDimensions(bitmap.width, bitmap.height); const preservePng = file.type === "image/png" && await hasTransparency(bitmap, dimensions.width, dimensions.height); const mimeType = preservePng ? "image/png" as const : "image/webp" as const;
    const canvas = document.createElement("canvas"); canvas.width = dimensions.width; canvas.height = dimensions.height; const context = canvas.getContext("2d"); if (!context) throw new Error("Canvas indisponível."); context.drawImage(bitmap, 0, 0, dimensions.width, dimensions.height);
    const blob = await canvasBlob(canvas, mimeType, mimeType === "image/webp" ? DEFAULT_QUALITY : undefined); if (blob.size > OPTIMIZED_IMAGE_LIMIT) throw new Error("A imagem otimizada ainda excede 5 MiB. Escolha outra imagem.");
    const output = new File([blob], optimizedFilename(mimeType).split("/")[1], { type: mimeType }); return { file: output, ...dimensions, originalBytes: file.size, optimizedBytes: output.size, mimeType };
  } finally { bitmap.close(); }
}
