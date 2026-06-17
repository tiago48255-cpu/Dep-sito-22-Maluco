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

  /*
   * IDENTIFICAÇÃO DO MOTOBOY
   *
   * A tabela `motoboys` não possui `user_id` — o campo `phone` é o elo entre
   * `profiles.phone` e `motoboys.phone`.
   *
   * LIMITAÇÃO: se dois motoboys tiverem o mesmo número, o primeiro ativo é usado.
   * Para um vínculo direto e seguro, adicione via migration:
   *   ALTER TABLE motoboys ADD COLUMN user_id uuid REFERENCES auth.users(id);
   * e atualize a query abaixo para `.eq("user_id", user.id)`.
   */
  const { data: motoboy } = profile?.phone
    ? await supabase
        .from("motoboys")
        .select("id, name")
        .eq("phone", profile.phone)
        .eq("active", true)
        .maybeSingle()
    : { data: null };

  /*
   * PEDIDOS DO MOTOBOY
   *
   * Se o motoboy foi identificado via telefone, filtra os pedidos atribuídos a ele
   * (orders.motoboy_id = motoboy.id) com status "saiu" (a caminho) ou "entregue".
   *
   * LIMITAÇÃO: se não houver correspondência, mostra todos os pedidos com status
   * "saiu" (disponíveis para qualquer motoboy aceitar). Isso ocorre quando o
   * telefone do perfil não coincide com nenhum registro em `motoboys`.
   */
  let orders: Record<string, unknown>[] = [];

  if (motoboy?.id) {
    const { data } = await supabase
      .from("orders")
      .select(
        "id, delivery_address, total, payment_method, change_for, notes, status, created_at, profiles(name, phone), order_items(qty, price_at_time, products(name))"
      )
      .eq("motoboy_id", motoboy.id)
      .in("status", ["saiu", "entregue"])
      .order("created_at", { ascending: false })
      .limit(30);
    orders = (data ?? []) as Record<string, unknown>[];
  } else {
    // Fallback: pedidos a caminho sem motoboy atribuído (abertos para aceitar)
    const { data } = await supabase
      .from("orders")
      .select(
        "id, delivery_address, total, payment_method, change_for, notes, status, created_at, profiles(name, phone), order_items(qty, price_at_time, products(name))"
      )
      .eq("status", "saiu")
      .is("motoboy_id", null)
      .order("created_at", { ascending: false })
      .limit(30);
    orders = (data ?? []) as Record<string, unknown>[];
  }

  return (
    <div className="min-h-screen bg-[#000] text-white">
      <header className="sticky top-0 z-40 glass-nav border-b border-white/8 h-16 flex items-center px-5">
        <div className="flex-1">
          <p className="text-white font-bold text-sm">22 Maluco — Motoboy</p>
          <p className="text-[#9999BB] text-xs">
            {motoboy?.name ?? profile?.name ?? "Entregador"}
            {!motoboy && (
              <span className="text-yellow-400 ml-1">· sem vínculo ativo</span>
            )}
          </p>
        </div>
      </header>

      <div className="px-4 pt-5 pb-24">
        <MotoboyOrders orders={orders as unknown as Parameters<typeof MotoboyOrders>[0]["orders"]} />
      </div>
    </div>
  );
}
