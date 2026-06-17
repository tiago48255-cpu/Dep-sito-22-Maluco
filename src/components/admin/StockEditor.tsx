"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Icon } from "@/components/ui/Icon";

interface Product {
  id: string;
  stock_qty: number;
  stock_min: number;
}

export function StockEditor({ product }: { product: Product }) {
  const [qty, setQty] = useState(product.stock_qty);
  const [min, setMin] = useState(product.stock_min);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const isLow = qty <= min;

  async function save() {
    setSaving(true);
    const supabase = createClient();
    await supabase
      .from("products")
      .update({ stock_qty: qty, stock_min: min })
      .eq("id", product.id);
    router.refresh();
    setSaving(false);
  }

  return (
    <div className="flex items-center gap-3">
      {isLow && <Icon name="warning" className="text-base text-secondary shrink-0" />}
      <div className="flex flex-col items-end gap-1">
        <div className="flex items-center gap-2">
          <span className="text-on-surface-variant text-label-md">Estoque:</span>
          <input
            type="number"
            value={qty}
            onChange={(e) => setQty(parseInt(e.target.value) || 0)}
            className={`w-16 bg-surface-container-lowest border ${isLow ? "border-secondary" : "border-white/10"} rounded-lg px-2 py-1 text-on-surface text-body-sm text-center focus:outline-none focus:border-primary`}
            min={0}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-on-surface-variant text-label-md">Mínimo:</span>
          <input
            type="number"
            value={min}
            onChange={(e) => setMin(parseInt(e.target.value) || 0)}
            className="w-16 bg-surface-container-lowest border border-white/10 rounded-lg px-2 py-1 text-on-surface text-body-sm text-center focus:outline-none focus:border-primary"
            min={0}
          />
        </div>
      </div>
      <button
        onClick={save}
        disabled={saving}
        className="btn-royal text-white text-label-md px-3 py-1.5 rounded-lg transition-all disabled:opacity-50 active:scale-95"
      >
        {saving ? "..." : "Salvar"}
      </button>
    </div>
  );
}
