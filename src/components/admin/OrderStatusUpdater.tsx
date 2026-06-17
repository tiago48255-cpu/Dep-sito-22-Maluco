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
      className="btn-royal text-white text-label-md px-3 py-1.5 rounded-lg transition-all disabled:opacity-50 active:scale-95"
    >
      {loading ? "..." : labels[currentStatus]}
    </button>
  );
}
