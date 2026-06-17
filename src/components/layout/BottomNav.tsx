"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { useCartStore } from "@/hooks/useCart";

const tabs = [
  { href: "/", label: "Início", icon: "home", match: (p: string) => p === "/" },
  { href: "/categorias", label: "Categorias", icon: "grid_view", match: (p: string) => p.startsWith("/categorias") },
  { href: "/pedidos", label: "Pedidos", icon: "receipt_long", match: (p: string) => p.startsWith("/pedidos") },
  { href: "/perfil", label: "Perfil", icon: "person", match: (p: string) => p.startsWith("/perfil") },
  { href: "/carrinho", label: "Carrinho", icon: "shopping_bag", match: (p: string) => p.startsWith("/carrinho") },
];

export function BottomNav() {
  const pathname = usePathname();
  const items = useCartStore((s) => s.items);
  const cartCount = items.reduce((sum, item) => sum + item.qty, 0);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 glass-nav border-t border-white/8 select-none md:hidden rounded-t-xl">
      <div className="flex justify-around items-center pt-base pb-5 px-sm">
        {tabs.map(({ href, label, icon, match }) => {
          const isActive = match(pathname);
          const isCart = href === "/carrinho";

          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center gap-1 relative active:scale-110 duration-200 transition-transform ${
                isActive ? "text-primary active-tab-glow" : "text-on-surface-variant hover:text-primary"
              }`}
            >
              <Icon name={icon} filled={isActive} className="text-2xl" />
              <span className="text-label-md">{label}</span>
              {isCart && cartCount > 0 && (
                <span className="absolute -top-1 right-0 w-4 h-4 bg-secondary-container text-white text-[9px] font-bold rounded-full flex items-center justify-center border border-black">
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
