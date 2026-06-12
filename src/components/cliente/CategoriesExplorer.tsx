"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin, ShoppingCart, Search, Beer, Wine, Martini, Zap, CupSoda,
  Snowflake, Droplets, Package, Sparkles, type LucideIcon,
} from "lucide-react";
import { useCartStore } from "@/hooks/useCart";

interface CategoryConfig {
  icon: LucideIcon;
  label: string;
  description: string;
  tintBg: string;
  tintText: string;
}

// Per-category styling — colored icon tiles match the categorias reference,
// where each category has its own tinted icon (whisky amber, energético amarelo…).
const categoryConfig: Record<string, CategoryConfig> = {
  cerveja: { icon: Beer, label: "Cervejas", description: "As mais geladas da região", tintBg: "bg-amber-500/15", tintText: "text-amber-400" },
  destilado: { icon: Martini, label: "Destilados", description: "Whisky, Gin, Vodka e mais", tintBg: "bg-orange-500/15", tintText: "text-orange-400" },
  vinho: { icon: Wine, label: "Vinhos", description: "Tinto, branco e espumante", tintBg: "bg-rose-500/15", tintText: "text-rose-400" },
  energético: { icon: Zap, label: "Energéticos", description: "Red Bull, Monster e TNT", tintBg: "bg-yellow-500/15", tintText: "text-yellow-400" },
  refrigerante: { icon: CupSoda, label: "Refrigerantes", description: "Coca, Guaraná e outros", tintBg: "bg-red-500/15", tintText: "text-red-400" },
  gelo: { icon: Snowflake, label: "Gelo", description: "Sempre fresquinho", tintBg: "bg-cyan-500/15", tintText: "text-cyan-300" },
  água: { icon: Droplets, label: "Água", description: "Mineral e com gás", tintBg: "bg-sky-500/15", tintText: "text-sky-300" },
  combo: { icon: Package, label: "Combos", description: "Mais por menos", tintBg: "bg-purple-500/15", tintText: "text-purple-300" },
};

function getCfg(cat: string): CategoryConfig {
  return (
    categoryConfig[cat] ?? {
      icon: Sparkles,
      label: cat.charAt(0).toUpperCase() + cat.slice(1),
      description: "Ver produtos",
      tintBg: "bg-brand-primary-container/20",
      tintText: "text-brand-primary",
    }
  );
}

export function CategoriesExplorer({ categories }: { categories: string[] }) {
  const [search, setSearch] = useState("");
  const items = useCartStore((s) => s.items);
  const cartCount = items.reduce((acc, i) => acc + i.qty, 0);

  // Featured = cerveja (matches the reference hero) or the first category.
  const featured = categories.includes("cerveja") ? "cerveja" : categories[0];
  const rest = categories.filter((c) => c !== featured);
  const gridCats = rest.slice(0, 4);
  const pillCats = rest.slice(4);

  const q = search.trim().toLowerCase();
  const matches = (cat: string) => {
    const cfg = getCfg(cat);
    return (
      cfg.label.toLowerCase().includes(q) ||
      cfg.description.toLowerCase().includes(q) ||
      cat.toLowerCase().includes(q)
    );
  };
  const searchResults = q ? categories.filter(matches) : [];

  return (
    <>
      {/* Top app bar — location (mesmo padrão da Home, conforme referência) */}
      <header className="page-header">
        <div className="flex items-center gap-2 max-w-[70%] md:max-w-none">
          <MapPin className="w-5 h-5 text-brand-primary shrink-0" />
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider leading-none">Entregar em:</span>
            <span className="text-xs text-white truncate font-semibold mt-0.5">Rua Exemplo, 123</span>
          </div>
        </div>

        <Link
          href="/carrinho"
          className="relative w-10 h-10 flex items-center justify-center rounded-full bg-neutral-900 border border-white/10 hover:border-brand-primary/45 transition-colors md:hidden"
        >
          <ShoppingCart className="w-[18px] h-[18px] text-white" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-brand-secondary-container text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black animate-pulse border border-black">
              {cartCount}
            </span>
          )}
        </Link>
      </header>

      <main className="content-container pt-5 pb-8 space-y-6">
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-tight">
          O que vamos beber hoje?
        </h2>

        {/* Search */}
        <div className="relative max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por categorias ou marcas..."
            className="w-full bg-[#111] border-none text-white rounded-xl py-3.5 pl-11 pr-4 text-sm focus:ring-2 focus:ring-brand-primary transition-all duration-300 placeholder:text-neutral-600 font-medium outline-none"
          />
        </div>

        {q ? (
          /* Resultados de busca — grid plano */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {searchResults.map((cat) => (
              <CategoryCard key={cat} cat={cat} />
            ))}
            {searchResults.length === 0 && (
              <div className="col-span-2 md:col-span-3 lg:col-span-4 py-16 text-center">
                <Beer className="w-12 h-12 text-neutral-700 mx-auto mb-3" />
                <p className="text-neutral-500 text-sm">Nenhuma categoria encontrada.</p>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Featured — Cervejas (usa o banner oficial como atmosfera) */}
            {featured && (
              <Link
                href={`/categorias?categoria=${featured}`}
                className="relative block h-44 md:h-56 rounded-2xl overflow-hidden border border-white/5 group active:scale-[0.99] transition-transform duration-200"
              >
                <Image
                  src="/banner.png"
                  alt=""
                  fill
                  priority
                  className="object-cover object-center opacity-90 transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 1280px) 100vw, 1200px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/25" />
                <div className="absolute top-4 right-4 z-10 bg-brand-tertiary/90 px-3 py-1 rounded-full">
                  <span className="text-[10px] font-black uppercase text-black tracking-wide">Oferta</span>
                </div>
                <div className="absolute bottom-4 left-5 z-10">
                  <h3 className="text-xl md:text-2xl font-extrabold text-white drop-shadow-lg">
                    {getCfg(featured).label}
                  </h3>
                  <p className="text-xs md:text-sm text-neutral-200 font-semibold mt-0.5 drop-shadow">
                    {getCfg(featured).description}
                  </p>
                </div>
              </Link>
            )}

            {/* Grid principal — cards com tile de ícone colorido */}
            {gridCats.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {gridCats.map((cat) => (
                  <CategoryCard key={cat} cat={cat} />
                ))}
              </div>
            )}

            {/* Pills — categorias secundárias (scroll horizontal) */}
            {pillCats.length > 0 && (
              <div className="flex gap-2.5 overflow-x-auto hide-scrollbar -mx-5 px-5 md:mx-0 md:px-0 md:flex-wrap">
                {pillCats.map((cat) => {
                  const cfg = getCfg(cat);
                  const Icon = cfg.icon;
                  return (
                    <Link
                      key={cat}
                      href={`/categorias?categoria=${cat}`}
                      className="shrink-0 flex items-center gap-2 h-11 px-4 rounded-xl bg-neutral-900 border border-white/5 hover:border-white/15 active:scale-95 transition-all"
                    >
                      <Icon className={`w-4 h-4 ${cfg.tintText}`} />
                      <span className="text-xs font-bold text-white">{cfg.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Promo banner — Combos com Desconto */}
            <Link
              href="/categorias"
              className="relative block h-28 md:h-32 rounded-2xl overflow-hidden border border-white/5 active:scale-[0.99] transition-transform duration-200"
              style={{ background: "radial-gradient(120% 140% at 12% 50%, rgba(255,193,7,0.22) 0%, rgba(120,80,8,0.16) 30%, #140f06 60%, #0a0a0a 100%)" }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />
              <div className="absolute inset-0 px-5 flex flex-col justify-center z-10">
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-tertiary">
                  Oferta da madrugada
                </span>
                <h3 className="text-lg md:text-xl font-extrabold text-white mt-1 leading-tight">
                  Combos com Desconto
                </h3>
                <p className="text-xs text-neutral-300 font-semibold mt-0.5">
                  Garanta a festa por menos
                </p>
              </div>
            </Link>

            {categories.length === 0 && (
              <div className="py-20 text-center">
                <Beer className="w-16 h-16 text-neutral-700 mx-auto mb-3" />
                <p className="text-neutral-500 text-sm">Nenhuma categoria disponível.</p>
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
}

function CategoryCard({ cat }: { cat: string }) {
  const cfg = getCfg(cat);
  const Icon = cfg.icon;
  return (
    <Link
      href={`/categorias?categoria=${cat}`}
      className="glass-panel rounded-2xl p-4 flex flex-col justify-between min-h-[128px] border border-white/5 hover:border-white/10 group active:scale-[0.98] transition-all duration-200"
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${cfg.tintBg}`}>
        <Icon className={`w-6 h-6 ${cfg.tintText}`} />
      </div>
      <div className="mt-3">
        <h3 className="text-sm font-black text-white leading-tight">{cfg.label}</h3>
        <p className="text-[10px] text-neutral-400 mt-1 leading-snug">{cfg.description}</p>
      </div>
    </Link>
  );
}
