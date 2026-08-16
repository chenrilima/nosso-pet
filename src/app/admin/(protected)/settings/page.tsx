import { getBusinessSettingsForAdmin } from "@/data/repositories/business.repository";
import { requireAdmin } from "@/features/admin/auth/server";
import { SettingsForm } from "@/features/admin/settings/settings-form";
import { HeroImageForm } from "@/features/admin/settings/hero-image-form";
import { createClient } from "@/lib/supabase/server";
import { getPublicSiteAssetUrl } from "@/lib/storage/site-assets";

export const dynamic = "force-dynamic";
export default async function AdminSettingsPage() {
  await requireAdmin();
  const client = await createClient();
  const row = await getBusinessSettingsForAdmin(client);
  if (!row) console.error("Registro singleton de business_settings ausente.");
  return (
    <>
      <header className="mb-8">
        <p className="eyebrow">Empresa</p>
        <h1 className="mt-2 text-3xl font-black text-olive sm:text-4xl">
          Dados da Nosso Pet
        </h1>
        <p className="mt-2 font-semibold text-stone-600">
          Edite as informações exibidas no site público.
        </p>
      </header>
      {row ? (
        <>
          <HeroImageForm
            id={row.id}
            imageUrl={
              row.hero_image_path
                ? getPublicSiteAssetUrl(client, row.hero_image_path)
                : null
            }
            positionX={row.hero_position_x}
            positionY={row.hero_position_y}
          />
          <SettingsForm row={row} />
        </>
      ) : (
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 p-5 font-bold text-red-800"
        >
          O registro único da empresa não foi encontrado. Nenhum registro foi
          criado automaticamente.
        </div>
      )}
    </>
  );
}
