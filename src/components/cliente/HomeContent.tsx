"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { WHATSAPP_URL } from "@/lib/constants";
import { Icon } from "@/components/ui/Icon";
import { StoreLocation } from "@/components/cliente/StoreLocation";
import { AppPromo } from "@/components/cliente/AppPromo";
import { AddressChip } from "@/components/cliente/AddressChip";
import type { Product } from "@/lib/types/queries";
import { useCartStore } from "@/hooks/useCart";

// Categoria do banco -> rótulo + ícone Material Symbols (design Nocturnal Pulse)
const categoryMeta: Record<string, { label: string; icon: string }> = {
  cerveja: { label: "Cervejas", icon: "sports_bar" },
  whisky: { label: "Whisky", icon: "liquor" },
  destilado: { label: "Destilados", icon: "local_bar" },
  vinho: { label: "Vinhos", icon: "wine_bar" },
  refrigerante: { label: "Refrigerantes", icon: "local_drink" },
  energetico: { label: "Energéticos", icon: "bolt" },
  gelo: { label: "Gelo & Carvão", icon: "ac_unit" },
  cigarro: { label: "Cigarros", icon: "smoking_rooms" },
  tabacaria: { label: "Tabacaria", icon: "grass" },
  diversos: { label: "Diversos", icon: "shopping_basket" },
  promocao: { label: "Promoções", icon: "sell" },
};

function metaFor(cat: string) {
  return categoryMeta[cat.toLowerCase()] ?? { label: cat, icon: "local_bar" };
}

function formatPrice(price: number) {
  return price.toFixed(2).replace(".", ",");
}

function ProductImage({ src, alt }: { src: string | null; alt: string }) {
  if (src) {
    return <Image src={src} alt={alt} fill className="object-cover" sizes="(max-width: 640px) 50vw, 320px" />;
  }
  return (
    <div className="flex items-center justify-center w-full h-full">
      <Icon name="sports_bar" className="text-4xl text-outline-variant" />
    </div>
  );
}

export function HomeContent({ products, categories }: { products: Product[]; categories: string[] }) {
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

  const addProduct = (p: Product) =>
    add({ id: p.id, name: p.name, price: p.price, image_url: p.image_url ?? null });

  // ============================ MOBILE ============================
  const mFeatured = filtered.slice(0, 8);
  const mBest = filtered.slice(8, 20);

  // ============================ DESKTOP ===========================
  const dFeatured = filtered.slice(0, 6);
  const dBest = filtered.slice(6, 11);

  return (
    <>
      {/* ============================ MOBILE ============================ */}
      <div className="md:hidden text-on-surface min-h-screen pb-24">
        <header className="page-header">
          <AddressChip variant="bar" />
          <Link href="/carrinho" className="relative active:scale-95">
            <Icon name="shopping_cart" className="text-2xl text-on-surface" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-secondary-container text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{cartCount}</span>
            )}
          </Link>
        </header>

        <main className="content-container pt-5 space-y-xl max-w-[600px] mx-auto">
          {/* Busca */}
          <div className="relative group">
            <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-on-surface-variant group-focus-within:text-primary transition-colors" />
            <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Buscar bebidas, marcas..." className="w-full bg-surface-container border-none rounded-xl py-4 pl-12 pr-4 text-body-md text-on-surface placeholder:text-on-surface-variant/60 focus:ring-2 focus:ring-primary outline-none" />
          </div>

          {/* Banner — imagem completa (proporção 1308x342) */}
          {!searchQuery && (
            <Link href="/categorias?categoria=promocao" className="block relative w-full aspect-[1024/265] rounded-2xl overflow-hidden neon-blue-glow group">
              <Image src="/stitch/banner.png" alt="22 Maluco — Depósito de Bebidas 24h. Rápido, fácil e gelado na sua casa." fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="600px" priority />
            </Link>
          )}

          {/* Categorias */}
          {!searchQuery && categories.length > 0 && (
            <section className="overflow-hidden">
              <div className="flex justify-between items-end mb-md">
                <h3 className="text-headline-sm">Categorias</h3>
                <Link href="/categorias" className="text-primary text-label-md hover:underline flex items-center gap-0.5">Ver todas<Icon name="chevron_right" className="text-base" /></Link>
              </div>
              <div className="relative -mx-margin-mobile">
                <div className="flex gap-md overflow-x-auto hide-scrollbar px-margin-mobile snap-x snap-mandatory scroll-px-margin-mobile">
                  {categories.map((cat) => (
                    <Link key={cat} href={`/categorias?categoria=${encodeURIComponent(cat)}`} className="flex flex-col items-center gap-2 shrink-0 snap-start group">
                      <div className="w-20 h-20 rounded-2xl bg-surface-container-high flex items-center justify-center border border-white/5 group-hover:bg-primary-container transition-colors active:scale-95">
                        <Icon name={metaFor(cat).icon} className="text-3xl text-primary group-hover:text-on-primary-container transition-colors" />
                      </div>
                      <span className="text-label-md text-on-surface-variant group-hover:text-primary transition-colors">{metaFor(cat).label}</span>
                    </Link>
                  ))}
                </div>
                {/* Fade indicando que rola pro lado */}
                <div className="pointer-events-none absolute top-0 right-0 bottom-0 w-12 bg-gradient-to-l from-background to-transparent" />
              </div>
            </section>
          )}

          {/* Destaques grid */}
          {mFeatured.length > 0 && (
            <section>
              <div className="flex justify-between items-end mb-md">
                <h3 className="text-headline-sm">{searchQuery ? "Resultados" : "Destaques"}</h3>
              </div>
              <div className="grid grid-cols-2 gap-gutter">
                {mFeatured.map((p) => (
                  <div key={p.id} className="bg-surface-container-low rounded-2xl p-sm product-card-border group">
                    <Link href={`/produto/${p.id}`}>
                      <div className="h-40 w-full rounded-xl overflow-hidden mb-base bg-surface-container-lowest flex items-center justify-center relative">
                        <ProductImage src={p.image_url ?? null} alt={p.name} />
                      </div>
                    </Link>
                    <div className="flex flex-col gap-xs">
                      <span className="text-label-md text-on-surface-variant truncate">{metaFor(p.category).label}</span>
                      <Link href={`/produto/${p.id}`} className="text-body-sm font-bold text-on-surface truncate leading-tight hover:text-primary">{p.name}</Link>
                      <div className="flex justify-between items-center mt-base">
                        <span className="text-primary text-body-md font-bold">R$ {formatPrice(p.price)}</span>
                        <button onClick={() => addProduct(p)} disabled={p.stock_qty <= 0} className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center active:scale-95 disabled:opacity-40" aria-label={`Adicionar ${p.name}`}>
                          <Icon name="add" className="text-xl" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Mais vendidos */}
          {mBest.length > 0 && (
            <section className="pb-base">
              <h3 className="text-headline-sm mb-md">{searchQuery ? "Mais resultados" : "Mais vendidos"}</h3>
              <div className="space-y-base">
                {mBest.map((p) => (
                  <div key={p.id} className="flex items-center gap-md bg-surface-container-lowest p-base rounded-xl border border-white/5">
                    <Link href={`/produto/${p.id}`} className="w-20 h-20 rounded-lg overflow-hidden bg-surface-container-high flex items-center justify-center shrink-0 relative">
                      <ProductImage src={p.image_url ?? null} alt={p.name} />
                    </Link>
                    <Link href={`/produto/${p.id}`} className="flex-1 min-w-0">
                      <h4 className="text-body-md font-bold text-on-surface truncate leading-tight">{p.name}</h4>
                      <p className="text-label-md text-on-surface-variant mt-0.5">{metaFor(p.category).label}</p>
                      <span className="text-primary font-bold mt-1 block">R$ {formatPrice(p.price)}</span>
                    </Link>
                    <button onClick={() => addProduct(p)} disabled={p.stock_qty <= 0} className="w-10 h-10 rounded-full border border-primary text-primary flex items-center justify-center active:scale-95 disabled:opacity-40 shrink-0" aria-label={`Adicionar ${p.name}`}>
                      <Icon name="shopping_basket" className="text-xl" />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <Icon name="sports_bar" className="text-5xl text-outline-variant" />
              <p className="text-on-surface-variant text-body-sm text-center">Nenhum produto encontrado.</p>
            </div>
          )}
        </main>
      </div>

      {/* ============================ DESKTOP ============================ */}
      <div className="hidden md:block text-on-surface">
        <main className="max-w-[1600px] mx-auto px-8 pb-12">
          {/* Hero — banner (imagem completa, proporção 1308x342) */}
          <section className="mt-6 mb-12">
            <Link href="/categorias" className="block relative w-full aspect-[1024/265] rounded-3xl overflow-hidden shadow-2xl neon-blue-glow group">
              <Image src="/stitch/banner.png" alt="22 Maluco — Depósito de Bebidas 24h. Rápido, fácil e gelado na sua casa." fill className="object-cover transition-transform duration-700 group-hover:scale-[1.02]" sizes="1600px" priority />
            </Link>
            <div className="flex flex-wrap gap-4 mt-6">
              <Link href="/categorias" className="bg-primary text-on-primary px-8 py-4 rounded-xl text-lg font-semibold flex items-center gap-2 hover:brightness-110 transition-all shadow-xl shadow-primary/20 active:scale-95">
                Pedir Agora <Icon name="bolt" className="text-xl" />
              </Link>
              <Link href="/categorias?categoria=promocao" className="bg-surface-container border border-white/10 text-on-surface px-8 py-4 rounded-xl text-lg font-semibold hover:bg-surface-container-high transition-all active:scale-95">
                Ver Promoções
              </Link>
            </div>
          </section>

          {/* Categorias chips */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-headline-lg">Explorar Categorias</h2>
              <Link href="/categorias" className="text-primary text-label-lg hover:underline underline-offset-4">Ver todas</Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
              {categories.map((cat, i) => (
                <Link
                  key={cat}
                  href={`/categorias?categoria=${encodeURIComponent(cat)}`}
                  className={`min-w-[160px] flex flex-col items-center gap-3 p-6 rounded-2xl transition-all shadow-lg ${
                    i === 0 ? "category-chip-active" : "bg-surface-container hover:bg-surface-container-high border border-outline-variant/10 text-on-surface"
                  }`}
                >
                  <Icon name={metaFor(cat).icon} filled={i === 0} className="text-3xl" />
                  <span className="text-label-lg">{metaFor(cat).label}</span>
                </Link>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Destaques */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-headline-lg">Destaques da Noite</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {dFeatured.map((p, i) => (
                  <div key={p.id} className="group bg-surface-container-low rounded-3xl overflow-hidden border border-outline-variant/5 product-card-hover transition-all duration-300">
                    <div className="relative h-64 overflow-hidden bg-surface-container-lowest">
                      <Link href={`/produto/${p.id}`} className="block w-full h-full relative">
                        <ProductImage src={p.image_url ?? null} alt={p.name} />
                      </Link>
                      {i === 0 && <div className="absolute top-4 left-4 bg-tertiary text-on-tertiary text-label-md px-3 py-1 rounded-full">DESTAQUE</div>}
                      <button onClick={() => addProduct(p)} disabled={p.stock_qty <= 0} className="absolute bottom-4 right-4 bg-primary text-on-primary p-3 rounded-2xl shadow-xl active:scale-90 transition-transform disabled:opacity-40" aria-label={`Adicionar ${p.name}`}>
                        <Icon name="add_shopping_cart" className="text-xl" />
                      </button>
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2 gap-2">
                        <Link href={`/produto/${p.id}`} className="text-headline-sm text-on-surface hover:text-primary leading-tight">{p.name}</Link>
                        <div className="flex items-center text-tertiary shrink-0"><Icon name="star" filled className="text-sm mr-1" /><span className="text-label-md">4.8</span></div>
                      </div>
                      <p className="text-on-surface-variant text-body-sm mb-4 line-clamp-1">{p.description ?? metaFor(p.category).label}</p>
                      <div className="flex items-center gap-3">
                        <span className="text-primary text-headline-md">R$ {formatPrice(p.price)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <aside className="space-y-8">
              <div className="bg-surface-container p-8 rounded-3xl border border-outline-variant/10">
                <h2 className="text-headline-md text-on-surface mb-6 flex items-center gap-2">Mais vendidos<Icon name="local_fire_department" className="text-tertiary" /></h2>
                <div className="space-y-6">
                  {dBest.map((p, i) => (
                    <div key={p.id}>
                      <div className="flex items-center gap-4 group">
                        <Link href={`/produto/${p.id}`} className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 bg-surface-container-high flex items-center justify-center">
                          <ProductImage src={p.image_url ?? null} alt={p.name} />
                        </Link>
                        <div className="flex-grow min-w-0">
                          <Link href={`/produto/${p.id}`} className="text-label-lg text-on-surface group-hover:text-primary transition-colors block truncate">{p.name}</Link>
                          <p className="text-body-sm text-on-surface-variant truncate">{metaFor(p.category).label}</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-primary text-label-lg">R$ {formatPrice(p.price)}</span>
                            <button onClick={() => addProduct(p)} disabled={p.stock_qty <= 0} className="text-on-surface-variant hover:text-primary transition-colors disabled:opacity-40" aria-label={`Adicionar ${p.name}`}>
                              <Icon name="add_circle" className="text-xl" />
                            </button>
                          </div>
                        </div>
                      </div>
                      {i < dBest.length - 1 && <div className="h-px bg-outline-variant/10 mt-6" />}
                    </div>
                  ))}
                </div>
                <Link href="/categorias" className="block text-center w-full mt-8 py-4 border border-outline-variant/30 rounded-xl text-label-lg text-on-surface-variant hover:text-primary hover:border-primary transition-all active:scale-95">Ver catálogo completo</Link>
              </div>

              {/* Tracker promo */}
              <div className="relative rounded-3xl overflow-hidden p-8 hero-gradient shadow-2xl">
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                  <div className="absolute inset-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent animate-pulse-slow" />
                </div>
                <div className="relative z-10 text-white">
                  <Icon name="near_me" className="text-4xl mb-4 text-white" />
                  <h3 className="text-headline-md mb-2 text-white">Onde está seu pedido?</h3>
                  <p className="text-body-sm mb-6 text-white/80">Acompanhe cada segundo da entrega em tempo real até a sua porta.</p>
                  <Link href="/pedidos" className="block text-center w-full bg-white text-[#00149f] px-6 py-3 rounded-xl text-label-lg font-bold hover:bg-white/90 transition-all active:scale-95">Rastrear Pedido</Link>
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>

      {/* Baixe o app (PWA) + Onde estamos — no final do site */}
      <AppPromo />
      <StoreLocation />

      {/* FAB WhatsApp */}
      <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="fixed bottom-24 md:bottom-8 right-4 md:right-8 w-14 h-14 text-white rounded-full shadow-2xl flex items-center justify-center z-40 active:scale-90 transition-transform" style={{ backgroundColor: "#25D366" }} aria-label="Falar no WhatsApp">
        <Icon name="chat" filled className="text-3xl" />
      </a>
    </>
  );
}
