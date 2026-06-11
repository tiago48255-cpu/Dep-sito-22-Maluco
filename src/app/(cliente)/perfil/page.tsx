import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProfileActions } from "@/components/cliente/ProfileActions";
import type { Profile } from "@/lib/types/queries";

export default async function PerfilPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/perfil");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single() as { data: Profile | null };

  return (
    <div className="text-white min-h-screen bg-black pb-24">
      <header className="sticky top-0 z-40 bg-neutral-950/95 backdrop-blur-xl border-b border-white/5 px-5 py-3 flex items-center h-16 select-none">
        <h1 className="text-base font-bold text-white">Meu perfil</h1>
      </header>
      <ProfileActions
        initialName={profile?.name ?? "Usuário"}
        phone={profile?.phone ?? null}
        userId={user.id}
      />
    </div>
  );
}
