"use server";

import { revalidatePath } from "next/cache";
import { listAdminCategories } from "@/data/repositories/categories.repository";
import { createProduct, deleteProduct, getAdminProduct, toggleProduct, updateProduct, updateProductImagePath, updateProductImagePosition } from "@/data/repositories/products.repository";
import { parseImagePosition } from "@/lib/image-position";
import { RepositoryError } from "@/data/repositories/shared";
import { requireAdmin } from "@/features/admin/auth/server";
import type { AdminActionResult } from "@/features/admin/mutations/types";
import { createClient } from "@/lib/supabase/server";
import { UUID_PATTERN, validateProduct } from "./validation";
import { PRODUCT_PATH_PATTERN, removeProductImageFile, uploadedImageDiagnostic, uploadedImageErrorMessage, verifyProductUpload } from "@/lib/storage/admin-site-assets";

const refresh = () => { revalidatePath("/"); revalidatePath("/admin/products"); revalidatePath("/admin"); };
function failure(error: unknown): AdminActionResult {
  if (error instanceof RepositoryError && error.infrastructureCode === "23505") return { ok: false, message: "Já existe um produto com esse slug.", fieldErrors: { slug: "Escolha outro slug." } };
  if (error instanceof RepositoryError && error.infrastructureCode === "23503") return { ok: false, message: "A categoria selecionada não está disponível.", fieldErrors: { categoryId: "Selecione outra categoria." } };
  console.error("Falha em mutação de produto.", { entity: error instanceof RepositoryError ? error.entity : "products", operation: error instanceof RepositoryError ? error.operation : "mutation", code: error instanceof RepositoryError ? error.infrastructureCode : undefined, name: error instanceof Error ? error.name : "unknown", ...uploadedImageDiagnostic(error) });
  return { ok: false, message: uploadedImageErrorMessage(error) ?? "Não foi possível salvar. Tente novamente." };
}
async function categoryAvailable(client: Awaited<ReturnType<typeof createClient>>, categoryId: string, currentCategoryId?: string) { return (await listAdminCategories(client)).some((category) => category.id === categoryId && (category.is_active || category.id === currentCategoryId)); }

export async function createProductAction(_previous: AdminActionResult, data: FormData): Promise<AdminActionResult> {
  await requireAdmin();
  const validation = validateProduct(data);
  if (!validation.values) return { ok: false, message: "Revise os campos destacados.", fieldErrors: validation.fieldErrors };
  const client = await createClient();
  try { if (!(await categoryAvailable(client, validation.values.category_id))) return { ok: false, message: "Selecione uma categoria válida.", fieldErrors: { categoryId: "A categoria selecionada não está ativa ou não existe." } }; await createProduct(client, validation.values); refresh(); return { ok: true, message: "Produto criado com sucesso." }; } catch (error) { return failure(error); }
}
export async function updateProductAction(id: string, _previous: AdminActionResult, data: FormData): Promise<AdminActionResult> {
  void _previous;
  await requireAdmin();
  if (!UUID_PATTERN.test(id)) return { ok: false, message: "Produto inválido." };
  const validation = validateProduct(data);
  if (!validation.values) return { ok: false, message: "Revise os campos destacados.", fieldErrors: validation.fieldErrors };
  const client = await createClient();
  try { const current = await getAdminProduct(client, id); if (!current) return { ok: false, message: "Produto não encontrado." }; if (!(await categoryAvailable(client, validation.values.category_id, current.category_id))) return { ok: false, message: "Selecione uma categoria válida.", fieldErrors: { categoryId: "A categoria selecionada não está ativa ou não existe." } }; await updateProduct(client, id, validation.values); refresh(); return { ok: true, message: "Produto atualizado com sucesso." }; } catch (error) { return failure(error); }
}
export async function toggleProductAction(id: string, isActive: boolean, _previous: AdminActionResult): Promise<AdminActionResult> {
  void _previous;
  await requireAdmin();
  if (!UUID_PATTERN.test(id)) return { ok: false, message: "Produto inválido." };
  const client = await createClient();
  try { if (!(await getAdminProduct(client, id))) return { ok: false, message: "Produto não encontrado." }; await toggleProduct(client, id, isActive); refresh(); return { ok: true, message: isActive ? "Produto ativado." : "Produto desativado." }; } catch (error) { return failure(error); }
}
export async function deleteProductAction(id: string, _previous: AdminActionResult): Promise<AdminActionResult> {
  void _previous;
  await requireAdmin();
  if (!UUID_PATTERN.test(id)) return { ok: false, message: "Produto inválido." };
  const client = await createClient();
  try { const current = await getAdminProduct(client, id); if (!current) return { ok: false, message: "Produto não encontrado." }; await deleteProduct(client, id); if (current.image_path) try { await removeProductImageFile(client, current.image_path); } catch (error) { console.error("Arquivo órfão de produto requer limpeza.", { name: error instanceof Error ? error.name : "unknown" }); } refresh(); return { ok: true, message: "Produto excluído permanentemente." }; } catch (error) { return failure(error); }
}

async function cleanupNewProductFile(client: Awaited<ReturnType<typeof createClient>>, path: string) { try { await removeProductImageFile(client, path); } catch (error) { console.error("Arquivo novo de produto requer limpeza.", { name: error instanceof Error ? error.name : "unknown" }); } }
export async function replaceProductImageAction(id: string, newPath: string): Promise<AdminActionResult> {
  await requireAdmin();
  if (!UUID_PATTERN.test(id) || !PRODUCT_PATH_PATTERN.test(newPath)) return { ok: false, message: "Imagem de produto inválida." };
  const client = await createClient();
  try {
    const current = await getAdminProduct(client, id);
    if (!current) { await cleanupNewProductFile(client, newPath); return { ok: false, message: "Produto não encontrado." }; }
    await verifyProductUpload(client, newPath);
    try { await updateProductImagePath(client, id, newPath); } catch (error) { await cleanupNewProductFile(client, newPath); throw error; }
    if (current.image_path) try { await removeProductImageFile(client, current.image_path); } catch (error) { console.error("Arquivo antigo de produto requer limpeza.", { name: error instanceof Error ? error.name : "unknown" }); }
    refresh(); return { ok: true, message: "Imagem do produto atualizada." };
  } catch (error) { return failure(error); }
}
export async function removeProductImageAction(id: string): Promise<AdminActionResult> {
  await requireAdmin();
  if (!UUID_PATTERN.test(id)) return { ok: false, message: "Produto inválido." };
  const client = await createClient();
  try {
    const current = await getAdminProduct(client, id);
    if (!current) return { ok: false, message: "Produto não encontrado." };
    if (!current.image_path) return { ok: true, message: "O produto já está sem imagem." };
    await updateProductImagePath(client, id, null);
    try { await removeProductImageFile(client, current.image_path); } catch (error) { console.error("Arquivo órfão de produto requer limpeza.", { name: error instanceof Error ? error.name : "unknown" }); }
    refresh(); return { ok: true, message: "Imagem removida; o card voltou ao placeholder." };
  } catch (error) { return failure(error); }
}
export async function updateProductImagePositionAction(id: string, x: number, y: number): Promise<AdminActionResult> {
  await requireAdmin(); if (!UUID_PATTERN.test(id)) return { ok: false, message: "Produto inválido." }; const position = parseImagePosition(x, y); if (!position) return { ok: false, message: "Posição inválida. Use valores inteiros entre 0 e 100." };
  const client = await createClient(); try { const current = await getAdminProduct(client, id); if (!current?.image_path) return { ok: false, message: "Imagem do produto não encontrada." }; await updateProductImagePosition(client, id, position.x, position.y); refresh(); return { ok: true, message: "Enquadramento salvo." }; } catch (error) { return failure(error); }
}
