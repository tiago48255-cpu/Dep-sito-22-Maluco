import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { AlertTriangle } from "lucide-react";
import { StockEditor } from "@/components/admin/StockEditor";

export default async function AdminEstoquePage() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select("id, name, category, stock_qty, stock_min, active")
    .order("category")
    .order("name") as { data: { id: string, name: string, category: string, stock_qty: number, stock_min: number, active: boolean }[] | null };

  const lowStock = (products ?? []).filter((p) => p.stock_qty <= p.stock_min);

  return (
    <div>
      <h1 className="text-white font-bold text-2xl mb-6">Controle de Estoque</h1>

      {lowStock.length > 0 && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={18} className="text-red-400" />
            <h2 className="text-red-400 font-semibold">{lowStock.length} produto(s) com estoque baixo</h2>
          </div>
          <div className="flex flex-col gap-1">
            {lowStock.map((p) => (
              <p key={p.id} className="text-sm text-red-300">
                {p.name} — {p.stock_qty} restante(s) (mínimo: {p.stock_min})
              </p>
            ))}
          </div>
        </div>
      )}

      <Card className="divide-y divide-[#2A2A4A]">
        {(products ?? []).map((product) => (
          <div key={product.id} className="p-4 flex items-center gap-4">
            <div className="flex-1">
              <p className="text-white font-medium text-sm">{product.name}</p>
              <p className="text-[#9999BB] text-xs capitalize">{product.category}</p>
            </div>
            <StockEditor product={product} />
          </div>
        ))}
      </Card>
    </div>
  );
}
