"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { useCartStore } from "@/hooks/useCart";

const links = [
  { href: "/", label: "Início", match: (p: string) => p === "/" },
  { href: "/categorias", label: "Categorias", match: (p: string) => p.startsWith("/categorias") },
  { href: "/pedidos", label: "Pedidos", match: (p: string) => p.startsWith("/pedidos") },
];

export function DesktopNav() {
  const pathname = usePathname();
  const items = useCartStore((s) => s.items);
  const cartCount = items.reduce((sum, item) => sum + item.qty, 0);

  return (
    <nav className="hidden md:block fixed top-0 left-0 right-0 z-50 glass-nav border-b border-outline-variant/10 shadow-lg">
      <div className="flex justify-between items-center h-20 px-8 max-w-[1440px] mx-auto">
        {/* Marca + endereço */}
        <div className="flex items-center gap-8">
          <Link href="/" className="text-display-lg text-primary tracking-tighter">22 Maluco</Link>
          <div className="hidden lg:flex items-center bg-surface-container-high rounded-full px-4 py-2 border border-outline-variant/20 focus-within:border-primary transition-all cursor-pointer">
            <Icon name="location_on" className="text-on-surface-variant mr-2 text-xl" />
            <span className="text-label-lg text-on-surface">Rua Exemplo, 123</span>
            <Icon name="expand_more" className="text-on-surface-variant ml-2 text-xl" />
          </div>
        </div>

        {/* Links + ações */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-8">
            {links.map(({ href, label, match }) => {
              const isActive = match(pathname);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`text-label-lg pb-1 transition-colors duration-200 ${
                    isActive
                      ? "text-primary border-b-2 border-primary"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </div>

          <div className="h-8 w-px bg-outline-variant/30" />

          <div className="flex items-center gap-4">
            <Link
              href="/carrinho"
              className="relative flex items-center gap-2 bg-primary-container text-on-primary-container px-5 py-2.5 rounded-full text-label-lg hover:brightness-110 transition-all active:scale-95"
            >
              <Icon name="shopping_cart" filled className="text-xl" />
              <span>Carrinho</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-secondary-container text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold border border-black">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link
              href="/perfil"
              className="flex items-center gap-2 p-1 pr-4 rounded-full bg-surface-container-highest hover:bg-outline-variant/20 transition-all"
            >
              <span className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center">
                <Icon name="person" filled className="text-on-primary-container text-xl" />
              </span>
              <span className="text-label-lg text-on-surface">Perfil</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
