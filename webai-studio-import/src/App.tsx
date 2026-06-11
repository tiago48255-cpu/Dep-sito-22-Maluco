import { useState, useEffect } from 'react';
import { 
  Beer, 
  Smartphone, 
  Wifi, 
  Battery, 
  Sparkles, 
  Sliders, 
  ListCollapse, 
  Home, 
  Grid, 
  History, 
  User, 
  ShoppingBag,
  MapPin,
  CheckCircle2,
  Trash2,
  Plus
} from 'lucide-react';
import { Product, CartItem, Order, ScreenType } from './types';
import { PRODUCTS, INITIAL_ORDERS } from './data';

// Component Screens
import SplashScreen from './components/SplashScreen';
import LoginScreen from './components/LoginScreen';
import HomeScreen from './components/HomeScreen';
import CategoriesScreen from './components/CategoriesScreen';
import ProductDetailsScreen from './components/ProductDetailsScreen';
import CartScreen from './components/CartScreen';
import CheckoutScreen from './components/CheckoutScreen';
import TrackingScreen from './components/TrackingScreen';
import HistoryScreen from './components/HistoryScreen';
import ProfileScreen from './components/ProfileScreen';

export default function App() {
  // Navigation & Flows
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('splash');
  const [lastScreen, setLastScreen] = useState<ScreenType>('home');
  const [userPhone, setUserPhone] = useState<string>('');
  
  // App Shared State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products] = useState<Product[]>(PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(products[0]);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState<Order>(INITIAL_ORDERS[0]);
  const [deliveryAddress, setDeliveryAddress] = useState<string>('Rua Exemplo, 123');
  
  // Checkout Transits
  const [checkoutCoupon, setCheckoutCoupon] = useState('');
  const [checkoutDiscount, setCouponDiscount] = useState(0);

  // Overlays / Toast Feedback
  const [successToast, setSuccessToast] = useState<{ title: string; message: string } | null>(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [tempAddress, setTypedAddress] = useState(deliveryAddress);

  // Time for mock phone clock
  const [realTime, setRealTime] = useState('11:25');

  // Interactive sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Real-time ticking mock clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setRealTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  // Screen Back Handler
  const navigateBack = () => {
    if (currentScreen === 'product-details') {
      setCurrentScreen(lastScreen);
    } else {
      setCurrentScreen('home');
    }
  };

  // Navigations switcher wrapper
  const handleNavigate = (screen: ScreenType) => {
    setLastScreen(currentScreen === 'product-details' ? lastScreen : currentScreen);
    setCurrentScreen(screen);
  };

  // Add Item to active cart
  const handleAddToCart = (product: Product, quantity: number = 1) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { product, quantity }];
    });

    // Success overlay feedback
    setSuccessToast({
      title: 'Adicionado!',
      message: `${quantity}x ${product.name} no carrinho.`
    });
    setTimeout(() => setSuccessToast(null), 2000);
  };

  // Clear specific item
  const handleRemoveCartItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // Update Item qty directly in cart list
  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  // Pre-load default cart if empty to ease checkout testing
  const handlePreloadCart = () => {
    setCart([
      { product: products[0], quantity: 1 }, // Heineken
      { product: products[8], quantity: 1 }, // Red Bull
      { product: products[7], quantity: 2 }, // Doritos
    ]);
    setSuccessToast({
      title: 'Carrinho Pronto!',
      message: 'Carrinho preenchido para testar o checkout.'
    });
    setTimeout(() => setSuccessToast(null), 2500);
  };

  // Process checkout click
  const handleProceedToCheckout = (coupon: string, discount: number) => {
    setCheckoutCoupon(coupon);
    setCouponDiscount(discount);
    handleNavigate('checkout');
  };

  // Confirm standard checkout order
  const handleConfirmOrder = (orderDetails: {
    address: string;
    paymentMethod: string;
    changeFor: string;
    observation: string;
    subtotal: number;
    deliveryFee: number;
    pixDiscount: number;
    couponDiscount: number;
    total: number;
  }) => {
    // Generate new mock order
    const nextOrderId = `#${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id: nextOrderId,
      date: 'Hoje às ' + realTime,
      status: 'Preparando',
      total: orderDetails.total,
      subtotal: orderDetails.subtotal,
      deliveryFee: orderDetails.deliveryFee,
      discount: orderDetails.couponDiscount + orderDetails.pixDiscount,
      items: [...cart],
      deliveryAddress: orderDetails.address,
      paymentMethod: orderDetails.paymentMethod,
      changeFor: orderDetails.changeFor,
      observation: orderDetails.observation,
      trackingEvents: [
        { title: 'Pedido recebido', description: 'Seu pedido foi confirmado', time: realTime, completed: true },
        { title: 'Preparando pedido', description: 'Suas bebidas estão sendo geladas', time: realTime, completed: true, active: true },
        { title: 'Aguardando entregador', description: 'Entregador está retirando o pedido', time: '--:--', completed: false },
        { title: 'Saiu para entrega', description: 'O entregador está próximo de você', time: '--:--', completed: false },
        { title: 'Entregue', description: 'Previsão: 15-25 minutos', time: '--:--', completed: false },
      ],
      courier: {
        name: 'Carlos Oliveira',
        rating: 4.8,
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBeEG2CIl54gcZF1yo-UzmmWCJV-_S5r8xS4ibETdxjctZx3hrwwiISJzdttp8awC2oweucUq9TLo7BjLlYyFBIuxPFzq9yYz4vB_n2vAo-GLrmkoWAvqHKpHLBcbZQBQXsQW13qwS6GzdjYmgjy8geHGF6wA8zeJ3xHm-XmK5ByBMHPxSg6M1ekRO1HSIXvzv5UpH76lt2k0RZfkWorpNnSxFriNPH-GJFdUQ8ZGx3KmtpBcNubea6u-Zussces39PPshVOtbenk', // Avatar placeholder
      }
    };

    setOrders([newOrder, ...orders]);
    setSelectedOrder(newOrder);
    setCart([]); // Clear Cart
    
    // Display cinematic success visual overlay modal
    setSuccessToast({
      title: 'Sucesso!',
      message: 'Preparando sua experiência gelada...'
    });

    setTimeout(() => {
      setSuccessToast(null);
      handleNavigate('tracking');
    }, 2500);
  };

  const handleUpdateAddress = () => {
    if (tempAddress.trim()) {
      setDeliveryAddress(tempAddress);
    }
    setShowAddressModal(false);
  };

  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#030303] text-white flex flex-col xl:flex-row justify-center items-stretch font-sans overflow-x-hidden">
      
      {/* SIDEBAR: INTERACTIVE DESIGNER CONTROL DRAWER (Shown on PC monitors) */}
      <aside 
        className={`bg-neutral-950 border-r border-white/5 xl:w-[280px] p-6 text-left flex flex-col gap-6 shrink-0 transition-all ${
          isSidebarOpen ? 'xl:flex block' : 'hidden xl:hidden'
        }`}
      >
        <div className="flex justify-between items-center select-none border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <Beer className="w-5 h-5 text-brand-primary" />
            <h2 className="text-sm font-extrabold uppercase tracking-widest text-brand-primary">Painel de Telas</h2>
          </div>
          <span className="bg-neutral-900 border border-white/5 text-[9px] px-2 py-0.5 rounded font-black text-neutral-400">DESIGNER</span>
        </div>

        {/* Dynamic State Info */}
        <section className="bg-neutral-900/40 p-4 rounded-xl space-y-2 border border-white/5 text-xs text-neutral-400 select-none">
          <div className="flex justify-between">
            <span>Telefone Logado:</span>
            <strong className="text-white">{userPhone || 'Vazio'}</strong>
          </div>
          <div className="flex justify-between">
            <span>Itens no Carrinho:</span>
            <strong className="text-brand-primary font-black">{cartItemsCount} itens</strong>
          </div>
          <div className="flex justify-between">
            <span>Pedidos Criados:</span>
            <strong className="text-white">{orders.length}</strong>
          </div>
        </section>

        {/* Quick Preload buttons to ease testing */}
        <div className="flex flex-col gap-2">
          <button
            onClick={handlePreloadCart}
            className="w-full py-2 bg-neutral-900 border border-white/5 hover:border-brand-primary/20 text-neutral-300 font-bold text-xs rounded-lg cursor-pointer transition-colors flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Preencher Carrinho</span>
          </button>
        </div>

        {/* Main List switcher tabs representing each mockup screenshot */}
        <div className="flex flex-col gap-1.5">
          <p className="text-[10px] font-black uppercase text-neutral-500 tracking-wider mb-1 pl-1">Escolher Tela Direta</p>
          {[
            { id: 'splash', label: '1. Splash Screen' },
            { id: 'login', label: '2. Login / Conta' },
            { id: 'home', label: '3. Feed Início' },
            { id: 'categories', label: '4. Categorias Bento' },
            { id: 'product-details', label: '5. Detalhes (Heineken)' },
            { id: 'cart', label: '6. Carrinho de Compras' },
            { id: 'checkout', label: '7. Checkout Pagamento' },
            { id: 'tracking', label: '8. Rastreamento Live' },
            { id: 'history', label: '9. Histórico Pedidos' },
            { id: 'profile', label: '10. Perfil do Cliente' },
          ].map((screen) => (
            <button
              key={screen.id}
              onClick={() => {
                if (screen.id === 'login' && !userPhone) {
                  setUserPhone('');
                }
                if (screen.id === 'product-details') {
                  setSelectedProduct(products[0]); // Fallback Heineken long neck
                }
                if (screen.id === 'tracking') {
                  setSelectedOrder(orders[0]); // latest
                }
                setCurrentScreen(screen.id as ScreenType);
              }}
              className={`w-full text-left py-2.5 px-4 rounded-xl text-xs font-semibold tracking-wide transition-all border shrink-0 text-ellipsis truncate cursor-pointer ${
                currentScreen === screen.id
                  ? 'bg-brand-primary text-black border-brand-primary font-bold shadow-royal-glow'
                  : 'bg-transparent text-neutral-400 border-transparent hover:bg-neutral-900 hover:text-white'
              }`}
            >
              {screen.label}
            </button>
          ))}
        </div>
      </aside>

      {/* CENTER: TELEFONE FRAME WRAPPER CONTAINER */}
      <section className="flex-1 flex flex-col items-center justify-center py-2 px-1 xl:p-8 relative min-h-screen">
        
        {/* Toggle Panel Button for XL screens */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="fixed top-4 left-4 z-50 p-2 bg-neutral-900/80 border border-white/10 text-white rounded-full hover:bg-neutral-800 transition-colors hidden xl:flex cursor-pointer"
          title="Alternar painel de controle"
        >
          <Sliders className="w-5 h-5 text-brand-primary" />
        </button>

        {/* High-Fidelity Smartphone Silhouette Wrapper Frame */}
        <div className="w-full max-w-[430px] rounded-[48px] bg-black border-[10px] border-neutral-900 shadow-2xl relative flex flex-col justify-start select-none ring-4 ring-neutral-950 min-h-[860px]">
          
          {/* Top Speaker Ear Speaker Notch & Dynamic Island mockup */}
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-5.5 bg-black rounded-full z-50 flex items-center justify-center border border-neutral-900/50">
            {/* Small camera dot */}
            <div className="w-2.5 h-2.5 rounded-full bg-neutral-900/60 ml-auto mr-3 border border-neutral-950" />
          </div>

          {/* Top Status Bar System Indicators */}
          <div className="h-10 shrink-0 px-8 flex justify-between items-center z-40 bg-neutral-950 text-white text-[11px] font-bold select-none border-b border-white/5">
            <span className="font-mono tracking-tight">{realTime}</span>
            <div className="flex items-center gap-1.5 text-neutral-300">
              <span className="text-[10px] tracking-widest font-black uppercase text-brand-primary mr-1 bg-brand-primary/10 px-1.5 py-0.5 rounded">22M</span>
              <Wifi className="w-3.5 h-3.5" />
              <span className="text-[9px] font-black uppercase font-mono tracking-tighter">5G</span>
              <Battery className="w-4 h-4 fill-current text-white shrink-0" />
            </div>
          </div>

          {/* TELEPHONE INNER SCREEN CANVAS PORT (Where the pages load) */}
          <div className="flex-1 w-full bg-black overflow-y-auto hide-scrollbar rounded-[38px] relative flex flex-col">
            
            {/* CURRENT ACTIVE SCREEN RENDERING ROUTER */}
            {currentScreen === 'splash' && (
              <SplashScreen onNext={() => handleNavigate('login')} />
            )}

            {currentScreen === 'login' && (
              <LoginScreen
                onLogin={(phone) => {
                  setUserPhone(phone);
                  handleNavigate('home');
                }}
              />
            )}

            {currentScreen === 'home' && (
              <HomeScreen
                products={products}
                cartCount={cartItemsCount}
                deliveryAddress={deliveryAddress}
                onSelectProduct={(p) => {
                  setSelectedProduct(p);
                  handleNavigate('product-details');
                }}
                onAddToCart={(p) => handleAddToCart(p, 1)}
                onNavigateToCart={() => handleNavigate('cart')}
                onNavigateToCategory={(catId) => {
                  handleNavigate('categories');
                }}
                onNavigateToProfile={() => handleNavigate('profile')}
                onOpenAddressChange={() => {
                  setTypedAddress(deliveryAddress);
                  setShowAddressModal(true);
                }}
              />
            )}

            {currentScreen === 'categories' && (
              <CategoriesScreen
                products={products}
                initialCategory="cerveja"
                cartCount={cartItemsCount}
                onBack={navigateBack}
                onAddToCart={(p) => handleAddToCart(p, 1)}
                onSelectProduct={(p) => {
                  setSelectedProduct(p);
                  handleNavigate('product-details');
                }}
                onNavigateToCart={() => handleNavigate('cart')}
              />
            )}

            {currentScreen === 'product-details' && selectedProduct && (
              <ProductDetailsScreen
                product={selectedProduct}
                onBack={navigateBack}
                onAddToCart={handleAddToCart}
                onSelectProduct={(p) => {
                  setSelectedProduct(p);
                  // stays on details but scrolls
                }}
              />
            )}

            {currentScreen === 'cart' && (
              <CartScreen
                cart={cart}
                onBack={navigateBack}
                onUpdateQuantity={handleUpdateCartQuantity}
                onRemoveItem={handleRemoveCartItem}
                onClearCart={() => setCart([])}
                onProceedToCheckout={handleProceedToCheckout}
              />
            )}

            {currentScreen === 'checkout' && (
              <CheckoutScreen
                cart={cart}
                deliveryAddress={deliveryAddress}
                appliedCoupon={checkoutCoupon}
                couponDiscount={checkoutDiscount}
                onBack={() => handleNavigate('cart')}
                onConfirmOrder={handleConfirmOrder}
              />
            )}

            {currentScreen === 'tracking' && selectedOrder && (
              <TrackingScreen
                order={selectedOrder}
                onBack={() => handleNavigate('history')}
              />
            )}

            {currentScreen === 'history' && (
              <HistoryScreen
                orders={orders}
                onBack={() => handleNavigate('profile')}
                onSelectOrder={(order) => {
                  setSelectedOrder(order);
                  handleNavigate('tracking');
                }}
                onNewOrder={() => handleNavigate('home')}
              />
            )}

            {currentScreen === 'profile' && (
              <ProfileScreen
                userPhone={userPhone}
                cartCount={cartItemsCount}
                onBack={() => handleNavigate('home')}
                onNavigateToCart={() => handleNavigate('cart')}
                onNavigateToHistory={() => handleNavigate('history')}
                onLogout={() => {
                  setUserPhone('');
                  setCart([]);
                  handleNavigate('login');
                }}
                onEditAddress={() => {
                  setTypedAddress(deliveryAddress);
                  setShowAddressModal(true);
                }}
              />
            )}

          </div>

          {/* BOTTOM PERSISTENT NAVIGATION SHELL (Hides during splash page) */}
          {currentScreen !== 'splash' && currentScreen !== 'login' && (
            <nav className="absolute bottom-0 w-full z-40 bg-neutral-950/90 backdrop-blur-2xl border-t border-white/5 flex justify-around items-center pt-3 pb-5 px-3 rounded-b-[48px] select-none shadow">
              <button
                onClick={() => handleNavigate('home')}
                className={`flex flex-col items-center justify-center bg-transparent border-none cursor-pointer group ${
                  currentScreen === 'home' ? 'text-brand-primary active-tab-glow font-bold' : 'text-neutral-500 hover:text-white'
                }`}
              >
                <Home className="w-4.5 h-4.5" />
                <span className="text-[10px] mt-1 font-bold">Início</span>
              </button>

              <button
                onClick={() => handleNavigate('categories')}
                className={`flex flex-col items-center justify-center bg-transparent border-none cursor-pointer group ${
                  currentScreen === 'categories' ? 'text-brand-primary active-tab-glow font-bold' : 'text-neutral-500 hover:text-white'
                }`}
              >
                <Grid className="w-4.5 h-4.5" />
                <span className="text-[10px] mt-1 font-bold">Categorias</span>
              </button>

              <button
                onClick={() => handleNavigate('history')}
                className={`flex flex-col items-center justify-center bg-transparent border-none cursor-pointer group ${
                  currentScreen === 'history' || currentScreen === 'tracking' ? 'text-brand-primary active-tab-glow font-bold' : 'text-neutral-500 hover:text-white'
                }`}
              >
                <History className="w-4.5 h-4.5" />
                <span className="text-[10px] mt-1 font-bold">Pedidos</span>
              </button>

              <button
                onClick={() => handleNavigate('profile')}
                className={`flex flex-col items-center justify-center bg-transparent border-none cursor-pointer group ${
                  currentScreen === 'profile' ? 'text-brand-primary active-tab-glow font-bold' : 'text-neutral-500 hover:text-white'
                }`}
              >
                <User className="w-4.5 h-4.5" />
                <span className="text-[10px] mt-1 font-bold font-sans">Perfil</span>
              </button>

              <button
                onClick={() => handleNavigate('cart')}
                className={`flex flex-col items-center justify-center bg-transparent border-none cursor-pointer group relative ${
                  currentScreen === 'cart' ? 'text-brand-primary active-tab-glow font-bold' : 'text-neutral-500 hover:text-white'
                }`}
              >
                <ShoppingBag className="w-4.5 h-4.5" />
                <span className="text-[10px] mt-1 font-bold">Carrinho</span>
                {cartItemsCount > 0 && (
                  <span className="absolute top-0 right-1.5 w-4 h-4 bg-brand-secondary-container text-white text-[9px] font-black rounded-full flex items-center justify-center border border-black">
                    {cartItemsCount}
                  </span>
                )}
              </button>
            </nav>
          )}

          {/* DIALOG/MODAL: ADDRESS CHANGE EDIT MODCKUP */}
          {showAddressModal && (
            <div className="absolute inset-0 bg-black/85 backdrop-blur-md z-[60] flex items-center justify-center p-6 select-none animate-fade-in">
              <div className="glass-panel p-5 rounded-3xl w-full max-w-[340px] text-left border border-white/10 space-y-4 shadow-royal-glow">
                <div className="flex items-center gap-2 text-brand-primary">
                  <MapPin className="w-5 h-5 animate-bounce" />
                  <h3 className="text-sm font-extrabold uppercase tracking-wide">Endereço de Entrega</h3>
                </div>
                
                <p className="text-[10px] font-semibold text-neutral-400 leading-snug">
                  Informe onde entregar suas bebidas geladas! Entregamos em Nova Iguaçu e adjacências em minutos.
                </p>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest pl-1" htmlFor="address-input">Logradouro</label>
                  <input
                    id="address-input"
                    type="text"
                    value={tempAddress}
                    onChange={(e) => setTypedAddress(e.target.value)}
                    placeholder="Rua Exemplo, 123"
                    className="w-full bg-[#111] border border-white/10 rounded-xl p-3 text-xs text-white focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary tracking-tight font-medium"
                    autoFocus
                  />
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => setShowAddressModal(false)}
                    className="flex-1 py-3 border border-white/10 rounded-xl text-xs font-bold text-neutral-500 hover:text-white hover:bg-neutral-900 cursor-pointer bg-transparent"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleUpdateAddress}
                    className="flex-1 py-3 bg-brand-primary text-black font-extrabold text-xs rounded-xl hover:bg-white transition-colors cursor-pointer border-none"
                  >
                    Confirmar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* POPUP OVERLAY TOAST FEEDBACK FOR CART ADDITIONS / ORDER UPDATES */}
          {successToast && (
            <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-sm pointer-events-none transition-all animate-fade-in select-none">
              <div className="glass-panel p-6 rounded-[28px] flex flex-col items-center text-center max-w-[240px] shadow-royal-glow border border-brand-primary/20">
                <div className="w-14 h-14 rounded-full bg-brand-primary text-black flex items-center justify-center mb-3 animate-pulse">
                  <CheckCircle2 className="w-8 h-8 stroke-[2.5px]" />
                </div>
                <h3 className="text-sm font-black text-white">{successToast.title}</h3>
                <p className="text-[10px] text-neutral-400 mt-1 font-semibold leading-relaxed leading-3">
                  {successToast.message}
                </p>
              </div>
            </div>
          )}

        </div>
      </section>
    </div>
  );
}
