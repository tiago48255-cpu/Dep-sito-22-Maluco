"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin, ShoppingCart, Search, Beer, Wine, Zap, Snowflake,
  Coffee, Droplets, Package, ChevronRight, Plus, MessageCircle, Sparkles
} from "lucide-react";
import type { Product } from "@/lib/types/queries";
import { useCartStore } from "@/hooks/useCart";

const categoryIcons: Record<string, React.ReactNode> = {
  cerveja: <Beer className="w-6 h-6 text-brand-primary" />,
  destilado: <Coffee className="w-6 h-6 text-brand-primary" />,
  energético: <Zap className="w-6 h-6 text-brand-primary" />,
  gelo: <Snowflake className="w-6 h-6 text-brand-primary" />,
  refrigerante: <Droplets className="w-6 h-6 text-brand-primary" />,
  água: <Droplets className="w-6 h-6 text-brand-primary" />,
  vinho: <Wine className="w-6 h-6 text-brand-primary" />,
  combo: <Package className="w-6 h-6 text-brand-primary" />,
};

function formatPrice(price: number) {
  return price.toFixed(2).replace(".", ",");
}

function ProductImage({ src, alt }: { src: string | null; alt: string }) {
  if (src) {
    return (
      <Image src={src} alt={alt} fill className="object-contain p-2" sizes="(max-width: 430px) 50vw, 215px" />
    );
  }
  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-2">
      <Beer className="w-10 h-10 text-neutral-700" />
    </div>
  );
}

export function HomeContent({
  products,
  categories,
}: {
  products: Product[];
  categories: string[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const add = useCartStore((s) => s.add);
  const items = useCartStore((s) => s.items);
  const cartCount = items.reduce((sum, item) => sum + item.qty, 0);

  const filtered = searchQuery
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : products;

  const featured = filtered.slice(0, 4);
  const bestSellers = filtered.slice(4);

  return (
    <div className="text-white min-h-screen pb-24">
      {/* Top App Bar */}
      <header className="sticky top-0 z-40 bg-neutral-950/90 backdrop-blur-xl border-b border-white/5 px-5 py-3.5 flex justify-between items-center h-16 select-none">
        <div className="flex items-center gap-2 max-w-[70%]">
          <MapPin className="w-5 h-5 text-brand-primary shrink-0" />
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider leading-none">Entregar em:</span>
            <span className="text-xs text-white truncate font-semibold mt-0.5">Caioaba, Nova Iguaçu</span>
          </div>
        </div>

        <Link
          href="/carrinho"
          className="relative w-10 h-10 flex items-center justify-center rounded-full bg-neutral-900 border border-white/10 hover:border-brand-primary/45 transition-colors"
        >
          <ShoppingCart className="w-4.5 h-4.5 text-white" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-brand-secondary-container text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black animate-pulse border border-black">
              {cartCount}
            </span>
          )}
        </Link>
      </header>

      <main className="px-5 pt-5 space-y-6">
        {/* Search */}
        <section>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar bebidas, marcas..."
              className="w-full bg-[#111] border-none text-white rounded-xl py-3.5 pl-11 pr-4 text-sm focus:ring-2 focus:ring-brand-primary transition-all duration-300 placeholder:text-neutral-600 font-medium outline-none"
            />
          </div>
        </section>

        {/* Promo Banner */}
        {!searchQuery && (
          <Link
            href="/categorias"
            className="relative h-44 w-full rounded-2xl overflow-hidden flex items-center block"
            style={{ background: "linear-gradient(135deg, #0a0a1a 0%, #1e2fbf20 50%, #0a0a0a 100%)" }}
          >
            <div className="absolute inset-0 shadow-neon-blue" />
            <div className="flex flex-col justify-center px-6 z-10 flex-1">
              <h2 className="text-xl font-extrabold text-white leading-tight uppercase tracking-tight">
                GELADA, RÁPIDA<br />E NA SUA CASA!
              </h2>
              <div className="flex items-center gap-2 mt-2.5">
                <span className="bg-brand-secondary-container text-white px-2 py-0.5 rounded text-[10px] font-black tracking-wider uppercase">
                  24 HORAS
                </span>
                <span className="text-neutral-300 text-[11px] font-semibold">
                  Entrega em minutos
                </span>
              </div>
            </div>
            <div className="relative w-32 h-36 shrink-0 mr-4">
              <Image
                src="/logo.png"
                alt="22 Maluco"
                fill
                className="object-contain"
                sizes="128px"
              />
            </div>
          </Link>
        )}

        {/* Categories */}
        {!searchQuery && categories.length > 0 && (
          <section className="overflow-hidden">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-bold tracking-wider uppercase text-neutral-400">Categorias</h3>
              <Link
                href="/categorias"
                className="text-brand-primary text-xs font-semibold hover:underline flex items-center gap-0.5"
              >
                <span>Ver todas</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-1 -mx-5 px-5">
              {categories.map((cat) => (
                <Link
                  key={cat}
                  href={`/categorias?categoria=${encodeURIComponent(cat)}`}
                  className="flex flex-col items-center gap-2 shrink-0 group"
                >
                  <div className="w-20 h-20 rounded-2xl bg-neutral-900 flex items-center justify-center border border-white/5 group-hover:bg-brand-primary-container transition-all duration-300 active:scale-95 shadow-md">
                    {categoryIcons[cat.toLowerCase()] ?? <Sparkles className="w-6 h-6 text-brand-primary" />}
                  </div>
                  <span className="text-xs text-neutral-400 font-bold tracking-tight group-hover:text-brand-primary transition-colors capitalize">
                    {cat}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Featured Grid */}
        {featured.length > 0 && (
          <section>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-bold tracking-wider uppercase text-neutral-400">
                {searchQuery ? "Resultados" : "Destaques"}
              </h3>
              {!searchQuery && (
                <Link href="/categorias" className="text-brand-primary text-xs font-semibold hover:underline">
                  Ver mais
                </Link>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {featured.map((product) => (
                <div
                  key={product.id}
                  className="bg-[#111] rounded-2xl p-3 border border-white/5 group transition-all hover:-translate-y-0.5"
                >
                  <Link href={`/produto/${product.id}`}>
                    <div className="h-36 w-full rounded-xl overflow-hidden mb-3 bg-[#0a0a0a] flex items-center justify-center relative">
                      <ProductImage src={product.image_url ?? null} alt={product.name} />
                    </div>
                  </Link>
                  <div className="flex flex-col gap-1 text-left">
                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block truncate">
                      {product.category}
                    </span>
                    <Link
                      href={`/produto/${product.id}`}
                      className="text-xs font-bold text-white text-left truncate leading-tight hover:text-brand-primary block"
                    >
                      {product.name}
                    </Link>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-brand-primary text-sm font-black">
                        R$ {formatPrice(product.price)}
                      </span>
                      <button
                        onClick={() => add({ id: product.id, name: product.name, price: product.price, image_url: product.image_url ?? null })}
                        className="w-8 h-8 rounded-full bg-brand-primary-container hover:bg-brand-inverse-primary text-white flex items-center justify-center hover:scale-110 transition-all border-none cursor-pointer"
                        disabled={product.stock_qty !== undefined && product.stock_qty <= 0}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Best Sellers List */}
        {bestSellers.length > 0 && (
          <section className="pb-8">
            <h3 className="text-sm font-bold tracking-wider uppercase text-neutral-400 mb-3">
              {searchQuery ? "Mais resultados" : "Mais vendidos"}
            </h3>
            <div className="space-y-3">
              {bestSellers.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-3 bg-[#111] p-3 rounded-2xl border border-white/5 hover:bg-neutral-900 transition-colors cursor-pointer group"
                >
                  <Link href={`/produto/${product.id}`} className="w-20 h-20 rounded-xl overflow-hidden bg-[#0A0A0A] flex items-center justify-center shrink-0 border border-white/5 relative">
                    <ProductImage src={product.image_url ?? null} alt={product.name} />
                  </Link>
                  <Link href={`/produto/${product.id}`} className="flex-1 min-w-0 text-left">
                    <h4 className="text-xs font-bold text-white truncate group-hover:text-brand-primary transition-colors leading-tight">
                      {product.name}
                    </h4>
                    <p className="text-[10px] text-neutral-400 mt-0.5 capitalize">{product.category}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-brand-primary text-xs font-black">
                        R$ {formatPrice(product.price)}
                      </span>
                    </div>
                  </Link>
                  <button
                    onClick={() => add({ id: product.id, name: product.name, price: product.price, image_url: product.image_url ?? null })}
                    className="w-10 h-10 rounded-full border border-brand-primary text-brand-primary bg-transparent flex items-center justify-center hover:bg-brand-primary-container hover:text-white hover:border-brand-primary-container transition-all cursor-pointer shadow shrink-0"
                    disabled={product.stock_qty !== undefined && product.stock_qty <= 0}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <Beer className="w-12 h-12 text-neutral-700" />
            <p className="text-neutral-500 text-sm text-center">
              Nenhum produto encontrado para "{searchQuery}"
            </p>
          </div>
        )}

        {!searchQuery && (
          <div className="flex flex-col items-center justify-center py-6 opacity-35 select-none">
            <Sparkles className="w-10 h-10 text-brand-primary animate-pulse" />
            <p className="text-[11px] font-bold text-neutral-400 mt-2 text-center uppercase tracking-widest leading-relaxed">
              Bebendo com moderação?<br />Não esqueça o gelo!
            </p>
          </div>
        )}
      </main>

      {/* FAB WhatsApp */}
      <a
        href="https://wa.me/5521968979426"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-24 right-4 w-14 h-14 text-white rounded-full shadow-2xl flex items-center justify-center z-40 active:scale-90 transition-transform duration-200"
        style={{ backgroundColor: "#25D366" }}
      >
        <MessageCircle className="w-7 h-7 fill-current" />
      </a>
    </div>
  );
}
