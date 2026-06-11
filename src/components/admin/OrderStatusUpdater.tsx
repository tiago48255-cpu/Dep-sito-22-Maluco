"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { OrderStatus } from "@/lib/types/database";

const nextStatus: Partial<Record<OrderStatus, OrderStatus>> = {
  pendente: "aceito",
  aceito: "preparando",
  preparando: "saiu",
  saiu: "entregue",
};

const labels: Partial<Record<OrderStatus, string>> = {
  pendente: "Aceitar",
  aceito: "Preparando",
  preparando: "Saiu",
  saiu: "Entregue",
};

export function OrderStatusUpdater({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: OrderStatus;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const next = nextStatus[currentStatus];
  if (!next) return null;

  async function advance() {
    setLoading(true);
    const supabase = createClient();
    await supabase
      .from("orders")
      .update({ status: next })
      .eq("id", orderId);
    router.refresh();
    setLoading(false);
  }

  return (
    <button
      onClick={advance}
      disabled={loading}
      className="bg-[#2233CC] hover:bg-[#1a28a8] text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
    >
      {loading ? "..." : labels[currentStatus]}
    </button>
  );
}
