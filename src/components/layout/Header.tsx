"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, User, Menu, X } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/hooks/useCart";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const itemCount = useCartStore((s) => s.items.reduce((acc, i) => acc + i.qty, 0));

  return (
    <header className="sticky top-0 z-50 bg-[#0A0A1A]/95 backdrop-blur border-b border-[#2A2A4A]">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="22 Maluco"
            width={48}
            height={48}
            className="rounded-full"
          />
          <div className="hidden sm:block">
            <span className="font-['var(--font-bebas)'] text-2xl text-white tracking-wide">22 MALUCO</span>
            <p className="text-[10px] text-[#9999BB] -mt-1">Depósito de Bebidas 24h</p>
          </div>
        </Link>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#9999BB]">
          <Link href="/" className="hover:text-white transition-colors">Cardápio</Link>
          <Link href="/pedidos" className="hover:text-white transition-colors">Meus Pedidos</Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link href="/carrinho" className="relative p-2 hover:bg-[#12122A] rounded-lg transition-colors">
            <ShoppingCart size={22} className="text-white" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#DD0000] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {itemCount}
              </span>
            )}
          </Link>
          <Link href="/perfil" className="p-2 hover:bg-[#12122A] rounded-lg transition-colors">
            <User size={22} className="text-white" />
          </Link>
          <button
            className="md:hidden p-2 hover:bg-[#12122A] rounded-lg"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={22} className="text-white" /> : <Menu size={22} className="text-white" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav className="md:hidden border-t border-[#2A2A4A] py-3 px-4 flex flex-col gap-3 text-sm font-medium">
          <Link href="/" className="text-[#9999BB] hover:text-white" onClick={() => setMobileOpen(false)}>Cardápio</Link>
          <Link href="/pedidos" className="text-[#9999BB] hover:text-white" onClick={() => setMobileOpen(false)}>Meus Pedidos</Link>
          <Link href="/perfil" className="text-[#9999BB] hover:text-white" onClick={() => setMobileOpen(false)}>Meu Perfil</Link>
        </nav>
      )}
    </header>
  );
}
