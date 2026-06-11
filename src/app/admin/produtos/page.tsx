import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { Plus } from "lucide-react";
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
        <h1 className="text-white font-bold text-2xl">Produtos</h1>
        <Link
          href="/admin/produtos/novo"
          className="flex items-center gap-2 bg-[#2233CC] hover:bg-[#1a28a8] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={16} /> Novo produto
        </Link>
      </div>

      <Card className="divide-y divide-[#2A2A4A]">
        {(products ?? []).map((product) => (
          <div key={product.id} className="p-4 flex items-center gap-4">
            <div className="flex-1">
              <p className="text-white font-medium text-sm">{product.name}</p>
              <p className="text-[#9999BB] text-xs capitalize">
                {product.category} · R$ {product.price.toFixed(2).replace(".", ",")} · Estoque: {product.stock_qty}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <ProductToggle productId={product.id} active={product.active} />
              <Link
                href={`/admin/produtos/${product.id}`}
                className="text-[#2233CC] text-sm hover:underline"
              >
                Editar
              </Link>
            </div>
          </div>
        ))}
        {(products ?? []).length === 0 && (
          <p className="text-[#9999BB] text-sm p-4 text-center">Nenhum produto cadastrado.</p>
        )}
      </Card>
    </div>
  );
}
