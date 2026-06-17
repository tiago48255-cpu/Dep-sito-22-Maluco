"use client";

import Link from "next/link";
import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
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
      <div className="text-on-surface min-h-screen pb-24 md:pb-8">
        <header className="page-header md:hidden">
          <h1 className="text-body-md font-bold text-on-surface">Meu carrinho</h1>
        </header>
        <div className="flex flex-col items-center justify-center py-24 gap-4 content-container">
          <Icon name="shopping_bag" className="text-6xl text-outline-variant" />
          <h2 className="text-on-surface font-bold text-headline-sm">Carrinho vazio</h2>
          <p className="text-on-surface-variant text-body-sm text-center">Adicione bebidas geladas pro seu pedido!</p>
          <Link href="/" className="btn-gradient royal-glow text-white font-bold text-body-sm rounded-xl px-8 py-3 active:scale-[0.96] transition-all mt-2">
            Ver cardápio
          </Link>
        </div>
      </div>
    );
  }

  const itemCount = items.reduce((s, i) => s + i.qty, 0);

  return (
    <div className="text-on-surface min-h-screen pb-24 md:pb-8">
      {/* Header — mobile */}
      <header className="page-header md:hidden">
        <Link href="/" className="text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-full w-9 h-9 flex items-center justify-center transition-colors shrink-0">
          <Icon name="arrow_back" className="text-xl" />
        </Link>
        <h1 className="text-body-md font-bold text-on-surface flex-1 text-center -ml-9 pr-9">Meu carrinho</h1>
        <button onClick={clear} className="text-on-surface-variant hover:text-secondary p-1 rounded transition-colors shrink-0" title="Esvaziar carrinho">
          <Icon name="delete" className="text-xl" />
        </button>
      </header>

      <main className="content-container pt-4 md:pt-8 pb-4">
        {/* Título desktop */}
        <div className="hidden md:flex items-center justify-between mb-lg">
          <h1 className="text-headline-lg text-on-surface">Meu carrinho</h1>
          <button onClick={clear} className="flex items-center gap-2 text-on-surface-variant hover:text-secondary transition-colors text-label-lg">
            <Icon name="delete" className="text-xl" /> Esvaziar
          </button>
        </div>

        <div className="md:flex md:gap-8">
          {/* Itens */}
          <div className="flex-1 space-y-4">
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="glass-panel rounded-2xl p-3 flex items-center gap-3">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-surface-container-lowest flex items-center justify-center shrink-0 border border-white/5 relative">
                    {item.image_url ? (
                      <Image src={item.image_url} alt={item.name} fill className="object-contain p-1" sizes="80px" />
                    ) : (
                      <Icon name="sports_bar" className="text-3xl text-outline-variant" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-on-surface font-bold text-body-sm truncate">{item.name}</p>
                    <p className="text-on-surface-variant text-label-md mt-0.5">R$ {formatPrice(item.price)} × {item.qty}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateQty(item.id, item.qty - 1)} className="w-7 h-7 bg-surface-container-high rounded-full flex items-center justify-center hover:bg-primary-container transition-colors" aria-label="Diminuir">
                        <Icon name="remove" className="text-base text-on-surface" />
                      </button>
                      <span className="text-on-surface font-bold text-body-sm w-5 text-center">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, item.qty + 1)} className="w-7 h-7 bg-surface-container-high rounded-full flex items-center justify-center hover:bg-primary-container transition-colors" aria-label="Aumentar">
                        <Icon name="add" className="text-base text-on-surface" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <button onClick={() => remove(item.id)} className="text-on-surface-variant hover:text-secondary transition-colors" aria-label="Remover">
                      <Icon name="close" className="text-lg" />
                    </button>
                    <span className="text-primary font-bold text-body-sm">R$ {formatPrice(item.price * item.qty)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Cupom (desabilitado) */}
            <div className="glass-panel rounded-2xl">
              <button className="w-full flex items-center justify-between px-4 py-3.5 text-left opacity-50 cursor-not-allowed">
                <div className="flex items-center gap-2 text-on-surface-variant">
                  <Icon name="confirmation_number" className="text-lg" />
                  <span className="text-body-sm">Cupom de desconto</span>
                </div>
                <span className="text-label-md text-on-surface-variant uppercase">Em breve</span>
              </button>
            </div>
          </div>

          {/* Resumo — sticky no desktop */}
          <div className="md:w-[380px] md:shrink-0 mt-4 md:mt-0">
            <div className="md:sticky md:top-24">
              <div className="glass-panel rounded-2xl p-4 space-y-3">
                <div className="flex justify-between text-on-surface-variant text-body-sm">
                  <span>Subtotal ({itemCount} {itemCount === 1 ? "item" : "itens"})</span>
                  <span>R$ {formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-on-surface-variant text-body-sm">
                  <span>Taxa de entrega</span>
                  <span>R$ {formatPrice(deliveryFee)}</span>
                </div>
                <div className="border-t border-white/5 pt-3 flex justify-between items-center">
                  <span className="text-on-surface font-bold text-body-md">Total</span>
                  <span className="text-primary font-bold text-headline-sm">R$ {formatPrice(finalTotal)}</span>
                </div>

                <Link href="/checkout" className="block mt-2 btn-gradient royal-glow text-white font-bold text-body-sm rounded-xl py-4 text-center active:scale-[0.96] transition-all">
                  Finalizar pedido
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
