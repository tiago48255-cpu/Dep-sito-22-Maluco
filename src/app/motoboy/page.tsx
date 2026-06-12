import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { MotoboyOrders } from "@/components/cliente/MotoboyOrders";

export default async function MotoboyPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, name")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "motoboy") redirect("/");

  const { data: motoboy } = await supabase
    .from("motoboys")
    .select("id")
    .eq("phone", "")
    .maybeSingle();

  const { data: orders } = await supabase
    .from("orders")
    .select("*, profiles(name, phone), order_items(qty, price_at_time, products(name))")
    .in("status", ["saiu"])
    .order("created_at", { ascending: true });

  return (
    <div className="min-h-screen bg-[#0A0A1A] p-6">
      <div className="max-w-xl mx-auto">
        <h1 className="text-white font-bold text-2xl mb-2">Olá, {profile?.name}</h1>
        <p className="text-[#9999BB] text-sm mb-6">Seus pedidos para entrega</p>
        <MotoboyOrders orders={(orders as any) ?? []} />
      </div>
    </div>
  );
}
