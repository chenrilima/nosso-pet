"use server";

import { revalidatePath } from "next/cache";
import { updateBusinessSettings } from "@/data/repositories/business.repository";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/features/admin/auth/server";
import type { AdminActionResult } from "@/features/admin/mutations/types";
import { validateBusinessSettings } from "./validation";

export async function updateBusinessSettingsAction(id: string, _previous: AdminActionResult, data: FormData): Promise<AdminActionResult> {
  await requireAdmin();
  const validation = validateBusinessSettings(data);
  if (!validation.values) return { ok: false, message: "Revise os campos destacados.", fieldErrors: validation.fieldErrors };
  try {
    await updateBusinessSettings(await createClient(), id, validation.values);
    revalidatePath("/");
    revalidatePath("/admin/settings");
    return { ok: true, message: "Dados da empresa salvos com sucesso." };
  } catch (error) {
    console.error("Falha ao atualizar os dados da empresa.", error instanceof Error ? { name: error.name } : undefined);
    return { ok: false, message: "Não foi possível salvar os dados. Tente novamente." };
  }
}
