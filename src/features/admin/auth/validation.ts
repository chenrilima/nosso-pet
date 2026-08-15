import type { LoginState } from "./types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLoginForm(formData: FormData): {
  credentials?: { email: string; password: string };
  fieldErrors?: LoginState["fieldErrors"];
} {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const fieldErrors: LoginState["fieldErrors"] = {};
  if (!email) fieldErrors.email = "Informe seu e-mail.";
  else if (email.length > 254 || !EMAIL_PATTERN.test(email)) fieldErrors.email = "Informe um e-mail válido.";
  if (!password) fieldErrors.password = "Informe sua senha.";
  else if (password.length > 1024) fieldErrors.password = "A senha informada é inválida.";
  return Object.keys(fieldErrors).length ? { fieldErrors } : { credentials: { email, password } };
}
