import { useState } from 'react';
import { 
  MapPin, 
  ShoppingCart, 
  Search, 
  Beer, 
  Wine, 
  IceCream, 
  Utensils, 
  TrendingUp, 
  Plus, 
  MessageCircle, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Product, CartItem } from '../types';
import { CATEGORIES } from '../data';

interface HomeScreenProps {
  products: Product[];
  cartCount: number;
  deliveryAddress: string;
  onSelectProduct: (p: Product) => void;
  onAddToCart: (p: Product) => void;
  onNavigateToCart: () => void;
  onNavigateToCategory: (categoryId: string) => void;
  onNavigateToProfile: () => void;
  onOpenAddressChange: () => void;
}

export default function HomeScreen({
  products,
  cartCount,
  deliveryAddress,
  onSelectProduct,
  onAddToCart,
  onNavigateToCart,
  onNavigateToCategory,
  onNavigateToProfile,
  onOpenAddressChange,
}: HomeScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // We filter the main lists dynamically based on search
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const featured = filteredProducts.filter(p => p.id === 'heineken-ln' || p.id === 'budweiser-ln');
  const bestSellers = filteredProducts.filter(p => p.id === 'skol-beats-senses' || p.id === 'jack-daniels');

  // Helper to map dynamic categories icons
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'sports_bar': return <Beer className="w-6 h-6 text-brand-primary" />;
      case 'liquor': return <Sparkles className="w-6 h-6 text-brand-primary" />;
      case 'wine_bar': return <Wine className="w-6 h-6 text-brand-primary" />;
      case 'ac_unit': return <IceCream className="w-6 h-6 text-brand-primary" />;
      default: return <Utensils className="w-6 h-6 text-brand-primary" />;
    }
  };

  return (
    <div className="text-white min-h-[750px] pb-24">
      {/* Top App Bar */}
      <header className="sticky top-0 z-40 bg-neutral-950/90 backdrop-blur-xl border-b border-white/5 px-5 py-3.5 flex justify-between items-center h-16 select-none">
        <button 
          onClick={onOpenAddressChange}
          className="flex items-center gap-2 max-w-[70%] hover:opacity-85 text-left border-none bg-transparent cursor-pointer p-0"
        >
          <MapPin className="w-5 h-5 text-brand-primary shrink-0" />
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider leading-none">Entregar em:</span>
            <span className="text-xs text-white truncate font-semibold mt-0.5">{deliveryAddress}</span>
          </div>
        </button>

        <button 
          onClick={onNavigateToCart}
          className="relative w-10 h-10 flex items-center justify-center rounded-full bg-neutral-900 border border-white/10 hover:border-brand-primary/45 transition-colors cursor-pointer"
        >
          <ShoppingCart className="w-4.5 h-4.5 text-white" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-brand-secondary-container text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black animate-pulse border border-black">
              {cartCount}
            </span>
          )}
        </button>
      </header>

      {/* Main Home Content */}
      <main className="px-5 pt-5 space-y-6">
        {/* Real-time Search Input */}
        <section>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-neutral-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar bebidas, marcas..."
              className="w-full bg-[#111] border-none text-white rounded-xl py-3.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-brand-primary transition-all duration-300 placeholder:text-neutral-600 font-medium"
            />
          </div>
        </section>

        {/* Dynamic Marketing Promo Banner */}
        <section 
          onClick={() => onNavigateToCategory('cerveja')}
          className="relative h-44 w-full rounded-2xl overflow-hidden shadow-neon-blue group cursor-pointer select-none"
        >
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDukaCOVnqjlZDYp12Rq9aVkBuOTbXBAidl-YTyygBZiamEie2k6czmYDbprR_xuJXhOe-v6yJreZ4xYGqxGSQdc90VXEr6yTSp37fDYiNQJC-NU9bDImPNFAYaXXJyPiqip-FfGQToSqNUCqqmbMGkCDiImgaedeoydlo1y7uDUiukeCGR-rDzuxJu7PiLteb4QltW7E8CpSjxQvVNHGDIQ5uogewf1QsS90wfTeSsquky4YVKiqT1r57vAhWgnIjoS5LTIeeK2UY"
            alt="PROMOÇÃO GELADA"
            className="w-full h-full object-cover transition-transform duration-750 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent flex flex-col justify-center px-6">
            <h2 className="text-xl font-extrabold text-white leading-tight uppercase tracking-tight">
              GELADA, RÁPIDA<br />E NA SUA CASA!
            </h2>
            <div className="flex items-center gap-2 mt-2.5">
              <span className="bg-brand-secondary-container text-white px-2 py-0.5 rounded text-[10px] font-black tracking-wider uppercase">
                24 HORAS
              </span>
              <span className="text-neutral-300 text-[11px] font-semibold">
                Entrega em minutos
              </span>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="overflow-hidden">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-bold tracking-wider uppercase text-neutral-400">Categorias</h3>
            <button 
              onClick={() => onNavigateToCategory('cerveja')}
              className="text-brand-primary text-xs font-semibold hover:underline bg-transparent border-none p-0 cursor-pointer flex items-center gap-0.5"
            >
              <span>Ver todas</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          
          <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-1 -mx-5 px-5">
            {CATEGORIES.slice(1).map((cat) => (
              <button
                key={cat.id}
                onClick={() => onNavigateToCategory(cat.id)}
                className="flex flex-col items-center gap-2 shrink-0 group bg-transparent border-none p-0 cursor-pointer"
              >
                <div className="w-20 h-20 rounded-2xl bg-neutral-900 flex items-center justify-center border border-white/5 group-hover:bg-brand-primary-container transition-all duration-300 transform group-active:scale-95 shadow-md">
                  {getCategoryIcon(cat.icon)}
                </div>
                <span className="text-xs text-neutral-400 font-bold tracking-tight group-hover:text-brand-primary transition-colors">
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Featured Products Grid ("Destaques") */}
        <section>
          <div className="flex justify-between items-bottom mb-3">
            <h3 className="text-sm font-bold tracking-wider uppercase text-neutral-400">Destaques</h3>
            <button 
              onClick={() => onNavigateToCategory('cerveja')}
              className="text-brand-primary text-xs font-semibold hover:underline bg-transparent border-none p-0 cursor-pointer"
            >
              Ver mais
            </button>
          </div>

          {featured.length === 0 ? (
            <p className="text-xs text-neutral-500 py-4 text-center">Nenhum produto em destaque encontrado.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {featured.map((product) => (
                <div
                  key={product.id}
                  className="bg-[#111] rounded-2xl p-3 border border-white/5 relative group transition-all hover:translate-y-[-2px]"
                >
                  <div 
                    onClick={() => onSelectProduct(product)}
                    className="h-40 w-full rounded-xl overflow-hidden mb-3 bg-[#0a0a0a] flex items-center justify-center cursor-pointer relative"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="max-h-full max-w-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="flex flex-col gap-1 text-left">
                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block truncate">
                      {product.subCategory || 'Bebida'}
                    </span>
                    <button 
                      onClick={() => onSelectProduct(product)}
                      className="text-xs font-bold text-white text-left truncate leading-tight hover:text-brand-primary bg-transparent border-none p-0 cursor-pointer block"
                    >
                      {product.name}
                    </button>
                    <p className="text-[10px] text-neutral-400 leading-none">{product.volume}</p>
                    
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-brand-primary text-sm font-black">
                        R$ {product.price.toFixed(2).replace('.', ',')}
                      </span>
                      <button
                        onClick={() => onAddToCart(product)}
                        className="w-8 h-8 rounded-full bg-brand-primary-container hover:bg-brand-inverse-primary text-white flex items-center justify-center hover:scale-115 transition-all cursor-pointer border-none"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Mais vendidos Section */}
        <section className="pb-8">
          <h3 className="text-sm font-bold tracking-wider uppercase text-neutral-400 mb-3 text-left">Mais vendidos</h3>
          
          {bestSellers.length === 0 ? (
            <p className="text-xs text-neutral-500 py-4 text-center">Nenhum produto mais vendido com estes filtros.</p>
          ) : (
            <div className="space-y-3">
              {bestSellers.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-3 bg-[#111] p-3 rounded-2xl border border-white/5 hover:bg-neutral-900 transition-colors cursor-pointer group"
                >
                  <div 
                    onClick={() => onSelectProduct(product)}
                    className="w-20 h-20 rounded-xl overflow-hidden bg-[#0A0A0A] flex items-center justify-center shrink-0 border border-white/5"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="max-h-full max-w-full object-contain p-1"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div 
                    onClick={() => onSelectProduct(product)}
                    className="flex-1 min-w-0 text-left"
                  >
                    <h4 className="text-xs font-bold text-white truncate group-hover:text-brand-primary transition-colors leading-tight">
                      {product.name}
                    </h4>
                    <p className="text-[10px] text-neutral-400 mt-0.5">{product.volume}</p>
                    
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-brand-primary text-xs font-black">
                        R$ {product.price.toFixed(2).replace('.', ',')}
                      </span>
                      {product.originalPrice && (
                        <span className="text-[11px] text-neutral-600 line-through font-medium">
                          R$ {product.originalPrice.toFixed(2).replace('.', ',')}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => onAddToCart(product)}
                    className="w-10 h-10 rounded-full border border-brand-primary text-brand-primary bg-transparent flex items-center justify-center hover:bg-brand-primary-container hover:text-white hover:border-brand-primary-container transition-all cursor-pointer shadow"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Fun Atmospheric Element */}
        <div className="flex flex-col items-center justify-center py-6 opacity-35 select-none">
          <Sparkles className="w-12 h-12 text-brand-primary animate-pulse" />
          <p className="text-[11px] font-bold text-neutral-400 mt-2 text-center uppercase tracking-widest leading-relaxed">
            Bebendo com moderação?<br />Não esqueça o gelo!
          </p>
        </div>
      </main>

      {/* Floating Action Button (FAB) for WhatsApp support */}
      <a
        href="https://wa.me/5521999999999"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-24 right-4 w-14 h-14 bg-[#25D366] text-white rounded-full shadow-2xl flex items-center justify-center z-40 active:scale-90 transition-transform duration-200"
      >
        <MessageCircle className="w-7 h-7 fill-current" />
      </a>
    </div>
  );
}
