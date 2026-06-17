// Prepara o último pedido do cliente de teste pra demonstrar a entrega ao vivo:
// - atribui o entregador "Zé Entregador" (motoboys.phone 21999990000)
// - semeia uma posição inicial do entregador perto da loja (pino já aparece)
// Rodar:  node scripts/prep-test-order.mjs

import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const env = {};
for (const line of readFileSync(new URL("../.env.local", import.meta.url), "utf8").split("\n")) {
  const m = line.match(/^([A-Z_]+)\s*=\s*(.*)$/);
  if (m) env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
}
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const CUSTOMER_ID = "ff039b8e-e8f3-4586-8cc3-520b272a61f3"; // tiago48254
const DRIVER_PHONE = "21999990000";

async function main() {
  const { data: mb } = await supabase.from("motoboys").select("id, name").eq("phone", DRIVER_PHONE).maybeSingle();
  if (!mb) { console.error("Entregador de teste não encontrado. Rode setup-driver.mjs antes."); process.exit(1); }

  const { data: order } = await supabase
    .from("orders")
    .select("id, status")
    .eq("user_id", CUSTOMER_ID)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!order) { console.error("Nenhum pedido encontrado pra esse cliente."); process.exit(1); }

  const { error } = await supabase
    .from("orders")
    .update({
      motoboy_id: mb.id,
      status: "saiu",
      // posição inicial perto da loja (Rua Barroso) — o pino já aparece antes do GPS
      driver_lat: -22.7402,
      driver_lng: -43.4378,
      driver_updated_at: new Date().toISOString(),
    })
    .eq("id", order.id);
  if (error) { console.error("Erro:", error.message); process.exit(1); }

  console.log(`✅ Pedido #${order.id.slice(-8).toUpperCase()} preparado:`);
  console.log(`   entregador = ${mb.name}, status = saiu, pino semeado perto da loja.`);
  console.log(`   Abra /pedidos/${order.id} como cliente pra ver o entregador + mapa.`);
}

main();
