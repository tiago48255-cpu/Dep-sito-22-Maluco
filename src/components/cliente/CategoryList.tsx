"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Plus, Beer, ArrowLeft, ShoppingCart } from "lucide-react";
import type { Product } from "@/lib/types/queries";
import { useCartStore } from "@/hooks/useCart";

function ProductImage({ src, alt }: { src: string | null; alt: string }) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className="object-contain p-1.5"
        sizes="80px"
      />
    );
  }
  return (
    <div className="flex items-center justify-center w-full h-full">
      <Beer className="w-8 h-8 text-neutral-700" />
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
      <header className="page-header">
        <div className="flex items-center gap-3">
          <Link
            href="/categorias"
            className="text-brand-primary hover:bg-neutral-900 rounded-full w-9 h-9 flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex flex-col text-left">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest leading-none">
              Seção
            </span>
            <h1 className="text-xs font-bold text-white mt-1">{catLabel}</h1>
          </div>
        </div>

        <Link
          href="/carrinho"
          className="relative w-10 h-10 flex items-center justify-center rounded-full bg-neutral-900 border border-white/10 hover:border-brand-primary/45 transition-colors"
        >
          <ShoppingCart className="w-[18px] h-[18px] text-white" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-brand-secondary-container text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black animate-pulse border border-black">
              {cartCount}
            </span>
          )}
        </Link>
      </header>

      <div className="content-container pt-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            type="text"
            placeholder={`Buscar em ${catLabel}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 bg-neutral-900 border border-white/5 text-white rounded-xl pl-11 pr-4 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand-primary"
          />
        </div>
      </div>

      <main className="content-container pt-4 pb-8">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Beer className="w-14 h-14 text-neutral-700 mx-auto mb-3" />
            <p className="text-sm text-neutral-500">Nenhum produto encontrado.</p>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="mt-3 text-xs text-brand-primary font-bold hover:underline bg-transparent border-none cursor-pointer"
              >
                Limpar busca
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((product) => (
              <div
                key={product.id}
              className="bg-neutral-900/60 p-3 rounded-2xl border border-white/5 hover:border-white/10 transition-all flex gap-4"
            >
              <Link
                href={`/produto/${product.id}`}
                className="relative w-20 h-24 bg-neutral-950 rounded-xl overflow-hidden flex items-center justify-center shrink-0 border border-white/5"
              >
                <ProductImage src={product.image_url} alt={product.name} />
              </Link>

              <div className="flex-1 flex flex-col justify-between min-w-0">
                <Link href={`/produto/${product.id}`} className="block">
                  <h3 className="text-xs font-extrabold text-white leading-snug hover:text-brand-primary transition-colors">
                    {product.name}
                  </h3>
                  {product.description && (
                    <p className="text-[10px] text-neutral-500 line-clamp-2 mt-1 leading-normal">
                      {product.description}
                    </p>
                  )}
                </Link>

                <div className="flex justify-between items-center mt-2.5">
                  <span className="text-brand-primary text-xs font-black">
                    R$ {product.price.toFixed(2).replace(".", ",")}
                  </span>
                  <button
                    onClick={() => add({ id: product.id, name: product.name, price: product.price, image_url: product.image_url ?? null })}
                    className="w-8 h-8 rounded-full bg-brand-primary-container hover:bg-brand-inverse-primary text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all border-none cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
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
