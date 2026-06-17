import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { StatusBadge } from "@/components/ui/Badge";
import { OrderTracker } from "@/components/cliente/OrderTracker";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import type { OrderStatus, PaymentMethod } from "@/lib/types/database";
import { WHATSAPP_URL } from "@/lib/constants";

interface OrderWithItems {
  id: string;
  user_id: string;
  status: OrderStatus;
  total: number;
  payment_method: PaymentMethod;
  change_for: number | null;
  delivery_address: string;
  created_at: string;
  motoboy_id: string | null;
  driver_lat: number | null;
  driver_lng: number | null;
  motoboys: { name: string; phone: string } | null;
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
    .select("*, motoboys(name, phone), order_items(id, qty, price_at_time, products(name))")
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
    <div className="text-on-surface min-h-screen pb-24 md:pb-8">
      {/* Header — mobile */}
      <header className="page-header md:hidden">
        <Link href="/pedidos" className="p-2 hover:bg-surface-container rounded-full transition-colors text-on-surface-variant hover:text-on-surface shrink-0">
          <Icon name="arrow_back" className="text-xl" />
        </Link>
        <div className="flex flex-col items-center flex-1 text-center">
          <span className="text-body-sm font-bold text-on-surface leading-none">Pedido #{shortId}</span>
          <span className="text-label-sm text-on-surface-variant mt-1">Realizado em {createdAt}</span>
        </div>
        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="p-2 text-on-surface-variant hover:text-on-surface transition-colors shrink-0">
          <Icon name="help" className="text-xl" />
        </a>
      </header>

      {/* Título desktop */}
      <div className="hidden md:flex content-container pt-8 items-center gap-3">
        <Link href="/pedidos" className="text-primary hover:bg-surface-container rounded-full w-10 h-10 flex items-center justify-center transition-colors">
          <Icon name="arrow_back" className="text-2xl" />
        </Link>
        <div>
          <h1 className="text-headline-md text-on-surface">Pedido #{shortId}</h1>
          <p className="text-label-md text-on-surface-variant">Realizado em {createdAt}</p>
        </div>
      </div>

      {/* Realtime Tracker */}
      <OrderTracker
        status={order.status}
        orderId={id}
        driver={order.motoboys}
        initialDriverLat={order.driver_lat}
        initialDriverLng={order.driver_lng}
      />

      {/* Itens do pedido */}
      <div className="glass-panel content-container mt-3 rounded-2xl p-4">
        <h3 className="text-label-lg uppercase tracking-wider text-on-surface-variant mb-3">Itens do pedido</h3>
        <div className="space-y-2">
          {order.order_items.map((item) => (
            <div key={item.id} className="flex justify-between text-body-sm">
              <span className="text-on-surface-variant">{item.qty}× {item.products?.name}</span>
              <span className="text-on-surface font-medium">R$ {(item.price_at_time * item.qty).toFixed(2).replace(".", ",")}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between text-on-surface font-bold mt-3 pt-3 border-t border-white/5">
          <span>Total</span>
          <span className="text-primary">R$ {order.total.toFixed(2).replace(".", ",")}</span>
        </div>
      </div>

      {/* Endereço de entrega */}
      <div className="glass-panel content-container mt-3 rounded-2xl p-4 flex items-start gap-3">
        <Icon name="location_on" className="text-lg text-primary shrink-0 mt-0.5" />
        <div className="min-w-0">
          <p className="text-label-md uppercase tracking-wider text-on-surface-variant mb-1">Endereço de entrega</p>
          <p className="text-on-surface text-body-sm">{order.delivery_address}</p>
          <p className="text-on-surface-variant text-label-md mt-1.5">
            {paymentLabels[order.payment_method]}
            {order.change_for && ` · Troco pra R$ ${order.change_for.toFixed(2).replace(".", ",")}`}
          </p>
        </div>
      </div>
    </div>
  );
}
