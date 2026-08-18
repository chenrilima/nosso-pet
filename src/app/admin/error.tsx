"use client";
import { useEffect } from "react";
import Link from "next/link";

export default function AdminError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => { console.error("admin_render_error", { name: error.name, digest: error.digest }); }, [error]);
  return <main className="grid min-h-[70vh] place-items-center bg-stone-100 px-4"><section className="max-w-lg rounded-2xl border border-stone-200 bg-white p-8 text-center shadow-sm"><h1 className="text-2xl font-black text-olive">Ocorreu um problema</h1><p className="mt-2 text-stone-600">Não foi possível carregar esta área do painel.</p><div className="mt-5 flex flex-wrap justify-center gap-3"><button className="btn btn-primary" onClick={retry}>Tentar novamente</button><Link className="btn btn-secondary" href="/admin">Retornar ao painel</Link></div></section></main>;
}
