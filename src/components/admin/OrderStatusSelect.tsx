"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { OrderStatus } from "@/lib/types/database";

const ALL_STATUSES: { value: OrderStatus; label: string }[] = [
  { value: "pendente", label: "Pendente" },
  { value: "aceito", label: "Aceito" },
  { value: "preparando", label: "Preparando" },
  { value: "saiu", label: "A caminho" },
  { value: "entregue", label: "Entregue" },
  { value: "cancelado", label: "Cancelado" },
];

export function OrderStatusSelect({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: OrderStatus;
}) {
  const [selected, setSelected] = useState<OrderStatus>(currentStatus);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  async function handleSave() {
    if (selected === currentStatus) return;
    setLoading(true);
    const supabase = createClient();
    await supabase.from("orders").update({ status: selected }).eq("id", orderId);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    router.refresh();
    setLoading(false);
  }

  return (
    <div className="flex items-center gap-3">
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value as OrderStatus)}
        className="flex-1 input-ds text-sm"
      >
        {ALL_STATUSES.map((s) => (
          <option key={s.value} value={s.value} className="bg-[#131313]">
            {s.label}
          </option>
        ))}
      </select>
      <button
        onClick={handleSave}
        disabled={loading || selected === currentStatus}
        className="btn-royal text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all disabled:opacity-40 whitespace-nowrap"
      >
        {loading ? "Salvando…" : saved ? "✓ Salvo" : "Confirmar"}
      </button>
    </div>
  );
}
