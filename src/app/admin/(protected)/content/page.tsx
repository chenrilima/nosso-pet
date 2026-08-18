import { getBusinessSettingsForAdmin } from "@/data/repositories/business.repository";
import { requireAdmin } from "@/features/admin/auth/server";
import { ContentForm } from "@/features/admin/content/content-form";
import { HeroImageForm } from "@/features/admin/settings/hero-image-form";
import { getPublicSiteAssetUrl } from "@/lib/storage/site-assets";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export default async function AdminContentPage() {
  await requireAdmin();
  const client = await createClient();
  const row = await getBusinessSettingsForAdmin(client);
  return <><header className="mb-8"><p className="eyebrow">Página inicial</p><h1 className="mt-2 text-3xl font-black text-olive sm:text-4xl">Conteúdo do site</h1><p className="mt-2 font-semibold text-stone-600">Edite os principais textos comerciais sem alterar o layout.</p></header>{row ? <><HeroImageForm id={row.id} imageUrl={row.hero_image_path ? getPublicSiteAssetUrl(client, row.hero_image_path) : null} positionX={row.hero_position_x} positionY={row.hero_position_y} /><ContentForm row={row} /></> : <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-5 font-bold text-red-800">O registro único da empresa não foi encontrado.</div>}</>;
}
