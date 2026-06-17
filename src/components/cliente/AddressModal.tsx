"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Icon } from "@/components/ui/Icon";
import { useAddress, formatAddress, type Address } from "@/hooks/useAddress";

type Form = Omit<Address, "formatted" | "lat" | "lng">;

const EMPTY: Form = { cep: "", street: "", number: "", neighborhood: "", city: "", state: "", complement: "" };

export function AddressModal() {
  const { modalOpen, required, address, setAddress, closeModal } = useAddress();
  const [form, setForm] = useState<Form>(EMPTY);
  const [cepLoading, setCepLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // ao abrir, pré-carrega o endereço atual (se houver)
  useEffect(() => {
    if (modalOpen) {
      setError("");
      if (address) {
        const { cep, street, number, neighborhood, city, state, complement } = address;
        setForm({ cep, street, number, neighborhood, city, state, complement });
      } else {
        setForm(EMPTY);
      }
    }
  }, [modalOpen, address]);

  if (!modalOpen) return null;

  const up = (k: keyof Form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function lookupCep(raw: string) {
    const cep = raw.replace(/\D/g, "");
    if (cep.length !== 8) return;
    setCepLoading(true);
    setError("");
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();
      if (data.erro) { setError("CEP não encontrado."); return; }
      setForm((f) => ({
        ...f,
        cep,
        street: data.logradouro || f.street,
        neighborhood: data.bairro || f.neighborhood,
        city: data.localidade || f.city,
        state: data.uf || f.state,
      }));
    } catch {
      setError("Não foi possível buscar o CEP.");
    } finally {
      setCepLoading(false);
    }
  }

  async function useMyLocation() {
    setError("");
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setError("GPS indisponível neste dispositivo.");
      return;
    }
    if (!window.isSecureContext) {
      setError("A localização exige HTTPS (use o site publicado, não o IP local).");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&addressdetails=1&lat=${latitude}&lon=${longitude}`,
            { headers: { "Accept-Language": "pt-BR" } }
          );
          const d = await res.json();
          const a = d.address ?? {};
          setForm((f) => ({
            ...f,
            cep: (a.postcode || f.cep).replace(/\D/g, ""),
            street: a.road || a.pedestrian || f.street,
            neighborhood: a.suburb || a.neighbourhood || a.city_district || f.neighborhood,
            city: a.city || a.town || a.municipality || f.city,
            state: a.state_code || a.state || f.state,
          }));
        } catch {
          setError("Não consegui converter sua localização em endereço.");
        } finally {
          setLocating(false);
        }
      },
      (e) => {
        setLocating(false);
        setError(e.code === 1 ? "Permissão de localização negada." : "Não foi possível obter a localização.");
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  }

  async function geocode(): Promise<{ lat: number; lng: number } | null> {
    try {
      const q = `${form.street}, ${form.number}, ${form.neighborhood}, ${form.city}, ${form.state}, Brasil`;
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(q)}`,
        { headers: { "Accept-Language": "pt-BR" } }
      );
      const arr = await res.json();
      if (arr[0]) return { lat: parseFloat(arr[0].lat), lng: parseFloat(arr[0].lon) };
    } catch { /* best-effort */ }
    return null;
  }

  async function save() {
    if (!form.street.trim() || !form.number.trim() || !form.neighborhood.trim() || !form.city.trim()) {
      setError("Preencha rua, número, bairro e cidade.");
      return;
    }
    setSaving(true);
    setError("");
    const coords = await geocode();
    const formatted = formatAddress(form);
    const full: Address = { ...form, lat: coords?.lat ?? null, lng: coords?.lng ?? null, formatted };
    setAddress(full);

    // se logado, persiste no perfil
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) await supabase.from("profiles").update({ address_default: formatted }).eq("id", user.id);
    } catch { /* opcional */ }

    setSaving(false);
  }

  return (
    <div className="fixed inset-0 z-[2000] flex items-end md:items-center justify-center bg-black/70 backdrop-blur-sm p-0 md:p-4">
      <div className="w-screen md:w-[34rem] md:max-w-[92vw] bg-surface-container rounded-t-3xl md:rounded-3xl border border-white/10 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-surface-container px-5 py-4 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-2">
            <Icon name="location_on" filled className="text-xl text-primary" />
            <h2 className="text-on-surface font-bold text-body-md">Onde você quer receber?</h2>
          </div>
          {!(required && !address) && (
            <button onClick={closeModal} className="text-on-surface-variant hover:text-on-surface p-1 rounded-full" aria-label="Fechar">
              <Icon name="close" className="text-xl" />
            </button>
          )}
        </div>

        <div className="p-5 flex flex-col gap-3">
          {required && !address && (
            <p className="text-label-md text-on-surface-variant bg-primary-container/15 border border-primary/20 rounded-xl px-3 py-2">
              Pra continuar, informe o endereço de entrega.
            </p>
          )}

          <button
            onClick={useMyLocation}
            disabled={locating}
            className="flex items-center justify-center gap-2 w-full border border-primary/40 text-primary rounded-xl py-3 text-label-lg hover:bg-primary-container/10 transition-colors disabled:opacity-60"
          >
            <Icon name="my_location" className="text-lg" />
            {locating ? "Localizando…" : "Usar minha localização"}
          </button>

          {/* CEP */}
          <div>
            <label className="text-label-md text-on-surface-variant">CEP</label>
            <input
              inputMode="numeric"
              value={form.cep}
              onChange={(e) => up("cep", e.target.value.replace(/\D/g, "").slice(0, 8))}
              onBlur={(e) => lookupCep(e.target.value)}
              placeholder="00000-000"
              className="w-full mt-1 bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-primary transition-colors"
            />
            {cepLoading && <p className="text-label-md text-on-surface-variant mt-1">Buscando CEP…</p>}
          </div>

          {/* Rua + número */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="text-label-md text-on-surface-variant">Rua</label>
              <input value={form.street} onChange={(e) => up("street", e.target.value)} placeholder="Rua / Avenida" className="w-full mt-1 bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-primary transition-colors" />
            </div>
            <div>
              <label className="text-label-md text-on-surface-variant">Número</label>
              <input value={form.number} onChange={(e) => up("number", e.target.value)} placeholder="Nº" className="w-full mt-1 bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-primary transition-colors" />
            </div>
          </div>

          {/* Bairro */}
          <div>
            <label className="text-label-md text-on-surface-variant">Bairro</label>
            <input value={form.neighborhood} onChange={(e) => up("neighborhood", e.target.value)} placeholder="Bairro" className="w-full mt-1 bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-primary transition-colors" />
          </div>

          {/* Cidade + UF */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="text-label-md text-on-surface-variant">Cidade</label>
              <input value={form.city} onChange={(e) => up("city", e.target.value)} placeholder="Cidade" className="w-full mt-1 bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-primary transition-colors" />
            </div>
            <div>
              <label className="text-label-md text-on-surface-variant">UF</label>
              <input value={form.state} onChange={(e) => up("state", e.target.value.toUpperCase().slice(0, 2))} placeholder="RJ" className="w-full mt-1 bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-primary transition-colors" />
            </div>
          </div>

          {/* Complemento */}
          <div>
            <label className="text-label-md text-on-surface-variant">Complemento <span className="opacity-60">(opcional)</span></label>
            <input value={form.complement} onChange={(e) => up("complement", e.target.value)} placeholder="Apto, bloco, referência…" className="w-full mt-1 bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-primary transition-colors" />
          </div>

          {error && <p className="text-secondary text-body-sm">{error}</p>}

          <button
            onClick={save}
            disabled={saving}
            className="w-full btn-gradient shadow-royal-glow text-white font-bold text-sm py-3.5 rounded-xl mt-1 disabled:opacity-60 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            {saving ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Salvar endereço"}
          </button>
        </div>
      </div>
    </div>
  );
}
