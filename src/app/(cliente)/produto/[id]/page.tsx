import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Star, Clock, Thermometer, Sparkles, Zap, Beer, Plus } from "lucide-react";
import { ProductAddBar } from "@/components/cliente/ProductAddBar";
import type { Product } from "@/lib/types/queries";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .eq("active", true)
    .single() as { data: Product | null };

  if (!product) notFound();

  const { data: related } = await supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .eq("category", product.category)
    .neq("id", product.id)
    .limit(5) as { data: Product[] | null };

  return (
    <div className="text-white min-h-screen pb-32 bg-black">
      {/* Top App Bar */}
      <header className="sticky top-0 z-40 bg-neutral-950/85 backdrop-blur-xl border-b border-white/5 px-5 py-3 flex justify-between items-center h-16 select-none">
        <Link
          href="/"
          className="p-2 hover:bg-neutral-900 rounded-full transition-colors text-brand-primary"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest leading-none">Produto</span>
          <h1 className="text-xs font-bold text-white mt-1 capitalize">{product.category}</h1>
        </div>
        <div className="w-9" />
      </header>

      {/* Product Image */}
      <section className="relative w-full aspect-[4/5] overflow-hidden bg-[#0A0A0A] select-none">
        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent z-10 pointer-events-none" />
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-contain p-6 scale-95"
            sizes="430px"
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Beer className="w-24 h-24 text-neutral-700" />
          </div>
        )}
        {/* Status badges */}
        <div className="absolute bottom-6 left-5 z-20 flex flex-wrap gap-2">
          <span className="bg-brand-primary-container/30 backdrop-blur-md text-brand-primary text-xs font-bold px-3 py-1 rounded-full border border-brand-primary/20 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>Geladaça</span>
          </span>
          <span className="bg-brand-secondary-container/30 backdrop-blur-md text-brand-secondary text-xs font-bold px-3 py-1 rounded-full border border-brand-secondary/20 flex items-center gap-1 animate-pulse">
            <Zap className="w-3 h-3 fill-current" />
            <span>Entrega Turbo</span>
          </span>
        </div>
      </section>

      {/* Product Details */}
      <section className="px-5 flex flex-col gap-5 -mt-6 relative z-30 text-left">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-white leading-tight">{product.name}</h2>
            <p className="text-xs text-neutral-400 font-semibold mt-1 capitalize">{product.category}</p>
          </div>
          <div className="flex items-center gap-1 bg-neutral-900 border border-white/5 px-2.5 py-1 rounded-lg shrink-0">
            <Star className="w-4 h-4 text-brand-tertiary fill-current" />
            <span className="text-sm font-black text-white">4.8</span>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-2xl font-black text-brand-primary">
            R$ {product.price.toFixed(2).replace(".", ",")}
          </span>
          {product.description && (
            <p className="text-xs text-neutral-400 leading-relaxed font-medium">{product.description}</p>
          )}
          {product.stock_qty === 0 && (
            <p className="text-xs text-brand-secondary font-bold">⚠ Produto fora de estoque</p>
          )}
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-neutral-900 border border-white/5 p-4 rounded-xl flex flex-col gap-1.5">
            <Clock className="w-5 h-5 text-neutral-400" />
            <span className="text-[10px] uppercase tracking-wider font-bold text-neutral-500">Tempo Estimado</span>
            <span className="text-sm font-extrabold text-white">15–25 min</span>
          </div>
          <div className="bg-neutral-900 border border-white/5 p-4 rounded-xl flex flex-col gap-1.5">
            <Thermometer className="w-5 h-5 text-brand-tertiary" />
            <span className="text-[10px] uppercase tracking-wider font-bold text-neutral-500">Temperatura</span>
            <span className="text-sm font-extrabold text-white">−2°C Ideal</span>
          </div>
        </div>

        {/* Related Products */}
        {related && related.length > 0 && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-black uppercase tracking-wider text-neutral-400">Você pode gostar</h3>
              <span className="text-[10px] font-bold text-neutral-600 uppercase">Mesma categoria</span>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-4 -mx-5 px-5 hide-scrollbar">
              {related.map((item) => (
                <div key={item.id} className="min-w-[130px] bg-neutral-900 rounded-2xl border border-white/5 p-3 shrink-0 flex flex-col gap-2">
                  <Link href={`/produto/${item.id}`}>
                    <div className="w-full aspect-square bg-[#1A1A1A] rounded-xl overflow-hidden flex items-center justify-center border border-white/5 relative">
                      {item.image_url ? (
                        <Image src={item.image_url} alt={item.name} fill className="object-contain p-1" sizes="130px" />
                      ) : (
                        <Beer className="w-8 h-8 text-neutral-700" />
                      )}
                    </div>
                  </Link>
                  <div className="text-left">
                    <Link href={`/produto/${item.id}`}>
                      <span className="text-[11px] font-bold text-white block truncate leading-none hover:text-brand-primary">
                        {item.name}
                      </span>
                    </Link>
                    <span className="text-xs font-black text-brand-primary block mt-1">
                      R$ {item.price.toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                  <Link
                    href={`/produto/${item.id}`}
                    className="w-full bg-neutral-800 text-white font-bold text-[10px] uppercase py-2 rounded-lg border border-white/5 hover:bg-neutral-700 transition-colors active:scale-95 flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Ver</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col items-center justify-center py-6 opacity-30 select-none">
          <span className="text-sm font-black tracking-widest text-brand-primary">22 MALUCO</span>
          <p className="text-[9px] font-extrabold uppercase tracking-widest mt-0.5">Drink Responsibly</p>
        </div>
      </section>

      {/* Fixed Bottom Bar */}
      <ProductAddBar product={product} />
    </div>
  );
}
