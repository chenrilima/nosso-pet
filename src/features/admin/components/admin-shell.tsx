import { LogOut, Menu, PawPrint } from "lucide-react";
import { logoutAction } from "@/features/admin/auth/actions";
import type { AdminUser } from "@/features/admin/auth/types";
import { AdminNav } from "./admin-nav";

function LogoutButton() {
  return <form action={logoutAction}><button type="submit" className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2.5 font-extrabold text-red-700 hover:bg-red-50"><LogOut size={19} aria-hidden="true" />Sair</button></form>;
}

function Brand({ businessName }: { businessName: string | null }) {
  return <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-brand text-white"><PawPrint size={22} aria-hidden="true" /></span><div>{businessName && <p className="font-black leading-tight text-olive">{businessName}</p>}<p className="text-xs font-bold text-stone-500">Administração</p></div></div>;
}

export function AdminShell({ admin, businessName, children }: { admin: AdminUser; businessName: string | null; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f7f6f1]">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 flex-col border-r border-stone-200 bg-white p-5 md:flex">
        <Brand businessName={businessName} /><div className="my-6 h-px bg-stone-200" /><AdminNav /><div className="mt-auto border-t border-stone-200 pt-4"><p className="mb-3 truncate px-3 text-xs font-bold text-stone-500" title={admin.email}>{admin.displayName || admin.email}</p><LogoutButton /></div>
      </aside>
      <header className="sticky top-0 z-20 flex min-h-16 items-center justify-between border-b border-stone-200 bg-white px-4 md:hidden">
        <Brand businessName={businessName} />
        <details className="group relative">
          <summary className="grid size-11 cursor-pointer list-none place-items-center rounded-xl border border-stone-200 text-olive hover:bg-stone-50" aria-label="Abrir menu"><Menu aria-hidden="true" /></summary>
          <div className="fixed inset-x-3 top-16 max-h-[calc(100vh-5rem)] overflow-y-auto rounded-2xl border border-stone-200 bg-white p-4 shadow-2xl"><AdminNav /><div className="mt-3 border-t border-stone-200 pt-3"><LogoutButton /></div></div>
        </details>
      </header>
      <main className="min-w-0 md:ml-72"><div className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-10">{children}</div></main>
    </div>
  );
}
