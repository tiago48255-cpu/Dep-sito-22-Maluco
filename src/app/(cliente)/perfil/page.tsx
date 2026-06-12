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
      <ProfileActions
        initialName={profile?.name ?? "Usuário"}
        phone={profile?.phone ?? null}
        userId={user.id}
      />
    </div>
  );
}
