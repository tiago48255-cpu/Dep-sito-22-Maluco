"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import { useCartStore } from "@/hooks/useCart";

interface CatMeta {
  label: string;
  icon: string;
  subtitle: string;
  image: string | null;
}

const META: Record<string, CatMeta> = {
  cerveja: { label: "Cervejas", icon: "sports_bar", subtitle: "Pilsen, Long Neck, Latão", image: "/stitch/prod-beer-glass.jpg" },
  whisky: { label: "Whisky", icon: "liquor", subtitle: "Escocês, Bourbon, Premium", image: "/stitch/prod-whisky.jpg" },
  destilado: { label: "Destilados", icon: "local_bar", subtitle: "Gin, Vodka, Cachaça", image: "/stitch/prod-gin.jpg" },
  vinho: { label: "Vinhos", icon: "wine_bar", subtitle: "Tintos, Chopp de vinho", image: "/stitch/prod-wine.jpg" },
  refrigerante: { label: "Refrigerantes", icon: "local_drink", subtitle: "Coca, Guaraná, Fanta", image: "/stitch/prod-coca.jpg" },
  energetico: { label: "Energéticos", icon: "bolt", subtitle: "Red Bull, Monster, TNT", image: null },
  gelo: { label: "Gelo & Carvão", icon: "ac_unit", subtitle: "Cubo, Escama, Carvão", image: null },
  cigarro: { label: "Cigarros", icon: "smoking_rooms", subtitle: "Maços diversos", image: null },
  tabacaria: { label: "Tabacaria", icon: "grass", subtitle: "Sedas, Piteiras", image: null },
  diversos: { label: "Diversos", icon: "shopping_basket", subtitle: "Água, Salgados, Doces", image: "/stitch/prod-water.jpg" },
  promocao: { label: "Promoções", icon: "sell", subtitle: "Packs, Combos, Fardos", image: "/stitch/prod-beer-can.jpg" },
};

function metaFor(cat: string): CatMeta {
  return META[cat.toLowerCase()] ?? { label: cat, icon: "local_bar", subtitle: "Ver produtos", image: null };
}

export function CategoriesExplorer({ categories }: { categories: string[] }) {
  const [search, setSearch] = useState("");
  const items = useCartStore((s) => s.items);
  const cartCount = items.reduce((acc, i) => acc + i.qty, 0);

  const q = search.trim().toLowerCase();
  const list = q
    ? categories.filter((c) => metaFor(c).label.toLowerCase().includes(q) || c.toLowerCase().includes(q))
    : categories;

  return (
    <>
      {/* ===== MOBILE ===== */}
      <div className="md:hidden text-on-surface min-h-screen pb-24">
        <header className="page-header">
          <div className="flex items-center gap-2 max-w-[70%]">
            <Icon name="location_on" className="text-xl text-primary shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-label-sm text-on-surface-variant leading-none">Entregar em:</span>
              <span className="text-label-md text-on-surface truncate mt-0.5">Rua Exemplo, 123</span>
            </div>
          </div>
          <Link href="/carrinho" className="relative active:scale-95">
            <Icon name="shopping_cart" className="text-2xl text-on-surface" />
            {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-secondary-container text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{cartCount}</span>}
          </Link>
        </header>

        <main className="content-container pt-5 pb-8 space-y-lg">
          <h2 className="text-headline-md leading-tight">O que vamos beber hoje?</h2>
          <div className="relative group">
            <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-on-surface-variant group-focus-within:text-primary" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar categorias..." className="w-full bg-surface-container border-none rounded-xl py-4 pl-12 pr-4 text-body-md text-on-surface placeholder:text-on-surface-variant/60 focus:ring-2 focus:ring-primary outline-none" />
          </div>

          <div className="grid grid-cols-2 gap-gutter">
            {list.map((cat) => (
              <CategoryCard key={cat} cat={cat} className="h-40" />
            ))}
          </div>
          {list.length === 0 && <p className="text-on-surface-variant text-body-sm text-center py-12">Nenhuma categoria encontrada.</p>}
        </main>
      </div>

      {/* ===== DESKTOP ===== */}
      <div className="hidden md:block text-on-surface">
        <main className="max-w-[1440px] mx-auto px-8 pt-8 pb-16">
          <header className="mb-10">
            <h1 className="text-headline-lg mb-2">Explorar Categorias</h1>
            <p className="text-body-md text-on-surface-variant">Encontre a sua bebida favorita para qualquer ocasião.</p>
          </header>
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {list.map((cat) => (
              <CategoryCard key={cat} cat={cat} className="h-80" />
            ))}
          </div>
        </main>
      </div>
    </>
  );
}

function CategoryCard({ cat, className }: { cat: string; className: string }) {
  const m = metaFor(cat);
  return (
    <Link
      href={`/categorias?categoria=${encodeURIComponent(cat)}`}
      className={`relative rounded-xl overflow-hidden group border border-white/5 neon-glow block ${className}`}
    >
      {m.image ? (
        <Image src={m.image} alt={m.label} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 50vw, 320px" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center hero-gradient">
          <Icon name={m.icon} className="text-6xl text-white/30" />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 p-5">
        <h3 className="text-headline-sm md:text-headline-md text-white mb-0.5">{m.label}</h3>
        <p className="text-body-sm text-primary/80">{m.subtitle}</p>
      </div>
      <div className="absolute top-4 right-4 bg-primary text-on-primary p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
        <Icon name="arrow_forward" className="text-lg" />
      </div>
    </Link>
  );
}
