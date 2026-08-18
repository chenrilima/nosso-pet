"use client";

import Image from "next/image";
import { useState } from "react";
import type { PointerEvent } from "react";
import { imageObjectPosition, safeImagePosition, type ImagePosition } from "@/lib/image-position";
import type { AdminActionResult } from "@/features/admin/mutations/types";
import { FormFeedback } from "./form-feedback";

type Props = { imageUrl: string; alt: string; initialX: number; initialY: number; aspectClass: string; onSave: (x: number, y: number) => Promise<AdminActionResult> };

export function ImagePositionEditor({ imageUrl, alt, initialX, initialY, aspectClass, onSave }: Props) {
  const initial = safeImagePosition(initialX, initialY);
  const [position, setPosition] = useState<ImagePosition>(initial);
  const [saved, setSaved] = useState<ImagePosition>(initial);
  const [state, setState] = useState<AdminActionResult>({ ok: true, message: "" });
  const [pending, setPending] = useState(false);
  const dirty = position.x !== saved.x || position.y !== saved.y;
  function point(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    setPosition({ x: Math.round(((event.clientX - rect.left) / rect.width) * 100), y: Math.round(((event.clientY - rect.top) / rect.height) * 100) });
  }
  async function save() { setPending(true); try { const result = await onSave(position.x, position.y); setState(result); if (result.ok) setSaved(position); } finally { setPending(false); } }
  return <section className="space-y-3 rounded-xl border border-stone-200 bg-white p-3">
    <div><h4 className="font-black text-olive">Ajustar enquadramento</h4><p className="text-xs font-semibold text-stone-500">Toque ou clique na região que deve permanecer em destaque.</p></div>
    <div className={`relative w-full cursor-crosshair touch-none overflow-hidden rounded-xl bg-stone-100 ${aspectClass}`} onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); point(event); }} onPointerMove={(event) => { if (event.currentTarget.hasPointerCapture(event.pointerId)) point(event); }}>
      <Image src={imageUrl} alt={alt} fill sizes="(max-width: 640px) 100vw, 640px" className="select-none object-cover" draggable={false} style={{ objectPosition: imageObjectPosition(position) }} />
      <span aria-hidden className="pointer-events-none absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-brand shadow" style={{ left: `${position.x}%`, top: `${position.y}%` }} />
    </div>
    <label className="block text-sm font-extrabold text-olive">Posição horizontal: {position.x}%<input className="mt-1 w-full accent-orange-600" aria-label="Posição horizontal" type="range" min="0" max="100" step="1" value={position.x} onChange={(event) => setPosition({ ...position, x: Number(event.target.value) })} /></label>
    <label className="block text-sm font-extrabold text-olive">Posição vertical: {position.y}%<input className="mt-1 w-full accent-orange-600" aria-label="Posição vertical" type="range" min="0" max="100" step="1" value={position.y} onChange={(event) => setPosition({ ...position, y: Number(event.target.value) })} /></label>
    <div className="flex flex-wrap gap-2"><button type="button" className="btn btn-primary" disabled={pending || !dirty} onClick={() => void save()}>{pending ? "Salvando…" : dirty ? "Salvar enquadramento" : "Enquadramento salvo"}</button><button type="button" className="btn btn-secondary" disabled={pending || (position.x === 50 && position.y === 50)} onClick={() => setPosition({ x: 50, y: 50 })}>Centralizar</button></div>
    <FormFeedback state={state} />
  </section>;
}
