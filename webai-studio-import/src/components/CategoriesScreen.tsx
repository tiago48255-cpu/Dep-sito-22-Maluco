import { useState } from 'react';
import { 
  ArrowLeft, 
  Search, 
  ShoppingCart, 
  Plus, 
  Star, 
  Wine, 
  Beer, 
  Bookmark, 
  Sparkles,
  Award,
  ChevronRight,
  TrendingDown
} from 'lucide-react';
import { Product } from '../types';
import { CATEGORIES } from '../data';

interface CategoriesScreenProps {
  products: Product[];
  initialCategory?: string;
  cartCount: number;
  onBack: () => void;
  onAddToCart: (p: Product) => void;
  onSelectProduct: (p: Product) => void;
  onNavigateToCart: () => void;
}

export default function CategoriesScreen({
  products,
  initialCategory = 'cerveja',
  cartCount,
  onBack,
  onAddToCart,
  onSelectProduct,
  onNavigateToCart,
}: CategoriesScreenProps) {
  // Two sub-states: 'grid' (categories dashboard list) or 'list' (browsing specific category items)
  const [viewState, setViewState] = useState<'grid' | 'list'>(
    initialCategory === 'all' ? 'grid' : 'list'
  );
  
  const [selectedCatId, setSelectedCatId] = useState(initialCategory || 'cerveja');
  const [subFilter, setSubFilter] = useState('Todas');
  const [searchQuery, setSearchQuery] = useState('');

  // Sub-categories list for filtering
  const subFiltersMap: Record<string, string[]> = {
    cerveja: ['Todas', 'Lager', 'Pilsen', 'Artesanais', 'Especiais'],
    whisky: ['Todas', 'Importados', 'Nacionais'],
    vinho: ['Todas', 'Tinto', 'Branco', 'Espumante'],
    outro: ['Todas', 'Snacks', 'Energéticos'],
    gelo: ['Todas', 'Pacote', 'Cubo'],
  };

  const activeSubFilters = subFiltersMap[selectedCatId] || ['Todas'];

  // Handle category selection from bento grid
  const handleSelectGridCategory = (catId: string) => {
    setSelectedCatId(catId);
    setSubFilter('Todas');
    setViewState('list');
  };

  // Filter products
  const categoryProducts = products.filter((p) => {
    // category matching
    const matchesCategory = selectedCatId === 'all' || p.category === selectedCatId;
    
    // sub-category matching
    const matchesSub = 
      subFilter === 'Todas' || 
      p.subCategory?.toLowerCase() === subFilter.toLowerCase() ||
      (subFilter === 'Snacks' && p.category === 'outro' && p.id !== 'red-bull') ||
      (subFilter === 'Energéticos' && p.id === 'red-bull');

    // search query matching
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSub && matchesSearch;
  });

  return (
    <div className="text-white min-h-[750px] pb-24">
      {/* Dynamic Top App Bar */}
      <header className="sticky top-0 z-40 bg-neutral-950/90 backdrop-blur-xl border-b border-white/5 px-5 py-3 flex justify-between items-center h-16 select-none">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              if (viewState === 'list') {
                setViewState('grid');
              } else {
                onBack();
              }
            }}
            className="text-brand-primary hover:bg-neutral-900 rounded-full w-9 h-9 flex items-center justify-center transition-colors border-none bg-transparent cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="flex flex-col text-left">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest leading-none">
              {viewState === 'list' ? 'Seção' : 'Explorar'}
            </span>
            <h1 className="text-xs font-bold text-white mt-1">
              {viewState === 'list' 
                ? (CATEGORIES.find(c => c.id === selectedCatId)?.name || 'Bebidas') 
                : 'Categorias'
              }
            </h1>
          </div>
        </div>

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

      {/* VIEW 1: BENTO BROWSE GRID */}
      {viewState === 'grid' && (
        <main className="px-5 pt-5 space-y-6">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-white text-left leading-normal mb-3">
              O que vamos<br />beber hoje?
            </h2>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-neutral-500" />
              <input
                type="text"
                placeholder="Buscar por categorias ou marcas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 bg-neutral-900/60 border border-white/5 rounded-xl pl-12 pr-4 text-sm text-white font-medium focus:ring-1 focus:ring-brand-primary"
              />
            </div>
          </div>

          {/* Dynamic Category Bento Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Cerveja - Large Featured Bento */}
            <div 
              onClick={() => handleSelectGridCategory('cerveja')}
              className="col-span-2 glass-panel rounded-2xl overflow-hidden relative group cursor-pointer active:scale-98 transition-transform duration-200"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent z-10" />
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDAjV8TPUtmim291FrWSKJn7WHxZRfg_havSfVwtAUzjTAi1VQFEcJ1KrwTZ7XSbhqAwIsHpp6hCSZznLKbbMwhEO8vwmCKjvQeAGTwZmweU8Ivq5o0Y-7CPIu_SuhKRLJgDrHghKEdbickiMgiXBQPz1FcHWGg0_aQsI7ZJ0IXzF99QMYOGZxDPtqTGUMSz1s_C-VO3Q1fzqAMfaZXQ_wUImpXGf5p9ViHq3PXHea96YponoMupO_uS2L6gcC4U3376X2gj3wGQPE"
                alt="Cold Beers"
                className="w-full h-44 object-cover group-hover:scale-102 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-4 left-4 z-20 text-left">
                <h3 className="text-lg font-extrabold text-white">Cervejas</h3>
                <p className="text-xs text-brand-primary font-semibold">As mais geladas da região</p>
              </div>
              <div className="absolute top-4 right-4 z-20 bg-brand-primary-container/40 backdrop-blur-md px-3 py-1 rounded-full border border-brand-primary/20">
                <span className="text-[10px] font-black uppercase text-brand-primary tracking-wide">Ofertas</span>
              </div>
            </div>

            {/* Whiskey */}
            <div 
              onClick={() => handleSelectGridCategory('whisky')}
              className="glass-panel rounded-2xl p-4 flex flex-col justify-between aspect-square group cursor-pointer active:scale-98 transition-transform duration-200 text-left"
            >
              <div className="w-12 h-12 bg-neutral-900 rounded-xl flex items-center justify-center border border-white/5 group-hover:bg-brand-primary-container transition-colors">
                <Award className="w-6 h-6 text-brand-tertiary" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white">Whiskey</h3>
                <p className="text-[10px] text-neutral-400 mt-1">Importados e Nacionais</p>
              </div>
            </div>

            {/* Wine / Vinho */}
            <div 
              onClick={() => handleSelectGridCategory('vinho')}
              className="glass-panel rounded-2xl p-4 flex flex-col justify-between aspect-square group cursor-pointer active:scale-98 transition-transform duration-200 text-left"
            >
              <div className="w-12 h-12 bg-neutral-900 rounded-xl flex items-center justify-center border border-white/5 group-hover:bg-brand-primary-container transition-colors">
                <Wine className="w-6 h-6 text-brand-primary" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white">Vinhos</h3>
                <p className="text-[10px] text-neutral-400 mt-1">Absolut, Licor & mais</p>
              </div>
            </div>

            {/* Gin row */}
            <div 
              onClick={() => handleSelectGridCategory('outro')}
              className="glass-panel rounded-2xl p-4 flex items-center justify-between group cursor-pointer active:scale-98 transition-transform duration-200 text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-neutral-900 rounded-lg flex items-center justify-center border border-white/5">
                  <Wine className="w-5 h-5 text-rose-300" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">Gin &amp; Runs</h3>
                  <p className="text-[9px] text-neutral-400">Botânicos &amp; Clássicos</p>
                </div>
              </div>
            </div>

            {/* Energéticos */}
            <div 
              onClick={() => handleSelectGridCategory('outro')}
              className="glass-panel rounded-2xl p-4 flex items-center justify-between group cursor-pointer active:scale-98 transition-transform duration-200 text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-neutral-900 rounded-lg flex items-center justify-center border border-white/5">
                  <Sparkles className="w-5 h-5 text-brand-tertiary" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">Combustão</h3>
                  <p className="text-[9px] text-neutral-400">Red Bull e Monstros</p>
                </div>
              </div>
            </div>

            {/* Tertiary categories row */}
            <div className="col-span-2 grid grid-cols-3 gap-2">
              <button
                onClick={() => handleSelectGridCategory('outro')}
                className="glass-panel rounded-xl p-3 flex flex-col items-center gap-1 cursor-pointer bg-transparent border border-white/5"
              >
                <span className="text-[10px] font-bold text-neutral-400">Sucos</span>
              </button>
              <button
                onClick={() => handleSelectGridCategory('gelo')}
                className="glass-panel rounded-xl p-3 flex flex-col items-center gap-1 cursor-pointer bg-transparent border border-white/5"
              >
                <span className="text-[10px] font-bold text-neutral-400">Gelo</span>
              </button>
              <button
                onClick={() => handleSelectGridCategory('outro')}
                className="glass-panel rounded-xl p-3 flex flex-col items-center gap-1 cursor-pointer bg-transparent border border-white/5"
              >
                <span className="text-[10px] font-bold text-neutral-400">Snacks</span>
              </button>
            </div>

            {/* Featured mid promo banner */}
            <div 
              onClick={() => handleSelectGridCategory('cerveja')}
              className="col-span-2 relative h-40 rounded-2xl overflow-hidden mt-2 group cursor-pointer active:scale-98 transition-transform"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/35 to-transparent z-10" />
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBkkzLGHVAWFtf3aLApqCJF1xwD2aZClW6lyh-5EgQQtNsqvqcpPiWxzVQOfpSls39HllHl0oq7QKxViX6_7nuuFC-Gfp9UppF2xYplpIsSmt3ie1DOzbbVG23GqUqZDbTPCcHHKm9qHvCn2_scD04JZb8Wx0fVoZlVz0_x0doozZ7tprl79J_R3mPO1zLBROkmLgVkYiFKhlI8SWNC_8dJ7xz0k5sOhOKq3V2bvdrQztL-GWkvjB_ZxBHMQAMEqIApDx2ABp2s9Bw"
                alt="Gin Drink"
                className="w-full h-full object-cover transition-transform group-hover:scale-102"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-y-0 left-6 flex flex-col justify-center z-20 max-w-[65%] text-left">
                <span className="text-[10px] font-bold text-brand-tertiary mb-1 uppercase tracking-widest">Oferta da Madrugada</span>
                <h4 className="text-md font-extrabold text-white leading-tight">Combos com Desconto</h4>
                <p className="text-[10px] text-neutral-400 mt-1">Garanta a resenha perfeita pagando bem menos.</p>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* VIEW 2: PRODUCTS SPECIFIC CATEGORY LISTING */}
      {viewState === 'list' && (
        <main className="px-5 pt-4 space-y-4">
          {/* Sub Filters Horizontal Bar */}
          <div className="flex gap-2 overflow-x-auto hide-scrollbar -mx-5 px-5 py-1">
            {activeSubFilters.map((sub) => (
              <button
                key={sub}
                onClick={() => setSubFilter(sub)}
                className={`py-2 px-4 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer border ${
                  subFilter === sub
                    ? 'bg-brand-primary text-black border-brand-primary shadow-royal-glow active-tab-glow'
                    : 'bg-neutral-900 text-neutral-400 border-white/5 hover:bg-neutral-800'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>

          {/* Search bar inside specific category list page */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              placeholder="Filtre nesta categoria..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 bg-neutral-900 border-none text-white rounded-xl pl-11 pr-4 text-xs font-semibold focus:ring-1 focus:ring-brand-primary"
            />
          </div>

          {/* Products vertical layouts list */}
          {categoryProducts.length === 0 ? (
            <div className="py-16 text-center select-none">
              <p className="text-sm text-neutral-500">Nenhum produto cadastrado com estes filtros.</p>
              <button 
                onClick={() => { setSubFilter('Todas'); setSearchQuery(''); }}
                className="mt-3 text-xs text-brand-primary font-bold hover:underline bg-transparent border-none cursor-pointer"
              >
                Limpar filtros
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {categoryProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-neutral-900/60 p-3 rounded-2xl border border-white/5 hover:border-white/10 transition-all flex gap-4 text-left relative group cursor-pointer"
                >
                  {/* Product Image Clickable to detail */}
                  <div 
                    onClick={() => onSelectProduct(product)}
                    className="w-20 h-24 bg-neutral-950 rounded-xl overflow-hidden flex items-center justify-center shrink-0 border border-white/5"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="max-h-full max-w-full object-contain p-1.5"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Brand Information and cart callback */}
                  <div className="flex-1 flex flex-col justify-between min-w-0 pr-1">
                    <div onClick={() => onSelectProduct(product)}>
                      <div className="flex justify-between items-start gap-1">
                        <h3 className="text-xs font-extrabold text-white truncate leading-snug group-hover:text-brand-primary transition-colors">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-0.5 shrink-0 ml-1">
                          <Star className="w-3 h-3 text-brand-tertiary fill-current" />
                          <span className="text-[10px] font-black text-brand-tertiary">{product.rating}</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-neutral-400 font-semibold">{product.volume}</p>
                      <p className="text-[10px] text-neutral-500 line-clamp-1 mt-1 leading-normal">{product.description}</p>
                    </div>

                    <div className="flex justify-between items-center mt-2.5">
                      <span className="text-brand-primary text-xs font-black">
                        R$ {product.price.toFixed(2).replace('.', ',')}
                      </span>

                      <div className="flex gap-2">
                        {product.isGelada && (
                          <span className="bg-brand-primary-container/20 border border-brand-primary/10 text-brand-primary px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase">
                            Geladaça
                          </span>
                        )}
                        <button
                          onClick={() => onAddToCart(product)}
                          className="w-8 h-8 rounded-full bg-brand-primary-container hover:bg-brand-inverse-primary text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all border-none cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      )}
    </div>
  );
}
