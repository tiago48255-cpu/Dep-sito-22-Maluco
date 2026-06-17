"use client";

import dynamic from "next/dynamic";
import { Icon } from "@/components/ui/Icon";
import { STORE_ADDRESS, STORE_LAT, STORE_LNG, STORE_MAPS_URL } from "@/lib/constants";

// Mapa só no cliente (Leaflet precisa de window). Reusa o DeliveryMap só com a loja.
const DeliveryMap = dynamic(() => import("./DeliveryMap"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-[#0a0a0f] animate-pulse" />,
});

export function StoreLocation() {
  return (
    <section className="content-container mt-10 mb-4">
      <div className="flex items-center gap-2 mb-4">
        <Icon name="storefront" className="text-2xl text-primary" />
        <h2 className="text-headline-sm md:text-headline-md text-on-surface">Onde estamos</h2>
      </div>

      <div className="glass-panel rounded-3xl overflow-hidden border border-outline-variant/10">
        {/* Endereço */}
        <div className="flex items-start gap-3 p-5">
          <Icon name="location_on" filled className="text-xl text-secondary shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-on-surface text-body-md font-semibold">22 Maluco — Depósito de Bebidas 24h</p>
            <p className="text-on-surface-variant text-body-sm mt-0.5">{STORE_ADDRESS}</p>
          </div>
          <a
            href={STORE_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 flex items-center gap-1.5 bg-primary-container text-on-primary-container px-4 py-2 rounded-full text-label-lg hover:brightness-110 transition-all active:scale-95"
          >
            <Icon name="directions" className="text-lg" />
            <span className="hidden sm:inline">Como chegar</span>
          </a>
        </div>

        {/* Mapa */}
        <div className="h-56 md:h-72 w-full border-t border-outline-variant/10">
          <DeliveryMap driverLat={null} driverLng={null} storeLat={STORE_LAT} storeLng={STORE_LNG} />
        </div>
      </div>
    </section>
  );
}
