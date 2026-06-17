"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
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
      add({ id: product.id, name: product.name, price: product.price, image_url: product.image_url ?? null });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  const controls = (
    <div className="w-full flex gap-3 items-center">
      <div className="flex items-center bg-surface-container rounded-xl p-1 border border-white/5 h-14 select-none shrink-0">
        <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center text-on-surface hover:text-primary transition-colors" aria-label="Diminuir">
          <Icon name="remove" className="text-xl" />
        </button>
        <span className="w-8 text-center text-body-md font-bold text-on-surface">{qty}</span>
        <button onClick={() => setQty((q) => q + 1)} className="w-10 h-10 flex items-center justify-center text-on-surface hover:text-primary transition-colors" aria-label="Aumentar">
          <Icon name="add" className="text-xl" />
        </button>
      </div>

      <button
        onClick={handleAdd}
        disabled={outOfStock}
        className="flex-1 h-14 btn-gradient royal-glow text-white font-bold text-body-sm rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.96] transition-all"
      >
        {added ? (
          <>
            <Icon name="check" className="text-xl shrink-0" />
            <span>Adicionado!</span>
          </>
        ) : outOfStock ? (
          <span>Sem estoque</span>
        ) : (
          <>
            <Icon name="shopping_bag" className="text-xl shrink-0" />
            <span>Adicionar ao carrinho</span>
            <span className="ml-1 text-body-sm opacity-65 font-normal">
              · R$ {(product.price * qty).toFixed(2).replace(".", ",")}
            </span>
          </>
        )}
      </button>
    </div>
  );

  return (
    <>
      {/* Mobile: barra fixa no rodapé */}
      <div className="fixed bottom-0 left-0 right-0 p-4 glass-nav border-t border-white/5 z-50 flex justify-center md:hidden">
        {controls}
      </div>

      {/* Desktop: inline na coluna de detalhes */}
      <div className="hidden md:block w-full">
        {controls}
        <p className="text-body-sm text-on-surface-variant flex items-center gap-2 mt-3">
          <Icon name="bolt" className="text-base text-tertiary" />
          Entrega em até 35 min na sua localização.
        </p>
      </div>
    </>
  );
}
