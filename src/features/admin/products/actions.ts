"use server";

import { revalidatePath } from "next/cache";
import { listAdminCategories } from "@/data/repositories/categories.repository";
import { createProduct, deleteProduct, getAdminProduct, toggleProduct, updateProduct } from "@/data/repositories/products.repository";
import { RepositoryError } from "@/data/repositories/shared";
import { requireAdmin } from "@/features/admin/auth/server";
import type { AdminActionResult } from "@/features/admin/mutations/types";
import { createClient } from "@/lib/supabase/server";
import { UUID_PATTERN, validateProduct } from "./validation";

const refresh = () => { revalidatePath("/"); revalidatePath("/admin/products"); revalidatePath("/admin"); };
function failure(error: unknown): AdminActionResult {
  if (error instanceof RepositoryError && error.infrastructureCode === "23505") return { ok: false, message: "Já existe um produto com esse slug.", fieldErrors: { slug: "Escolha outro slug." } };
  if (error instanceof RepositoryError && error.infrastructureCode === "23503") return { ok: false, message: "A categoria selecionada não está disponível.", fieldErrors: { categoryId: "Selecione outra categoria." } };
  console.error("Falha em mutação de produto.", error instanceof Error ? { name: error.name } : undefined);
  return { ok: false, message: "Não foi possível salvar. Tente novamente." };
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
  try { if (!(await getAdminProduct(client, id))) return { ok: false, message: "Produto não encontrado." }; await deleteProduct(client, id); refresh(); return { ok: true, message: "Produto excluído permanentemente." }; } catch (error) { return failure(error); }
}
