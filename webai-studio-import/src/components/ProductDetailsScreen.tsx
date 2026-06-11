import { useState } from 'react';
import { 
  ArrowLeft, 
  Heart, 
  Star, 
  Clock, 
  Thermometer, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Sparkles,
  Zap
} from 'lucide-react';
import { Product } from '../types';
import { PRODUCTS } from '../data';

interface ProductDetailsScreenProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (p: Product, quantity: number) => void;
  onSelectProduct: (p: Product) => void;
}

export default function ProductDetailsScreen({
  product,
  onBack,
  onAddToCart,
  onSelectProduct,
}: ProductDetailsScreenProps) {
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  // Recommendations mapping
  const recomendados = PRODUCTS.filter(p => p.id === 'doritos-nacho' || p.id === 'red-bull' || p.id === 'mix-aperitivo');

  const incrementQty = () => setQuantity(q => q + 1);
  const decrementQty = () => setQuantity(q => (q > 1 ? q - 1 : 1));

  const finalPrice = product.price * quantity;

  return (
    <div className="text-white min-h-[750px] pb-32 bg-black">
      {/* Top App Bar */}
      <header className="fixed top-0 w-full max-w-[600px] z-50 bg-neutral-950/85 backdrop-blur-xl border-b border-white/5 px-5 py-3 flex justify-between items-center h-16 select-none shadow">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-neutral-900 rounded-full transition-colors border-none bg-transparent cursor-pointer text-brand-primary"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest leading-none">Produto</span>
          <h1 className="text-xs font-bold text-white mt-1 capitalize">{product.category}s</h1>
        </div>
        <button 
          onClick={() => setIsFavorite(!isFavorite)}
          className="p-2 hover:bg-neutral-900 rounded-full transition-colors border-none bg-transparent cursor-pointer text-brand-primary"
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current text-rose-500' : 'text-brand-primary'}`} />
        </button>
      </header>

      {/* Main product high-fidelity section */}
      <div className="pt-16">
        {/* Cinematic Product Image spotlight with gradients */}
        <section className="relative w-full aspect-[4/5] overflow-hidden bg-[#0A0A0A] select-none">
          <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent z-10 pointer-events-none" />
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover object-center p-6 scale-95"
            referrerPolicy="no-referrer"
          />
          {/* Atmospheric Status Badges overlay */}
          <div className="absolute bottom-6 left-5 z-20 flex flex-wrap gap-2">
            {product.isGelada && (
              <span className="bg-brand-primary-container/30 backdrop-blur-md text-brand-primary text-xs font-bold px-3 py-1 rounded-full border border-brand-primary/20 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Geladaça</span>
              </span>
            )}
            {product.isTurbo && (
              <span className="bg-brand-secondary-container/30 backdrop-blur-md text-brand-secondary text-xs font-bold px-3 py-1 rounded-full border border-brand-secondary/20 flex items-center gap-1 animate-pulse">
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Entrega Turbo</span>
              </span>
            )}
          </div>
        </section>

        {/* Product Details Content */}
        <section className="px-5 flex flex-col gap-5 -mt-6 relative z-30 text-left">
          <div className="flex justify-between items-start gap-4">
            <div>
              <h2 className="text-xl font-bold font-sans text-white leading-tight">
                {product.name}
              </h2>
              <p className="text-xs text-neutral-400 font-semibold mt-1">
                {product.volume} • Cerveja Premium {product.subCategory || 'Lager'}
              </p>
            </div>
            
            <div className="flex items-center gap-1 bg-neutral-900 border border-white/5 px-2.5 py-1 rounded-lg shrink-0">
              <Star className="w-4 h-4 text-brand-tertiary fill-current" />
              <span className="text-sm font-black text-white">{product.rating.toFixed(1)}</span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 align-left">
            <span className="text-2xl font-black text-brand-primary">
              R$ {product.price.toFixed(2).replace('.', ',')}
            </span>
            <p className="text-xs text-neutral-400 leading-relaxed font-medium">
              {product.description}
            </p>
          </div>

          {/* Bento Info Grid details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-neutral-900 border border-white/5 p-4 rounded-xl flex flex-col gap-1.5">
              <Clock className="w-5 h-5 text-neutral-400" />
              <span className="text-[10px] uppercase tracking-wider font-bold text-neutral-500">Tempo Estimado</span>
              <span className="text-sm font-extrabold text-white">{product.estimatedTime || '15-25 min'}</span>
            </div>
            
            <div className="bg-neutral-900 border border-white/5 p-4 rounded-xl flex flex-col gap-1.5">
              <Thermometer className="w-5 h-5 text-brand-tertiary" />
              <span className="text-[10px] uppercase tracking-wider font-bold text-neutral-500">Temperatura</span>
              <span className="text-sm font-extrabold text-white">{product.temperature || '-2°C Ideal'}</span>
            </div>
          </div>

          {/* Cross-sell snacks accompaniments section */}
          <div className="mt-4 space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-black uppercase tracking-wider text-neutral-400">Acompanhamentos</h3>
              <span className="text-[10px] font-bold text-neutral-600">IDEAL PARA PAREAR</span>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 snap-x -mx-5 px-5 hide-scrollbar">
              {recomendados.map((item) => (
                <div
                  key={item.id}
                  className="min-w-[140px] bg-neutral-900 rounded-2xl border border-white/5 p-3 snap-start flex flex-col gap-2 shadow"
                >
                  <div 
                    onClick={() => onSelectProduct(item)}
                    className="w-full aspect-square bg-[#1A1A1A] rounded-xl overflow-hidden flex items-center justify-center cursor-pointer border border-white/5 p-1"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="max-h-full max-w-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="text-left py-0.5">
                    <span 
                      onClick={() => onSelectProduct(item)}
                      className="text-[11px] font-bold text-white block truncate leading-none cursor-pointer hover:text-brand-primary"
                    >
                      {item.name}
                    </span>
                    <span className="text-xs font-black text-brand-primary block mt-1">
                      R$ {item.price.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      onAddToCart(item, 1);
                      setQuantity(1); // resets quantity to be safe
                    }}
                    className="w-full bg-neutral-800 text-white font-bold text-[10px] uppercase py-2 rounded-lg border border-white/5 hover:bg-neutral-700 cursor-pointer transition-colors active:scale-95 flex items-center justify-center gap-1 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Adicionar</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Core footer branding */}
          <div className="flex flex-col items-center justify-center py-6 opacity-30 select-none">
            <span className="text-md font-black tracking-widest text-brand-primary">22 MALUCO</span>
            <p className="text-[9px] font-extrabold uppercase tracking-widest mt-0.5">Drink Responsibly</p>
          </div>
        </section>
      </div>

      {/* Quantity Selector & Add Button Action (Fixed Bar) */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-neutral-950/95 backdrop-blur-xl border-t border-white/5 z-50 flex justify-center">
        <div className="w-full max-w-[560px] flex gap-4 items-center">
          {/* Quantity Selector controls */}
          <div className="flex items-center bg-neutral-900 rounded-xl p-1 border border-white/5 h-14 select-none shadow">
            <button
              onClick={decrementQty}
              className="w-10 h-10 flex items-center justify-center text-white hover:text-brand-primary transition-colors bg-transparent border-none cursor-pointer p-0"
            >
              <Minus className="w-4.5 h-4.5" />
            </button>
            <span className="w-8 text-center text-base font-bold text-white">{quantity}</span>
            <button
              onClick={incrementQty}
              className="w-10 h-10 flex items-center justify-center text-white hover:text-brand-primary transition-colors bg-transparent border-none cursor-pointer p-0"
            >
              <Plus className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Big responsive horizontal gradient layout Action buttons */}
          <button
            onClick={() => {
              onAddToCart(product, quantity);
              onBack();
            }}
            className="flex-1 h-14 bg-gradient-to-r from-brand-primary-container to-brand-inverse-primary text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 border-none cursor-pointer shadow-royal-glow hover:opacity-95 transform active:scale-98 transition-all"
          >
            <ShoppingBag className="w-4.5 h-4.5 shrink-0" />
            <span>Adicionar ao carrinho</span>
            <span className="ml-1 text-xs opacity-65 font-normal">
              • R$ {finalPrice.toFixed(2).replace('.', ',')}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
