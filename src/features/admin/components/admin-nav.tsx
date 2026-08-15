"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Tags, Scissors, Images, CircleHelp, Building2, ExternalLink } from "lucide-react";

const items = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { label: "Produtos", icon: Package, href: "/admin/products" },
  { label: "Categorias", icon: Tags, href: "/admin/categories" },
  { label: "Serviços", icon: Scissors, href: "/admin/services" },
  { label: "Galeria", icon: Images, href: "/admin/gallery" },
  { label: "FAQ", icon: CircleHelp, href: "/admin/faqs" },
  { label: "Empresa", icon: Building2, href: "/admin/settings" },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Navegação administrativa" className="space-y-1">
      {items.map(({ label, icon: Icon, href }) => (
        <Link key={label} href={href} aria-current={pathname === href ? "page" : undefined} className={`flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 font-extrabold ${pathname === href ? "bg-orange-50 text-brand" : "text-olive hover:bg-stone-100"}`}>
          <Icon size={19} aria-hidden="true" />{label}
        </Link>
      ))}
      <Link href="/" target="_blank" className="mt-4 flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 font-extrabold text-olive hover:bg-stone-100">
        <ExternalLink size={19} aria-hidden="true" />Ver site
      </Link>
    </nav>
  );
}
