"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/hooks/useCart";
import { Card } from "@/components/ui/Card";
import type { Product } from "@/lib/types/queries";

export function ProductGrid({ products }: { products: Product[] }) {
  const add = useCartStore((s) => s.add);

  if (products.length === 0) {
    return (
      <div className="text-center py-16 text-[#9999BB]">
        <p className="text-4xl mb-3">🍺</p>
        <p>Nenhum produto encontrado.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <Card key={product.id} hover className="overflow-hidden flex flex-col">
          <Link href={`/produto/${product.id}`} className="flex-1">
            <div className="aspect-square bg-[#0A0A1A] relative">
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl">
                  🍾
                </div>
              )}
            </div>
            <div className="p-3">
              <p className="text-xs text-[#9999BB] uppercase tracking-wide capitalize">
                {product.category}
              </p>
              <h3 className="text-white font-medium text-sm mt-0.5 line-clamp-2">
                {product.name}
              </h3>
            </div>
          </Link>
          <div className="px-3 pb-3 flex items-center justify-between">
            <span className="text-white font-bold">
              R$ {product.price.toFixed(2).replace(".", ",")}
            </span>
            <button
              onClick={() =>
                add({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image_url: product.image_url,
                })
              }
              className="bg-[#2233CC] hover:bg-[#1a28a8] text-white rounded-lg p-2 transition-colors"
              aria-label={`Adicionar ${product.name} ao carrinho`}
            >
              <ShoppingCart size={16} />
            </button>
          </div>
        </Card>
      ))}
    </div>
  );
}
