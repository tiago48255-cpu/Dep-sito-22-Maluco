"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingBag, Check } from "lucide-react";
import { useCartStore } from "@/hooks/useCart";
import type { Product } from "@/lib/types/queries";

export function ProductAddBar({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const add = useCartStore((s) => s.add);

  const outOfStock = product.stock_qty <= 0;

  function handleAdd() {
    if (outOfStock) return;
    for (let i = 0; i < qty; i++) {
      add({
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url ?? null,
      });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-neutral-950/95 backdrop-blur-xl border-t border-white/5 z-50 flex justify-center">
      <div className="w-full max-w-[430px] flex gap-3 items-center">
        <div className="flex items-center bg-neutral-900 rounded-xl p-1 border border-white/5 h-14 select-none shadow shrink-0">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="w-10 h-10 flex items-center justify-center text-white hover:text-brand-primary transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-8 text-center text-base font-bold text-white">{qty}</span>
          <button
            onClick={() => setQty((q) => q + 1)}
            className="w-10 h-10 flex items-center justify-center text-white hover:text-brand-primary transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={handleAdd}
          disabled={outOfStock}
          className="flex-1 h-14 btn-gradient shadow-royal-glow text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.96] transition-all"
        >
          {added ? (
            <>
              <Check className="w-4 h-4 shrink-0" />
              <span>Adicionado!</span>
            </>
          ) : outOfStock ? (
            <span>Sem estoque</span>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4 shrink-0" />
              <span>Adicionar ao carrinho</span>
              <span className="ml-1 text-xs opacity-65 font-normal">
                · R$ {(product.price * qty).toFixed(2).replace(".", ",")}
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
