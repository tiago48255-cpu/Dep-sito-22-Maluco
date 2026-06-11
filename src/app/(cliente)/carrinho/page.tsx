"use client";

import Link from "next/link";
import Image from "next/image";
import { Trash2, Plus, Minus, X, ShoppingBag, Ticket, Beer } from "lucide-react";
import { useCartStore } from "@/hooks/useCart";

function formatPrice(value: number) {
  return value.toFixed(2).replace(".", ",");
}

export default function CarrinhoPage() {
  const { items, remove, updateQty, clear, total } = useCartStore();

  const subtotal = total();
  const deliveryFee = subtotal > 0 ? 5.0 : 0;
  const finalTotal = subtotal + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="text-white min-h-screen pb-24">
        <header className="sticky top-0 z-40 bg-neutral-950/95 backdrop-blur-xl border-b border-white/5 px-5 py-3 flex items-center h-16">
          <h1 className="text-base font-bold text-white">Meu carrinho</h1>
        </header>
        <div className="flex flex-col items-center justify-center py-24 gap-4 px-5">
          <ShoppingBag className="w-16 h-16 text-neutral-700" />
          <h2 className="text-white font-bold text-lg">Carrinho vazio</h2>
          <p className="text-neutral-500 text-sm text-center">Adicione bebidas geladas pro seu pedido!</p>
          <Link
            href="/"
            className="btn-gradient shadow-royal-glow text-white font-bold text-sm rounded-xl px-8 py-3 active:scale-[0.96] transition-all mt-2"
          >
            Ver cardápio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="text-white min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-neutral-950/95 backdrop-blur-xl border-b border-white/5 px-5 py-3 flex justify-between items-center h-16 select-none">
        <h1 className="text-base font-bold text-white">Meu carrinho</h1>
        <button
          onClick={clear}
          className="text-neutral-500 hover:text-brand-secondary p-1 rounded transition-colors"
          title="Esvaziar carrinho"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </header>

      <main className="px-5 pt-4 space-y-4 pb-4">
        {/* Items */}
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="glass-panel rounded-2xl p-3 flex items-center gap-3">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#0A0A0A] flex items-center justify-center shrink-0 border border-white/5 relative">
                {item.image_url ? (
                  <Image src={item.image_url} alt={item.name} fill className="object-contain p-1" sizes="80px" />
                ) : (
                  <Beer className="w-8 h-8 text-neutral-700" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-sm truncate">{item.name}</p>
                <p className="text-neutral-400 text-xs mt-0.5">
                  R$ {formatPrice(item.price)} × {item.qty}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => updateQty(item.id, item.qty - 1)}
                    className="w-7 h-7 bg-neutral-800 rounded-full flex items-center justify-center hover:bg-brand-primary-container transition-colors"
                  >
                    <Minus className="w-3 h-3 text-white" />
                  </button>
                  <span className="text-white font-bold text-sm w-5 text-center">{item.qty}</span>
                  <button
                    onClick={() => updateQty(item.id, item.qty + 1)}
                    className="w-7 h-7 bg-neutral-800 rounded-full flex items-center justify-center hover:bg-brand-primary-container transition-colors"
                  >
                    <Plus className="w-3 h-3 text-white" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2 shrink-0">
                <button
                  onClick={() => remove(item.id)}
                  className="text-neutral-600 hover:text-brand-secondary transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <span className="text-brand-primary font-black text-sm">
                  R$ {formatPrice(item.price * item.qty)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Cupom (desabilitado — sem tabela de cupons) */}
        <div className="glass-panel rounded-2xl">
          <button className="w-full flex items-center justify-between px-4 py-3.5 text-left opacity-50 cursor-not-allowed">
            <div className="flex items-center gap-2 text-neutral-400">
              <Ticket className="w-4 h-4" />
              <span className="text-sm font-medium">Cupom de desconto</span>
            </div>
            <span className="text-xs text-neutral-600 font-bold uppercase">Em breve</span>
          </button>
        </div>

        {/* Order Summary */}
        <div className="glass-panel rounded-2xl p-4 space-y-3">
          <div className="flex justify-between text-neutral-400 text-sm">
            <span>Subtotal ({items.reduce((s, i) => s + i.qty, 0)} {items.reduce((s, i) => s + i.qty, 0) === 1 ? "item" : "itens"})</span>
            <span>R$ {formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-neutral-400 text-sm">
            <span>Taxa de entrega</span>
            <span>R$ {formatPrice(deliveryFee)}</span>
          </div>
          <div className="border-t border-white/5 pt-3 flex justify-between items-center">
            <span className="text-white font-bold text-base">Total</span>
            <span className="text-brand-primary font-black text-xl">R$ {formatPrice(finalTotal)}</span>
          </div>

          <Link
            href="/checkout"
            className="block mt-2 btn-gradient shadow-royal-glow text-white font-bold text-sm rounded-xl py-4 text-center active:scale-[0.96] transition-all"
          >
            Finalizar pedido
          </Link>
        </div>
      </main>
    </div>
  );
}
