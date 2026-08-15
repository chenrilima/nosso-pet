"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signInAdmin, signOutAdmin } from "./service";
import type { LoginState } from "./types";
import { validateLoginForm } from "./validation";

export async function loginAction(_state: LoginState, formData: FormData): Promise<LoginState> {
  const validation = validateLoginForm(formData);
  if (!validation.credentials) return { status: "error", fieldErrors: validation.fieldErrors };

  const result = await signInAdmin(await createClient(), validation.credentials);
  if (!result.ok) {
    return {
      status: "error",
      message: result.reason === "not_admin"
        ? "Esta conta não possui acesso ao painel administrativo."
        : "E-mail ou senha inválidos.",
    };
  }
  redirect("/admin");
}

export async function logoutAction() {
  await signOutAdmin(await createClient());
  redirect("/admin/login");
}
