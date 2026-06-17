import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { MotoboyOrders } from "@/components/cliente/MotoboyOrders";

export default async function MotoboyPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, name, phone")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "motoboy") redirect("/");

  // Vínculo pelo telefone: profiles.phone ↔ motoboys.phone
  const { data: motoboy } = profile?.phone
    ? await supabase
        .from("motoboys")
        .select("id, name")
        .eq("phone", profile.phone)
        .eq("active", true)
        .maybeSingle()
    : { data: null };

  // Busca pedidos: aceito/saiu/entregue do motoboy, ou todos os saiu sem motoboy se sem vínculo
  let orders: Record<string, unknown>[] = [];

  if (motoboy?.id) {
    const { data } = await supabase
      .from("orders")
      .select(
        "id, status, delivery_address, total, payment_method, change_for, notes, created_at, profiles(name, phone), order_items(qty, price_at_time, products(name))"
      )
      .eq("motoboy_id", motoboy.id)
      .in("status", ["aceito", "saiu", "entregue"])
      .order("created_at", { ascending: false })
      .limit(30);
    orders = (data ?? []) as Record<string, unknown>[];
  } else {
    const { data } = await supabase
      .from("orders")
      .select(
        "id, status, delivery_address, total, payment_method, change_for, notes, created_at, profiles(name, phone), order_items(qty, price_at_time, products(name))"
      )
      .eq("status", "saiu")
      .is("motoboy_id", null)
      .order("created_at", { ascending: false })
      .limit(30);
    orders = (data ?? []) as Record<string, unknown>[];
  }

  return (
    <div className="min-h-screen bg-[#000] text-white">
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur border-b border-white/8 h-16 flex items-center px-5">
        <div className="flex-1">
          <p className="text-white font-bold text-sm">22 Maluco — Entregador</p>
          <p className="text-[#9999BB] text-xs">
            {motoboy?.name ?? profile?.name ?? "Entregador"}
            {!motoboy && (
              <span className="text-yellow-400 ml-1">· sem vínculo — peça ao admin pra cadastrar seu telefone</span>
            )}
          </p>
        </div>
      </header>

      <div className="px-4 pt-5 pb-24">
        <MotoboyOrders
          orders={orders as unknown as Parameters<typeof MotoboyOrders>[0]["orders"]}
          motoboyId={motoboy?.id ?? null}
        />
      </div>
    </div>
  );
}
