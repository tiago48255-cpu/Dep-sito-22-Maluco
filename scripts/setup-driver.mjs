// Cria (ou reusa) uma conta de ENTREGADOR de teste pra simular a entrega.
// - cria um auth user com email+senha conhecidos
// - marca o profile como role='motoboy' + phone
// - cria a linha em `motoboys` com o MESMO phone (o /motoboy casa pelo telefone)
//
// Rodar:  node scripts/setup-driver.mjs
// Depois: logar no CELULAR com as credenciais que aparecem no final e abrir /motoboy

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

// ---- credenciais do entregador de teste ----
const EMAIL = "entregador@22maluco.com";
const PASSWORD = "Entregador22!";
const NAME = "Zé Entregador";
const PHONE = "21999990000";

async function main() {
  // 1) achar ou criar o auth user
  let userId;
  const { data: list } = await supabase.auth.admin.listUsers();
  const existing = list?.users?.find((u) => u.email === EMAIL);
  if (existing) {
    userId = existing.id;
    await supabase.auth.admin.updateUserById(userId, { password: PASSWORD, email_confirm: true });
    console.log("• Reusando auth user existente.");
  } else {
    const { data, error } = await supabase.auth.admin.createUser({
      email: EMAIL,
      password: PASSWORD,
      email_confirm: true,
      user_metadata: { name: NAME },
    });
    if (error) { console.error("Erro criando auth user:", error.message); process.exit(1); }
    userId = data.user.id;
    console.log("• Auth user criado.");
  }

  // 2) profile com role motoboy + phone (upsert — trigger pode ter criado a linha)
  const { error: pe } = await supabase
    .from("profiles")
    .upsert({ id: userId, name: NAME, phone: PHONE, role: "motoboy" }, { onConflict: "id" });
  if (pe) { console.error("Erro no profile:", pe.message); process.exit(1); }
  console.log("• Profile marcado como role=motoboy.");

  // 3) linha em motoboys com o MESMO phone (elo do /motoboy)
  const { data: mb } = await supabase.from("motoboys").select("id").eq("phone", PHONE).maybeSingle();
  if (mb) {
    await supabase.from("motoboys").update({ name: NAME, active: true }).eq("id", mb.id);
    console.log("• Motoboy já existia — reativado.");
  } else {
    const { error: me } = await supabase.from("motoboys").insert({ name: NAME, phone: PHONE, active: true });
    if (me) { console.error("Erro criando motoboy:", me.message); process.exit(1); }
    console.log("• Motoboy criado na tabela.");
  }

  console.log("\n========================================");
  console.log("  ENTREGADOR DE TESTE PRONTO");
  console.log("  Login (no celular) → /motoboy");
  console.log("  email:", EMAIL);
  console.log("  senha:", PASSWORD);
  console.log("  nome :", NAME, "| tel:", PHONE);
  console.log("========================================");
}

main();
