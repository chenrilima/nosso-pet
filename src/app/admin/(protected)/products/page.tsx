import Link from "next/link";
import { ListTree, Tags } from "lucide-react";
import { requireAdmin } from "@/features/admin/auth/server";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  await requireAdmin();
  const paths = [
    { href: "/admin/categories", title: "1. Categorias", description: "Defina as linhas de produtos exibidas no site.", icon: Tags },
    { href: "/admin/products/options", title: "2. Grupos e opções", description: "Configure as escolhas que formam a consulta e a sacola.", icon: ListTree },
  ];
  return <><header className="mb-8"><p className="eyebrow">Conteúdo</p><h1 className="mt-2 text-3xl font-black text-olive sm:text-4xl">Produtos</h1><p className="mt-2 max-w-2xl font-semibold text-stone-600">O catálogo público é configurado por categorias, grupos e opções.</p></header><section className="grid gap-4 sm:grid-cols-2">{paths.map(({ href, title, description, icon: Icon }) => <Link key={href} href={href} className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition hover:border-brand/40"><span className="grid size-11 place-items-center rounded-xl bg-orange-50 text-brand"><Icon aria-hidden="true" size={22} /></span><h2 className="mt-5 text-xl font-black text-olive">{title}</h2><p className="mt-2 font-semibold text-stone-600">{description}</p><span className="btn btn-secondary mt-5">Gerenciar</span></Link>)}</section></>;
}
