import type { DatabaseClient } from "@/data/repositories/shared";
import { GALLERY_PATH_PATTERN } from "@/features/admin/gallery/validation";
import { OPTIMIZED_IMAGE_LIMIT } from "@/lib/images/optimize-image";
import { SITE_ASSETS_BUCKET } from "./site-assets";

const ALLOWED_OUTPUTS = new Set(["image/webp", "image/png"]);
export const PRODUCT_PATH_PATTERN = /^products\/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.(?:webp|png)$/i;
export function assertGalleryPath(path: string) { if (!GALLERY_PATH_PATTERN.test(path)) throw new Error("Caminho de imagem inválido."); }
export function assertProductPath(path: string) { if (!PRODUCT_PATH_PATTERN.test(path)) throw new Error("Caminho de imagem de produto inválido."); }
async function verifyUpload(client: DatabaseClient, path: string, directory: "gallery" | "products", requirement: string) {
  const name = path.slice(`${directory}/`.length); const { data, error } = await client.storage.from(SITE_ASSETS_BUCKET).list(directory, { search: name, limit: 2 });
  if (error) throw new Error("Não foi possível validar o arquivo enviado."); const object = data.find((item) => item.name === name); const mime = String(object?.metadata?.mimetype ?? object?.metadata?.contentType ?? ""); const size = Number(object?.metadata?.size ?? 0);
  if (!object || !ALLOWED_OUTPUTS.has(mime) || !size || size > OPTIMIZED_IMAGE_LIMIT) throw new Error(requirement);
}
export async function verifyGalleryUpload(client: DatabaseClient, path: string): Promise<void> {
  assertGalleryPath(path); await verifyUpload(client, path, "gallery", "O arquivo enviado não atende aos requisitos da galeria.");
}
export async function removeGalleryImageFile(client: DatabaseClient, path: string): Promise<void> { assertGalleryPath(path); const { error } = await client.storage.from(SITE_ASSETS_BUCKET).remove([path]); if (error) throw new Error("Não foi possível remover o arquivo da galeria."); }
export async function verifyProductUpload(client: DatabaseClient, path: string): Promise<void> { assertProductPath(path); await verifyUpload(client, path, "products", "O arquivo enviado não atende aos requisitos de imagem de produto."); }
export async function removeProductImageFile(client: DatabaseClient, path: string): Promise<void> { assertProductPath(path); const { error } = await client.storage.from(SITE_ASSETS_BUCKET).remove([path]); if (error) throw new Error("Não foi possível remover o arquivo do produto."); }
