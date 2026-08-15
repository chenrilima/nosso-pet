"use server";

import { revalidatePath } from "next/cache";
import { createCategory, deleteCategory, toggleCategory, updateCategory } from "@/data/repositories/categories.repository";
import { RepositoryError } from "@/data/repositories/shared";
import { requireAdmin } from "@/features/admin/auth/server";
import type { AdminActionResult } from "@/features/admin/mutations/types";
import { createClient } from "@/lib/supabase/server";
import { validateCategory } from "./validation";

const invalidId = (id: string) => !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
function categoryFailure(error: unknown): AdminActionResult {
  if (error instanceof RepositoryError && error.infrastructureCode === "23505") return { ok: false, message: "Já existe uma categoria com esse slug.", fieldErrors: { slug: "Escolha outro slug." } };
  console.error("Falha em mutação de categoria.", error instanceof Error ? { name: error.name } : undefined);
  return { ok: false, message: "Não foi possível concluir a alteração. Tente novamente." };
}

export async function createCategoryAction(_previous: AdminActionResult, data: FormData): Promise<AdminActionResult> {
  await requireAdmin();
  const validation = validateCategory(data);
  if (!validation.values) return { ok: false, message: "Revise os campos destacados.", fieldErrors: validation.fieldErrors };
  try { await createCategory(await createClient(), validation.values); revalidatePath("/"); revalidatePath("/admin/categories"); return { ok: true, message: "Categoria criada com sucesso." }; }
  catch (error) { return categoryFailure(error); }
}

export async function updateCategoryAction(id: string, _previous: AdminActionResult, data: FormData): Promise<AdminActionResult> {
  await requireAdmin();
  if (invalidId(id)) return { ok: false, message: "Categoria inválida." };
  const validation = validateCategory(data);
  if (!validation.values) return { ok: false, message: "Revise os campos destacados.", fieldErrors: validation.fieldErrors };
  try { await updateCategory(await createClient(), id, validation.values); revalidatePath("/"); revalidatePath("/admin/categories"); return { ok: true, message: "Categoria atualizada com sucesso." }; }
  catch (error) { return categoryFailure(error); }
}

export async function toggleCategoryAction(id: string, isActive: boolean, _previous: AdminActionResult): Promise<AdminActionResult> {
  void _previous;
  await requireAdmin();
  if (invalidId(id)) return { ok: false, message: "Categoria inválida." };
  try { await toggleCategory(await createClient(), id, isActive); revalidatePath("/"); revalidatePath("/admin/categories"); return { ok: true, message: isActive ? "Categoria ativada." : "Categoria desativada. Ela deixa de aparecer no site." }; }
  catch (error) { return categoryFailure(error); }
}

export async function deleteCategoryAction(id: string, _previous: AdminActionResult): Promise<AdminActionResult> {
  void _previous;
  await requireAdmin();
  if (invalidId(id)) return { ok: false, message: "Categoria inválida." };
  try {
    const result = await deleteCategory(await createClient(), id);
    if (result === "in_use") return { ok: false, message: "Não é possível excluir esta categoria porque existem produtos vinculados." };
    revalidatePath("/"); revalidatePath("/admin/categories"); return { ok: true, message: "Categoria excluída permanentemente." };
  } catch (error) { return categoryFailure(error); }
}
