import type { AdminActionResult } from "@/features/admin/mutations/types";

export function FormFeedback({ state }: { state: AdminActionResult }) {
  if (!state.message) return null;
  return <p role="status" className={`rounded-xl px-4 py-3 text-sm font-bold ${state.ok ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>{state.message}</p>;
}

export function FieldError({ state, name }: { state: AdminActionResult; name: string }) {
  const error = state.ok ? undefined : state.fieldErrors?.[name];
  return error ? <span className="mt-1 block text-sm font-bold text-red-700">{error}</span> : null;
}
