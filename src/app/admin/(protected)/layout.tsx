import { AdminShell } from "@/features/admin/components/admin-shell";
import { requireAdmin } from "@/features/admin/auth/server";
import { getPublicBusinessSettings } from "@/data/queries/business.query";

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const [admin, business] = await Promise.all([requireAdmin(), getPublicBusinessSettings()]);
  return <AdminShell admin={admin} businessName={business.ok ? business.data?.shortName ?? null : null}>{children}</AdminShell>;
}
