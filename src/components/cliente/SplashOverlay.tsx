"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export function SplashOverlay() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), 2400);
    const hideTimer = setTimeout(() => setVisible(false), 2800);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between py-16 px-6 text-center bg-black overflow-hidden select-none transition-opacity duration-400 ${
        fading ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(circle at center, rgba(30,47,191,0.15) 0%, transparent 70%)" }}
      />

      <div />

      <div className="flex flex-col items-center gap-6 relative z-10">
        <div className="relative w-48 h-48" style={{ filter: "drop-shadow(0 0 35px rgba(61,77,216,0.35))" }}>
          <Image
            src="/logo.png"
            alt="Mascote 22 Maluco"
            fill
            className="object-contain animate-pulse"
            priority
          />
        </div>
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2 uppercase">
            22 Maluco
          </h1>
          <p className="text-neutral-500 font-medium tracking-widest text-xs uppercase">
            Depósito de Bebidas 24h
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-3 relative z-10 w-full max-w-[200px]">
        <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden border border-white/5">
          <div className="animate-progress h-full rounded-full"
            style={{ background: "linear-gradient(90deg, #1e2fbf 0%, #3d4dd8 50%, #7c3aed 100%)" }}
          />
        </div>
        <p className="text-xs text-neutral-500 font-mono tracking-widest animate-pulse">
          Carregando experiência gelada...
        </p>
      </div>
    </div>
  );
}
