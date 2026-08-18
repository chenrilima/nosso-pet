import { listAdminCatalog } from "@/data/repositories/catalog.repository";
import { requireAdmin } from "@/features/admin/auth/server";
import { CatalogManager } from "@/features/admin/catalog/catalog-forms";
import { createClient } from "@/lib/supabase/server";
export const dynamic = "force-dynamic";
export default async function ProductOptionsPage() { await requireAdmin(); const categories = await listAdminCatalog(await createClient()); return <><header className="mb-8"><p className="eyebrow">Produtos</p><h1 className="mt-2 text-3xl font-black text-olive sm:text-4xl">Grupos e opções</h1><p className="mt-2 font-semibold text-stone-600">Configure as etapas da consulta pública por categoria.</p></header>{categories.length ? <CatalogManager categories={categories} /> : <p className="rounded-2xl bg-white p-6 font-semibold">Cadastre uma categoria primeiro.</p>}</>; }
