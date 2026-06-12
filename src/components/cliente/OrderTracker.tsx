"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { CheckCircle2, Circle, Bike, Phone, MessageCircle, User } from "lucide-react";
import type { OrderStatus } from "@/lib/types/database";

const steps: { status: OrderStatus; label: string; description: string }[] = [
  { status: "pendente", label: "Pedido recebido", description: "Aguardando confirmação da loja" },
  { status: "aceito", label: "Pedido aceito", description: "A loja confirmou seu pedido" },
  { status: "preparando", label: "Preparando", description: "Seu pedido está sendo separado" },
  { status: "saiu", label: "Saiu para entrega", description: "O entregador está a caminho" },
  { status: "entregue", label: "Entregue!", description: "Aproveite suas bebidas 🎉" },
];

const statusOrder: Record<OrderStatus, number> = {
  pendente: 0,
  aceito: 1,
  preparando: 2,
  saiu: 3,
  entregue: 4,
  cancelado: -1,
};

export function OrderTracker({ status: initialStatus, orderId }: { status: OrderStatus; orderId: string }) {
  const [status, setStatus] = useState<OrderStatus>(initialStatus);

  // Supabase Realtime — lógica intacta
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`order-${orderId}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "orders", filter: `id=eq.${orderId}` },
        (payload) => {
          setStatus((payload.new as { status: OrderStatus }).status);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [orderId]);

  if (status === "cancelado") {
    return (
      <div className="glass-panel rounded-2xl p-6 text-center content-container mt-4">
        <p className="text-brand-secondary font-bold text-base">Pedido cancelado</p>
        <p className="text-neutral-400 text-sm mt-1">Entre em contato pelo WhatsApp</p>
        <a
          href="https://wa.me/5521968979426"
          className="inline-flex items-center gap-2 mt-4 text-sm font-bold text-brand-primary"
        >
          <MessageCircle className="w-4 h-4" />
          Falar com a loja
        </a>
      </div>
    );
  }

  const currentIdx = statusOrder[status];
  const activeStep = steps[currentIdx] ?? steps[0];

  return (
    <>
      <div className="md:flex md:gap-6 content-container md:mt-6">
        {/* Left column: Map + status */}
        <div className="flex-1">
          {/* Map Placeholder */}
          <div
            className="relative h-44 md:h-64 overflow-hidden md:rounded-2xl"
            style={{ background: "linear-gradient(to bottom, #0a0a0a, #0f0f1a, #000)" }}
          >
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <div className="grid grid-cols-6 gap-3 w-full h-full p-4">
                {Array.from({ length: 36 }).map((_, i) => (
                  <div key={i} className="rounded bg-brand-primary/20 h-4" />
                ))}
              </div>
            </div>
            {/* Floating status card */}
            <div className="absolute bottom-4 left-4 right-4 glass-panel rounded-xl p-3 flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-primary-container rounded-full flex items-center justify-center shrink-0">
                <Bike className="w-5 h-5 text-brand-primary animate-pulse" />
              </div>
              <div className="min-w-0">
                <p className="text-white font-bold text-sm truncate">{activeStep.label}</p>
                <p className="text-neutral-400 text-xs truncate">{activeStep.description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Timeline + courier */}
        <div className="md:w-[380px] md:shrink-0">
          {/* Timeline */}
          <div className="glass-panel mt-4 md:mt-0 rounded-2xl p-5">
            <h3 className="text-xs font-black uppercase tracking-wider text-neutral-400 mb-4">Acompanhamento</h3>
            <div className="space-y-0">
              {steps.map((step, idx) => {
                const done = idx < currentIdx;
                const active = idx === currentIdx;
                const inactive = idx > currentIdx;
                const isLast = idx === steps.length - 1;

                return (
                  <div
                    key={step.status}
                    className={`relative flex items-start gap-3 pb-6 ${
                      isLast ? "step-last" : done || active ? "step-active" : "step-inactive"
                    }`}
                  >
                    {/* Circle */}
                    <div className="shrink-0 w-6 h-6 flex items-center justify-center z-10 relative">
                      {done ? (
                        <CheckCircle2 className="w-6 h-6 text-brand-primary" />
                      ) : active ? (
                        <div className="w-6 h-6 rounded-full bg-brand-primary flex items-center justify-center">
                          <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" />
                        </div>
                      ) : (
                        <Circle className="w-6 h-6 text-neutral-700" />
                      )}
                    </div>

                    {/* Content */}
                    <div className={`flex-1 pt-0.5 ${inactive ? "opacity-30" : ""}`}>
                      <p className={`text-sm font-bold ${active ? "text-white" : done ? "text-neutral-300" : "text-neutral-600"}`}>
                        {step.label}
                      </p>
                      {(done || active) && (
                        <p className="text-xs text-neutral-500 mt-0.5">{step.description}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Courier Card */}
          {(status === "saiu" || status === "entregue") && (
            <div className="glass-panel mt-3 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-neutral-800 border-2 border-brand-primary/30 flex items-center justify-center shrink-0">
                <User className="w-6 h-6 text-neutral-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black uppercase tracking-wider text-neutral-500">Entregador</p>
                <p className="text-white font-bold text-sm">Entregador Parceiro</p>
                <p className="text-xs text-neutral-500">⭐ 4.9 · 22 Maluco Express</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <a
                  href="tel:21968979426"
                  className="w-9 h-9 bg-neutral-800 rounded-full flex items-center justify-center hover:bg-neutral-700 transition-colors"
                >
                  <Phone className="w-4 h-4 text-white" />
                </a>
                <a
                  href="https://wa.me/5521968979426"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                  style={{ backgroundColor: "#25D366" }}
                >
                  <MessageCircle className="w-4 h-4 text-white fill-current" />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
