import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, Package, Truck, Settings } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/Badge";
import { OrderStatusEditor } from "@/components/admin/OrderStatusEditor";
import { DriverAssigner } from "@/components/admin/DriverAssigner";

const paymentLabels: Record<string, string> = {
  pix: "PIX",
  credito: "Cartão de Crédito",
  debito: "Cartão de Débito",
  dinheiro: "Dinheiro",
};

export default async function PedidoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: order } = await supabase
    .from("orders")
    .select(
      "*, profiles(name, phone, address_default), motoboys(name, phone), order_items(*, products(name))"
    )
    .eq("id", id)
    .single();

  if (!order) notFound();

  const { data: drivers } = await supabase
    .from("motoboys")
    .select("id, name")
    .eq("active", true)
    .order("name");

  const items = (order.order_items ?? []) as Array<{
    id: string;
    qty: number;
    price_at_time: number;
    products: { name: string } | null;
  }>;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/pedidos"
          className="flex items-center gap-1.5 text-[#9999BB] hover:text-white transition-colors text-sm"
        >
          <ArrowLeft size={16} />
          Voltar
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="text-white font-bold text-xl">
            Pedido #{order.id.slice(-8).toUpperCase()}
          </h1>
          <StatusBadge status={order.status} />
        </div>
        <p className="text-[#9999BB] text-xs ml-auto">
          {new Date(order.created_at).toLocaleString("pt-BR")}
        </p>
      </div>

      <div className="space-y-4">
        {/* Cliente */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <User size={16} className="text-[#2233CC]" />
            <h2 className="text-white font-semibold text-sm">Cliente</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <p className="text-[#9999BB] text-xs mb-0.5">Nome</p>
              <p className="text-white text-sm">{order.profiles?.name ?? "—"}</p>
            </div>
            <div>
              <p className="text-[#9999BB] text-xs mb-0.5">Telefone</p>
              <p className="text-white text-sm">{order.profiles?.phone ?? "—"}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-[#9999BB] text-xs mb-0.5">Endereço de entrega</p>
              <p className="text-white text-sm">{order.delivery_address}</p>
            </div>
          </div>
        </Card>

        {/* Itens */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Package size={16} className="text-[#2233CC]" />
            <h2 className="text-white font-semibold text-sm">Itens do pedido</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-[#9999BB] font-medium text-left pb-2">Produto</th>
                <th className="text-[#9999BB] font-medium text-center pb-2 w-16">Qtd</th>
                <th className="text-[#9999BB] font-medium text-right pb-2 w-24">Preço</th>
                <th className="text-[#9999BB] font-medium text-right pb-2 w-24">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-white/5 last:border-0">
                  <td className="text-white py-2.5">{item.products?.name ?? "Produto removido"}</td>
                  <td className="text-white text-center py-2.5">{item.qty}</td>
                  <td className="text-white text-right py-2.5">
                    R$ {item.price_at_time.toFixed(2).replace(".", ",")}
                  </td>
                  <td className="text-white text-right py-2.5 font-medium">
                    R$ {(item.qty * item.price_at_time).toFixed(2).replace(".", ",")}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} className="text-[#9999BB] text-right pt-3 font-medium">
                  Total
                </td>
                <td className="text-white text-right pt-3 font-bold text-base">
                  R$ {order.total.toFixed(2).replace(".", ",")}
                </td>
              </tr>
            </tfoot>
          </table>
        </Card>

        {/* Logística */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Truck size={16} className="text-[#2233CC]" />
            <h2 className="text-white font-semibold text-sm">Logística</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <p className="text-[#9999BB] text-xs mb-1">Entregador</p>
              <DriverAssigner
                orderId={order.id}
                current={order.motoboy_id}
                motoboys={drivers ?? []}
              />
              {order.motoboys?.phone && (
                <p className="text-[#9999BB] text-xs mt-1">{order.motoboys.phone}</p>
              )}
              {order.status === "saiu" && !order.motoboy_id && (
                <p className="text-amber-400/90 text-xs mt-1.5">
                  ⚠ Pedido a caminho sem entregador atribuído — selecione um acima.
                </p>
              )}
            </div>
            <div>
              <p className="text-[#9999BB] text-xs mb-0.5">Forma de pagamento</p>
              <p className="text-white text-sm">
                {paymentLabels[order.payment_method] ?? order.payment_method}
              </p>
              {order.payment_method === "dinheiro" && order.change_for && (
                <p className="text-[#9999BB] text-xs mt-0.5">
                  Troco para R$ {order.change_for.toFixed(2).replace(".", ",")}
                </p>
              )}
            </div>
            {order.notes && (
              <div className="sm:col-span-2">
                <p className="text-[#9999BB] text-xs mb-0.5">Observações</p>
                <p className="text-white text-sm">{order.notes}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Atualizar status */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Settings size={16} className="text-[#2233CC]" />
            <h2 className="text-white font-semibold text-sm">Atualizar status</h2>
          </div>
          <OrderStatusEditor orderId={order.id} currentStatus={order.status} />
        </Card>
      </div>
    </div>
  );
}
