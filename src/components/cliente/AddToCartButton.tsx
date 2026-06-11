"use client";

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { useCartStore } from "@/hooks/useCart";
import { Button } from "@/components/ui/Button";
import type { Product } from "@/lib/types/queries";

export function AddToCartButton({ product }: { product: Product }) {
  const [added, setAdded] = useState(false);
  const add = useCartStore((s) => s.add);

  function handleAdd() {
    add({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  if (product.stock_qty === 0) {
    return (
      <Button disabled className="cursor-not-allowed">
        Sem estoque
      </Button>
    );
  }

  return (
    <Button onClick={handleAdd} size="lg" className="gap-2">
      {added ? <Check size={18} /> : <ShoppingCart size={18} />}
      {added ? "Adicionado!" : "Adicionar"}
    </Button>
  );
}
