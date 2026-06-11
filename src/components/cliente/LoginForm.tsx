"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ShieldAlert } from "lucide-react";

interface LoginFormProps {
  redirectTo?: string;
}

export function LoginForm({ redirectTo = "/" }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError("Email ou senha incorretos.");
    } else {
      router.push(redirectTo);
      router.refresh();
    }

    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs text-neutral-400 font-bold px-1 uppercase tracking-wider" htmlFor="email-input">
          Email
        </label>
        <input
          id="email-input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com"
          required
          autoComplete="email"
          className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl py-3 px-4 text-white text-sm input-focus-ring placeholder:text-neutral-700 font-medium focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs text-neutral-400 font-bold px-1 uppercase tracking-wider" htmlFor="password-input">
          Senha
        </label>
        <input
          id="password-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          autoComplete="current-password"
          className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl py-3 px-4 text-white text-sm input-focus-ring placeholder:text-neutral-700 font-medium focus:outline-none"
        />
      </div>

      {error && (
        <span className="text-[11px] text-rose-400 font-semibold px-1 flex items-center gap-1">
          <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
          {error}
        </span>
      )}

      <button
        type="submit"
        disabled={loading}
        className="btn-gradient w-full py-3.5 rounded-xl text-white font-bold text-sm shadow-royal-glow flex items-center justify-center gap-2 cursor-pointer active:scale-[0.96] duration-150 disabled:opacity-60 disabled:cursor-not-allowed mt-1"
      >
        {loading ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
