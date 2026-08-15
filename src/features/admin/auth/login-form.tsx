"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";
import type { LoginState } from "./types";

const initialState: LoginState = { status: "idle" };

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, initialState);
  return (
    <form action={action} className="space-y-5" noValidate>
      <div>
        <label className="mb-2 block text-sm font-extrabold text-olive" htmlFor="email">E-mail</label>
        <input className="field min-h-12" id="email" name="email" type="email" autoComplete="username" maxLength={254} aria-describedby={state.fieldErrors?.email ? "email-error" : undefined} aria-invalid={Boolean(state.fieldErrors?.email)} required />
        {state.fieldErrors?.email && <p id="email-error" className="mt-2 text-sm font-bold text-red-700">{state.fieldErrors.email}</p>}
      </div>
      <div>
        <label className="mb-2 block text-sm font-extrabold text-olive" htmlFor="password">Senha</label>
        <input className="field min-h-12" id="password" name="password" type="password" autoComplete="current-password" maxLength={1024} aria-describedby={state.fieldErrors?.password ? "password-error" : undefined} aria-invalid={Boolean(state.fieldErrors?.password)} required />
        {state.fieldErrors?.password && <p id="password-error" className="mt-2 text-sm font-bold text-red-700">{state.fieldErrors.password}</p>}
      </div>
      {state.message && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-800">{state.message}</div>}
      <button className="btn btn-primary min-h-12 w-full disabled:cursor-wait disabled:opacity-70" type="submit" disabled={pending} aria-disabled={pending}>
        {pending ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
