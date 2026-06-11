"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/hooks/useCart";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/types/queries";
import type { PaymentMethod } from "@/lib/types/database";
import { MapPin, CreditCard, Landmark, Banknote, Smartphone } from "lucide-react";

function formatPrice(value: number) {
  return value.toFixed(2).replace(".", ",");
}

const paymentOptions: { value: PaymentMethod; label: string; icon: React.ReactNode; badge?: string }[] = [
  { value: "pix", label: "PIX", icon: <Smartphone className="w-4 h-4" />, badge: "5% OFF" },
  { value: "credito", label: "Cartão de Crédito", icon: <CreditCard className="w-4 h-4" /> },
  { value: "debito", label: "Cartão de Débito", icon: <Landmark className="w-4 h-4" /> },
  { value: "dinheiro", label: "Dinheiro", icon: <Banknote className="w-4 h-4" /> },
];

export function CheckoutForm({ profile }: { profile: Profile | null }) {
  const router = useRouter();
  const { items, total, clear } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [address, setAddress] = useState(profile?.address_default ?? "");
  const [payment, setPayment] = useState<PaymentMethod>("pix");
  const [changeFor, setChangeFor] = useState("");
  const [notes, setNotes] = useState("");

  const subtotal = total();
  const deliveryFee = 5.0;
  const finalTotal = subtotal + deliveryFee;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) return;
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login?redirect=/checkout");
      return;
    }

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        total: subtotal,
        payment_method: payment,
        change_for: payment === "dinheiro" && changeFor ? parseFloat(changeFor) : null,
        delivery_address: address,
        notes: notes || null,
      })
      .select("id")
      .single();

    if (orderError || !order) {
      setError("Erro ao criar pedido. Tente novamente.");
      setLoading(false);
      return;
    }

    const { error: itemsError } = await supabase.from("order_items").insert(
      items.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        qty: item.qty,
        price_at_time: item.price,
      }))
    );

    if (itemsError) {
      setError("Erro ao registrar itens. Tente novamente.");
      setLoading(false);
      return;
    }

    clear();
    router.push(`/pedidos/${order.id}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col pb-28">
      {/* Endereço */}
      <div className="glass-panel mx-5 mt-4 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-4 h-4 text-brand-primary shrink-0" />
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Endereço de entrega</span>
        </div>
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Rua, número, bairro"
          required
          className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-neutral-600 input-focus-ring transition-colors outline-none"
        />
      </div>

      {/* Forma de Pagamento */}
      <div className="glass-panel mx-5 mt-3 rounded-2xl p-4">
        <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-3">Forma de pagamento</span>
        <div className="space-y-2">
          {paymentOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setPayment(opt.value)}
              className={`w-full flex items-center gap-3 p-3.5 rounded-xl border text-sm font-medium transition-all text-left ${
                payment === opt.value
                  ? "border-brand-primary/50 bg-brand-primary-container/20 text-white"
                  : "border-white/8 text-neutral-400 hover:border-white/15"
              }`}
            >
              <span className={payment === opt.value ? "text-brand-primary" : ""}>{opt.icon}</span>
              <span className="flex-1">{opt.label}</span>
              {opt.badge && (
                <span className="text-[10px] font-black bg-brand-tertiary text-black px-1.5 py-0.5 rounded uppercase tracking-wide">
                  {opt.badge}
                </span>
              )}
              <span
                className={`w-4 h-4 rounded-full border-2 shrink-0 ${
                  payment === opt.value ? "border-brand-primary bg-brand-primary" : "border-neutral-600"
                }`}
              />
            </button>
          ))}
        </div>

        {payment === "dinheiro" && (
          <div className="mt-3">
            <input
              type="number"
              value={changeFor}
              onChange={(e) => setChangeFor(e.target.value)}
              placeholder="Troco para quanto? (opcional)"
              min={subtotal}
              className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-neutral-600 input-focus-ring transition-colors outline-none mt-2"
            />
          </div>
        )}
      </div>

      {/* Observações */}
      <div className="glass-panel mx-5 mt-3 rounded-2xl p-4">
        <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-3">Observações (opcional)</span>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Adicionar observação ao pedido..."
          className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-neutral-600 input-focus-ring transition-colors outline-none resize-none"
          rows={3}
        />
      </div>

      {/* Resumo */}
      <div className="glass-panel mx-5 mt-3 rounded-2xl p-4 space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-1">Resumo do pedido</span>
        <div className="space-y-1.5">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between text-xs text-neutral-400">
              <span>{item.qty}× {item.name}</span>
              <span>R$ {formatPrice(item.price * item.qty)}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-white/5 pt-2 mt-2 space-y-1.5">
          <div className="flex justify-between text-sm text-neutral-400">
            <span>Subtotal</span>
            <span>R$ {formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-neutral-400">
            <span>Taxa de entrega</span>
            <span>R$ {formatPrice(deliveryFee)}</span>
          </div>
          <div className="flex justify-between text-white font-black text-base pt-2 border-t border-white/5">
            <span>Total</span>
            <span className="text-brand-primary">R$ {formatPrice(finalTotal)}</span>
          </div>
        </div>
      </div>

      {error && <p className="text-brand-secondary text-sm mx-5 mt-3">{error}</p>}

      {/* Fixed CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-neutral-950/95 backdrop-blur-xl border-t border-white/5 z-50 flex justify-center">
        <div className="w-full max-w-[430px]">
          <button
            type="submit"
            disabled={loading || items.length === 0}
            className="w-full h-14 btn-gradient shadow-royal-glow text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.96] transition-all"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <span>Confirmar pedido · R$ {formatPrice(finalTotal)}</span>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
