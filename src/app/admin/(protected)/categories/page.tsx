import { listAdminCategories } from "@/data/repositories/categories.repository";
import { requireAdmin } from "@/features/admin/auth/server";
import { CategoryCard, NewCategoryForm } from "@/features/admin/categories/category-forms";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export default async function AdminCategoriesPage() {
  await requireAdmin();
  const categories = await listAdminCategories(await createClient());
  return <><header className="mb-8"><p className="eyebrow">Conteúdo</p><div className="mt-2 flex flex-wrap items-end justify-between gap-4"><div><h1 className="text-3xl font-black text-olive sm:text-4xl">Categorias</h1><p className="mt-2 font-semibold text-stone-600">Organize as categorias exibidas no site.</p></div><a className="btn btn-primary" href="#nova-categoria">Nova categoria</a></div></header><NewCategoryForm />{categories.length ? <section aria-label="Categorias cadastradas" className="space-y-4">{categories.map((category) => <CategoryCard key={category.id} category={category} />)}</section> : <section className="rounded-2xl border border-dashed border-stone-300 bg-white p-8 text-center"><h2 className="text-xl font-black text-olive">Nenhuma categoria cadastrada</h2><p className="mt-2 font-semibold text-stone-600">Use o formulário acima para criar a primeira categoria.</p><a href="#nova-categoria" className="btn btn-primary mt-4">Nova categoria</a></section>}</>;
}
