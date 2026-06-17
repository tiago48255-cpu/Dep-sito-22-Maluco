"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Check } from "lucide-react";

interface MotoboyOption {
  id: string;
  name: string;
}

export function DriverAssigner({
  orderId,
  current,
  motoboys,
}: {
  orderId: string;
  current: string | null;
  motoboys: MotoboyOption[];
}) {
  const [value, setValue] = useState(current ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  async function assign(motoboyId: string) {
    setValue(motoboyId);
    setSaving(true);
    setSaved(false);
    const supabase = createClient();
    await supabase
      .from("orders")
      .update({ motoboy_id: motoboyId || null })
      .eq("id", orderId);
    setSaving(false);
    setSaved(true);
    router.refresh();
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={value}
        onChange={(e) => assign(e.target.value)}
        disabled={saving}
        className="bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-[#2233CC] transition-colors disabled:opacity-60 min-w-0 flex-1"
      >
        <option value="">Não atribuído</option>
        {motoboys.map((m) => (
          <option key={m.id} value={m.id}>
            {m.name}
          </option>
        ))}
      </select>
      {saved && (
        <span className="flex items-center gap-1 text-green-400 text-xs shrink-0">
          <Check size={14} /> salvo
        </span>
      )}
    </div>
  );
}
