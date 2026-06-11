import { useState } from 'react';
import { 
  ArrowLeft, 
  ShoppingCart, 
  Edit3, 
  User, 
  MapPin, 
  CreditCard, 
  Receipt, 
  Tag, 
  Headphones, 
  Info, 
  LogOut, 
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface ProfileScreenProps {
  userPhone: string;
  cartCount: number;
  onBack: () => void;
  onNavigateToCart: () => void;
  onNavigateToHistory: () => void;
  onLogout: () => void;
  onEditAddress: () => void;
}

export default function ProfileScreen({
  userPhone,
  cartCount,
  onBack,
  onNavigateToCart,
  onNavigateToHistory,
  onLogout,
  onEditAddress,
}: ProfileScreenProps) {
  const [userName, setUserName] = useState('Cliente 22 Maluco');
  const [isEditingName, setIsEditingName] = useState(false);
  const [typedName, setTypedName] = useState(userName);

  const handleSaveName = () => {
    if (typedName.trim()) {
      setUserName(typedName.trim());
    }
    setIsEditingName(false);
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
          <h1 className="text-base font-bold text-white text-left">Meu perfil</h1>
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

      {/* Main content Area */}
      <main className="px-5 pt-5 space-y-6">
        {/* Profile Card details summary */}
        <section className="glass-panel p-5 rounded-2xl border border-white/5 relative overflow-hidden flex items-center gap-4 text-left shadow select-none">
          <div className="absolute -right-8 -top-8 w-28 h-28 bg-brand-primary-container/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative shrink-0">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCBeEG2CIl54gcZF1yo-UzmmWCJV-_S5r8xS4ibETdxjctZx3hrwwiISJzdttp8awC2oweucUq9TLo7BjLlYyFBIuxPFzq9yYz4vB_n2vAo-GLrmkoWAvqHKpHLBcbZQBQXsQW13qwS6GzdjYmgjy8geHGF6wA8zeJ3xHm-XmK5ByBMHPxSg6M1ekRO1HSIXvzv5UpH76lt2k0RZfkWorpNnSxFriNPH-GJFdUQ8ZGx3KmtpBcNubea6u-Zussces39PPshVOtbenk"
              alt="Cliente Avatar"
              className="w-18 h-18 rounded-full border-2 border-brand-primary object-cover"
              referrerPolicy="no-referrer"
            />
            <button 
              onClick={() => setIsEditingName(true)}
              className="absolute bottom-0 right-0 bg-brand-primary hover:bg-white text-black p-1 rounded-full border-2 border-neutral-950 transition-colors border-none cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex-1 min-w-0">
            {isEditingName ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={typedName}
                  onChange={(e) => setTypedName(e.target.value)}
                  className="bg-black border border-white/10 rounded px-2 py-1 text-xs text-white tracking-tight focus:outline-none focus:border-brand-primary w-2/3"
                  autoFocus
                />
                <button
                  onClick={handleSaveName}
                  className="px-2 py-1 bg-brand-primary text-black font-extrabold text-[10px] uppercase rounded border-none cursor-pointer"
                >
                  OK
                </button>
              </div>
            ) : (
              <h2 className="text-base font-extrabold text-white truncate leading-tight uppercase tracking-tight">
                {userName}
              </h2>
            )}
            <p className="text-xs text-neutral-400 font-semibold mt-0.5">{userPhone || '(21) 99999-9999'}</p>
          </div>
        </section>

        {/* Categories of Profile Settings */}
        <section className="space-y-5 text-left">
          {/* GROUP 1: CONTA */}
          <div className="space-y-2">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-500 pl-1">
              Conta
            </h3>
            <div className="glass-panel rounded-2xl overflow-hidden divide-y divide-white/5 border border-white/5">
              <button 
                onClick={() => setIsEditingName(true)}
                className="w-full flex items-center justify-between p-4 hover:bg-neutral-900 transition-colors group bg-transparent border-none cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <User className="w-4.5 h-4.5 text-brand-primary shrink-0" />
                  <span className="text-xs font-semibold text-white">Meus dados</span>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button 
                onClick={onEditAddress}
                className="w-full flex items-center justify-between p-4 hover:bg-neutral-900 transition-colors group bg-transparent border-none cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <MapPin className="w-4.5 h-4.5 text-brand-primary shrink-0" />
                  <span className="text-xs font-semibold text-white">Endereços salvos</span>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button className="w-full flex items-center justify-between p-4 hover:bg-neutral-900 transition-colors group bg-transparent border-none cursor-pointer">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-4.5 h-4.5 text-brand-primary shrink-0" />
                  <span className="text-xs font-semibold text-white">Formas de pagamento</span>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* GROUP 2: ATIVIDADE */}
          <div className="space-y-2">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-500 pl-1">
              Atividade
            </h3>
            <div className="glass-panel rounded-2xl overflow-hidden divide-y divide-white/5 border border-white/5">
              <button 
                onClick={onNavigateToHistory}
                className="w-full flex items-center justify-between p-4 hover:bg-neutral-900 transition-colors group bg-transparent border-none cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Receipt className="w-4.5 h-4.5 text-brand-primary shrink-0" />
                  <span className="text-xs font-semibold text-white">Meus pedidos</span>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button className="w-full flex items-center justify-between p-4 hover:bg-neutral-900 transition-colors group bg-transparent border-none cursor-pointer">
                <div className="flex items-center gap-3">
                  <Tag className="w-4.5 h-4.5 text-brand-primary shrink-0" />
                  <span className="text-xs font-semibold text-white">Meus cupons salvos</span>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* GROUP 3: SUPORTE */}
          <div className="space-y-2">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-500 pl-1">
              Suporte
            </h3>
            <div className="glass-panel rounded-2xl overflow-hidden divide-y divide-white/5 border border-white/5">
              <a 
                href="https://wa.me/5521999999999"
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-between p-4 hover:bg-neutral-900 transition-colors group bg-transparent border-none cursor-pointer text-left no-underline"
              >
                <div className="flex items-center gap-3">
                  <Headphones className="w-4.5 h-4.5 text-brand-primary shrink-0" />
                  <span className="text-xs font-semibold text-white">Suporte ao cliente 24h</span>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:translate-x-0.5 transition-transform" />
              </a>

              <button className="w-full flex items-center justify-between p-4 hover:bg-neutral-900 transition-colors group bg-transparent border-none cursor-pointer">
                <div className="flex items-center gap-3">
                  <Info className="w-4.5 h-4.5 text-brand-primary shrink-0" />
                  <span className="text-xs font-semibold text-white">Sobre o aplicativo</span>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* LOGOUT BUTTON */}
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2.5 p-4 mt-6 text-brand-secondary border border-brand-secondary/20 rounded-xl hover:bg-brand-secondary/5 transition-colors cursor-pointer select-none active:scale-[0.98] duration-150 font-bold text-xs uppercase tracking-wider"
          >
            <LogOut className="w-4.5 h-4.5 shrink-0" />
            <span>Sair da conta</span>
          </button>
        </section>
      </main>
    </div>
  );
}
