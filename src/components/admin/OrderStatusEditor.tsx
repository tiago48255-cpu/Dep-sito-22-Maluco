"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { OrderStatus } from "@/lib/types/database";

const statusOptions: { value: OrderStatus; label: string }[] = [
  { value: "pendente", label: "Pendente" },
  { value: "aceito", label: "Aceito" },
  { value: "preparando", label: "Preparando" },
  { value: "saiu", label: "A caminho" },
  { value: "entregue", label: "Entregue" },
  { value: "cancelado", label: "Cancelado" },
];

export function OrderStatusEditor({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: OrderStatus;
}) {
  const [selected, setSelected] = useState<OrderStatus>(currentStatus);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleUpdate() {
    if (selected === currentStatus) return;
    setLoading(true);
    const supabase = createClient();
    await supabase
      .from("orders")
      .update({ status: selected, updated_at: new Date().toISOString() })
      .eq("id", orderId);
    router.refresh();
    setLoading(false);
  }

  return (
    <div className="flex gap-3 items-end">
      <div className="flex-1">
        <label className="text-[#9999BB] text-xs mb-1.5 block">Novo status</label>
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value as OrderStatus)}
          className="w-full bg-[#1A1A38] border border-white/10 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#2233CC] transition-colors"
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={handleUpdate}
        disabled={loading || selected === currentStatus}
        className="bg-[#2233CC] hover:bg-[#1a28a8] disabled:opacity-40 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors whitespace-nowrap"
      >
        {loading ? "Salvando…" : "Atualizar"}
      </button>
    </div>
  );
}
