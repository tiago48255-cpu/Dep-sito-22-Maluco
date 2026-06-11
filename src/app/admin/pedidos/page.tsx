import { createClient } from "@/lib/supabase/server";
import { StatusBadge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { OrderStatusUpdater } from "@/components/admin/OrderStatusUpdater";

export default async function AdminPedidosPage() {
  const supabase = await createClient();

  const { data: orders } = await supabase
    .from("orders")
    .select("*, profiles(name, phone), motoboys(name)")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div>
      <h1 className="text-white font-bold text-2xl mb-6">Pedidos</h1>

      <Card className="divide-y divide-[#2A2A4A]">
        {(orders ?? []).map((order) => (
          <div key={order.id} className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-white font-medium text-sm">#{order.id.slice(-8).toUpperCase()}</span>
                <StatusBadge status={order.status} />
              </div>
              <p className="text-[#9999BB] text-xs">{order.profiles?.name} · {order.delivery_address}</p>
              <p className="text-white font-bold text-sm mt-1">R$ {order.total.toFixed(2).replace(".", ",")}</p>
              <p className="text-[#9999BB] text-xs">
                {new Date(order.created_at).toLocaleString("pt-BR")}
                {order.motoboys && ` · Motoboy: ${order.motoboys.name}`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <OrderStatusUpdater orderId={order.id} currentStatus={order.status} />
              <Link
                href={`/admin/pedidos/${order.id}`}
                className="text-[#2233CC] text-sm hover:underline"
              >
                Detalhes
              </Link>
            </div>
          </div>
        ))}
        {(orders ?? []).length === 0 && (
          <p className="text-[#9999BB] text-sm p-4 text-center">Nenhum pedido ainda.</p>
        )}
      </Card>
    </div>
  );
}
