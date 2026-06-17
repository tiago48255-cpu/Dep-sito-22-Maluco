import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
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
    <div className="text-on-surface min-h-screen pb-32 md:pb-8">
      {/* Top app bar — mobile */}
      <header className="page-header md:hidden">
        <Link href="/" className="p-2 hover:bg-surface-container rounded-full transition-colors text-on-surface-variant hover:text-on-surface shrink-0">
          <Icon name="arrow_back" className="text-xl" />
        </Link>
        <div className="flex flex-col items-center flex-1 text-center">
          <span className="text-label-sm text-on-surface-variant uppercase tracking-widest leading-none">Produto</span>
          <h1 className="text-label-lg text-on-surface mt-0.5 capitalize">{product.category}</h1>
        </div>
        <button className="p-2 text-on-surface-variant hover:text-secondary transition-colors shrink-0">
          <Icon name="favorite" className="text-xl" />
        </button>
      </header>

      {/* Desktop: lado a lado | Mobile: pilha vertical */}
      <div className="md:flex md:gap-8 content-container md:pt-8">
        {/* Imagem */}
        <section className="relative w-full md:w-1/2 md:max-w-[560px] aspect-[4/5] md:aspect-square overflow-hidden bg-surface-container-lowest select-none md:rounded-2xl md:shrink-0">
          <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black via-black/60 to-transparent z-10 pointer-events-none md:hidden" />
          {product.image_url ? (
            <Image src={product.image_url} alt={product.name} fill className="object-contain p-6 scale-95" sizes="(max-width: 768px) 100vw, 50vw" priority />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Icon name="sports_bar" className="text-7xl text-outline-variant" />
            </div>
          )}
          <div className="absolute bottom-6 left-5 z-20 flex flex-wrap gap-2">
            <span className="bg-primary-container/30 backdrop-blur-md text-primary text-label-md px-3 py-1 rounded-full border border-primary/20 flex items-center gap-1">
              <Icon name="ac_unit" className="text-sm" />
              <span>Geladaça</span>
            </span>
            <span className="bg-secondary-container/30 backdrop-blur-md text-secondary text-label-md px-3 py-1 rounded-full border border-secondary/20 flex items-center gap-1">
              <Icon name="bolt" filled className="text-sm" />
              <span>Entrega Turbo</span>
            </span>
          </div>
        </section>

        {/* Detalhes */}
        <section className="flex-1 flex flex-col gap-5 -mt-6 md:mt-0 relative z-30 text-left px-5 md:px-0">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 min-w-0">
              <h2 className="text-headline-sm md:text-headline-md text-on-surface leading-tight">{product.name}</h2>
              <p className="text-label-md text-on-surface-variant mt-1 capitalize">{product.category}</p>
            </div>
            <div className="flex items-center gap-1 bg-surface-container border border-white/5 px-2.5 py-1 rounded-lg shrink-0">
              <Icon name="star" filled className="text-base text-tertiary" />
              <span className="text-body-sm font-bold text-on-surface">4.8</span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-headline-md md:text-headline-lg text-primary">R$ {product.price.toFixed(2).replace(".", ",")}</span>
            {product.description && (
              <p className="text-body-sm text-on-surface-variant leading-relaxed">{product.description}</p>
            )}
            {product.stock_qty === 0 && (
              <p className="text-body-sm text-secondary font-bold flex items-center gap-1">
                <Icon name="warning" className="text-base" /> Produto fora de estoque
              </p>
            )}
          </div>

          {/* Seletor de quantidade + Adicionar (desktop na coluna; mobile vira barra fixa) */}
          <ProductAddBar product={product} />

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-container border border-white/5 p-4 rounded-xl flex flex-col gap-1.5">
              <Icon name="schedule" className="text-xl text-on-surface-variant" />
              <span className="text-label-sm uppercase tracking-wider text-on-surface-variant">Tempo Estimado</span>
              <span className="text-body-sm font-bold text-on-surface">15–25 min</span>
            </div>
            <div className="bg-surface-container border border-white/5 p-4 rounded-xl flex flex-col gap-1.5">
              <Icon name="device_thermostat" className="text-xl text-tertiary" />
              <span className="text-label-sm uppercase tracking-wider text-on-surface-variant">Temperatura</span>
              <span className="text-body-sm font-bold text-on-surface">−2°C Ideal</span>
            </div>
          </div>

          {/* Relacionados */}
          {related && related.length > 0 && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-label-lg uppercase tracking-wider text-on-surface-variant">Você pode gostar</h3>
                <span className="text-label-md text-on-surface-variant uppercase">Mesma categoria</span>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-4 -mx-5 px-5 md:mx-0 md:px-0 hide-scrollbar">
                {related.map((item) => (
                  <div key={item.id} className="min-w-[130px] bg-surface-container rounded-2xl border border-white/5 p-3 shrink-0 flex flex-col gap-2">
                    <Link href={`/produto/${item.id}`}>
                      <div className="w-full aspect-square bg-surface-container-high rounded-xl overflow-hidden flex items-center justify-center border border-white/5 relative">
                        {item.image_url ? (
                          <Image src={item.image_url} alt={item.name} fill className="object-contain p-1" sizes="130px" />
                        ) : (
                          <Icon name="sports_bar" className="text-3xl text-outline-variant" />
                        )}
                      </div>
                    </Link>
                    <div className="text-left">
                      <Link href={`/produto/${item.id}`}>
                        <span className="text-label-md font-bold text-on-surface block truncate leading-none hover:text-primary">{item.name}</span>
                      </Link>
                      <span className="text-body-sm font-bold text-primary block mt-1">R$ {item.price.toFixed(2).replace(".", ",")}</span>
                    </div>
                    <Link href={`/produto/${item.id}`} className="w-full bg-surface-container-high text-on-surface text-label-md uppercase py-2 rounded-lg border border-white/5 hover:bg-surface-container-highest transition-colors active:scale-95 flex items-center justify-center gap-1">
                      <Icon name="visibility" className="text-sm" />
                      <span>Ver</span>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col items-center justify-center py-6 opacity-30 select-none">
            <span className="text-label-lg tracking-widest text-primary">22 MALUCO</span>
            <p className="text-label-sm uppercase tracking-widest mt-0.5">Beba com responsabilidade</p>
          </div>
        </section>
      </div>
    </div>
  );
}
