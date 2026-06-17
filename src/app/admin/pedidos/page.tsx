import { createClient } from "@/lib/supabase/server";
import { StatusBadge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
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
      <div className="flex items-center gap-3 mb-6">
        <Icon name="receipt_long" className="text-3xl text-primary" />
        <h1 className="text-headline-lg text-on-surface">Pedidos</h1>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden divide-y divide-white/5 border border-white/5">
        {(orders ?? []).map((order) => (
          <div key={order.id} className="p-4 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-surface-container/50 transition-colors">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-on-surface font-bold text-body-sm">#{order.id.slice(-8).toUpperCase()}</span>
                <StatusBadge status={order.status} />
              </div>
              <p className="text-on-surface-variant text-label-md flex items-center gap-1">
                <Icon name="person" className="text-sm" /> {order.profiles?.name ?? "Cliente"}
                <span className="mx-1">·</span>
                <Icon name="location_on" className="text-sm" /> <span className="truncate">{order.delivery_address}</span>
              </p>
              <p className="text-primary font-bold text-body-md mt-1">R$ {order.total.toFixed(2).replace(".", ",")}</p>
              <p className="text-on-surface-variant text-label-md">
                {new Date(order.created_at).toLocaleString("pt-BR")}
                {order.motoboys && ` · Motoboy: ${order.motoboys.name}`}
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <OrderStatusUpdater orderId={order.id} currentStatus={order.status} />
              <Link
                href={`/admin/pedidos/${order.id}`}
                className="text-primary text-label-lg hover:underline flex items-center gap-1"
              >
                Detalhes <Icon name="chevron_right" className="text-base" />
              </Link>
            </div>
          </div>
        ))}
        {(orders ?? []).length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 py-16">
            <Icon name="receipt_long" className="text-5xl text-outline-variant" />
            <p className="text-on-surface-variant text-body-sm">Nenhum pedido ainda.</p>
          </div>
        )}
      </div>
    </div>
  );
}
