// Seed do catálogo REAL do 22 Maluco direto da loja no AnotaAI.
// Puxa produtos/preços/categorias da API do AnotaAI, baixa as fotos reais pra
// /public/produtos e substitui o catálogo no Supabase (de forma SEGURA — não
// toca em pedidos/histórico). Usa a service role key (ignora RLS).
//
// Rodar:  node scripts/seed-anotaai.mjs
//
// Fonte: https://pedido.anota.ai/loja/deposito-22-maluco-24horas
// Fluxo da API (descoberto do bundle do SPA):
//   1) GET api.anota.ai/noauth/access/get-token/{slug}  -> token (JWT c/ idpage)
//   2) GET api.anota.ai/clientauth/nm-category/menu-merchant?displaySources=DIGITAL_MENU
//      (header Authorization: {token})  -> { establishment, menu:{ menu:[categorias] } }

import { readFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createClient } from "@supabase/supabase-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_PRODUTOS = join(__dirname, "..", "public", "produtos");

const SLUG = "deposito-22-maluco-24horas";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";
const HDRS = { "User-Agent": UA, Referer: "https://pedido.anota.ai/", Origin: "https://pedido.anota.ai" };

// --- carrega .env.local manualmente ---
const env = {};
for (const line of readFileSync(new URL("../.env.local", import.meta.url), "utf8").split("\n")) {
  const m = line.match(/^([A-Z_]+)\s*=\s*(.*)$/);
  if (m) env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
}
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Faltam NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY no .env.local");
  process.exit(1);
}
const supabase = createClient(url, key, { auth: { persistSession: false } });

// ---- mapeamento de categorias do AnotaAI -> chaves canônicas do app ----
function mapCategory(anotaTitle, itemTitle) {
  const t = anotaTitle.toLowerCase();
  if (t.includes("refriger")) return "refrigerante";
  if (t.includes("cigarro")) return "cigarro";
  if (t.includes("energ")) return "energetico";
  if (t.includes("diversos")) return "diversos";
  if (t.includes("promo")) return "promocao";
  if (t.includes("whisk")) return "whisky";
  if (t.includes("gelo") || t.includes("carvao") || t.includes("carvão")) return "gelo";
  if (t.includes("tabacaria")) return "tabacaria";
  // categoria mista "Destilados e Cervejas e vinhos" -> separar item a item
  if (t.includes("destilados e cervejas")) return splitMixed(itemTitle);
  return "diversos";
}
function splitMixed(itemTitle) {
  const n = (itemTitle || "").toLowerCase();
  if (/vinho|chopp|pink moon/.test(n)) return "vinho";
  if (/heineken|stella|corona|skol|beats|ice|kovak|brahma|antar|itaipava|imp[eé]rio|long neck|lat[ãa]o|budweiser|amstel|spaten|eisenbahn|petra|bohemia|original|lager|cervej/.test(n)) return "cerveja";
  return "destilado"; // gin, vodka, pergola, galioto, bananinha, licores...
}

// ---- slug p/ nome de arquivo de imagem ----
const usedSlugs = new Map();
function fileSlug(title) {
  let base = (title || "produto")
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 48) || "produto";
  const n = (usedSlugs.get(base) ?? 0) + 1;
  usedSlugs.set(base, n);
  return n === 1 ? base : `${base}-${n}`;
}

function extFromBytes(buf) {
  if (buf[0] === 0xff && buf[1] === 0xd8) return "jpg";
  if (buf[0] === 0x89 && buf[1] === 0x50) return "png";
  if (buf[0] === 0x47 && buf[1] === 0x49) return "gif";
  if (buf[0] === 0x52 && buf[1] === 0x49 && buf[8] === 0x57) return "webp"; // RIFF....WEBP
  return "jpg";
}

async function downloadImage(remote, slug) {
  if (!remote) return null;
  try {
    const res = await fetch(remote, { headers: HDRS });
    if (!res.ok) { console.warn(`  ! img ${res.status} ${slug}`); return null; }
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 100) return null;
    const ext = extFromBytes(buf);
    const fname = `${slug}.${ext}`;
    writeFileSync(join(PUBLIC_PRODUTOS, fname), buf);
    return `/produtos/${fname}`;
  } catch (e) {
    console.warn(`  ! img falhou ${slug}: ${e.message}`);
    return null;
  }
}

async function fetchMenu() {
  const tkRes = await fetch(`https://api.anota.ai/noauth/access/get-token/${SLUG}`, { headers: HDRS });
  const tk = await tkRes.json();
  if (!tk?.token) throw new Error("não obteve token do AnotaAI");
  const res = await fetch(
    "https://api.anota.ai/clientauth/nm-category/menu-merchant?displaySources=DIGITAL_MENU",
    { headers: { ...HDRS, Authorization: tk.token } }
  );
  const j = await res.json();
  const d = j.data || j;
  const cats = d?.menu?.menu;
  if (!Array.isArray(cats)) throw new Error("estrutura de menu inesperada");
  return cats;
}

async function main() {
  if (!existsSync(PUBLIC_PRODUTOS)) mkdirSync(PUBLIC_PRODUTOS, { recursive: true });

  console.log("Baixando cardápio do AnotaAI...");
  const cats = await fetchMenu();
  console.log(`Categorias no AnotaAI: ${cats.length}`);

  // monta linhas + baixa imagens
  const rows = [];
  const counts = {};
  for (const cat of cats) {
    const items = cat.itens || cat.items || [];
    for (const it of items) {
      const name = (it.title || "").trim();
      if (!name) continue;
      const category = mapCategory(cat.title, name);
      const slug = fileSlug(name);
      const image_url = await downloadImage(it.image, slug);
      rows.push({
        name,
        description: (it.description || "").trim() || null,
        price: Number(it.price) || 0,
        category,
        image_url,
        stock_qty: it.out ? 0 : 40,
        stock_min: 5,
        active: true,
      });
      counts[category] = (counts[category] ?? 0) + 1;
    }
  }
  console.log(`\nProdutos montados: ${rows.length}`);
  console.log("Por categoria:", counts);
  const semImg = rows.filter((r) => !r.image_url).length;
  console.log(`Com imagem: ${rows.length - semImg} | sem imagem: ${semImg}`);

  // --- Substituição SEGURA (mexe SÓ na tabela products) ---
  const { data: existing } = await supabase.from("products").select("id");
  const allIds = (existing ?? []).map((p) => p.id);
  const { data: oiRefs } = await supabase.from("order_items").select("product_id");
  const { data: saRefs } = await supabase.from("stock_alerts").select("product_id");
  const referenced = new Set([
    ...(oiRefs ?? []).map((r) => r.product_id),
    ...(saRefs ?? []).map((r) => r.product_id),
  ]);
  const toDelete = allIds.filter((id) => !referenced.has(id));
  const toDeactivate = allIds.filter((id) => referenced.has(id));

  if (toDeactivate.length) {
    const { error } = await supabase.from("products").update({ active: false }).in("id", toDeactivate);
    if (error) { console.error("Erro desativando antigos:", error.message); process.exit(1); }
    console.log(`desativados (com pedido/alerta vinculado): ${toDeactivate.length}`);
  }
  if (toDelete.length) {
    const { error } = await supabase.from("products").delete().in("id", toDelete);
    if (error) { console.error("Erro removendo antigos:", error.message); process.exit(1); }
    console.log(`removidos (sem vínculo): ${toDelete.length}`);
  }

  const { data, error } = await supabase.from("products").insert(rows).select("id");
  if (error) { console.error("Erro inserindo produtos:", error.message); process.exit(1); }
  console.log(`\n✅ Inseridos ${data.length} produtos reais do AnotaAI (com fotos).`);
}

main();
