import Image from "next/image";
import Link from "next/link";
import { Clock, Truck } from "lucide-react";
import { LoginForm } from "@/components/cliente/LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect } = await searchParams;

  return (
    <div className="flex flex-col min-h-screen px-6 pt-10 pb-8 bg-black relative justify-between overflow-y-auto max-w-[430px] mx-auto">
      {/* Brand Header */}
      <header className="flex flex-col items-center mt-4 mb-4 select-none">
        <div className="relative w-36 h-36 mb-2 drop-shadow-[0_0_20px_rgba(61,77,216,0.3)]">
          <Image
            src="/logo.png"
            alt="Mascote 22 Maluco"
            fill
            className="object-contain"
            priority
          />
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight leading-tight uppercase">
          22 MALUCO
        </h1>
        <p className="text-neutral-500 text-xs mt-0.5">Depósito de Bebidas 24h</p>
      </header>

      {/* Glass Login Card */}
      <section className="glass-panel p-6 rounded-[32px] flex flex-col gap-5 shadow-royal-glow border border-white/5">
        <div className="text-center">
          <h2 className="text-xl font-bold text-white tracking-tight mb-1">Bem-vindo!</h2>
          <p className="text-xs text-neutral-400">Entre para continuar seu pedido</p>
        </div>

        <LoginForm redirectTo={redirect ?? "/"} />

        <div className="text-center pt-1 border-t border-white/5">
          <p className="text-xs text-neutral-400">
            Ainda não tem conta?{" "}
            <Link
              href="/cadastro"
              className="text-brand-primary font-bold hover:underline"
            >
              Criar conta
            </Link>
          </p>
        </div>
      </section>

      {/* Value Props */}
      <section className="mt-6 grid grid-cols-2 gap-3">
        <div className="flex items-center gap-3 bg-neutral-900/60 p-3 rounded-2xl border border-white/5">
          <div className="w-9 h-9 rounded-full bg-brand-primary-container/30 flex items-center justify-center text-brand-primary shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-left">
            <p className="text-xs font-bold text-white uppercase tracking-wider">24 HORAS</p>
            <p className="text-[10px] text-neutral-500 leading-none">Sempre disponível</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-neutral-900/60 p-3 rounded-2xl border border-white/5">
          <div className="w-9 h-9 rounded-full bg-brand-secondary-container/30 flex items-center justify-center text-brand-secondary shrink-0">
            <Truck className="w-4 h-4" />
          </div>
          <div className="text-left">
            <p className="text-xs font-bold text-white uppercase tracking-wider">RÁPIDA</p>
            <p className="text-[10px] text-neutral-500 leading-none">Chega em minutos</p>
          </div>
        </div>
      </section>

      {/* Legal Footer */}
      <footer className="mt-6 text-center select-none">
        <p className="text-[9px] text-neutral-600 uppercase tracking-widest font-mono">
          Se beber, não dirija. Venda proibida para menores de 18 anos.
        </p>
      </footer>
    </div>
  );
}
