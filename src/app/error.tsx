"use client";
import { useEffect } from "react";
import Link from "next/link";

export default function PublicError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => { console.error("public_render_error", { name: error.name, digest: error.digest }); }, [error]);
  return <main className="grid min-h-[70vh] place-items-center bg-cream px-4"><div className="card max-w-lg p-8 text-center"><p className="eyebrow">Nosso Pet</p><h1 className="title mt-2">Algo não saiu como esperado</h1><p className="mt-4 text-gray-600">Não foi possível carregar esta página agora.</p><div className="mt-6 flex flex-wrap justify-center gap-3"><button className="btn btn-primary" onClick={retry}>Tentar novamente</button><Link className="btn btn-secondary" href="/">Ir para o início</Link></div></div></main>;
}
