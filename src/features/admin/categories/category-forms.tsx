"use client";

import { useActionState, useState } from "react";
import type { AdminCategory } from "@/data/repositories/categories.repository";
import { FieldError, FormFeedback } from "@/features/admin/components/form-feedback";
import { initialAdminActionResult } from "@/features/admin/mutations/types";
import { createCategoryAction, deleteCategoryAction, toggleCategoryAction, updateCategoryAction } from "./actions";

const inputClass = "field mt-1";
function CategoryFields({ category, state }: { category?: AdminCategory; state: typeof initialAdminActionResult }) {
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <label className="text-sm font-extrabold text-olive">Nome<input className={inputClass} name="name" defaultValue={category?.name} maxLength={80} required /><FieldError state={state} name="name" /></label>
    <label className="text-sm font-extrabold text-olive">Slug <span className="font-semibold text-stone-500">(opcional no cadastro)</span><input className={inputClass} name="slug" defaultValue={category?.slug} maxLength={80} placeholder="gerado pelo nome" /><FieldError state={state} name="slug" /></label>
    <label className="text-sm font-extrabold text-olive">Ordem<input className={inputClass} name="sortOrder" type="number" min="0" step="1" defaultValue={category?.sort_order ?? 0} required /><FieldError state={state} name="sortOrder" /></label>
    <label className="flex min-h-11 items-center gap-2 self-end rounded-xl bg-stone-50 px-3 font-extrabold text-olive"><input name="isActive" type="checkbox" defaultChecked={category?.is_active ?? true} />Ativa no site</label>
    <label className="text-sm font-extrabold text-olive sm:col-span-2 lg:col-span-4">Descrição<textarea className={inputClass} name="description" defaultValue={category?.description} maxLength={300} rows={2} /><FieldError state={state} name="description" /></label>
  </div>;
}

export function NewCategoryForm() {
  const [state, action, pending] = useActionState(createCategoryAction, initialAdminActionResult);
  return <section id="nova-categoria" className="mb-6 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-6"><h2 className="mb-4 text-xl font-black text-olive">Nova categoria</h2><form action={action} className="space-y-4"><CategoryFields state={state} /><FormFeedback state={state} /><button className="btn btn-primary w-full sm:w-auto" disabled={pending}>{pending ? "Criando…" : "Criar categoria"}</button></form></section>;
}

function CategoryActions({ category }: { category: AdminCategory }) {
  const [toggleState, toggleAction, togglePending] = useActionState(toggleCategoryAction.bind(null, category.id, !category.is_active), initialAdminActionResult);
  const [deleteState, deleteAction, deletePending] = useActionState(deleteCategoryAction.bind(null, category.id), initialAdminActionResult);
  const [confirming, setConfirming] = useState(false);
  return <div className="space-y-3"><div className="flex flex-wrap gap-2"><form action={toggleAction}><button className="btn btn-secondary min-h-11" disabled={togglePending}>{togglePending ? "Alterando…" : category.is_active ? "Desativar" : "Ativar"}</button></form>{confirming ? <><form action={deleteAction}><button className="btn min-h-11 bg-red-700 text-white" disabled={deletePending}>{deletePending ? "Excluindo…" : `Excluir ${category.name}`}</button></form><button type="button" className="btn btn-secondary min-h-11" onClick={() => setConfirming(false)}>Cancelar</button></> : <button type="button" className="btn min-h-11 border border-red-200 bg-white text-red-700" onClick={() => setConfirming(true)} disabled={category.dependency_count > 0} title={category.dependency_count > 0 ? "Há grupos ou registros antigos vinculados" : undefined}>Excluir</button>}</div><FormFeedback state={toggleState.message ? toggleState : deleteState} />{confirming && <p role="alert" className="text-sm font-bold text-red-700">Confirmar exclusão permanente de “{category.name}”? Esta ação não pode ser desfeita.</p>}</div>;
}

export function CategoryCard({ category }: { category: AdminCategory }) {
  const [state, action, pending] = useActionState(updateCategoryAction.bind(null, category.id), initialAdminActionResult);
  return <article className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-6"><div className="mb-4 flex flex-wrap items-center justify-between gap-2"><div><h2 className="text-xl font-black text-olive">{category.name}</h2><p className="text-sm font-bold text-stone-500">{category.dependency_count} vínculo(s) de catálogo</p></div><span className={`rounded-full px-3 py-1 text-xs font-black ${category.is_active ? "bg-green-100 text-green-800" : "bg-stone-200 text-stone-700"}`}>{category.is_active ? "Ativa" : "Inativa"}</span></div><form action={action} className="space-y-4"><CategoryFields category={category} state={state} /><FormFeedback state={state} /><button className="btn btn-primary w-full sm:w-auto" disabled={pending}>{pending ? "Salvando…" : "Salvar edição"}</button></form><div className="my-4 h-px bg-stone-200" /><p className="mb-3 text-sm font-semibold text-stone-600">Desativar oculta do site. Excluir só é permitido sem grupos ou registros antigos vinculados.</p><CategoryActions category={category} /></article>;
}
