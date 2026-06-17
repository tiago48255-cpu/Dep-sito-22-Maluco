"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import type { Product } from "@/lib/types/queries";
import { useCartStore } from "@/hooks/useCart";

function ProductImage({ src, alt }: { src: string | null; alt: string }) {
  if (src) {
    return <Image src={src} alt={alt} fill className="object-contain p-1.5" sizes="80px" />;
  }
  return (
    <div className="flex items-center justify-center w-full h-full">
      <Icon name="sports_bar" className="text-3xl text-outline-variant" />
    </div>
  );
}

export function CategoryList({
  products,
  categoria,
}: {
  products: Product[];
  categoria: string;
}) {
  const [search, setSearch] = useState("");
  const add = useCartStore((s) => s.add);
  const items = useCartStore((s) => s.items);
  const cartCount = items.reduce((acc, i) => acc + i.qty, 0);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description?.toLowerCase().includes(search.toLowerCase()) ?? false)
  );

  const catLabel = categoria.charAt(0).toUpperCase() + categoria.slice(1);

  return (
    <>
      {/* Top app bar — mobile */}
      <header className="page-header md:hidden">
        <div className="flex items-center gap-3">
          <Link href="/categorias" className="text-primary hover:bg-surface-container rounded-full w-9 h-9 flex items-center justify-center transition-colors">
            <Icon name="arrow_back" className="text-xl" />
          </Link>
          <div className="flex flex-col text-left">
            <span className="text-label-sm text-on-surface-variant uppercase tracking-widest leading-none">Seção</span>
            <h1 className="text-label-lg text-on-surface mt-1">{catLabel}</h1>
          </div>
        </div>

        <Link href="/carrinho" className="relative hover:opacity-80 transition-opacity active:scale-95">
          <Icon name="shopping_cart" className="text-2xl text-on-surface" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-secondary-container text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {cartCount}
            </span>
          )}
        </Link>
      </header>

      <div className="content-container pt-4 md:pt-8">
        {/* Título desktop */}
        <div className="hidden md:flex items-center gap-3 mb-lg">
          <Link href="/categorias" className="text-primary hover:bg-surface-container rounded-full w-10 h-10 flex items-center justify-center transition-colors">
            <Icon name="arrow_back" className="text-2xl" />
          </Link>
          <h1 className="text-headline-lg text-on-surface">{catLabel}</h1>
        </div>

        <div className="relative group max-w-2xl">
          <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-on-surface-variant group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder={`Buscar em ${catLabel}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-12 bg-surface-container border border-white/5 text-on-surface rounded-xl pl-12 pr-4 text-body-sm placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
          />
        </div>
      </div>

      <main className="content-container pt-4 pb-8">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Icon name="sports_bar" className="text-5xl text-outline-variant block mx-auto mb-3" />
            <p className="text-body-sm text-on-surface-variant">Nenhum produto encontrado.</p>
            {search && (
              <button onClick={() => setSearch("")} className="mt-3 text-label-md text-primary hover:underline bg-transparent border-none cursor-pointer">
                Limpar busca
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-sm">
            {filtered.map((product) => (
              <div key={product.id} className="bg-surface-container-low p-3 rounded-2xl border border-white/5 hover:border-white/10 transition-all flex gap-4">
                <Link href={`/produto/${product.id}`} className="relative w-20 h-24 bg-surface-container-lowest rounded-xl overflow-hidden flex items-center justify-center shrink-0 border border-white/5">
                  <ProductImage src={product.image_url} alt={product.name} />
                </Link>

                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <Link href={`/produto/${product.id}`} className="block">
                    <h3 className="text-body-sm font-bold text-on-surface leading-snug hover:text-primary transition-colors">{product.name}</h3>
                    {product.description && (
                      <p className="text-label-md text-on-surface-variant line-clamp-2 mt-1 leading-normal">{product.description}</p>
                    )}
                  </Link>

                  <div className="flex justify-between items-center mt-2.5">
                    <span className="text-primary text-body-md font-bold">R$ {product.price.toFixed(2).replace(".", ",")}</span>
                    <button
                      onClick={() => add({ id: product.id, name: product.name, price: product.price, image_url: product.image_url ?? null })}
                      className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center hover:scale-110 active:scale-95 transition-all border-none cursor-pointer"
                      aria-label={`Adicionar ${product.name}`}
                    >
                      <Icon name="add" className="text-xl" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
