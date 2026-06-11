import { createClient } from "@/lib/supabase/server";
import { SplashOverlay } from "@/components/cliente/SplashOverlay";
import { HomeContent } from "@/components/cliente/HomeContent";
import type { Product } from "@/lib/types/queries";

export default async function HomePage() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .order("category")
    .order("name") as { data: Product[] | null };

  const { data: categoriesRaw } = await supabase
    .from("products")
    .select("category")
    .eq("active", true) as { data: { category: string }[] | null };

  const categories = [...new Set(categoriesRaw?.map((p) => p.category) ?? [])].sort();

  return (
    <>
      <SplashOverlay />
      <HomeContent products={products ?? []} categories={categories} />
    </>
  );
}
