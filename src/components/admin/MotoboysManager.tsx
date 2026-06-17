"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
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
        <h2 className="text-on-surface font-bold text-body-md mb-4">Adicionar motoboy</h2>
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
            <Icon name="add" className="text-lg" /> Adicionar
          </Button>
        </form>
      </Card>

      <Card className="divide-y divide-white/5 overflow-hidden">
        {motoboys.map((motoboy) => (
          <div key={motoboy.id} className="p-4 flex items-center gap-4">
            <div className={`p-2 rounded-lg ${motoboy.active ? "bg-primary-container/20" : "bg-surface-container-high"}`}>
              <Icon name="sports_motorsports" className={motoboy.active ? "text-xl text-primary" : "text-xl text-on-surface-variant"} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-on-surface font-bold text-body-sm">{motoboy.name}</p>
              <p className="text-on-surface-variant text-label-md">{motoboy.phone}</p>
            </div>
            <button
              onClick={() => toggleActive(motoboy.id, motoboy.active)}
              className={`text-label-md px-3 py-1 rounded-full transition-colors ${
                motoboy.active
                  ? "bg-green-500/20 text-green-400 hover:bg-secondary/20 hover:text-secondary"
                  : "bg-surface-container-high text-on-surface-variant hover:bg-primary-container/20 hover:text-primary"
              }`}
            >
              {motoboy.active ? "Ativo" : "Inativo"}
            </button>
          </div>
        ))}
        {motoboys.length === 0 && (
          <p className="text-on-surface-variant text-body-sm p-4 text-center">Nenhum motoboy cadastrado.</p>
        )}
      </Card>
    </div>
  );
}
