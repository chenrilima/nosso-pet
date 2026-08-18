"use server";

import { revalidatePath } from "next/cache";
import { getBusinessSettingsForAdmin, updateBusinessSettings, updateHeroImagePath, updateHeroImagePosition } from "@/data/repositories/business.repository";
import { parseImagePosition } from "@/lib/image-position";
import { RepositoryError } from "@/data/repositories/shared";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/features/admin/auth/server";
import type { AdminActionResult } from "@/features/admin/mutations/types";
import { validateBusinessSettings } from "./validation";
import { HERO_PATH_PATTERN, removeHeroImageFile, uploadedImageDiagnostic, uploadedImageErrorMessage, verifyHeroUpload } from "@/lib/storage/admin-site-assets";

const refreshHero = () => { revalidatePath("/"); revalidatePath("/admin"); revalidatePath("/admin/settings"); };
const logSettingsFailure = (operation: string, error: unknown) => console.error("Falha em mutação de configurações.", { entity: error instanceof RepositoryError ? error.entity : "business_settings", operation, code: error instanceof RepositoryError ? error.infrastructureCode : undefined, name: error instanceof Error ? error.name : "unknown", ...uploadedImageDiagnostic(error) });

export async function updateBusinessSettingsAction(id: string, _previous: AdminActionResult, data: FormData): Promise<AdminActionResult> {
  await requireAdmin();
  const validation = validateBusinessSettings(data);
  if (!validation.values) return { ok: false, message: "Revise os campos destacados.", fieldErrors: validation.fieldErrors };
  try {
    await updateBusinessSettings(await createClient(), id, validation.values);
    revalidatePath("/");
    revalidatePath("/", "layout");
    revalidatePath("/admin/settings");
    return { ok: true, message: "Dados da empresa salvos com sucesso." };
  } catch (error) {
    console.error("Falha ao atualizar os dados da empresa.", error instanceof Error ? { name: error.name } : undefined);
    return { ok: false, message: "Não foi possível salvar os dados. Tente novamente." };
  }
}

async function cleanupNewHero(client: Awaited<ReturnType<typeof createClient>>, path: string) { try { await removeHeroImageFile(client, path); } catch (error) { logSettingsFailure("cleanup_new_hero", error); } }
export async function replaceHeroImageAction(id: string, newPath: string): Promise<AdminActionResult> {
  await requireAdmin();
  if (!HERO_PATH_PATTERN.test(newPath)) return { ok: false, message: "Imagem principal inválida." };
  const client = await createClient();
  try {
    const current = await getBusinessSettingsForAdmin(client);
    if (!current || current.id !== id) { await cleanupNewHero(client, newPath); return { ok: false, message: "Configurações não encontradas." }; }
    await verifyHeroUpload(client, newPath);
    try { await updateHeroImagePath(client, id, newPath); } catch (error) { await cleanupNewHero(client, newPath); throw error; }
    if (current.hero_image_path) try { await removeHeroImageFile(client, current.hero_image_path); } catch (error) { logSettingsFailure("cleanup_old_hero", error); }
    refreshHero();
    return { ok: true, message: "Imagem principal atualizada." };
  } catch (error) { logSettingsFailure("replace_hero", error); return { ok: false, message: uploadedImageErrorMessage(error) ?? "Não foi possível atualizar a imagem principal." }; }
}

export async function removeHeroImageAction(id: string): Promise<AdminActionResult> {
  await requireAdmin();
  const client = await createClient();
  try {
    const current = await getBusinessSettingsForAdmin(client);
    if (!current || current.id !== id) return { ok: false, message: "Configurações não encontradas." };
    if (!current.hero_image_path) return { ok: true, message: "A imagem padrão já está em uso." };
    await updateHeroImagePath(client, id, null);
    try { await removeHeroImageFile(client, current.hero_image_path); } catch (error) { logSettingsFailure("cleanup_removed_hero", error); }
    refreshHero();
    return { ok: true, message: "Imagem padrão restaurada." };
  } catch (error) { logSettingsFailure("remove_hero", error); return { ok: false, message: "Não foi possível restaurar a imagem padrão." }; }
}

export async function updateHeroImagePositionAction(id: string, x: number, y: number): Promise<AdminActionResult> {
  await requireAdmin(); const position = parseImagePosition(x, y); if (!position) return { ok: false, message: "Posição inválida. Use valores inteiros entre 0 e 100." };
  const client = await createClient(); try { const current = await getBusinessSettingsForAdmin(client); if (!current || current.id !== id || !current.hero_image_path) return { ok: false, message: "Imagem principal não encontrada." }; await updateHeroImagePosition(client, id, position.x, position.y); refreshHero(); return { ok: true, message: "Enquadramento salvo." }; } catch (error) { logSettingsFailure("position_hero", error); return { ok: false, message: "Não foi possível salvar o enquadramento." }; }
}
