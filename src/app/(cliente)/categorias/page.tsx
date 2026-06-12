import { createClient } from "@/lib/supabase/server";
import { CategoryList } from "@/components/cliente/CategoryList";
import { CategoriesExplorer } from "@/components/cliente/CategoriesExplorer";
import type { Product } from "@/lib/types/queries";

export default async function CategoriasPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const { categoria } = await searchParams;
  const supabase = await createClient();

  if (categoria) {
    const { data: products } = (await supabase
      .from("products")
      .select("*")
      .eq("category", categoria)
      .eq("active", true)
      .order("name")) as { data: Product[] | null };

    return (
      <div className="text-white min-h-screen bg-black pb-24">
        <CategoryList products={products ?? []} categoria={categoria} />
      </div>
    );
  }

  const { data: rows } = (await supabase
    .from("products")
    .select("category")
    .eq("active", true)) as { data: { category: string }[] | null };

  const categories = [...new Set((rows ?? []).map((r) => r.category))].sort();

  return (
    <div className="text-white min-h-screen bg-black pb-24">
      <CategoriesExplorer categories={categories} />
    </div>
  );
}
