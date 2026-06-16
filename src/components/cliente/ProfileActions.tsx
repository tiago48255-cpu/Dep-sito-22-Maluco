"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { WHATSAPP_URL } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import { useCartStore } from "@/hooks/useCart";
import { Icon } from "@/components/ui/Icon";

interface ProfileActionsProps {
  initialName: string;
  phone: string | null;
  userId: string;
}

function MenuRow({
  icon,
  label,
  disabled,
}: {
  icon: string;
  label: string;
  disabled?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between p-4 ${disabled ? "opacity-40" : "hover:bg-surface-container transition-colors group"}`}>
      <div className="flex items-center gap-3">
        <Icon name={icon} className="text-xl text-primary shrink-0" />
        <span className="text-body-sm font-medium text-on-surface">{label}</span>
      </div>
      <Icon name="chevron_right" className="text-lg text-on-surface-variant group-hover:translate-x-0.5 transition-transform" />
    </div>
  );
}

export function ProfileActions({ initialName, phone, userId }: ProfileActionsProps) {
  const router = useRouter();
  const clearCart = useCartStore((s) => s.clear);
  const [name, setName] = useState(initialName);
  const [isEditing, setIsEditing] = useState(false);
  const [typedName, setTypedName] = useState(initialName);
  const [saving, setSaving] = useState(false);

  const initials = name.trim().split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

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
      {/* Header — mobile */}
      <header className="page-header md:hidden">
        <Link href="/" className="text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-full w-9 h-9 flex items-center justify-center transition-colors shrink-0">
          <Icon name="arrow_back" className="text-xl" />
        </Link>
        <h1 className="text-body-md font-bold text-on-surface flex-1 text-center -ml-9 pr-9">Meu perfil</h1>
        <Link href="/carrinho" className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors shrink-0 text-on-surface-variant hover:text-on-surface">
          <Icon name="shopping_cart" className="text-xl" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-secondary-container text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold border border-black">
              {cartCount}
            </span>
          )}
        </Link>
      </header>

      <main className="content-container pt-5 md:pt-8 space-y-6 pb-8 max-w-3xl">
        <h1 className="hidden md:block text-headline-lg text-on-surface">Meu perfil</h1>

        {/* Card do perfil */}
        <section className="glass-panel p-5 rounded-2xl border border-white/5 relative overflow-hidden flex items-center gap-4 select-none">
          <div className="absolute -right-8 -top-8 w-28 h-28 bg-primary-container/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative shrink-0">
            <div className="w-[72px] h-[72px] rounded-full border-2 border-primary bg-primary-container/30 flex items-center justify-center">
              <span className="text-primary font-bold text-headline-sm">{initials || "U"}</span>
            </div>
            <button
              onClick={() => { setIsEditing(true); setTypedName(name); }}
              className="absolute bottom-0 right-0 bg-primary hover:bg-white text-on-primary p-1 rounded-full border-2 border-background transition-colors cursor-pointer"
              aria-label="Editar nome"
            >
              <Icon name="edit" className="text-sm" />
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
                  className="bg-black border border-white/10 rounded px-2 py-1 text-body-sm text-on-surface focus:outline-none focus:border-primary w-2/3"
                  autoFocus
                  disabled={saving}
                />
                <button onClick={handleSaveName} disabled={saving} className="px-3 py-1 bg-primary text-on-primary font-bold text-label-md uppercase rounded cursor-pointer disabled:opacity-50">
                  OK
                </button>
              </div>
            ) : (
              <h2 className="text-body-md font-bold text-on-surface truncate leading-tight">{name}</h2>
            )}
            <p className="text-label-md text-on-surface-variant mt-0.5">{phone ?? "Sem telefone cadastrado"}</p>
          </div>
        </section>

        {/* Grupos de menu */}
        <section className="space-y-5">
          <div className="space-y-2">
            <h3 className="text-label-md uppercase tracking-widest text-on-surface-variant pl-1">Conta</h3>
            <div className="glass-panel rounded-2xl overflow-hidden divide-y divide-white/5 border border-white/5">
              <button onClick={() => { setIsEditing(true); setTypedName(name); }} className="w-full bg-transparent border-none cursor-pointer text-left">
                <MenuRow icon="person" label="Meus dados" />
              </button>
              <div className="cursor-not-allowed"><MenuRow icon="location_on" label="Endereços salvos" disabled /></div>
              <div className="cursor-not-allowed"><MenuRow icon="credit_card" label="Formas de pagamento" disabled /></div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-label-md uppercase tracking-widest text-on-surface-variant pl-1">Atividade</h3>
            <div className="glass-panel rounded-2xl overflow-hidden divide-y divide-white/5 border border-white/5">
              <Link href="/pedidos"><MenuRow icon="receipt_long" label="Meus pedidos" /></Link>
              <div className="cursor-not-allowed"><MenuRow icon="sell" label="Meus cupons salvos" disabled /></div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-label-md uppercase tracking-widest text-on-surface-variant pl-1">Suporte</h3>
            <div className="glass-panel rounded-2xl overflow-hidden divide-y divide-white/5 border border-white/5">
              <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="block no-underline"><MenuRow icon="headset_mic" label="Suporte ao cliente 24h" /></a>
              <div className="cursor-not-allowed"><MenuRow icon="info" label="Sobre o aplicativo" disabled /></div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2.5 p-4 mt-2 text-secondary border border-secondary/20 rounded-xl hover:bg-secondary/5 transition-all duration-150 cursor-pointer select-none active:scale-[0.98] font-bold text-label-lg uppercase tracking-wider"
          >
            <Icon name="logout" className="text-xl shrink-0" />
            <span>Sair da conta</span>
          </button>
        </section>
    </main>
  </>
  );
}
