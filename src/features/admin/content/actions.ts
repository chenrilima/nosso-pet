"use server";

import { revalidatePath } from "next/cache";
import { updateHomeContent } from "@/data/repositories/business.repository";
import { requireAdmin } from "@/features/admin/auth/server";
import type { AdminActionResult } from "@/features/admin/mutations/types";
import { UUID_PATTERN } from "@/features/admin/mutations/validation";
import { createClient } from "@/lib/supabase/server";
import { validateHomeContent } from "./validation";

export async function updateHomeContentAction(id: string, _previous: AdminActionResult, data: FormData): Promise<AdminActionResult> {
  await requireAdmin();
  if (!UUID_PATTERN.test(id)) return { ok: false, message: "Configuração inválida." };
  const validation = validateHomeContent(data);
  if (!validation.values) return { ok: false, message: "Revise os campos destacados.", fieldErrors: validation.fieldErrors };
  try {
    await updateHomeContent(await createClient(), id, validation.values);
    revalidatePath("/");
    revalidatePath("/admin/content");
    return { ok: true, message: "Conteúdo da página inicial salvo com sucesso." };
  } catch (error) {
    console.error("Falha ao atualizar conteúdo da página inicial.", error instanceof Error ? { name: error.name } : undefined);
    return { ok: false, message: "Não foi possível salvar o conteúdo. Tente novamente." };
  }
}
