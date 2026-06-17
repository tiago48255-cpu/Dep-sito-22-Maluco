import { createClient } from "@/lib/supabase/server";
import { Icon } from "@/components/ui/Icon";
import { StockEditor } from "@/components/admin/StockEditor";

export default async function AdminEstoquePage() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select("id, name, category, stock_qty, stock_min, active")
    .order("category")
    .order("name") as { data: { id: string; name: string; category: string; stock_qty: number; stock_min: number; active: boolean }[] | null };

  const lowStock = (products ?? []).filter((p) => p.stock_qty <= p.stock_min);

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Icon name="warehouse" className="text-3xl text-primary" />
        <h1 className="text-headline-lg text-on-surface">Controle de Estoque</h1>
      </div>

      {lowStock.length > 0 && (
        <div className="bg-secondary-container/15 border border-secondary-container/40 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Icon name="warning" className="text-xl text-secondary" />
            <h2 className="text-secondary font-bold text-body-md">{lowStock.length} produto(s) com estoque baixo</h2>
          </div>
          <div className="flex flex-col gap-1">
            {lowStock.map((p) => (
              <p key={p.id} className="text-body-sm text-on-secondary-container">
                {p.name} — {p.stock_qty} restante(s) (mínimo: {p.stock_min})
              </p>
            ))}
          </div>
        </div>
      )}

      <div className="glass-panel rounded-2xl overflow-hidden divide-y divide-white/5 border border-white/5">
        {(products ?? []).map((product) => (
          <div key={product.id} className="p-4 flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-on-surface font-bold text-body-sm">{product.name}</p>
              <p className="text-on-surface-variant text-label-md capitalize">{product.category}</p>
            </div>
            <StockEditor product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
