"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AlertTriangle } from "lucide-react";

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
      {isLow && <AlertTriangle size={16} className="text-red-400 flex-shrink-0" />}
      <div className="flex flex-col items-end gap-1">
        <div className="flex items-center gap-2">
          <span className="text-[#9999BB] text-xs">Estoque:</span>
          <input
            type="number"
            value={qty}
            onChange={(e) => setQty(parseInt(e.target.value) || 0)}
            className={`w-16 bg-[#0A0A1A] border ${isLow ? "border-red-500" : "border-[#2A2A4A]"} rounded px-2 py-1 text-white text-sm text-center focus:outline-none focus:border-[#2233CC]`}
            min={0}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#9999BB] text-xs">Mínimo:</span>
          <input
            type="number"
            value={min}
            onChange={(e) => setMin(parseInt(e.target.value) || 0)}
            className="w-16 bg-[#0A0A1A] border border-[#2A2A4A] rounded px-2 py-1 text-white text-sm text-center focus:outline-none focus:border-[#2233CC]"
            min={0}
          />
        </div>
      </div>
      <button
        onClick={save}
        disabled={saving}
        className="bg-[#2233CC] hover:bg-[#1a28a8] text-white text-xs px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
      >
        {saving ? "..." : "Salvar"}
      </button>
    </div>
  );
}
