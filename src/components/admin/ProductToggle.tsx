"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function ProductToggle({ productId, active }: { productId: string; active: boolean }) {
  const [value, setValue] = useState(active);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function toggle() {
    setLoading(true);
    const supabase = createClient();
    const next = !value;
    setValue(next);
    await supabase.from("products").update({ active: next }).eq("id", productId);
    router.refresh();
    setLoading(false);
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${value ? "bg-primary-container" : "bg-surface-container-high"} disabled:opacity-50`}
      title={value ? "Ativo — clique para desativar" : "Inativo — clique para ativar"}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${value ? "translate-x-4.5" : "translate-x-0.5"}`}
      />
    </button>
  );
}
