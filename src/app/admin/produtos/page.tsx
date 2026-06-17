import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { ProductToggle } from "@/components/admin/ProductToggle";

export default async function AdminProdutosPage() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("category")
    .order("name");

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Icon name="inventory_2" className="text-3xl text-primary" />
          <h1 className="text-headline-lg text-on-surface">Produtos</h1>
        </div>
        <Link
          href="/admin/produtos/novo"
          className="btn-royal text-white text-label-lg px-4 py-2 rounded-xl flex items-center gap-2 active:scale-95 transition-all"
        >
          <Icon name="add" className="text-lg" /> Novo produto
        </Link>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden divide-y divide-white/5 border border-white/5">
        {(products ?? []).map((product) => (
          <div key={product.id} className="p-4 flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-on-surface font-bold text-body-sm">{product.name}</p>
              <p className="text-on-surface-variant text-label-md capitalize">
                {product.category} · R$ {product.price.toFixed(2).replace(".", ",")} · Estoque: {product.stock_qty}
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <ProductToggle productId={product.id} active={product.active} />
              <Link href={`/admin/produtos/${product.id}`} className="text-primary text-label-lg hover:underline">
                Editar
              </Link>
            </div>
          </div>
        ))}
        {(products ?? []).length === 0 && (
          <p className="text-on-surface-variant text-body-sm p-4 text-center">Nenhum produto cadastrado.</p>
        )}
      </div>
    </div>
  );
}
