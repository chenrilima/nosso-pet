"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signInAdmin, signOutAdmin } from "./service";
import type { LoginState } from "./types";
import { validateLoginForm } from "./validation";

const LOGIN_FAILURE_MESSAGE = "Não foi possível acessar o painel com essas credenciais.";

export async function loginAction(_state: LoginState, formData: FormData): Promise<LoginState> {
  const validation = validateLoginForm(formData);
  if (!validation.credentials) return { status: "error", fieldErrors: validation.fieldErrors };

  const result = await signInAdmin(await createClient(), validation.credentials);
  if (!result.ok) {
    return {
      status: "error",
      message: LOGIN_FAILURE_MESSAGE,
    };
  }
  redirect("/admin");
}

export async function logoutAction() {
  await signOutAdmin(await createClient());
  redirect("/admin/login");
}
