"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { createClient } from "@/lib/supabase/client";
import { Icon } from "@/components/ui/Icon";
import { WHATSAPP_URL, STORE_LAT, STORE_LNG } from "@/lib/constants";
import type { OrderStatus } from "@/lib/types/database";

// Mapa só no cliente (Leaflet precisa de window)
const DeliveryMap = dynamic(() => import("./DeliveryMap"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-[#0a0a0f] animate-pulse" />,
});

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

interface Driver {
  name: string;
  phone: string;
}

export function OrderTracker({
  status: initialStatus,
  orderId,
  driver: initialDriver = null,
  initialDriverLat = null,
  initialDriverLng = null,
}: {
  status: OrderStatus;
  orderId: string;
  driver?: Driver | null;
  initialDriverLat?: number | null;
  initialDriverLng?: number | null;
}) {
  const [status, setStatus] = useState<OrderStatus>(initialStatus);
  const [driver, setDriver] = useState<Driver | null>(initialDriver);
  const [driverLat, setDriverLat] = useState<number | null>(initialDriverLat);
  const [driverLng, setDriverLng] = useState<number | null>(initialDriverLng);

  // Supabase Realtime — status + posição do entregador ao vivo
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`order-${orderId}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "orders", filter: `id=eq.${orderId}` },
        (payload) => {
          const row = payload.new as {
            status: OrderStatus;
            driver_lat: number | null;
            driver_lng: number | null;
            motoboy_id: string | null;
          };
          setStatus(row.status);
          if (row.driver_lat != null) setDriverLat(row.driver_lat);
          if (row.driver_lng != null) setDriverLng(row.driver_lng);
          // Entregador atribuído depois de carregar a página → busca nome/telefone
          if (row.motoboy_id && !driver) {
            supabase
              .from("motoboys")
              .select("name, phone")
              .eq("id", row.motoboy_id)
              .single()
              .then(({ data }) => { if (data) setDriver(data as Driver); });
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [orderId, driver]);

  if (status === "cancelado") {
    return (
      <div className="glass-panel rounded-2xl p-6 text-center content-container mt-4">
        <p className="text-secondary font-bold text-body-md">Pedido cancelado</p>
        <p className="text-on-surface-variant text-body-sm mt-1">Entre em contato pelo WhatsApp</p>
        <a href={WHATSAPP_URL} className="inline-flex items-center gap-2 mt-4 text-body-sm font-bold text-primary">
          <Icon name="chat" className="text-lg" />
          Falar com a loja
        </a>
      </div>
    );
  }

  const currentIdx = statusOrder[status];
  const activeStep = steps[currentIdx] ?? steps[0];
  const onTheWay = status === "saiu" || status === "entregue";

  return (
    <>
      <div className="md:flex md:gap-6 content-container md:mt-6">
        {/* Left column: Map + status */}
        <div className="flex-1">
          <div className="relative h-56 md:h-72 overflow-hidden md:rounded-2xl bg-[#0a0a0f]">
            {onTheWay ? (
              <DeliveryMap
                driverLat={driverLat}
                driverLng={driverLng}
                storeLat={STORE_LAT}
                storeLng={STORE_LNG}
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center px-6"
                style={{ background: "linear-gradient(160deg, #0f0f1a, #000)" }}>
                <Icon name="restaurant" className="text-4xl text-primary animate-pulse" />
                <p className="text-on-surface text-body-sm font-bold">{activeStep.label}</p>
                <p className="text-on-surface-variant text-label-md">{activeStep.description}</p>
              </div>
            )}

            {/* Floating status card sobre o mapa */}
            {onTheWay && (
              <div className="absolute bottom-3 left-3 right-3 glass-panel rounded-xl p-3 flex items-center gap-3 z-[1000] pointer-events-none">
                <div className="w-10 h-10 bg-primary-container rounded-full flex items-center justify-center shrink-0">
                  <Icon name="sports_motorsports" className="text-xl text-primary animate-pulse" />
                </div>
                <div className="min-w-0">
                  <p className="text-on-surface font-bold text-body-sm truncate">{activeStep.label}</p>
                  <p className="text-on-surface-variant text-label-md truncate">
                    {driverLat != null ? "Acompanhando o entregador ao vivo" : activeStep.description}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right column: Timeline + courier */}
        <div className="md:w-[380px] md:shrink-0">
          {/* Timeline */}
          <div className="glass-panel mt-4 md:mt-0 rounded-2xl p-5">
            <h3 className="text-label-lg uppercase tracking-wider text-on-surface-variant mb-4">Acompanhamento</h3>
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
                        <Icon name="check_circle" filled className="text-2xl text-primary" />
                      ) : active ? (
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                          <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" />
                        </div>
                      ) : (
                        <Icon name="radio_button_unchecked" className="text-2xl text-outline-variant" />
                      )}
                    </div>

                    {/* Content */}
                    <div className={`flex-1 pt-0.5 ${inactive ? "opacity-30" : ""}`}>
                      <p className={`text-body-sm font-bold ${active ? "text-on-surface" : done ? "text-on-surface-variant" : "text-on-surface-variant/60"}`}>
                        {step.label}
                      </p>
                      {(done || active) && (
                        <p className="text-label-md text-on-surface-variant mt-0.5">{step.description}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Courier Card — entregador real */}
          {onTheWay && (
            <div className="glass-panel mt-3 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-surface-container-high border-2 border-primary/30 flex items-center justify-center shrink-0">
                <Icon name="sports_motorsports" filled className="text-2xl text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-label-md uppercase tracking-wider text-on-surface-variant">Entregador</p>
                {driver ? (
                  <>
                    <p className="text-on-surface font-bold text-body-sm truncate">{driver.name}</p>
                    <p className="text-label-md text-on-surface-variant flex items-center gap-1">
                      <Icon name="verified" filled className="text-sm text-primary" /> 22 Maluco Express
                    </p>
                  </>
                ) : (
                  <p className="text-on-surface-variant text-body-sm">Procurando entregador…</p>
                )}
              </div>
              {driver && (
                <div className="flex gap-2 shrink-0">
                  <a href={`tel:${driver.phone}`} className="w-9 h-9 bg-surface-container-high rounded-full flex items-center justify-center hover:bg-surface-container-highest transition-colors">
                    <Icon name="call" className="text-lg text-on-surface" />
                  </a>
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full flex items-center justify-center transition-colors" style={{ backgroundColor: "#25D366" }}>
                    <Icon name="chat" filled className="text-lg text-white" />
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
