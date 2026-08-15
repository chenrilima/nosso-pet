"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { whatsappUrl } from "@/lib/whatsapp";
const links = [
  ["Início", "top"],
  ["Serviços", "servicos"],
  ["Agendamento", "agendamento"],
  ["Produtos", "produtos"],
  ["Nossos Pets", "galeria"],
  ["Sobre", "sobre"],
  ["Localização", "localizacao"],
];
export function Header({ whatsappRaw }: { whatsappRaw: string }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/95 backdrop-blur">
      <div className="container flex h-20 items-center justify-between">
        <a href="#top">
          <Logo />
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
            href={whatsappUrl(
              "Olá! Vim pelo site da Nosso Pet e gostaria de agendar um atendimento.",
              whatsappRaw,
            )}
          >
            Agendar pelo WhatsApp
          </a>
        </nav>
        <button
          className="p-2 lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav className="container grid gap-1 border-t py-4 lg:hidden">
          {links.map(([l, id]) => (
            <a
              onClick={() => setOpen(false)}
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
