import { useState } from 'react';
import { 
  ArrowLeft, 
  Search, 
  ChevronRight, 
  RotateCcw, 
  CheckCircle2, 
  Clock, 
  XCircle,
  Plus
} from 'lucide-react';
import { Order } from '../types';

interface HistoryScreenProps {
  orders: Order[];
  onBack: () => void;
  onSelectOrder: (order: Order) => void;
  onNewOrder: () => void;
}

export default function HistoryScreen({
  orders,
  onBack,
  onSelectOrder,
  onNewOrder,
}: HistoryScreenProps) {
  const [activeTab, setActiveTab] = useState<'Todos' | 'Entregues' | 'A caminho'>('Todos');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtering based on tab + search
  const filteredOrders = orders.filter((order) => {
    const matchesTab = 
      activeTab === 'Todos' ||
      (activeTab === 'Entregues' && order.status === 'Entregue') ||
      (activeTab === 'A caminho' && order.status === 'A caminho');

    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some(i => i.product.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesTab && matchesSearch;
  });

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'A caminho':
        return (
          <span className="bg-brand-primary-container/20 border border-brand-primary/20 text-brand-primary font-bold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full animate-pulse flex items-center gap-1 shrink-0">
            <Clock className="w-3 h-3" />
            <span>Em entrega</span>
          </span>
        );
      case 'Entregue':
        return (
          <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
            <CheckCircle2 className="w-3 h-3" />
            <span>Entregue</span>
          </span>
        );
      case 'Cancelado':
        return (
          <span className="bg-rose-500/10 border border-rose-500/20 text-rose-450 font-bold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
            <XCircle className="w-3 h-3" />
            <span>Cancelado</span>
          </span>
        );
      default:
        return (
          <span className="bg-neutral-800 border border-neutral-700 text-neutral-400 font-bold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="text-white min-h-[750px] pb-24">
      {/* Top App Bar */}
      <header className="sticky top-0 z-40 bg-neutral-950/95 backdrop-blur-xl border-b border-white/5 px-5 py-3 flex justify-between items-center h-16 select-none shadow">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="text-brand-primary p-2 hover:bg-neutral-900 rounded-full transition-colors border-none bg-transparent cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-base font-bold text-white text-left">Meus pedidos</h1>
        </div>
        <div className="w-8" /> {/* Spacer */}
      </header>

      {/* Main Container Layout */}
      <main className="px-5 pt-4 space-y-4">
        {/* Horizontal filter chips tabs */}
        <div className="flex gap-2.5 overflow-x-auto hide-scrollbar">
          {(['Todos', 'Entregues', 'A caminho'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-5 rounded-full text-xs font-bold shrink-0 transition-all border cursor-pointer ${
                activeTab === tab
                  ? 'bg-brand-primary text-black border-brand-primary shadow-royal-glow active-tab-glow'
                  : 'bg-neutral-900 text-neutral-400 border-white/5 hover:bg-neutral-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search filter orders */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            type="text"
            placeholder="Buscar por código ou produto..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 bg-neutral-900 border-none text-white rounded-xl pl-11 pr-4 text-xs font-semibold focus:ring-1 focus:ring-brand-primary"
          />
        </div>

        {/* Vertical List of past simulated orders */}
        <section className="space-y-3 pt-1">
          {filteredOrders.length === 0 ? (
            <div className="py-20 text-center select-none text-neutral-500">
              <p className="text-sm">Nenhum pedido encontrado nos filtros selecionados.</p>
              <button 
                onClick={() => { setActiveTab('Todos'); setSearchQuery(''); }}
                className="mt-3 text-xs text-brand-primary font-bold hover:underline bg-transparent border-none cursor-pointer animate-pulse"
              >
                Ver todos os meus pedidos
              </button>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order.id}
                onClick={() => onSelectOrder(order)}
                className="glass-panel p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-colors cursor-pointer text-left space-y-3 relative group"
              >
                {/* Header id with date and status */}
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="text-sm font-black text-white group-hover:text-brand-primary transition-colors">
                      Pedido {order.id}
                    </h3>
                    <p className="text-[10px] text-neutral-500 font-bold mt-0.5">{order.date}</p>
                  </div>
                  {getStatusBadge(order.status)}
                </div>

                {/* Products previews text */}
                <div className="py-1 border-y border-white/5 text-xs text-neutral-300 font-semibold space-y-1">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <span className="truncate max-w-[80%]">
                        {item.quantity}x {item.product.name}
                      </span>
                      <span className="text-[10px] text-neutral-500 shrink-0">
                        {item.product.volume}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Final prices action layout */}
                <div className="flex justify-between items-center pt-0.5">
                  <div className="flex items-center gap-1 text-xs">
                    <span className="text-neutral-500 font-bold">Valor Total:</span>
                    <strong className="text-brand-primary font-black">
                      R$ {order.total.toFixed(2).replace('.', ',')}
                    </strong>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Avoid triggering parent details click
                      onSelectOrder(order);
                    }}
                    className="text-brand-primary text-xs font-black bg-transparent border-none cursor-pointer flex items-center hover:underline p-1"
                  >
                    <span>Ver detalhes</span>
                    <ChevronRight className="w-4 h-4 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            ))
          )}
        </section>

        {/* Fazer novo pedido action at bottom */}
        <div className="pt-4 pb-8">
          <button
            onClick={onNewOrder}
            className="w-full h-13 btn-gradient text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 border-none cursor-pointer shadow-royal-glow active:scale-98 transition-all uppercase tracking-wider"
          >
            <Plus className="w-4 h-4 font-black shrink-0" />
            <span>Fazer novo pedido</span>
          </button>
        </div>
      </main>
    </div>
  );
}
