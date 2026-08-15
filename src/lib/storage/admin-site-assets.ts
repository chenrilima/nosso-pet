import type { DatabaseClient } from "@/data/repositories/shared";
import { GALLERY_PATH_PATTERN } from "@/features/admin/gallery/validation";
import { OPTIMIZED_IMAGE_LIMIT } from "@/lib/images/optimize-image";
import { SITE_ASSETS_BUCKET } from "./site-assets";

const ALLOWED_OUTPUTS = new Set(["image/webp", "image/png"]);
export function assertGalleryPath(path: string) { if (!GALLERY_PATH_PATTERN.test(path)) throw new Error("Caminho de imagem inválido."); }
export async function verifyGalleryUpload(client: DatabaseClient, path: string): Promise<void> {
  assertGalleryPath(path); const name = path.slice("gallery/".length); const { data, error } = await client.storage.from(SITE_ASSETS_BUCKET).list("gallery", { search: name, limit: 2 });
  if (error) throw new Error("Não foi possível validar o arquivo enviado."); const object = data.find((item) => item.name === name); const mime = String(object?.metadata?.mimetype ?? object?.metadata?.contentType ?? ""); const size = Number(object?.metadata?.size ?? 0);
  if (!object || !ALLOWED_OUTPUTS.has(mime) || !size || size > OPTIMIZED_IMAGE_LIMIT) throw new Error("O arquivo enviado não atende aos requisitos da galeria.");
}
export async function removeGalleryImageFile(client: DatabaseClient, path: string): Promise<void> { assertGalleryPath(path); const { error } = await client.storage.from(SITE_ASSETS_BUCKET).remove([path]); if (error) throw new Error("Não foi possível remover o arquivo da galeria."); }
