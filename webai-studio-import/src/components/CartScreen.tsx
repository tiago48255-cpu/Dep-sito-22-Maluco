import { useState } from 'react';
import { 
  ArrowLeft, 
  Trash2, 
  Plus, 
  Minus, 
  X, 
  Ticket, 
  ChevronRight, 
  ArrowRight,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { CartItem } from '../types';

interface CartScreenProps {
  cart: CartItem[];
  onBack: () => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: (discountCode: string, discountValue: number) => void;
}

export default function CartScreen({
  cart,
  onBack,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
}: CartScreenProps) {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountValue, setDiscountValue] = useState(0);
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [couponError, setCouponError] = useState('');

  // Calculate prices
  const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const deliveryFee = subtotal > 0 ? 5.00 : 0.00;
  
  // Coupon logic
  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (code === 'MALUCO22' || code === 'QUEROV22') {
      const discount = subtotal * 0.10; // 10% discount
      setDiscountValue(discount);
      setAppliedCoupon(code);
      setCouponError('');
      setCouponCode('');
      setShowCouponInput(false);
    } else if (code === 'GELADA24') {
      const discount = 5.00; // Free delivery discount
      setDiscountValue(discount);
      setAppliedCoupon(code);
      setCouponError('');
      setCouponCode('');
      setShowCouponInput(false);
    } else {
      setCouponError('Cupom inválido. Experimente "MALUCO22" para 10% OFF!');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscountValue(0);
  };

  const finalTotal = Math.max(0, subtotal + deliveryFee - discountValue);

  return (
    <div className="text-white min-h-[750px] pb-24">
      {/* Top App Bar */}
      <header className="sticky top-0 z-40 bg-neutral-950/95 backdrop-blur-xl border-b border-white/5 px-5 py-3 flex justify-between items-center h-16 select-none">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="text-brand-primary p-1 hover:bg-neutral-900 rounded-full transition-colors border-none bg-transparent cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-base font-bold text-white text-left">Meu carrinho</h1>
        </div>
        
        {cart.length > 0 && (
          <button 
            onClick={onClearCart}
            className="text-neutral-500 hover:text-rose-400 p-1 rounded transition-colors bg-transparent border-none cursor-pointer"
            title="Esvaziar carrinho"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </header>

      {/* Main Cart Items details content */}
      <main className="px-5 pt-4 space-y-6">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center select-none space-y-4">
            <div className="w-16 h-16 bg-neutral-900 rounded-full flex items-center justify-center text-neutral-500 border border-white/5">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm text-neutral-400 font-bold">Seu carrinho está vazio</p>
              <p className="text-xs text-neutral-500 mt-1">Bora escolher aquela cerveja geladaça!</p>
            </div>
            <button 
              onClick={onBack}
              className="px-6 py-2.5 bg-brand-primary-container text-white text-xs font-bold rounded-xl border-none cursor-pointer shadow hover:bg-brand-inverse-primary"
            >
              Escolher bebidas
            </button>
          </div>
        ) : (
          <>
            {/* Items details wrapper */}
            <section className="space-y-3">
              {cart.map((item) => {
                const itemTotal = item.product.price * item.quantity;
                return (
                  <div
                    key={item.product.id}
                    className="glass-panel p-3 rounded-2xl flex gap-4 relative border border-white/5 group text-left"
                  >
                    <div className="w-20 h-24 bg-[#0a0a0a] rounded-xl overflow-hidden shrink-0 flex items-center justify-center border border-white/5">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="max-h-full max-w-full object-contain p-1"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between min-w-0 py-0.5">
                      <div>
                        <div className="flex justify-between items-start gap-1">
                          <h3 className="text-xs font-bold text-white truncate leading-snug">
                            {item.product.name}
                          </h3>
                          <button
                            onClick={() => onRemoveItem(item.product.id)}
                            className="text-neutral-500 hover:text-rose-400 border-none bg-transparent cursor-pointer p-1 shrink-0 -mt-1 -mr-1"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-[10px] text-neutral-400 mt-0.5">{item.product.volume}</p>
                      </div>

                      <div className="flex justify-between items-end">
                        <span className="text-brand-primary text-xs font-black">
                          R$ {itemTotal.toFixed(2).replace('.', ',')}
                          {item.quantity > 1 && (
                            <span className="text-[9px] text-neutral-500 font-normal ml-1">
                              ({item.quantity}x R$ {item.product.price.toFixed(2).replace('.', ',')})
                            </span>
                          )}
                        </span>

                        {/* Quantity switcher list controls */}
                        <div className="flex items-center bg-neutral-900 rounded-full px-1 py-1 gap-2.5 border border-white/5">
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center rounded-full text-white hover:bg-neutral-800 transition-colors bg-transparent border-none cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-bold text-xs w-3 text-center">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center rounded-full bg-brand-primary-container text-white hover:bg-brand-inverse-primary transition-colors bg-transparent border-none cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </section>

            {/* Coupon / Voucher discount section */}
            <section className="relative">
              {!appliedCoupon ? (
                <div>
                  <button
                    onClick={() => setShowCouponInput(!showCouponInput)}
                    className="w-full flex items-center justify-between p-4 glass-panel rounded-xl group transition-all duration-200 cursor-pointer bg-transparent border border-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <Ticket className="w-5 h-5 text-brand-primary shrink-0" />
                      <span className="text-xs font-bold text-white">Cupom de desconto</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-brand-primary font-bold text-xs">Adicionar</span>
                      <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </button>

                  {showCouponInput && (
                    <div className="mt-2 flex flex-col gap-2 p-3 bg-neutral-900 rounded-xl border border-white/5 text-left animate-fade-in">
                      <p className="text-[10px] uppercase tracking-wider font-extrabold text-neutral-500 mb-1">Digite o código do cupom</p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          placeholder="EX: MALUCO22"
                          className="flex-1 bg-black border border-white/10 rounded-lg px-3 py-2 text-xs font-bold tracking-wider placeholder:text-neutral-700 uppercase focus:border-brand-primary focus:outline-none"
                        />
                        <button
                          onClick={handleApplyCoupon}
                          className="px-4 bg-brand-primary-container text-white text-xs font-black rounded-lg hover:bg-brand-inverse-primary cursor-pointer border-none"
                        >
                          Aplicar
                        </button>
                      </div>
                      {couponError && <p className="text-[10px] font-bold text-rose-400 mt-1">{couponError}</p>}
                      <p className="text-[9px] text-neutral-500 mt-0.5">Sugestões: MALUCO22 (10% OFF), GELADA24 (R$5 OFF)</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full flex items-center justify-between p-4 bg-brand-primary-container/20 border border-brand-primary/30 rounded-xl">
                  <div className="flex items-center gap-3 text-left">
                    <Sparkles className="w-5 h-5 text-brand-primary shrink-0 animate-pulse" />
                    <div>
                      <span className="text-xs font-bold text-brand-primary">Cupom {appliedCoupon} Ativo</span>
                      <p className="text-[10px] text-neutral-400 mt-0.5">Desconto de R$ {discountValue.toFixed(2).replace('.', ',')}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-neutral-400 hover:text-white font-extrabold text-[10px] uppercase tracking-widest bg-transparent border-none cursor-pointer"
                  >
                    Excluir
                  </button>
                </div>
              )}
            </section>

            {/* Price items summary Section */}
            <section className="glass-panel p-4 rounded-2xl space-y-3 mb-4 select-none">
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-400 font-medium">Subtotal</span>
                <span className="text-white font-bold">R$ {subtotal.toFixed(2).replace('.', ',')}</span>
              </div>
              
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-400 font-medium">Taxa de entrega</span>
                <span className="text-white font-bold">
                  {deliveryFee > 0 ? `R$ ${deliveryFee.toFixed(2).replace('.', ',')}` : 'Grátis'}
                </span>
              </div>

              {discountValue > 0 && (
                <div className="flex justify-between items-center text-xs text-brand-secondary">
                  <span>Desconto aplicado</span>
                  <span className="font-extrabold">- R$ {discountValue.toFixed(2).replace('.', ',')}</span>
                </div>
              )}

              <div className="pt-3 border-t border-white/5 flex justify-between items-center">
                <span className="text-sm font-extrabold text-white">Total</span>
                <span className="text-base font-black text-brand-primary">
                  R$ {finalTotal.toFixed(2).replace('.', ',')}
                </span>
              </div>
            </section>

            {/* Proceed Action (Sticky floating container layout) */}
            <div className="pt-2 pb-8">
              <button
                onClick={() => onProceedToCheckout(appliedCoupon || '', discountValue)}
                className="w-full h-14 bg-gradient-to-r from-brand-primary-container to-brand-inverse-primary text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 border-none cursor-pointer shadow-royal-glow active:scale-98 transition-all"
              >
                <span>Finalizar pedido</span>
                <ArrowRight className="w-4.5 h-4.5 shrink-0" />
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
