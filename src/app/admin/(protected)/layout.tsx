import { AdminShell } from "@/features/admin/components/admin-shell";
import { requireAdmin } from "@/features/admin/auth/server";

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  return <AdminShell admin={admin}>{children}</AdminShell>;
}
