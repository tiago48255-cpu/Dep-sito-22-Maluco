import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Receipt } from "lucide-react";
import { OrderCard } from "@/components/cliente/OrderCard";
import type { OrderStatus } from "@/lib/types/database";

interface OrderRow {
  id: string;
  status: OrderStatus;
  total: number;
  created_at: string;
  order_items: { qty: number; products: { name: string } | null }[];
}

const tabs = [
  { label: "Todos", value: "" },
  { label: "Entregues", value: "entregue" },
  { label: "A caminho", value: "saiu" },
];

export default async function PedidosPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirect=/pedidos");

  let query = supabase
    .from("orders")
    .select("id, status, total, created_at, order_items(qty, products(name))")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }

  const { data: orders } = await query as { data: OrderRow[] | null };

  return (
    <div className="text-white min-h-screen bg-black pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-neutral-950/95 backdrop-blur-xl border-b border-white/5 px-5 py-3 flex items-center h-16 select-none">
        <h1 className="text-base font-bold text-white">Meus pedidos</h1>
      </header>

      {/* Filter Tabs */}
      <div className="flex gap-2 px-5 pt-4 overflow-x-auto hide-scrollbar">
        {tabs.map((tab) => (
          <Link
            key={tab.value}
            href={tab.value ? `/pedidos?status=${tab.value}` : "/pedidos"}
            className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all border ${
              status === tab.value || (!status && tab.value === "")
                ? "bg-brand-primary-container border-brand-primary/30 text-white"
                : "bg-transparent border-white/10 text-neutral-400 hover:border-white/20"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Orders List */}
      <main className="px-5 pt-4 space-y-3">
        {orders && orders.length > 0 ? (
          <>
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                id={order.id}
                shortId={order.id.slice(-8).toUpperCase()}
                date={new Date(order.created_at).toLocaleString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                status={order.status}
                items={order.order_items.map((i) => ({ name: i.products?.name ?? "Produto", qty: i.qty }))}
                total={order.total}
              />
            ))}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Receipt className="w-16 h-16 text-neutral-700" />
            <h2 className="text-white font-bold text-lg">Nenhum pedido encontrado</h2>
            <p className="text-neutral-500 text-sm text-center">
              {status ? "Tente remover o filtro." : "Faça seu primeiro pedido!"}
            </p>
            <Link
              href="/"
              className="btn-gradient shadow-royal-glow text-white font-bold text-sm rounded-xl px-8 py-3 active:scale-[0.96] transition-all"
            >
              Fazer novo pedido
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
