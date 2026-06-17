"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { useAddress } from "@/hooks/useAddress";

function distanceKm(aLat: number, aLng: number, bLat: number, bLng: number) {
  const R = 6371;
  const dLat = ((bLat - aLat) * Math.PI) / 180;
  const dLng = ((bLng - aLng) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((aLat * Math.PI) / 180) * Math.cos((bLat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

export function AddressGate() {
  const { address, hydrated, openModal } = useAddress();
  const [mismatch, setMismatch] = useState(false);
  const checked = useRef(false);

  // 1) Entrada: se já passou no 18+ e não tem endereço, exige cadastrar
  useEffect(() => {
    if (!hydrated || address) return;
    let ageOk = false;
    try { ageOk = localStorage.getItem("22maluco-age-ok") === "1"; } catch { /* ignore */ }
    if (ageOk) openModal(true);
  }, [hydrated, address, openModal]);

  // 2) Aviso de endereço divergente (GPS distante do endereço cadastrado)
  useEffect(() => {
    if (checked.current) return;
    if (!hydrated || !address?.lat || !address?.lng) return;
    if (typeof navigator === "undefined" || !navigator.geolocation || !window.isSecureContext) return;
    checked.current = true;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const km = distanceKm(pos.coords.latitude, pos.coords.longitude, address.lat!, address.lng!);
        if (km > 0.7) setMismatch(true);
      },
      () => { /* sem permissão — ignora */ },
      { enableHighAccuracy: false, timeout: 12000, maximumAge: 60000 }
    );
  }, [hydrated, address]);

  if (!mismatch) return null;

  return (
    <div className="fixed top-2 left-2 right-2 md:left-1/2 md:-translate-x-1/2 md:right-auto md:w-[28rem] z-[1400]">
      <div className="glass-panel rounded-2xl border border-tertiary/30 p-3 flex items-start gap-3 shadow-2xl">
        <Icon name="wrong_location" className="text-xl text-tertiary shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-on-surface text-body-sm font-semibold">Você parece estar em outro endereço</p>
          <p className="text-on-surface-variant text-label-md mt-0.5 truncate">
            Cadastrado: {address?.formatted}
          </p>
          <div className="flex gap-2 mt-2">
            <button onClick={() => { setMismatch(false); openModal(); }} className="text-primary text-label-lg font-bold hover:underline">
              Atualizar endereço
            </button>
            <button onClick={() => setMismatch(false)} className="text-on-surface-variant text-label-lg hover:text-on-surface">
              Manter
            </button>
          </div>
        </div>
        <button onClick={() => setMismatch(false)} className="text-on-surface-variant hover:text-on-surface p-0.5" aria-label="Fechar">
          <Icon name="close" className="text-lg" />
        </button>
      </div>
    </div>
  );
}
