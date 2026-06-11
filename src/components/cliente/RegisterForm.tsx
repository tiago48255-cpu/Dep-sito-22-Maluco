"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { name: form.name, phone: form.phone },
      },
    });

    if (authError) {
      setError(authError.message);
    } else {
      router.push("/");
      router.refresh();
    }

    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Nome completo"
        type="text"
        value={form.name}
        onChange={(e) => set("name", e.target.value)}
        placeholder="Seu nome"
        required
        autoComplete="name"
      />
      <Input
        label="WhatsApp"
        type="tel"
        value={form.phone}
        onChange={(e) => set("phone", e.target.value)}
        placeholder="(21) 9xxxx-xxxx"
        autoComplete="tel"
      />
      <Input
        label="Email"
        type="email"
        value={form.email}
        onChange={(e) => set("email", e.target.value)}
        placeholder="seu@email.com"
        required
        autoComplete="email"
      />
      <Input
        label="Senha"
        type="password"
        value={form.password}
        onChange={(e) => set("password", e.target.value)}
        placeholder="Mínimo 6 caracteres"
        required
        minLength={6}
        autoComplete="new-password"
      />
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <Button type="submit" loading={loading} className="w-full mt-1">
        Criar conta
      </Button>
    </form>
  );
}
