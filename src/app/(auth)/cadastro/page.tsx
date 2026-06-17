import { RegisterForm } from "@/components/cliente/RegisterForm";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

export default function CadastroPage() {
  return (
    <div className="min-h-screen bg-black md:grid md:grid-cols-2">
      {/* Left panel — Branding (desktop only) */}
      <div className="hidden md:flex flex-col items-center justify-center relative overflow-hidden p-12">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, rgba(30,47,191,0.12) 0%, transparent 70%)" }}
        />

        <div className="relative z-10 flex flex-col items-center text-center max-w-md">
          <div className="relative w-40 h-40 mb-6" style={{ filter: "drop-shadow(0 0 35px rgba(61,77,216,0.35))" }}>
            <Image
              src="/logo.png"
              alt="Mascote 22 Maluco"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight leading-tight uppercase">
            22 Maluco
          </h1>
          <p className="text-neutral-400 font-medium tracking-widest text-sm uppercase mt-2">
            Depósito de Bebidas 24h
          </p>

          <div className="grid grid-cols-2 gap-4 mt-10 w-full">
            <div className="flex items-center gap-3 bg-neutral-900/60 p-4 rounded-2xl border border-white/5">
              <div className="w-10 h-10 rounded-full bg-brand-primary-container/30 flex items-center justify-center text-brand-primary shrink-0">
                <Icon name="schedule" className="text-xl" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-white uppercase tracking-wider">24 HORAS</p>
                <p className="text-[10px] text-neutral-500 leading-none mt-0.5">Sempre disponível</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-neutral-900/60 p-4 rounded-2xl border border-white/5">
              <div className="w-10 h-10 rounded-full bg-brand-secondary-container/30 flex items-center justify-center text-brand-secondary shrink-0">
                <Icon name="moped" className="text-xl" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-white uppercase tracking-wider">RÁPIDA</p>
                <p className="text-[10px] text-neutral-500 leading-none mt-0.5">Chega em minutos</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-neutral-900/60 p-4 rounded-2xl border border-white/5">
              <div className="w-10 h-10 rounded-full bg-brand-tertiary-container/30 flex items-center justify-center text-brand-tertiary shrink-0">
                <Icon name="sports_bar" className="text-xl" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-white uppercase tracking-wider">GELADA</p>
                <p className="text-[10px] text-neutral-500 leading-none mt-0.5">Do jeito que merece</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-neutral-900/60 p-4 rounded-2xl border border-white/5">
              <div className="w-10 h-10 rounded-full bg-brand-primary-container/30 flex items-center justify-center text-brand-primary shrink-0">
                <Icon name="auto_awesome" className="text-xl" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-white uppercase tracking-wider">FÁCIL</p>
                <p className="text-[10px] text-neutral-500 leading-none mt-0.5">PIX, cartão, dinheiro</p>
              </div>
            </div>
          </div>
        </div>

        <p className="absolute bottom-6 text-[9px] text-neutral-600 uppercase tracking-widest font-mono text-center">
          Se beber, não dirija. Venda proibida para menores de 18 anos.
        </p>
      </div>

      {/* Right panel — Register form */}
      <div className="flex flex-col min-h-screen px-6 md:px-12 pt-10 pb-8 bg-black relative justify-between md:justify-center">
        {/* Mobile brand header */}
        <div className="flex flex-col items-center mb-8 md:hidden">
          <Link href="/" className="flex flex-col items-center gap-2">
            <Image src="/logo.png" alt="22 Maluco" width={80} height={80} className="rounded-full" />
            <span className="text-2xl font-black text-white tracking-tight uppercase">22 MALUCO</span>
          </Link>
        </div>

        <div className="w-full md:w-[26rem] mx-auto">
          <section className="glass-panel p-6 rounded-[32px] flex flex-col gap-5 shadow-royal-glow border border-white/5">
            <div>
              <h1 className="text-white font-bold text-xl mb-1">Criar conta</h1>
              <p className="text-neutral-400 text-sm">É rápido e gratuito</p>
            </div>
            <RegisterForm />
            <div className="text-center pt-1 border-t border-white/5">
              <p className="text-xs text-neutral-400">
                Já tem conta?{" "}
                <Link href="/login" className="text-brand-primary font-bold hover:underline">
                  Entrar
                </Link>
              </p>
            </div>
          </section>
        </div>

        <div className="md:hidden" />
      </div>
    </div>
  );
}
