import type { AdminActionResult } from "@/features/admin/mutations/types";

export function FormFeedback({ state }: { state: AdminActionResult }) {
  if (!state.message) return null;
  return <p role="status" className={`rounded-xl px-4 py-3 text-sm font-bold ${state.ok ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>{state.message}</p>;
}

export function FieldError({ state, name, fieldId = name }: { state: AdminActionResult; name: string; fieldId?: string }) {
  const error = state.ok ? undefined : state.fieldErrors?.[name];
  return error ? <span id={`${fieldId}-error`} className="mt-1 block text-sm font-bold text-red-700">{error}</span> : null;
}

export function fieldAccessibility(state: AdminActionResult, name: string, fieldId = name) {
  const invalid = !state.ok && Boolean(state.fieldErrors?.[name]);
  return { id: fieldId, "aria-invalid": invalid || undefined, "aria-describedby": invalid ? `${fieldId}-error` : undefined };
}
