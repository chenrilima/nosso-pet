"use client";

import { useActionState } from "react";
import type { BusinessSettingsRow } from "@/data/repositories/business.repository";
import { initialAdminActionResult } from "@/features/admin/mutations/types";
import { FieldError, FormFeedback, fieldAccessibility } from "@/features/admin/components/form-feedback";
import { updateBusinessSettingsAction } from "./actions";
import { BUSINESS_DAYS } from "./validation";

const fieldClass = "field mt-1";
function parseHours(hours: BusinessSettingsRow["hours"], day: string) {
  if (!hours || typeof hours !== "object" || Array.isArray(hours)) return { open: false, start: "08:00", end: "18:00" };
  const value = hours[day];
  if (typeof value !== "string" || value === "closed") return { open: false, start: "08:00", end: "18:00" };
  const [start, end] = value.split("-");
  return { open: Boolean(start && end), start: start || "08:00", end: end || "18:00" };
}
function Input({ label, name, defaultValue, state, type = "text", maxLength = 120, inputMode }: { label: string; name: string; defaultValue: string; state: ReturnType<typeof useSettingsState>[0]; type?: string; maxLength?: number; inputMode?: "tel" | "numeric" }) {
  return <div><label htmlFor={name} className="block text-sm font-extrabold text-olive">{label}</label><input {...fieldAccessibility(state, name)} className={fieldClass} name={name} type={type} inputMode={inputMode} defaultValue={defaultValue} maxLength={maxLength} required /><FieldError state={state} name={name} /></div>;
}
function useSettingsState(row: BusinessSettingsRow) { return useActionState(updateBusinessSettingsAction.bind(null, row.id), initialAdminActionResult); }

export function SettingsForm({ row }: { row: BusinessSettingsRow }) {
  const [state, action, pending] = useSettingsState(row);
  return <form action={action} className="space-y-6">
    <FormFeedback state={state} />
    <section className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-6"><h2 className="mb-4 text-xl font-black text-olive">Identidade e contato</h2><div className="grid gap-4 sm:grid-cols-2">
      <Input label="Nome da empresa" name="name" defaultValue={row.name} state={state} /><Input label="Nome curto" name="shortName" defaultValue={row.short_name} state={state} />
      <Input label="Telefone" name="phone" inputMode="tel" defaultValue={row.phone} state={state} /><Input label="WhatsApp" name="whatsapp" inputMode="tel" defaultValue={row.whatsapp} state={state} />
      <Input label="Usuário do Instagram" name="instagramHandle" defaultValue={row.instagram_handle} state={state} /><Input label="URL do Instagram" name="instagramUrl" type="url" defaultValue={row.instagram_url} state={state} maxLength={2000} />
    </div></section>
    <section className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-6"><h2 className="mb-4 text-xl font-black text-olive">Endereço e mapas</h2><div className="grid gap-4 sm:grid-cols-2">
      <Input label="Endereço" name="addressLine" defaultValue={row.address_line} state={state} /><Input label="Bairro" name="district" defaultValue={row.district} state={state} />
      <Input label="Cidade" name="city" defaultValue={row.city} state={state} /><Input label="Estado (UF)" name="state" defaultValue={row.state} state={state} />
      <Input label="CEP" name="postalCode" inputMode="numeric" defaultValue={row.postal_code} state={state} /><div />
      <Input label="URL do mapa" name="mapsUrl" type="url" defaultValue={row.maps_url} state={state} maxLength={2000} /><Input label="URL de incorporação do mapa" name="mapsEmbedUrl" type="url" defaultValue={row.maps_embed_url} state={state} maxLength={2000} />
    </div></section>
    <section className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-6"><h2 className="text-xl font-black text-olive">Horários</h2><p className="mb-4 mt-1 text-sm font-semibold text-stone-600">Marque “Aberto” e informe o intervalo. Dias desmarcados são salvos como fechados.</p><div className="space-y-3">{BUSINESS_DAYS.map(([day, label]) => { const value = parseHours(row.hours, day); const errorName = `hours_${day}`; const invalid = fieldAccessibility(state, errorName); return <fieldset key={day} className="grid gap-3 rounded-xl bg-stone-50 p-3 sm:grid-cols-[1fr_auto_auto] sm:items-end"><legend className="sr-only">{label}</legend><label className="flex min-h-11 items-center gap-2 font-extrabold text-olive"><input type="checkbox" name={`${errorName}_open`} defaultChecked={value.open} />Aberto — {label}</label><label className="text-sm font-bold">De<input {...invalid} id={`${errorName}-start`} className={fieldClass} type="time" name={`${errorName}_start`} defaultValue={value.start} /></label><label className="text-sm font-bold">Até<input {...invalid} id={`${errorName}-end`} className={fieldClass} type="time" name={`${errorName}_end`} defaultValue={value.end} /></label><div className="sm:col-span-3"><FieldError state={state} name={errorName} /></div></fieldset>; })}</div></section>
    <div className="sticky bottom-3 rounded-2xl border border-stone-200 bg-white/95 p-3 shadow-lg backdrop-blur"><button className="btn btn-primary w-full sm:w-auto" type="submit" disabled={pending}>{pending ? "Salvando…" : "Salvar dados da empresa"}</button></div>
  </form>;
}
