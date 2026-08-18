"use client";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { bookingInquiryMessage, whatsappUrl } from "@/lib/whatsapp";
const links = [
  ["Início", "top"],
  ["Serviços", "servicos"],
  ["Agendamento", "agendamento"],
  ["Produtos", "produtos"],
  ["Nossos Pets", "galeria"],
  ["Sobre", "sobre"],
  ["Localização", "localizacao"],
];
export function Header({ businessName, whatsappRaw }: { businessName: string; whatsappRaw: string }) {
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeMenu = (restoreFocus = false) => {
    setOpen(false);
    if (restoreFocus) requestAnimationFrame(() => menuButtonRef.current?.focus());
  };
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu(true);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);
  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/95 backdrop-blur">
      <div className="container flex h-20 items-center justify-between">
        <a href="#top">
          <Logo name={businessName} />
        </a>
        <nav className="hidden items-center gap-5 lg:flex">
          {links.map(([l, id]) => (
            <a
              className="text-sm font-bold hover:text-brand"
              href={`#${id}`}
              key={id}
            >
              {l}
            </a>
          ))}
          <a
            className="btn btn-primary text-sm"
            target="_blank"
            rel="noopener noreferrer"
            href={whatsappUrl(
              bookingInquiryMessage(businessName),
              whatsappRaw,
            )}
          >
            Agendar pelo WhatsApp
          </a>
        </nav>
        <button
          ref={menuButtonRef}
          className="grid size-11 place-items-center rounded-xl lg:hidden"
          onClick={() => setOpen((isOpen) => !isOpen)}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav id="mobile-navigation" className="container grid gap-1 border-t py-4 lg:hidden">
          {links.map(([l, id]) => (
            <a
              onClick={() => closeMenu()}
              className="rounded-xl px-3 py-3 font-bold hover:bg-orange-50"
              href={`#${id}`}
              key={id}
            >
              {l}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
