"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useAddress } from "@/hooks/useAddress";

const KEY = "22maluco-age-ok";

export function AgeGate() {
  const [show, setShow] = useState(true);
  const [denied, setDenied] = useState(false);
  const { address, openModal } = useAddress();

  useEffect(() => {
    try {
      if (localStorage.getItem(KEY) === "1") setShow(false);
    } catch { /* ignore */ }
  }, []);

  function confirm() {
    try { localStorage.setItem(KEY, "1"); } catch { /* ignore */ }
    setShow(false);
    if (!address) openModal(true);
  }

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black p-6">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, rgba(30,47,191,0.18) 0%, transparent 70%)" }}
      />
      <div className="relative z-10 w-[22rem] max-w-[calc(100vw-3rem)] text-center flex flex-col items-center mx-auto">
        <div className="relative w-28 h-28 mb-5" style={{ filter: "drop-shadow(0 0 30px rgba(61,77,216,0.4))" }}>
          <Image src="/logo.png" alt="22 Maluco" fill className="object-contain" priority />
        </div>

        {denied ? (
          <>
            <h1 className="text-2xl font-extrabold text-white mb-2">Volte quando tiver 18+</h1>
            <p className="text-neutral-400 text-sm">
              A venda de bebidas alcoólicas é proibida para menores de 18 anos.
            </p>
            <button
              onClick={() => setDenied(false)}
              className="mt-6 text-primary text-label-lg font-bold hover:underline"
            >
              Voltar
            </button>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Você tem 18 anos ou mais?</h1>
            <p className="text-neutral-400 text-sm mt-2 mb-8">
              Pra entrar no 22 Maluco você precisa ser maior de idade.
            </p>
            <div className="flex gap-3 w-full">
              <button
                onClick={() => setDenied(true)}
                className="flex-1 py-3.5 rounded-xl border border-white/15 text-white font-bold hover:bg-white/5 transition-colors active:scale-95"
              >
                Não
              </button>
              <button
                onClick={confirm}
                className="flex-1 py-3.5 rounded-xl btn-gradient shadow-royal-glow text-white font-bold active:scale-95 transition-all"
              >
                Sim, tenho 18+
              </button>
            </div>
          </>
        )}

        <p className="mt-8 text-[10px] text-neutral-600 uppercase tracking-widest font-mono">
          Beba com moderação · Se beber, não dirija
        </p>
      </div>
    </div>
  );
}
