import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { StatusBadge } from "@/components/ui/Badge";
import { OrderTracker } from "@/components/cliente/OrderTracker";
import Link from "next/link";
import { ArrowLeft, MapPin } from "lucide-react";
import type { OrderStatus, PaymentMethod } from "@/lib/types/database";

interface OrderWithItems {
  id: string;
  user_id: string;
  status: OrderStatus;
  total: number;
  payment_method: PaymentMethod;
  change_for: number | null;
  delivery_address: string;
  created_at: string;
  order_items: { id: string; qty: number; price_at_time: number; products: { name: string } | null }[];
}

const paymentLabels: Record<PaymentMethod, string> = {
  pix: "PIX",
  credito: "Cartão de Crédito",
  debito: "Cartão de Débito",
  dinheiro: "Dinheiro",
};

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/login?redirect=/pedidos/${id}`);

  const { data: order } = await supabase
    .from("orders")
    .select("*, order_items(id, qty, price_at_time, products(name))")
    .eq("id", id)
    .single() as { data: OrderWithItems | null };

  if (!order || order.user_id !== user.id) notFound();

  const shortId = id.slice(-8).toUpperCase();
  const createdAt = new Date(order.created_at).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="text-white min-h-screen bg-black pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-neutral-950/85 backdrop-blur-xl border-b border-white/5 px-5 py-3 flex items-center justify-between h-16 select-none">
        <Link href="/pedidos" className="p-2 hover:bg-neutral-900 rounded-full transition-colors text-brand-primary">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest leading-none">Pedido</span>
          <span className="text-xs font-bold text-white mt-1">#{shortId}</span>
        </div>
        <StatusBadge status={order.status} />
      </header>

      <p className="text-center text-neutral-500 text-xs py-3">{createdAt}</p>

      {/* Realtime Tracker */}
      <OrderTracker status={order.status} orderId={id} />

      {/* Order Items */}
      <div className="glass-panel mx-5 mt-3 rounded-2xl p-4">
        <h3 className="text-xs font-black uppercase tracking-wider text-neutral-400 mb-3">Itens do pedido</h3>
        <div className="space-y-2">
          {order.order_items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-neutral-400">{item.qty}× {item.products?.name}</span>
              <span className="text-white font-medium">
                R$ {(item.price_at_time * item.qty).toFixed(2).replace(".", ",")}
              </span>
            </div>
          ))}
        </div>
        <div className="flex justify-between text-white font-black mt-3 pt-3 border-t border-white/5">
          <span>Total</span>
          <span className="text-brand-primary">R$ {order.total.toFixed(2).replace(".", ",")}</span>
        </div>
      </div>

      {/* Delivery Info */}
      <div className="glass-panel mx-5 mt-3 rounded-2xl p-4 flex items-start gap-3">
        <MapPin className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1">Endereço de entrega</p>
          <p className="text-white text-sm">{order.delivery_address}</p>
          <p className="text-neutral-400 text-xs mt-1.5">
            {paymentLabels[order.payment_method]}
            {order.change_for && ` · Troco pra R$ ${order.change_for.toFixed(2).replace(".", ",")}`}
          </p>
        </div>
      </div>
    </div>
  );
}
