import { getBusinessSettingsForAdmin } from "@/data/repositories/business.repository";
import { requireAdmin } from "@/features/admin/auth/server";
import { SettingsForm } from "@/features/admin/settings/settings-form";
import { createClient } from "@/lib/supabase/server";

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
          Dados da {row?.short_name ?? "empresa"}
        </h1>
        <p className="mt-2 font-semibold text-stone-600">
          Edite as informações exibidas no site público.
        </p>
      </header>
      {row ? (
        <>
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
