import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { MotoboysManager } from "@/components/admin/MotoboysManager";

export default async function AdminMotoboysPage() {
  const supabase = await createClient();
  const { data: motoboys } = await supabase
    .from("motoboys")
    .select("*")
    .order("name");

  return (
    <div>
      <h1 className="text-white font-bold text-2xl mb-6">Motoboys</h1>
      <MotoboysManager initialMotoboys={motoboys ?? []} />
    </div>
  );
}
