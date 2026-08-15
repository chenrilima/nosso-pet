"use server";

import { revalidatePath } from "next/cache";
import { createService, deleteService, getAdminService, toggleService, updateService } from "@/data/repositories/services.repository";
import { RepositoryError } from "@/data/repositories/shared";
import { requireAdmin } from "@/features/admin/auth/server";
import type { AdminActionResult } from "@/features/admin/mutations/types";
import { createClient } from "@/lib/supabase/server";
import { UUID_PATTERN } from "@/features/admin/products/validation";
import { validateService } from "./validation";

const refresh = () => { revalidatePath("/"); revalidatePath("/admin/services"); revalidatePath("/admin"); };
function failure(error: unknown): AdminActionResult {
  if (error instanceof RepositoryError && error.infrastructureCode === "23505") return { ok: false, message: "Já existe um serviço com esse slug.", fieldErrors: { slug: "Escolha outro slug." } };
  if (error instanceof RepositoryError && error.infrastructureCode === "23514") return { ok: false, message: "Revise o tipo e os valores de preço." };
  console.error("Falha em mutação de serviço.", error instanceof Error ? { name: error.name } : undefined);
  return { ok: false, message: "Não foi possível salvar. Tente novamente." };
}
export async function createServiceAction(_previous: AdminActionResult, data: FormData): Promise<AdminActionResult> {
  await requireAdmin(); const validation = validateService(data);
  if (!validation.values) return { ok: false, message: "Revise os campos destacados.", fieldErrors: validation.fieldErrors };
  try { await createService(await createClient(), validation.values); refresh(); return { ok: true, message: "Serviço criado com sucesso." }; } catch (error) { return failure(error); }
}
export async function updateServiceAction(id: string, _previous: AdminActionResult, data: FormData): Promise<AdminActionResult> {
  void _previous;
  await requireAdmin(); if (!UUID_PATTERN.test(id)) return { ok: false, message: "Serviço inválido." };
  const client = await createClient();
  try { const current = await getAdminService(client, id); if (!current) return { ok: false, message: "Serviço não encontrado." }; const validation = validateService(data, current.icon_key); if (!validation.values) return { ok: false, message: "Revise os campos destacados.", fieldErrors: validation.fieldErrors }; await updateService(client, id, validation.values); refresh(); return { ok: true, message: "Serviço atualizado com sucesso." }; } catch (error) { return failure(error); }
}
export async function toggleServiceAction(id: string, isActive: boolean, _previous: AdminActionResult): Promise<AdminActionResult> {
  void _previous;
  await requireAdmin(); if (!UUID_PATTERN.test(id)) return { ok: false, message: "Serviço inválido." }; const client = await createClient();
  try { if (!(await getAdminService(client, id))) return { ok: false, message: "Serviço não encontrado." }; await toggleService(client, id, isActive); refresh(); return { ok: true, message: isActive ? "Serviço ativado." : "Serviço desativado e removido dos agendáveis." }; } catch (error) { return failure(error); }
}
export async function deleteServiceAction(id: string, _previous: AdminActionResult): Promise<AdminActionResult> {
  void _previous;
  await requireAdmin(); if (!UUID_PATTERN.test(id)) return { ok: false, message: "Serviço inválido." }; const client = await createClient();
  try { if (!(await getAdminService(client, id))) return { ok: false, message: "Serviço não encontrado." }; await deleteService(client, id); refresh(); return { ok: true, message: "Serviço excluído permanentemente." }; } catch (error) { return failure(error); }
}
