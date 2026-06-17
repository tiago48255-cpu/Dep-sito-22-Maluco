import { createClient } from "@/lib/supabase/server";
import { StatusBadge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import Link from "next/link";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [ordersToday, openOrders, lowStockAlerts, recentOrders] = await Promise.all([
    supabase.from("orders").select("total", { count: "exact" }).gte("created_at", today.toISOString()),
    supabase.from("orders").select("id", { count: "exact" }).in("status", ["pendente", "aceito", "preparando", "saiu"]),
    supabase.from("stock_alerts").select("id", { count: "exact" }).eq("resolved", false),
    supabase.from("orders").select("id, status, total, delivery_address, created_at, profiles(name)").order("created_at", { ascending: false }).limit(5),
  ]);

  const faturamentoHoje = (ordersToday.data ?? []).reduce((acc, o) => acc + o.total, 0);

  const stats = [
    { label: "Faturamento hoje", value: `R$ ${faturamentoHoje.toFixed(2).replace(".", ",")}`, icon: "trending_up", color: "text-green-400" },
    { label: "Pedidos hoje", value: String(ordersToday.count ?? 0), icon: "receipt_long", color: "text-primary" },
    { label: "Pedidos em aberto", value: String(openOrders.count ?? 0), icon: "schedule", color: "text-tertiary" },
    { label: "Alertas de estoque", value: String(lowStockAlerts.count ?? 0), icon: "warning", color: "text-secondary" },
  ];

  return (
    <div>
      <h1 className="text-headline-lg text-on-surface mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="glass-panel rounded-2xl p-4 border border-white/5">
            <Icon name={stat.icon} className={`text-2xl mb-2 ${stat.color}`} />
            <p className="text-on-surface font-bold text-headline-md">{stat.value}</p>
            <p className="text-on-surface-variant text-body-sm mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-headline-sm text-on-surface">Pedidos recentes</h2>
          <Link href="/admin/pedidos" className="text-primary text-label-lg hover:underline">Ver todos</Link>
        </div>
        <div className="glass-panel rounded-2xl overflow-hidden divide-y divide-white/5 border border-white/5">
          {(recentOrders.data ?? []).map((order) => (
            <Link key={order.id} href={`/admin/pedidos/${order.id}`} className="flex items-center justify-between p-4 hover:bg-surface-container/50 transition-colors">
              <div className="min-w-0">
                <p className="text-on-surface text-body-sm font-bold">#{order.id.slice(-8).toUpperCase()}</p>
                <p className="text-on-surface-variant text-label-md truncate">{order.delivery_address}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <StatusBadge status={order.status} />
                <span className="text-primary font-bold text-body-sm">R$ {order.total.toFixed(2).replace(".", ",")}</span>
              </div>
            </Link>
          ))}
          {(recentOrders.data ?? []).length === 0 && (
            <p className="text-on-surface-variant text-body-sm p-4 text-center">Nenhum pedido ainda.</p>
          )}
        </div>
      </div>
    </div>
  );
}
