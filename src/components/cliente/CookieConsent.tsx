"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";

const KEY = "22maluco-cookies";

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setShow(true);
    } catch { /* ignore */ }
  }, []);

  function decide(value: "accepted" | "rejected") {
    try { localStorage.setItem(KEY, value); } catch { /* ignore */ }
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[1500] p-3 md:p-4 md:bottom-4 md:left-4 md:right-auto md:max-w-md">
      <div className="glass-panel rounded-2xl border border-white/10 p-4 shadow-2xl">
        <div className="flex items-start gap-3">
          <Icon name="cookie" className="text-2xl text-tertiary shrink-0 mt-0.5" />
          <div className="min-w-0">
            <p className="text-on-surface text-body-sm font-semibold">A gente usa cookies 🍪</p>
            <p className="text-on-surface-variant text-label-md mt-1">
              Usamos cookies pra melhorar sua experiência, lembrar seu endereço e o carrinho. Você pode aceitar ou recusar.
            </p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => decide("accepted")}
                className="flex-1 btn-gradient text-white text-label-lg font-bold py-2.5 rounded-xl active:scale-95 transition-all"
              >
                Aceitar
              </button>
              <button
                onClick={() => decide("rejected")}
                className="flex-1 border border-white/15 text-on-surface text-label-lg py-2.5 rounded-xl hover:bg-white/5 transition-colors active:scale-95"
              >
                Rejeitar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
