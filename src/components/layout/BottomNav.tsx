"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid, History, User, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/hooks/useCart";

const tabs = [
  { href: "/", label: "Início", icon: Home, match: (p: string) => p === "/" },
  { href: "/categorias", label: "Categorias", icon: Grid, match: (p: string) => p.startsWith("/categorias") },
  { href: "/pedidos", label: "Pedidos", icon: History, match: (p: string) => p.startsWith("/pedidos") },
  { href: "/perfil", label: "Perfil", icon: User, match: (p: string) => p.startsWith("/perfil") },
  { href: "/carrinho", label: "Carrinho", icon: ShoppingBag, match: (p: string) => p.startsWith("/carrinho") },
];

export function BottomNav() {
  const pathname = usePathname();
  const items = useCartStore((s) => s.items);
  const cartCount = items.reduce((sum, item) => sum + item.qty, 0);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 glass-nav border-t border-white/8 select-none md:hidden">
      <div className="flex justify-around items-center pt-3 pb-5 px-3">
      {tabs.map(({ href, label, icon: Icon, match }) => {
        const isActive = match(pathname);
        const isCart = href === "/carrinho";

        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center justify-center gap-1 relative ${
              isActive ? "text-brand-primary active-tab-glow" : "text-neutral-500 hover:text-white"
            } transition-colors`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-bold">{label}</span>
            {isCart && cartCount > 0 && (
              <span className="absolute -top-1 right-0 w-4 h-4 bg-brand-secondary-container text-white text-[9px] font-black rounded-full flex items-center justify-center border border-black">
                {cartCount}
              </span>
            )}
          </Link>
        );
      })}
      </div>
    </nav>
  );
}
