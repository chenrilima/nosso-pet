"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FormFeedback } from "@/features/admin/components/form-feedback";
import { initialAdminActionResult, type AdminActionResult } from "@/features/admin/mutations/types";
import { optimizeImage, optimizedFilename, type OptimizedImage } from "@/lib/images/optimize-image";
import { createClient } from "@/lib/supabase/client";
import { SITE_ASSETS_BUCKET } from "@/lib/storage/site-assets";
import { removeHeroImageAction, replaceHeroImageAction } from "./actions";

export function HeroImageForm({ id, imageUrl }: { id: string; imageUrl: string | null }) {
  const [optimized, setOptimized] = useState<OptimizedImage | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [state, setState] = useState<AdminActionResult>(initialAdminActionResult);
  const [pending, setPending] = useState(false);
  const previewRef = useRef<string | null>(null);
  useEffect(() => () => { if (previewRef.current) URL.revokeObjectURL(previewRef.current); }, []);
  async function select(file?: File) {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    previewRef.current = null; setPreview(null); setOptimized(null); setState(initialAdminActionResult);
    if (!file) return;
    try { const value = await optimizeImage(file); const url = URL.createObjectURL(value.file); previewRef.current = url; setOptimized(value); setPreview(url); }
    catch (error) { setState({ ok: false, message: error instanceof Error ? error.message : "Não foi possível otimizar a imagem." }); }
  }
  async function replace() {
    if (!optimized) return;
    setPending(true); setState({ ok: true, message: "Enviando…" });
    const path = optimizedFilename(optimized.mimeType, crypto.randomUUID(), "hero");
    try { const { error } = await createClient().storage.from(SITE_ASSETS_BUCKET).upload(path, optimized.file, { contentType: optimized.mimeType, upsert: false }); if (error) throw new Error("Não foi possível enviar a imagem. Confirme sua sessão e tente novamente."); setState(await replaceHeroImageAction(id, path)); }
    catch (error) { setState({ ok: false, message: error instanceof Error ? error.message : "Falha no envio." }); }
    finally { setPending(false); }
  }
  async function restore() { setPending(true); try { setState(await removeHeroImageAction(id)); } finally { setPending(false); } }
  return <section className="mb-6 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-6"><h2 className="text-xl font-black text-olive">Imagem principal do site</h2><p className="mb-4 mt-1 text-sm font-semibold text-stone-600">Controla somente o Hero da página inicial. Sem imagem customizada, o site usa a ilustração padrão.</p><Image src={preview ?? imageUrl ?? "/images/hero-pets.png"} alt="Prévia da imagem principal" width={720} height={540} unoptimized={Boolean(preview)} className="mb-4 aspect-[4/3] max-h-96 w-full rounded-xl bg-stone-100 object-cover" /><label className="text-sm font-extrabold text-olive">Escolher nova imagem<input className="field mt-1" type="file" accept="image/jpeg,image/png,image/webp,image/avif" disabled={pending} onChange={(event) => void select(event.target.files?.[0])} /></label><p className="mt-2 text-sm font-semibold text-stone-600">JPEG, PNG, WebP ou AVIF; original de até 20 MiB. Sem recorte automático.</p><div className="mt-4 flex flex-wrap gap-2"><button type="button" className="btn btn-primary" disabled={pending || !optimized} onClick={() => void replace()}>{pending ? "Processando…" : "Substituir imagem"}</button><button type="button" className="btn btn-secondary" disabled={pending || !imageUrl} onClick={() => void restore()}>Usar imagem padrão</button></div><div className="mt-3"><FormFeedback state={state} /></div></section>;
}
