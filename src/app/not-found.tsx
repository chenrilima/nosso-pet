import Link from "next/link";

export default function NotFound() {
  return <main className="grid min-h-[70vh] place-items-center bg-cream px-4"><div className="card max-w-lg p-8 text-center"><p className="eyebrow">Erro 404</p><h1 className="title mt-2">Página não encontrada</h1><p className="mt-4 text-gray-600">O endereço acessado não existe ou foi movido.</p><Link className="btn btn-primary mt-6" href="/">Voltar ao início</Link></div></main>;
}
