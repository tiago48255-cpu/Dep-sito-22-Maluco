import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/Badge";
import { ShoppingBag, TrendingUp, AlertTriangle, Clock } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [ordersToday, openOrders, lowStockAlerts, recentOrders] = await Promise.all([
    supabase
      .from("orders")
      .select("total", { count: "exact" })
      .gte("created_at", today.toISOString()),
    supabase
      .from("orders")
      .select("id", { count: "exact" })
      .in("status", ["pendente", "aceito", "preparando", "saiu"]),
    supabase
      .from("stock_alerts")
      .select("id", { count: "exact" })
      .eq("resolved", false),
    supabase
      .from("orders")
      .select("id, status, total, delivery_address, created_at, profiles(name)")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const faturamentoHoje = (ordersToday.data ?? []).reduce((acc, o) => acc + o.total, 0);

  const stats = [
    {
      label: "Faturamento hoje",
      value: `R$ ${faturamentoHoje.toFixed(2).replace(".", ",")}`,
      icon: TrendingUp,
      color: "text-green-400",
    },
    {
      label: "Pedidos hoje",
      value: String(ordersToday.count ?? 0),
      icon: ShoppingBag,
      color: "text-[#2233CC]",
    },
    {
      label: "Pedidos em aberto",
      value: String(openOrders.count ?? 0),
      icon: Clock,
      color: "text-yellow-400",
    },
    {
      label: "Alertas de estoque",
      value: String(lowStockAlerts.count ?? 0),
      icon: AlertTriangle,
      color: "text-[#DD0000]",
    },
  ];

  return (
    <div>
      <h1 className="text-white font-bold text-2xl mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-4">
            <div className={`${stat.color} mb-2`}>
              <stat.icon size={20} />
            </div>
            <p className="text-white font-bold text-2xl">{stat.value}</p>
            <p className="text-[#9999BB] text-sm mt-0.5">{stat.label}</p>
          </Card>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold">Pedidos recentes</h2>
          <Link href="/admin/pedidos" className="text-[#2233CC] text-sm hover:underline">
            Ver todos
          </Link>
        </div>
        <Card className="divide-y divide-[#2A2A4A]">
          {(recentOrders.data ?? []).map((order) => (
            <Link
              key={order.id}
              href={`/admin/pedidos/${order.id}`}
              className="flex items-center justify-between p-4 hover:bg-[#1A1A38] transition-colors"
            >
              <div>
                <p className="text-white text-sm font-medium">
                  #{order.id.slice(-8).toUpperCase()}
                </p>
                <p className="text-[#9999BB] text-xs">{order.delivery_address.slice(0, 30)}...</p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={order.status} />
                <span className="text-white font-medium text-sm">
                  R$ {order.total.toFixed(2).replace(".", ",")}
                </span>
              </div>
            </Link>
          ))}
          {(recentOrders.data ?? []).length === 0 && (
            <p className="text-[#9999BB] text-sm p-4 text-center">Nenhum pedido ainda.</p>
          )}
        </Card>
      </div>
    </div>
  );
}
