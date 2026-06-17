"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Icon } from "@/components/ui/Icon";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function AppPromo() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [iosHint, setIosHint] = useState(false);

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => setInstalled(true);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    // já instalado / standalone?
    if (window.matchMedia("(display-mode: standalone)").matches) setInstalled(true);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  async function install() {
    if (deferred) {
      await deferred.prompt();
      const { outcome } = await deferred.userChoice;
      if (outcome === "accepted") setInstalled(true);
      setDeferred(null);
      return;
    }
    // iOS (Safari não dispara beforeinstallprompt) → instruções
    setIosHint(true);
  }

  return (
    <section className="content-container mt-12">
      <div className="relative overflow-hidden rounded-3xl hero-gradient shadow-2xl">
        {/* brilho de fundo */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute -right-10 -top-10 w-60 h-60 rounded-full bg-white/20 blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 p-6 md:p-10">
          {/* Mascote */}
          <div className="relative w-32 h-32 md:w-44 md:h-44 shrink-0" style={{ filter: "drop-shadow(0 8px 24px rgba(0,0,0,.5))" }}>
            <Image src="/stitch/mascote.png" alt="Mascote 22 Maluco" fill className="object-contain" />
          </div>

          {/* Texto + badges */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
              Baixe o app do 22 Maluco
            </h2>
            <p className="text-white/80 text-body-sm md:text-body-md mt-2 mb-5">
              {installed
                ? "App instalado! Abra pela tela inicial do seu celular. 🎉"
                : "Instale na tela inicial e peça sua gelada em segundos — funciona no Android e no iPhone."}
            </p>

            {!installed && (
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <button onClick={install} className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl hover:brightness-125 transition-all active:scale-95 border border-white/15">
                  <Icon name="android" className="text-2xl" />
                  <span className="text-left leading-none">
                    <span className="block text-[9px] uppercase tracking-wide text-white/60">Disponível no</span>
                    <span className="block text-sm font-bold">Google Play</span>
                  </span>
                </button>
                <button onClick={install} className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl hover:brightness-125 transition-all active:scale-95 border border-white/15">
                  <Icon name="phone_iphone" className="text-2xl" />
                  <span className="text-left leading-none">
                    <span className="block text-[9px] uppercase tracking-wide text-white/60">Baixar na</span>
                    <span className="block text-sm font-bold">App Store</span>
                  </span>
                </button>
              </div>
            )}

            {iosHint && (
              <p className="mt-4 text-white/90 text-xs bg-black/30 rounded-xl p-3 text-left">
                <b>No iPhone:</b> toque em <Icon name="ios_share" className="text-sm align-middle" /> <b>Compartilhar</b> e
                depois em <b>“Adicionar à Tela de Início”</b>.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
