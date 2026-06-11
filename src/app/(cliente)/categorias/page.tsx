import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
  Beer,
  Wine,
  Coffee,
  Zap,
  Snowflake,
  Droplets,
  Package,
  Sparkles,
} from "lucide-react";
import { CategoryList } from "@/components/cliente/CategoryList";
import type { Product } from "@/lib/types/queries";

interface CategoryConfig {
  icon: React.ReactNode;
  label: string;
  description: string;
  gradient: string;
}

const categoryConfig: Record<string, CategoryConfig> = {
  cerveja: {
    icon: <Beer className="w-6 h-6 text-brand-primary" />,
    label: "Cervejas",
    description: "As mais geladas da região",
    gradient: "from-yellow-900/30 to-amber-950/40",
  },
  destilado: {
    icon: <Coffee className="w-6 h-6 text-brand-primary" />,
    label: "Destilados",
    description: "Whisky, Gin, Vodka e mais",
    gradient: "from-amber-900/30 to-orange-950/40",
  },
  vinho: {
    icon: <Wine className="w-6 h-6 text-brand-primary" />,
    label: "Vinhos",
    description: "Tinto, branco e espumante",
    gradient: "from-rose-900/30 to-red-950/40",
  },
  energético: {
    icon: <Zap className="w-6 h-6 text-brand-primary" />,
    label: "Energéticos",
    description: "Red Bull e muito mais",
    gradient: "from-blue-900/30 to-indigo-950/40",
  },
  refrigerante: {
    icon: <Droplets className="w-6 h-6 text-brand-primary" />,
    label: "Refrigerantes",
    description: "Coca, Guaraná e outros",
    gradient: "from-red-900/30 to-rose-950/40",
  },
  gelo: {
    icon: <Snowflake className="w-6 h-6 text-brand-primary" />,
    label: "Gelo",
    description: "Sempre fresquinho",
    gradient: "from-cyan-900/30 to-sky-950/40",
  },
  água: {
    icon: <Droplets className="w-6 h-6 text-brand-primary" />,
    label: "Água",
    description: "Mineral e com gás",
    gradient: "from-sky-900/30 to-blue-950/40",
  },
  combo: {
    icon: <Package className="w-6 h-6 text-brand-primary" />,
    label: "Combos",
    description: "Mais por menos",
    gradient: "from-purple-900/30 to-indigo-950/40",
  },
};

function getCfg(cat: string): CategoryConfig {
  return categoryConfig[cat] ?? {
    icon: <Sparkles className="w-6 h-6 text-brand-primary" />,
    label: cat.charAt(0).toUpperCase() + cat.slice(1),
    description: "Ver produtos",
    gradient: "from-neutral-800/30 to-neutral-900/40",
  };
}

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
  const featured = categories[0] as string | undefined;
  const rest = categories.slice(1);
  const featuredCfg = featured ? getCfg(featured) : null;

  return (
    <div className="text-white min-h-screen bg-black pb-24">
      <header className="sticky top-0 z-40 bg-neutral-950/90 backdrop-blur-xl border-b border-white/5 px-5 py-3 flex items-center h-16 select-none">
        <div className="flex flex-col text-left">
          <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest leading-none">
            Explorar
          </span>
          <h1 className="text-xs font-bold text-white mt-1">Categorias</h1>
        </div>
      </header>

      <main className="px-5 pt-5 pb-8 space-y-6">
        <h2 className="text-2xl font-extrabold tracking-tight text-white leading-snug">
          O que vamos<br />beber hoje?
        </h2>

        <div className="grid grid-cols-2 gap-4">
          {/* Featured — full width */}
          {featured && featuredCfg && (
            <Link
              href={`/categorias?categoria=${featured}`}
              className="col-span-2 glass-panel rounded-2xl overflow-hidden relative group cursor-pointer active:scale-[0.98] transition-transform duration-200 h-44"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${featuredCfg.gradient}`} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.06]">
                <div className="scale-[10]">{featuredCfg.icon}</div>
              </div>
              <div className="absolute bottom-4 left-4 z-10">
                <h3 className="text-lg font-extrabold text-white">{featuredCfg.label}</h3>
                <p className="text-xs text-brand-primary font-semibold mt-0.5">
                  {featuredCfg.description}
                </p>
              </div>
              <div className="absolute top-4 right-4 z-10 bg-brand-primary-container/40 backdrop-blur-md px-3 py-1 rounded-full border border-brand-primary/20">
                <span className="text-[10px] font-black uppercase text-brand-primary tracking-wide">
                  Destaques
                </span>
              </div>
            </Link>
          )}

          {/* Rest — square cards */}
          {rest.map((cat) => {
            const cfg = getCfg(cat);
            return (
              <Link
                key={cat}
                href={`/categorias?categoria=${cat}`}
                className="glass-panel rounded-2xl p-4 flex flex-col justify-between aspect-square group cursor-pointer active:scale-[0.98] transition-transform duration-200"
              >
                <div className="w-12 h-12 bg-neutral-900 rounded-xl flex items-center justify-center border border-white/5 group-hover:bg-brand-primary-container/30 transition-colors">
                  {cfg.icon}
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">{cfg.label}</h3>
                  <p className="text-[10px] text-neutral-400 mt-1">{cfg.description}</p>
                </div>
              </Link>
            );
          })}

          {categories.length === 0 && (
            <div className="col-span-2 py-20 text-center">
              <Beer className="w-16 h-16 text-neutral-700 mx-auto mb-3" />
              <p className="text-neutral-500 text-sm">Nenhuma categoria disponível.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
