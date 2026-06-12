"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useCartStore } from "@/hooks/useCart";
import {
  Edit3,
  User,
  MapPin,
  CreditCard,
  Receipt,
  Tag,
  Headphones,
  Info,
  LogOut,
  ChevronRight,
  ArrowLeft,
  ShoppingCart,
} from "lucide-react";

interface ProfileActionsProps {
  initialName: string;
  phone: string | null;
  userId: string;
}

export function ProfileActions({ initialName, phone, userId }: ProfileActionsProps) {
  const router = useRouter();
  const clearCart = useCartStore((s) => s.clear);
  const [name, setName] = useState(initialName);
  const [isEditing, setIsEditing] = useState(false);
  const [typedName, setTypedName] = useState(initialName);
  const [saving, setSaving] = useState(false);

  const initials = name
    .trim()
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  async function handleSaveName() {
    const trimmed = typedName.trim();
    if (!trimmed || trimmed === name) {
      setIsEditing(false);
      return;
    }
    setSaving(true);
    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from("profiles") as any).update({ name: trimmed }).eq("id", userId);
    setName(trimmed);
    setIsEditing(false);
    setSaving(false);
  }

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    clearCart();
    router.push("/login");
    router.refresh();
  }

  const items = useCartStore((s) => s.items);
  const cartCount = items.reduce((sum, item) => sum + item.qty, 0);

  return (
    <>
      <header className="page-header">
        <Link
          href="/"
          className="text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-full w-9 h-9 flex items-center justify-center transition-colors shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-sm font-bold text-white flex-1 text-center -ml-9 pr-9">Meu perfil</h1>
        <Link
          href="/carrinho"
          className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-neutral-900 transition-colors shrink-0 text-neutral-400 hover:text-white"
        >
          <ShoppingCart className="w-5 h-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-brand-secondary text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold border border-black">
              {cartCount}
            </span>
          )}
        </Link>
      </header>

      <main className="content-container pt-5 space-y-6 pb-8 max-w-3xl">
      {/* Profile Card */}
      <section className="glass-panel p-5 rounded-2xl border border-white/5 relative overflow-hidden flex items-center gap-4 select-none">
        <div className="absolute -right-8 -top-8 w-28 h-28 bg-brand-primary-container/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative shrink-0">
          <div className="w-[72px] h-[72px] rounded-full border-2 border-brand-primary bg-brand-primary-container/30 flex items-center justify-center">
            <span className="text-brand-primary font-black text-lg">{initials || "U"}</span>
          </div>
          <button
            onClick={() => { setIsEditing(true); setTypedName(name); }}
            className="absolute bottom-0 right-0 bg-brand-primary hover:bg-white text-black p-1 rounded-full border-2 border-neutral-950 transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={typedName}
                onChange={(e) => setTypedName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
                className="bg-black border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-brand-primary w-2/3"
                autoFocus
                disabled={saving}
              />
              <button
                onClick={handleSaveName}
                disabled={saving}
                className="px-2 py-1 bg-brand-primary text-black font-extrabold text-[10px] uppercase rounded cursor-pointer disabled:opacity-50"
              >
                OK
              </button>
            </div>
          ) : (
            <h2 className="text-base font-extrabold text-white truncate leading-tight uppercase tracking-tight">
              {name}
            </h2>
          )}
          <p className="text-xs text-neutral-400 font-semibold mt-0.5">
            {phone ?? "Sem telefone cadastrado"}
          </p>
        </div>
      </section>

      {/* Menu Groups */}
      <section className="space-y-5">
        {/* Conta */}
        <div className="space-y-2">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-500 pl-1">
            Conta
          </h3>
          <div className="glass-panel rounded-2xl overflow-hidden divide-y divide-white/5 border border-white/5">
            <button
              onClick={() => { setIsEditing(true); setTypedName(name); }}
              className="w-full flex items-center justify-between p-4 hover:bg-neutral-900 transition-colors group bg-transparent border-none cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <User className="w-[18px] h-[18px] text-brand-primary shrink-0" />
                <span className="text-xs font-semibold text-white">Meus dados</span>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button
              disabled
              className="w-full flex items-center justify-between p-4 hover:bg-neutral-900 transition-colors group bg-transparent border-none cursor-pointer opacity-40"
            >
              <div className="flex items-center gap-3">
                <MapPin className="w-[18px] h-[18px] text-brand-primary shrink-0" />
                <span className="text-xs font-semibold text-white">Endereços salvos</span>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-500" />
            </button>
            <button
              disabled
              className="w-full flex items-center justify-between p-4 hover:bg-neutral-900 transition-colors group bg-transparent border-none cursor-pointer opacity-40"
            >
              <div className="flex items-center gap-3">
                <CreditCard className="w-[18px] h-[18px] text-brand-primary shrink-0" />
                <span className="text-xs font-semibold text-white">Formas de pagamento</span>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-500" />
            </button>
          </div>
        </div>

        {/* Atividade */}
        <div className="space-y-2">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-500 pl-1">
            Atividade
          </h3>
          <div className="glass-panel rounded-2xl overflow-hidden divide-y divide-white/5 border border-white/5">
            <Link
              href="/pedidos"
              className="flex items-center justify-between p-4 hover:bg-neutral-900 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Receipt className="w-[18px] h-[18px] text-brand-primary shrink-0" />
                <span className="text-xs font-semibold text-white">Meus pedidos</span>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <button
              disabled
              className="w-full flex items-center justify-between p-4 bg-transparent border-none cursor-pointer opacity-40"
            >
              <div className="flex items-center gap-3">
                <Tag className="w-[18px] h-[18px] text-brand-primary shrink-0" />
                <span className="text-xs font-semibold text-white">Meus cupons salvos</span>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-500" />
            </button>
          </div>
        </div>

        {/* Suporte */}
        <div className="space-y-2">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-500 pl-1">
            Suporte
          </h3>
          <div className="glass-panel rounded-2xl overflow-hidden divide-y divide-white/5 border border-white/5">
            <a
              href="https://wa.me/5521968979426"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-4 hover:bg-neutral-900 transition-colors group no-underline"
            >
              <div className="flex items-center gap-3">
                <Headphones className="w-[18px] h-[18px] text-brand-primary shrink-0" />
                <span className="text-xs font-semibold text-white">Suporte ao cliente 24h</span>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:translate-x-0.5 transition-transform" />
            </a>
            <button
              disabled
              className="w-full flex items-center justify-between p-4 bg-transparent border-none cursor-pointer opacity-40"
            >
              <div className="flex items-center gap-3">
                <Info className="w-[18px] h-[18px] text-brand-primary shrink-0" />
                <span className="text-xs font-semibold text-white">Sobre o aplicativo</span>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-500" />
            </button>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2.5 p-4 mt-2 text-brand-secondary border border-brand-secondary/20 rounded-xl hover:bg-brand-secondary/5 transition-all duration-150 cursor-pointer select-none active:scale-[0.98] font-bold text-xs uppercase tracking-wider"
        >
          <LogOut className="w-[18px] h-[18px] shrink-0" />
          <span>Sair da conta</span>
        </button>
      </section>
    </main>
  </>
  );
}
