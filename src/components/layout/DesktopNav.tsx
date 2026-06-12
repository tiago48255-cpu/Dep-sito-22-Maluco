"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Home, Grid, History, User, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/hooks/useCart";

const links = [
  { href: "/", label: "Cardápio", icon: Home, match: (p: string) => p === "/" },
  { href: "/categorias", label: "Categorias", icon: Grid, match: (p: string) => p.startsWith("/categorias") },
  { href: "/pedidos", label: "Pedidos", icon: History, match: (p: string) => p.startsWith("/pedidos") },
  { href: "/perfil", label: "Perfil", icon: User, match: (p: string) => p.startsWith("/perfil") },
  { href: "/carrinho", label: "Carrinho", icon: ShoppingBag, match: (p: string) => p.startsWith("/carrinho") },
];

export function DesktopNav() {
  const pathname = usePathname();
  const items = useCartStore((s) => s.items);
  const cartCount = items.reduce((sum, item) => sum + item.qty, 0);

  return (
    <aside className="hidden md:flex fixed top-0 left-0 w-[240px] h-screen flex-col bg-neutral-950/95 backdrop-blur-xl border-r border-white/5 z-50 select-none">
      {/* Brand */}
      <Link href="/" className="flex items-center gap-3 px-6 py-5 border-b border-white/5">
        <div className="relative w-10 h-10 shrink-0">
          <Image
            src="/logo.png"
            alt="22 Maluco"
            fill
            className="object-contain rounded-full"
            sizes="40px"
          />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-black text-white uppercase tracking-wide leading-none">22 Maluco</span>
          <span className="text-[10px] text-neutral-500 font-semibold mt-0.5">Depósito de Bebidas 24h</span>
        </div>
      </Link>

      {/* Navigation Links */}
      <nav className="flex-1 flex flex-col gap-1 px-3 py-4">
        {links.map(({ href, label, icon: Icon, match }) => {
          const isActive = match(pathname);
          const isCart = href === "/carrinho";

          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 relative group ${
                isActive
                  ? "bg-brand-primary-container/20 text-brand-primary shadow-[inset_0_0_20px_rgba(61,77,216,0.08)]"
                  : "text-neutral-400 hover:text-white hover:bg-white/[0.03]"
              }`}
            >
              <Icon className={`w-[18px] h-[18px] shrink-0 ${isActive ? "text-brand-primary" : ""}`} />
              <span>{label}</span>
              {isCart && cartCount > 0 && (
                <span className="ml-auto bg-brand-secondary-container text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black border border-black animate-pulse">
                  {cartCount}
                </span>
              )}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-brand-primary rounded-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-white/5">
        <p className="text-[9px] text-neutral-600 uppercase tracking-widest font-mono text-center leading-relaxed">
          Venda proibida para<br />menores de 18 anos
        </p>
      </div>
    </aside>
  );
}
