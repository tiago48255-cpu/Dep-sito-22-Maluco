import { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  HelpCircle, 
  Check, 
  Bike, 
  Phone, 
  MessageSquare, 
  Star, 
  MapPin,
  Sparkles,
  Search
} from 'lucide-react';
import { Order } from '../types';

interface TrackingScreenProps {
  order: Order;
  onBack: () => void;
}

export default function TrackingScreen({ order, onBack }: TrackingScreenProps) {
  // Let's copy tracking events to local state so we can simulate ticking
  const [localEvents, setLocalEvents] = useState(order.trackingEvents);
  const [activeStepIndex, setActiveStepIndex] = useState(3); // "Saiu para entrega" index

  useEffect(() => {
    setLocalEvents(order.trackingEvents);
  }, [order]);

  // Small timer to simulate real-time movement and delivery completion if they wait 15 seconds!
  useEffect(() => {
    const timer = setTimeout(() => {
      if (activeStepIndex === 3) {
        // Safe transition: Mark 'Saiu para entrega' fully checked, and activate 'Entregue'
        const updated = [...localEvents];
        // Out for delivery completed
        updated[3] = { ...updated[3], active: false, completed: true };
        // Delivered activated
        updated[4] = { ...updated[4], title: 'Entregue', description: 'Entregue com sucesso!', time: '21:55', completed: true, active: true };
        setLocalEvents(updated);
        setActiveStepIndex(4);
      }
    }, 15000);

    return () => clearTimeout(timer);
  }, [activeStepIndex, localEvents]);

  const activeEvent = localEvents.find(e => e.active) || localEvents[localEvents.length - 1];

  return (
    <div className="text-white min-h-[750px] pb-24 bg-black">
      {/* Top App Bar */}
      <header className="sticky top-0 z-50 bg-neutral-950/95 backdrop-blur-xl border-b border-white/5 px-5 py-3 flex justify-between items-center h-16 select-none shadow">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="text-brand-primary p-2 hover:bg-neutral-900 rounded-full transition-colors border-none bg-transparent cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold text-white">Pedido {order.id}</span>
            <span className="text-[10px] text-neutral-400 font-semibold">{order.date}</span>
          </div>
        </div>

        <button className="text-brand-primary hover:opacity-85 border-none bg-transparent cursor-pointer p-2">
          <HelpCircle className="w-5 h-5" />
        </button>
      </header>

      {/* Map Section Backdrop with status card */}
      <section className="relative h-64 overflow-hidden select-none">
        <div className="absolute inset-0 z-0">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5KWz0naxgib_Ff0k7vX0mpEhmpHXMXahhYQJKZjvvzw1rTxy5OjiHyiN5IKqCXDKQrpKIQ136RBUz-7Jc2qJdZnyDeeLZf6id0jKSzllzsX_EYuRnWXMzwL5ytdbtkfnlrn6jIv_prvFEgivCsdyG1l7TZ8yl2WOkbKeGULi0E-NdACYDoSbQ-8LX-EjDcp9OQWbYL9ss3VTB9sx_GYDaNBRYbJcqiSSgUciuXtj8OY3enrmc5U3cVTOOgfStcLXMr8H7VGoXZrs"
            alt="Delivery map mock layout"
            className="w-full h-full object-cover opacity-50"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black to-transparent" />
          <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-black to-transparent" />
        </div>

        {/* Floating active tracking state card overlay */}
        <div className="absolute bottom-5 left-5 right-5 z-10 text-left">
          <div className="glass-panel p-4 rounded-2xl flex items-center gap-4 border-l-4 border-l-brand-primary border-white/5 shadow-royal-glow">
            <div className="w-10 h-10 rounded-full bg-brand-primary-container/20 flex items-center justify-center text-brand-primary animate-pulse shrink-0">
              <Bike className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-black text-brand-primary leading-tight">
                {activeEvent ? activeEvent.title : 'Saiu para entrega'}
              </h2>
              <p className="text-[10px] text-neutral-400 mt-1 font-semibold truncate leading-none">
                {activeEvent ? activeEvent.description : 'Seu pedido está a caminho!'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Progression timeline */}
      <main className="px-5 space-y-6">
        <section className="glass-panel p-5 rounded-2xl border border-white/5 relative z-10">
          <div className="space-y-6">
            {localEvents.map((event, index) => {
              const isLast = index === localEvents.length - 1;
              const isEventCompleted = event.completed;
              const isEventActive = event.active;

              return (
                <div 
                  key={index} 
                  className={`relative flex gap-4 text-left ${
                    isLast ? '' : isEventCompleted ? 'step-active' : 'step-inactive'
                  }`}
                >
                  {/* Circle indicator step */}
                  <div className="relative z-10 shrink-0">
                    {isEventActive ? (
                      <div className="w-6 h-6 rounded-full bg-brand-primary border-4 border-black flex items-center justify-center ring-4 ring-brand-primary-container/45">
                        <div className="w-1.5 h-1.5 rounded-full bg-black" />
                      </div>
                    ) : isEventCompleted ? (
                      <div className="w-6 h-6 rounded-full bg-brand-primary flex items-center justify-center text-black">
                        <Check className="w-3.5 h-3.5 font-extrabold stroke-[3px]" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center text-neutral-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-neutral-600" />
                      </div>
                    )}
                  </div>

                  {/* Informational description */}
                  <div className="flex justify-between w-full min-w-0 pb-1">
                    <div className="min-w-0 pr-2">
                      <h3 className={`text-xs font-black tracking-tight leading-snug ${
                        isEventActive ? 'text-brand-primary' : isEventCompleted ? 'text-white' : 'text-neutral-500'
                      }`}>
                        {event.title}
                      </h3>
                      <p className="text-[10px] text-neutral-400 mt-0.5 leading-snug">
                        {event.description}
                      </p>
                    </div>
                    <span className={`text-[10px] font-mono shrink-0 font-bold ${
                      isEventActive ? 'text-brand-primary' : 'text-neutral-500'
                    }`}>
                      {event.time}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Courier João Santos cards Section */}
        {order.courier && (
          <section className="bg-[#111] p-4 rounded-2xl border border-white/5 flex items-center justify-between shadow-md text-left">
            <div className="flex items-center gap-3">
              <div className="relative shrink-0 select-none">
                <img
                  src={order.courier.avatar}
                  alt={order.courier.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-brand-primary"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute -bottom-1 -right-1 bg-brand-primary text-black p-1 rounded-full">
                  <Bike className="w-3 h-3 stroke-[2.5px]" />
                </div>
              </div>

              <div>
                <h4 className="text-xs font-black text-white">{order.courier.name}</h4>
                <div className="flex items-center gap-1 mt-1 leading-none">
                  <Star className="w-3.5 h-3.5 text-brand-tertiary fill-current" />
                  <span className="text-brand-tertiary font-black text-xs leading-none">
                    {order.courier.rating.toFixed(1)}
                  </span>
                  <span className="text-[10px] text-neutral-500 font-bold ml-1">
                    Entregador Parceiro
                  </span>
                </div>
              </div>
            </div>

            {/* Simulated CTA callback and buttons */}
            <div className="flex gap-2">
              <a 
                href="tel:5521999999999" 
                className="w-10 h-10 flex items-center justify-center rounded-full bg-brand-primary-container/10 hover:bg-brand-primary-container/20 text-brand-primary transition-colors cursor-pointer border border-brand-primary/10"
              >
                <Phone className="w-4.5 h-4.5" />
              </a>
              <a 
                href="https://wa.me/5521999999999" 
                target="_blank" 
                rel="noreferrer" 
                className="w-10 h-10 flex items-center justify-center rounded-full bg-brand-primary-container/10 hover:bg-brand-primary-container/20 text-brand-primary transition-colors cursor-pointer border border-brand-primary/10"
              >
                <MessageSquare className="w-4.5 h-4.5" />
              </a>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
