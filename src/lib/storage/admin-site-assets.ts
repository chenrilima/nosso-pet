import type { DatabaseClient } from "@/data/repositories/shared";
import { GALLERY_PATH_PATTERN } from "@/features/admin/gallery/validation";
import { OPTIMIZED_IMAGE_LIMIT } from "@/lib/images/optimize-image";
import { SITE_ASSETS_BUCKET } from "./site-assets";

const ALLOWED_OUTPUTS = new Set(["image/webp", "image/png"]);
type ImageValidationReason = "object_unavailable" | "object_missing" | "invalid_mime" | "invalid_size" | "extension_mismatch";
export class UploadedImageValidationError extends Error {
  constructor(readonly validationStep: "storage_metadata", readonly reasonCode: ImageValidationReason) {
    super("A imagem enviada não pôde ser validada.");
    this.name = "UploadedImageValidationError";
  }
}
export function uploadedImageErrorMessage(error: unknown): string | null {
  if (!(error instanceof UploadedImageValidationError)) return null;
  if (error.reasonCode === "invalid_mime" || error.reasonCode === "extension_mismatch") return "Formato de imagem não suportado.";
  if (error.reasonCode === "invalid_size") return "A imagem otimizada deve ter no máximo 5 MiB.";
  return "Não foi possível validar a imagem enviada. Tente enviá-la novamente.";
}
export function uploadedImageDiagnostic(error: unknown) {
  return error instanceof UploadedImageValidationError ? { validationStep: error.validationStep, reasonCode: error.reasonCode } : {};
}
export const PRODUCT_PATH_PATTERN = /^products\/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.(?:webp|png)$/i;
export const HERO_PATH_PATTERN = /^hero\/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.(?:webp|png)$/i;
export function assertGalleryPath(path: string) { if (!GALLERY_PATH_PATTERN.test(path)) throw new Error("Caminho de imagem inválido."); }
export function assertProductPath(path: string) { if (!PRODUCT_PATH_PATTERN.test(path)) throw new Error("Caminho de imagem de produto inválido."); }
async function verifyUpload(client: DatabaseClient, path: string) {
  const { data: object, error } = await client.storage.from(SITE_ASSETS_BUCKET).info(path);
  if (error) throw new UploadedImageValidationError("storage_metadata", error.status === 404 ? "object_missing" : "object_unavailable");
  const mime = String(object.contentType ?? object.metadata?.mimetype ?? object.metadata?.contentType ?? "").toLowerCase();
  const size = Number(object.size ?? object.metadata?.size ?? 0);
  const extension = path.slice(path.lastIndexOf(".") + 1).toLowerCase();
  if (!ALLOWED_OUTPUTS.has(mime)) throw new UploadedImageValidationError("storage_metadata", "invalid_mime");
  if (!size || size > OPTIMIZED_IMAGE_LIMIT) throw new UploadedImageValidationError("storage_metadata", "invalid_size");
  if ((mime === "image/webp" && extension !== "webp") || (mime === "image/png" && extension !== "png")) throw new UploadedImageValidationError("storage_metadata", "extension_mismatch");
}
export async function verifyGalleryUpload(client: DatabaseClient, path: string): Promise<void> {
  assertGalleryPath(path); await verifyUpload(client, path);
}
export async function removeGalleryImageFile(client: DatabaseClient, path: string): Promise<void> { assertGalleryPath(path); const { error } = await client.storage.from(SITE_ASSETS_BUCKET).remove([path]); if (error) throw new Error("Não foi possível remover o arquivo da galeria."); }
export async function verifyProductUpload(client: DatabaseClient, path: string): Promise<void> { assertProductPath(path); await verifyUpload(client, path); }
export async function removeProductImageFile(client: DatabaseClient, path: string): Promise<void> { assertProductPath(path); const { error } = await client.storage.from(SITE_ASSETS_BUCKET).remove([path]); if (error) throw new Error("Não foi possível remover o arquivo do produto."); }
export async function verifyHeroUpload(client: DatabaseClient, path: string): Promise<void> {
  if (!HERO_PATH_PATTERN.test(path)) throw new Error("Caminho da imagem principal inválido.");
  await verifyUpload(client, path);
}
export async function removeHeroImageFile(client: DatabaseClient, path: string): Promise<void> {
  if (!HERO_PATH_PATTERN.test(path)) throw new Error("Caminho da imagem principal inválido.");
  const { error } = await client.storage.from(SITE_ASSETS_BUCKET).remove([path]);
  if (error) throw new Error("Não foi possível remover o arquivo da imagem principal.");
}
