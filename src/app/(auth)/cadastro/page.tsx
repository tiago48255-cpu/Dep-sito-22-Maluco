import { RegisterForm } from "@/components/cliente/RegisterForm";
import Image from "next/image";
import Link from "next/link";

export default function CadastroPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-[#0A0A1A]">
      <Link href="/" className="mb-8 flex flex-col items-center gap-2">
        <Image src="/logo.png" alt="22 Maluco" width={80} height={80} className="rounded-full" />
        <span className="font-['var(--font-bebas)'] text-3xl text-white tracking-wider">22 MALUCO</span>
      </Link>

      <div className="w-full max-w-sm bg-[#12122A] border border-[#2A2A4A] rounded-2xl p-6">
        <h1 className="text-white font-bold text-xl mb-1">Criar conta</h1>
        <p className="text-[#9999BB] text-sm mb-6">É rápido e gratuito</p>
        <RegisterForm />
        <p className="text-center text-sm text-[#9999BB] mt-4">
          Já tem conta?{" "}
          <Link href="/login" className="text-[#2233CC] hover:underline font-medium">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
