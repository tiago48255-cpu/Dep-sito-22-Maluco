import { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Check, 
  CreditCard, 
  DollarSign, 
  FileText, 
  ChevronRight, 
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { CartItem } from '../types';

interface CheckoutScreenProps {
  cart: CartItem[];
  deliveryAddress: string;
  appliedCoupon: string;
  couponDiscount: number;
  onBack: () => void;
  onConfirmOrder: (orderDetails: {
    address: string;
    paymentMethod: string;
    changeFor: string;
    observation: string;
    subtotal: number;
    deliveryFee: number;
    pixDiscount: number;
    couponDiscount: number;
    total: number;
  }) => void;
}

export default function CheckoutScreen({
  cart,
  deliveryAddress,
  appliedCoupon,
  couponDiscount,
  onBack,
  onConfirmOrder,
}: CheckoutScreenProps) {
  const [paymentMethod, setPaymentMethod] = useState<'PIX' | 'Crédito' | 'Débito' | 'Dinheiro'>('PIX');
  const [changeFor, setChangeFor] = useState('');
  const [observation, setObservation] = useState('');
  
  // Calculations
  const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const deliveryFee = 5.00;
  
  // PIX 5% extra discount
  const pixDiscount = paymentMethod === 'PIX' ? subtotal * 0.05 : 0;
  
  // Total summary
  const finalTotal = Math.max(0, subtotal + deliveryFee - couponDiscount - pixDiscount);

  const handleSubmit = () => {
    onConfirmOrder({
      address: deliveryAddress,
      paymentMethod,
      changeFor: paymentMethod === 'Dinheiro' ? changeFor : '',
      observation,
      subtotal,
      deliveryFee,
      pixDiscount,
      couponDiscount,
      total: finalTotal,
    });
  };

  return (
    <div className="text-white min-h-[750px] pb-32">
      {/* Top App Bar */}
      <header className="sticky top-0 z-40 bg-neutral-950/95 backdrop-blur-xl border-b border-white/5 px-5 py-3 flex justify-between items-center h-16 select-none shadow">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="text-brand-primary p-2 hover:bg-neutral-900 rounded-full transition-colors border-none bg-transparent cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-base font-bold text-white text-left">Checkout</h1>
        </div>
        <div className="w-8 shrink-0" /> {/* Spacer */}
      </header>

      {/* Main Checkout details containers */}
      <main className="px-5 pt-4 space-y-6">
        {/* Delivery Address Section */}
        <section className="text-left">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-[#8f8fa0] mb-2">
            Endereço de entrega
          </h2>
          <div className="glass-panel p-4 rounded-xl flex items-center gap-3 border border-white/5">
            <div className="bg-brand-primary-container/20 p-2 rounded-lg text-brand-primary">
              <MapPin className="w-5 h-5 shrink-0" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">Caioaba, Nova Iguaçu - RJ</p>
              <p className="text-[10px] text-neutral-400 mt-0.5 truncate">{deliveryAddress}</p>
            </div>
            <button className="text-brand-primary text-xs font-bold bg-transparent border-none cursor-pointer hover:underline shrink-0">
              Alterar
            </button>
          </div>
        </section>

        {/* Payment Methods selector section */}
        <section className="text-left">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-[#8f8fa0] mb-2">
            Forma de Pagamento
          </h2>
          
          <div className="space-y-2.5">
            {/* PIX radio custom block */}
            <label 
              className={`glass-panel p-4 rounded-xl flex items-center gap-3 border transition-all duration-200 cursor-pointer ${
                paymentMethod === 'PIX' 
                  ? 'border-brand-primary bg-brand-primary-container/5 shadow-royal-glow' 
                  : 'border-white/5 hover:bg-neutral-950'
              }`}
            >
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === 'PIX'}
                onChange={() => setPaymentMethod('PIX')}
                className="hidden"
              />
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                paymentMethod === 'PIX' ? 'border-brand-primary' : 'border-neutral-600'
              }`}>
                {paymentMethod === 'PIX' && <span className="w-2.5 h-2.5 rounded-full bg-brand-primary" />}
              </div>
              
              <div className="bg-brand-primary-container/10 p-1.5 rounded text-brand-primary">
                <Check className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-white flex-1">PIX</span>
              <span className="bg-brand-tertiary-container border border-brand-tertiary/20 text-brand-tertiary text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full scale-95 shrink-0">
                5% OFF
              </span>
            </label>

            {/* Credit Card block */}
            <label 
              className={`glass-panel p-4 rounded-xl flex items-center gap-3 border transition-all duration-200 cursor-pointer ${
                paymentMethod === 'Crédito' 
                  ? 'border-brand-primary bg-brand-primary-container/5 shadow-royal-glow' 
                  : 'border-white/5 hover:bg-neutral-950'
              }`}
            >
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === 'Crédito'}
                onChange={() => setPaymentMethod('Crédito')}
                className="hidden"
              />
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                paymentMethod === 'Crédito' ? 'border-brand-primary' : 'border-neutral-600'
              }`}>
                {paymentMethod === 'Crédito' && <span className="w-2.5 h-2.5 rounded-full bg-brand-primary" />}
              </div>
              
              <div className="bg-neutral-955 p-1.5 rounded text-neutral-400">
                <CreditCard className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-white">Cartão de Crédito</span>
            </label>

            {/* Debit Card block */}
            <label 
              className={`glass-panel p-4 rounded-xl flex items-center gap-3 border transition-all duration-200 cursor-pointer ${
                paymentMethod === 'Débito' 
                  ? 'border-brand-primary bg-brand-primary-container/5 shadow-royal-glow' 
                  : 'border-white/5 hover:bg-neutral-950'
              }`}
            >
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === 'Débito'}
                onChange={() => setPaymentMethod('Débito')}
                className="hidden"
              />
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                paymentMethod === 'Débito' ? 'border-brand-primary' : 'border-neutral-600'
              }`}>
                {paymentMethod === 'Débito' && <span className="w-2.5 h-2.5 rounded-full bg-brand-primary" />}
              </div>
              
              <div className="bg-neutral-955 p-1.5 rounded text-neutral-400">
                <CreditCard className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-white">Cartão de Débito</span>
            </label>

            {/* Cash / Dinheiro block */}
            <label 
              className={`glass-panel p-4 rounded-xl flex items-center gap-3 border transition-all duration-200 cursor-pointer ${
                paymentMethod === 'Dinheiro' 
                  ? 'border-brand-primary bg-brand-primary-container/5 shadow-royal-glow' 
                  : 'border-white/5 hover:bg-neutral-950'
              }`}
            >
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === 'Dinheiro'}
                onChange={() => setPaymentMethod('Dinheiro')}
                className="hidden"
              />
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                paymentMethod === 'Dinheiro' ? 'border-brand-primary' : 'border-neutral-600'
              }`}>
                {paymentMethod === 'Dinheiro' && <span className="w-2.5 h-2.5 rounded-full bg-brand-primary" />}
              </div>
              
              <div className="bg-neutral-955 p-1.5 rounded text-neutral-300">
                <DollarSign className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-white">Dinheiro</span>
            </label>
          </div>
        </section>

        {/* Change field conditional for Cash */}
        {paymentMethod === 'Dinheiro' && (
          <section className="text-left animate-fade-in">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-[#8f8fa0] mb-2 uppercase">
              Troco para quanto?
            </h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Exemplo: R$ 50,00"
                value={changeFor}
                onChange={(e) => setChangeFor(e.target.value)}
                className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl p-3.5 text-xs text-white focus:border-brand-primary transition-colors pl-10"
              />
              <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            </div>
          </section>
        )}

        {/* Optional observations */}
        <section className="text-left">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-[#8f8fa0] mb-2">
            Observação (opcional)
          </h2>
          <textarea
            placeholder="Adicionar observação..."
            value={observation}
            onChange={(e) => setObservation(e.target.value)}
            rows={2}
            className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl p-3 text-xs text-white focus:border-brand-primary focus:ring-1 focus:ring-brand-primary resize-none placeholder:text-neutral-700"
          />
        </section>

        {/* Summary pricing Section */}
        <section className="glass-panel p-4 rounded-xl space-y-2.5 select-none">
          <div className="flex justify-between items-center text-xs">
            <span className="text-neutral-400 font-medium">Subtotal</span>
            <span className="text-white font-bold">R$ {subtotal.toFixed(2).replace('.', ',')}</span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-neutral-400 font-medium">Taxa de entrega</span>
            <span className="text-white font-bold">R$ {deliveryFee.toFixed(2).replace('.', ',')}</span>
          </div>

          {couponDiscount > 0 && (
            <div className="flex justify-between items-center text-xs text-brand-primary">
              <span>Cupom aplicado</span>
              <span className="font-extrabold">- R$ {couponDiscount.toFixed(2).replace('.', ',')}</span>
            </div>
          )}

          {pixDiscount > 0 && (
            <div className="flex justify-between items-center text-xs text-brand-tertiary">
              <span>Desconto PIX (5% OFF)</span>
              <span className="font-extrabold">- R$ {pixDiscount.toFixed(2).replace('.', ',')}</span>
            </div>
          )}

          <div className="pt-2.5 border-t border-white/5 flex justify-between items-center">
            <span className="text-sm font-extrabold text-white">Total</span>
            <span className="text-base font-black text-brand-primary shadow-royal-glow">
              R$ {finalTotal.toFixed(2).replace('.', ',')}
            </span>
          </div>
        </section>
      </main>

      {/* FIXED BOTTOM ACTION BAR ORDER SUBMIT */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-neutral-950/90 backdrop-blur-xl border-t border-white/5 z-50">
        <div className="max-w-[600px] mx-auto">
          <button
            onClick={handleSubmit}
            className="w-full h-14 bg-gradient-to-r from-brand-primary-container to-brand-inverse-primary text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 border-none cursor-pointer shadow-royal-glow hover:opacity-95 transform active:scale-98 transition-all"
          >
            <span>Confirmar pedido</span>
            <ChevronRight className="w-4.5 h-4.5 shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
}
