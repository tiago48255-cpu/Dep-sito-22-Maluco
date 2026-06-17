"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Icon } from "@/components/ui/Icon";

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
          className="input-ds w-full placeholder:text-neutral-700 font-medium"
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
          className="input-ds w-full placeholder:text-neutral-700 font-medium"
        />
      </div>

      {error && (
        <span className="text-label-md text-error font-semibold px-1 flex items-center gap-1">
          <Icon name="gpp_maybe" className="text-base shrink-0" />
          {error}
        </span>
      )}

      <button
        type="submit"
        disabled={loading}
        className="btn-royal w-full py-3.5 rounded-xl font-bold text-sm shadow-royal-glow flex items-center justify-center gap-2 cursor-pointer active:scale-[0.96] duration-150 disabled:opacity-60 disabled:cursor-not-allowed mt-1"
      >
        {loading ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
