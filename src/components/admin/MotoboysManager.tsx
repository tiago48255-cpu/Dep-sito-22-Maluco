"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Plus, Bike } from "lucide-react";
import type { Motoboy } from "@/lib/types/queries";

export function MotoboysManager({ initialMotoboys }: { initialMotoboys: Motoboy[] }) {
  const [motoboys, setMotoboys] = useState(initialMotoboys);
  const [form, setForm] = useState({ name: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function addMotoboy(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("motoboys")
      .insert({ name: form.name, phone: form.phone })
      .select()
      .single();
    if (data) {
      setMotoboys((prev) => [...prev, data]);
      setForm({ name: "", phone: "" });
    }
    setLoading(false);
  }

  async function toggleActive(id: string, active: boolean) {
    const supabase = createClient();
    await supabase.from("motoboys").update({ active: !active }).eq("id", id);
    setMotoboys((prev) =>
      prev.map((m) => (m.id === id ? { ...m, active: !active } : m))
    );
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="p-4">
        <h2 className="text-white font-semibold mb-4">Adicionar motoboy</h2>
        <form onSubmit={addMotoboy} className="flex flex-col gap-3">
          <Input
            label="Nome"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Nome do motoboy"
            required
          />
          <Input
            label="WhatsApp"
            type="tel"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            placeholder="(21) 9xxxx-xxxx"
            required
          />
          <Button type="submit" loading={loading} className="gap-2 w-fit">
            <Plus size={16} /> Adicionar
          </Button>
        </form>
      </Card>

      <Card className="divide-y divide-[#2A2A4A]">
        {motoboys.map((motoboy) => (
          <div key={motoboy.id} className="p-4 flex items-center gap-4">
            <div className={`p-2 rounded-lg ${motoboy.active ? "bg-[#2233CC]/20" : "bg-[#2A2A4A]"}`}>
              <Bike size={18} className={motoboy.active ? "text-[#2233CC]" : "text-[#9999BB]"} />
            </div>
            <div className="flex-1">
              <p className="text-white font-medium text-sm">{motoboy.name}</p>
              <p className="text-[#9999BB] text-xs">{motoboy.phone}</p>
            </div>
            <button
              onClick={() => toggleActive(motoboy.id, motoboy.active)}
              className={`text-xs font-semibold px-3 py-1 rounded-full transition-colors ${
                motoboy.active
                  ? "bg-green-500/20 text-green-400 hover:bg-red-500/20 hover:text-red-400"
                  : "bg-[#2A2A4A] text-[#9999BB] hover:bg-[#2233CC]/20 hover:text-[#2233CC]"
              }`}
            >
              {motoboy.active ? "Ativo" : "Inativo"}
            </button>
          </div>
        ))}
        {motoboys.length === 0 && (
          <p className="text-[#9999BB] text-sm p-4 text-center">Nenhum motoboy cadastrado.</p>
        )}
      </Card>
    </div>
  );
}
