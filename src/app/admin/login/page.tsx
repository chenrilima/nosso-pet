import { redirect } from "next/navigation";
import { ArrowLeft, LockKeyhole, PawPrint } from "lucide-react";
import Link from "next/link";
import { LoginForm } from "@/features/admin/auth/login-form";
import { findCurrentAdmin } from "@/features/admin/auth/server";

export default async function AdminLoginPage() {
  if (await findCurrentAdmin()) redirect("/admin");
  return (
    <main className="paw-bg grid min-h-screen place-items-center bg-cream px-4 py-10">
      <section className="w-full max-w-md rounded-3xl border border-stone-200 bg-white p-6 shadow-soft sm:p-9" aria-labelledby="login-title">
        <div className="mb-7 flex items-center justify-between"><span className="grid size-12 place-items-center rounded-2xl bg-brand text-white"><PawPrint aria-hidden="true" /></span><span className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-3 py-1.5 text-xs font-black uppercase tracking-wide text-olive"><LockKeyhole size={14} aria-hidden="true" />Acesso restrito</span></div>
        <p className="eyebrow">Nosso Pet Admin</p>
        <h1 id="login-title" className="mt-2 text-3xl font-black tracking-tight text-olive">Boas-vindas</h1>
        <p className="mb-7 mt-2 text-sm font-semibold leading-relaxed text-stone-600">Entre com sua conta administrativa para acessar o painel.</p>
        <LoginForm />
        <Link href="/" className="mt-6 flex min-h-11 items-center justify-center gap-2 rounded-xl text-sm font-extrabold text-olive hover:bg-stone-50"><ArrowLeft size={17} aria-hidden="true" />Voltar ao site</Link>
      </section>
    </main>
  );
}
