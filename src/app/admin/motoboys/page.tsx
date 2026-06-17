import { createClient } from "@/lib/supabase/server";
import { Icon } from "@/components/ui/Icon";
import { MotoboysManager } from "@/components/admin/MotoboysManager";

export default async function AdminMotoboysPage() {
  const supabase = await createClient();
  const { data: motoboys } = await supabase
    .from("motoboys")
    .select("*")
    .order("name");

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Icon name="sports_motorsports" className="text-3xl text-primary" />
        <h1 className="text-headline-lg text-on-surface">Motoboys</h1>
      </div>
      <MotoboysManager initialMotoboys={motoboys ?? []} />
    </div>
  );
}
