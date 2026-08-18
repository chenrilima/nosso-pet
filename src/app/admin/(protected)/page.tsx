import Link from "next/link";
import { Images, Package, Scissors, Tags, CircleHelp, Building2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/features/admin/auth/server";
import { getAdminDashboardSummary } from "@/features/admin/dashboard/repository";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const admin = await requireAdmin();
  const summary = await getAdminDashboardSummary(await createClient());
  const cards = [
    ["Produtos", summary.productOptions, "opções cadastradas", Package, "/admin/products"],
    ["Serviços", summary.services, "cadastrados", Scissors, "/admin/services"],
    ["Categorias", summary.categories, "cadastradas", Tags, "/admin/categories"],
    ["FAQ", summary.faqs, "perguntas", CircleHelp, "/admin/faqs"],
    ["Galeria", summary.galleryImages, "fotos", Images, "/admin/gallery"],
  ] as const;
  return (
    <>
      <header className="mb-8"><p className="eyebrow">Dashboard</p><h1 className="mt-2 text-3xl font-black tracking-tight text-olive sm:text-4xl">Olá, {admin.displayName || admin.email}</h1><p className="mt-2 font-semibold text-stone-600">Visão geral do conteúdo da empresa.</p></header>
      <section aria-labelledby="overview-title"><h2 id="overview-title" className="mb-4 text-lg font-black text-olive">Visão geral</h2><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{cards.map(([label, count, suffix, Icon, href]) => { const card = <article className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"><div className="mb-5 flex items-center justify-between"><h3 className="font-black text-olive">{label}</h3><span className="grid size-10 place-items-center rounded-xl bg-orange-50 text-brand"><Icon size={20} aria-hidden="true" /></span></div><p className="text-3xl font-black text-olive">{count}</p><p className="mt-1 text-sm font-bold text-stone-500">{suffix}</p></article>; return href ? <Link key={label} href={href}>{card}</Link> : <div key={label}>{card}</div>; })}<Link href="/admin/settings"><article className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"><div className="mb-5 flex items-center justify-between"><h3 className="font-black text-olive">Empresa</h3><span className="grid size-10 place-items-center rounded-xl bg-orange-50 text-brand"><Building2 size={20} aria-hidden="true" /></span></div><p className="font-black text-olive">Editar dados</p><p className="mt-1 text-sm font-bold text-stone-500">contato, endereço e horários</p></article></Link></div></section>
    </>
  );
}
