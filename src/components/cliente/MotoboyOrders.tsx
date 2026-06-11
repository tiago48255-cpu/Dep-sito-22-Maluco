"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MapPin, Phone, CheckCircle } from "lucide-react";

interface Order {
  id: string;
  delivery_address: string;
  total: number;
  payment_method: string;
  change_for: number | null;
  notes: string | null;
  profiles: { name: string; phone: string } | null;
  order_items: { qty: number; price_at_time: number; products: { name: string } | null }[];
}

export function MotoboyOrders({ orders }: { orders: Order[] }) {
  const router = useRouter();

  async function markDelivered(orderId: string) {
    const supabase = createClient();
    await supabase
      .from("orders")
      .update({ status: "entregue" })
      .eq("id", orderId);
    router.refresh();
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-16 text-[#9999BB]">
        <p className="text-4xl mb-3">🛵</p>
        <p>Nenhum pedido aguardando entrega.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {orders.map((order) => (
        <Card key={order.id} className="p-4">
          <div className="flex items-start justify-between mb-3">
            <p className="text-white font-bold">#{order.id.slice(-8).toUpperCase()}</p>
            <span className="text-[#9999BB] text-sm capitalize">{order.payment_method}</span>
          </div>

          <div className="flex items-start gap-2 mb-2">
            <MapPin size={16} className="text-[#9999BB] mt-0.5 flex-shrink-0" />
            <p className="text-white text-sm">{order.delivery_address}</p>
          </div>

          {order.profiles?.phone && (
            <div className="flex items-center gap-2 mb-2">
              <Phone size={16} className="text-[#9999BB]" />
              <p className="text-[#9999BB] text-sm">{order.profiles.name} · {order.profiles.phone}</p>
            </div>
          )}

          <div className="bg-[#0A0A1A] rounded-lg p-3 mb-3 text-sm text-[#9999BB]">
            {order.order_items.map((item, i) => (
              <p key={i}>{item.qty}x {item.products?.name}</p>
            ))}
            <p className="text-white font-bold mt-2">Total: R$ {order.total.toFixed(2).replace(".", ",")}</p>
            {order.change_for && (
              <p className="text-yellow-400">Troco pra R$ {order.change_for.toFixed(2).replace(".", ",")}</p>
            )}
          </div>

          {order.notes && (
            <p className="text-[#9999BB] text-xs bg-[#2A2A4A]/50 rounded p-2 mb-3">📝 {order.notes}</p>
          )}

          <Button
            onClick={() => markDelivered(order.id)}
            variant="primary"
            className="w-full gap-2"
          >
            <CheckCircle size={16} /> Confirmar entrega
          </Button>
        </Card>
      ))}
    </div>
  );
}
