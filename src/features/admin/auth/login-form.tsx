"use client";

import { Eye, EyeOff } from "lucide-react";
import { type FormEvent, useActionState, useState } from "react";
import { loginAction } from "./actions";
import type { LoginState } from "./types";

const initialState: LoginState = { status: "idle" };

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, initialState);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function preserveSubmittedValues(event: FormEvent<HTMLFormElement>) {
    const form = event.currentTarget;
    const submittedEmail = form.elements.namedItem("email");
    const submittedPassword = form.elements.namedItem("password");
    setEmail(submittedEmail instanceof HTMLInputElement ? submittedEmail.value : email);
    setPassword(submittedPassword instanceof HTMLInputElement ? submittedPassword.value : password);
  }

  return (
    <form action={action} className="space-y-5" noValidate onSubmit={preserveSubmittedValues}>
      <div>
        <label className="mb-2 block text-sm font-extrabold text-olive" htmlFor="email">E-mail</label>
        <input className="field min-h-12" id="email" name="email" type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.currentTarget.value)} maxLength={254} aria-describedby={state.fieldErrors?.email ? "email-error" : undefined} aria-invalid={Boolean(state.fieldErrors?.email)} required />
        {state.fieldErrors?.email && <p id="email-error" className="mt-2 text-sm font-bold text-red-700">{state.fieldErrors.email}</p>}
      </div>
      <div>
        <label className="mb-2 block text-sm font-extrabold text-olive" htmlFor="password">Senha</label>
        <div className="relative">
          <input className="field min-h-12 pr-12" id="password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.currentTarget.value)} maxLength={1024} aria-describedby={state.fieldErrors?.password ? "password-error" : undefined} aria-invalid={Boolean(state.fieldErrors?.password)} required />
          <button
            type="button"
            className="absolute inset-y-0 right-0 grid min-w-11 place-items-center rounded-r-xl text-stone-500 transition-colors hover:bg-stone-100 hover:text-olive focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand"
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            aria-pressed={showPassword}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => setShowPassword((visible) => !visible)}
          >
            {showPassword ? <EyeOff size={20} aria-hidden="true" /> : <Eye size={20} aria-hidden="true" />}
          </button>
        </div>
        {state.fieldErrors?.password && <p id="password-error" className="mt-2 text-sm font-bold text-red-700">{state.fieldErrors.password}</p>}
      </div>
      {state.message && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-800">{state.message}</div>}
      <button className="btn btn-primary min-h-12 w-full disabled:cursor-wait disabled:opacity-70" type="submit" disabled={pending} aria-disabled={pending}>
        {pending ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
