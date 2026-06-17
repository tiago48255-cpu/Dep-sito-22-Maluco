// Seed do catálogo REAL do 22 Maluco (fonte: AnotaAI).
// Substitui o catálogo atual. Usa a service role key (ignora RLS).
//
// Rodar:  node scripts/seed-stitch.mjs
//
// Categorias canônicas: cerveja, whisky, destilado, vinho, refrigerante,
// energetico, gelo, cigarro, tabacaria, diversos, promocao
//
// image_url aponta pras fotos baixadas em /public/stitch (só nos que casam);
// os demais ficam null e a UI mostra o ícone de garrafa.

import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

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

const IMG = (n) => (n ? `/stitch/${n}` : null);

// [nome, descrição, preço, categoria, imagem, esgotado?]
const catalog = [
  // ===== CERVEJAS =====
  ["Heineken Long Neck 330ml", "Puro malte, gelada", 6.5, "cerveja", "prod-heineken.jpg"],
  ["Stella Artois 330ml", "Puro malte premium", 6.0, "cerveja", "prod-beer-glass.jpg"],
  ["Heineken Latão 473ml", "A verdinha no latão", 6.0, "cerveja", "prod-beer-can.jpg"],
  ["Corona Extra 330ml", "Cerveja mexicana", 6.0, "cerveja", "prod-beer-glass.jpg"],
  ["Skol Beats GT 269ml", "Vodka + guaraná", 7.0, "cerveja", "prod-beer-can.jpg"],
  ["Ice Kovak", "Bebida ice refrescante", 6.0, "cerveja", "prod-beer-can.jpg"],
  ["Império Lager 355ml", "Pilsen gelada", 5.5, "cerveja", "prod-beer-can.jpg"],

  // ===== WHISKY =====
  ["Red Label 1L", "Johnnie Walker Red Label", 83.0, "whisky", "prod-whisky.jpg"],
  ["Chivas Regal 1L", "Blended Scotch 12 anos", 143.0, "whisky", "prod-whisky.jpg"],
  ["Black Label 1L", "Johnnie Walker Black Label 12 anos", 155.0, "whisky", "prod-whisky.jpg"],
  ["White Horse 1L", "Whisky escocês", 69.99, "whisky", "prod-whisky.jpg"],
  ["Jack Daniel's 1L", "Tennessee Whiskey", 143.0, "whisky", "prod-whisky.jpg"],
  ["Buchanan's", "Deluxe 12 anos", 169.99, "whisky", "prod-whisky.jpg"],
  ["Black & White", "Blended Scotch Whisky", 49.99, "whisky", "prod-whisky.jpg"],
  ["Old Parr 1L", "Blended Scotch 12 anos", 140.0, "whisky", "prod-whisky.jpg"],
  ["Ballantine's 750ml", "Finest Blended Scotch", 63.0, "whisky", "prod-whisky.jpg"],

  // ===== DESTILADOS =====
  ["Gin Rocks Tradicional 1L", "Gin nacional para drinks", 35.0, "destilado", "prod-gin.jpg"],
  ["Gin Rocks Rosé 1L", "Gin rosé para drinks", 35.0, "destilado", "prod-gin.jpg"],
  ["Vodka Smirnoff 1L", "Vodka tradicional", 39.99, "destilado", "prod-vodka.jpg"],
  ["Pergola 1L", "Bebida destilada", 26.0, "destilado", null],
  ["Galioto", "Bebida destilada", 26.0, "destilado", null],
  ["Bananinha", "Licor de banana", 26.0, "destilado", null],

  // ===== VINHOS =====
  ["Chopp de Vinho 300ml", "Chopp de vinho gelado", 5.0, "vinho", "prod-wine.jpg"],
  ["Chopp de Vinho 600ml", "Chopp de vinho gelado", 10.0, "vinho", "prod-wine.jpg"],
  ["Vinho Bodegão 2L", "Vinho de mesa", 21.0, "vinho", "prod-wine.jpg"],
  ["Chopp Pink Moon 2L", "Chopp de vinho frisante", 26.0, "vinho", "prod-wine.jpg"],

  // ===== REFRIGERANTES =====
  ["Coca-Cola 2L", "Refrigerante de cola família", 11.99, "refrigerante", "prod-coca.jpg"],
  ["Coca-Cola 2L Zero", "Coca-Cola sem açúcar", 11.99, "refrigerante", "prod-coca.jpg"],
  ["Fanta Laranja 2L", "Refrigerante de laranja", 8.5, "refrigerante", null],
  ["Fanta Uva 2L", "Refrigerante de uva", 8.5, "refrigerante", null],
  ["Sprite 2L", "Refrigerante limão", 8.5, "refrigerante", null],
  ["Convenção Guaraná 2L", "Refrigerante de guaraná", 6.0, "refrigerante", null],
  ["Convenção Laranja 2L", "Refrigerante de laranja", 6.0, "refrigerante", null, true],
  ["Convenção Abacaxi 2L", "Refrigerante de abacaxi", 6.0, "refrigerante", null],
  ["Convenção Limão 2L", "Refrigerante de limão", 6.0, "refrigerante", null, true],
  ["Guaraná Antártica 2L", "O sabor do Brasil", 8.5, "refrigerante", null],
  ["Pepsi 2L", "Refrigerante de cola", 8.5, "refrigerante", null],
  ["Minerinho 2L", "Refrigerante", 8.5, "refrigerante", null],

  // ===== ENERGÉTICOS =====
  ["Monster Energy 473ml", "Energético latão", 9.0, "energetico", null],
  ["Red Bull 250ml", "Energético que te dá asas", 9.0, "energetico", null],
  ["Fontt Energy", "Energético", 11.0, "energetico", null],
  ["Fusion 1L", "Energético", 11.0, "energetico", null],
  ["Fusion 2L", "Energético família", 16.0, "energetico", null],
  ["Minotauro", "Energético", 11.0, "energetico", null],
  ["Bally", "Energético", 16.0, "energetico", null],

  // ===== GELO E CARVÃO =====
  ["Carvão 3kg", "Saco de carvão", 13.0, "gelo", null],
  ["Carvão 6kg", "Saco de carvão", 23.0, "gelo", null],
  ["Gelo Escama 20kg", "Saco de gelo escama", 12.0, "gelo", null],
  ["Saco de Gelo de Coco 1kg", "Gelo de água de coco", 15.0, "gelo", null],
  ["Caixinha de Gelo", "Gelo em cubo", 3.0, "gelo", null],

  // ===== CIGARROS =====
  ["Rothmans", "Maço de cigarro", 8.0, "cigarro", null],
  ["Dunhill", "Maço de cigarro", 13.0, "cigarro", null],
  ["Lucky Strike Double", "Maço de cigarro", 11.0, "cigarro", null],
  ["Lucky Strike Azul / Vermelho", "Maço de cigarro", 10.0, "cigarro", null],
  ["Black", "Maço de cigarro", 21.0, "cigarro", null],
  ["Winston", "Maço de cigarro", 6.0, "cigarro", null],

  // ===== TABACARIA =====
  ["Seda Zomo Black", "Seda para enrolar", 4.5, "tabacaria", null],
  ["Seda Zomo Monster", "Seda para enrolar", 4.5, "tabacaria", null],
  ["Seda Zomo Brown", "Seda para enrolar", 4.5, "tabacaria", null],
  ["Dichavador Fibra de Coco", "Dichavador", 6.0, "tabacaria", null],
  ["Piteira", "Piteira", 4.5, "tabacaria", null],

  // ===== DIVERSOS =====
  ["Água Mineral 510ml", "Sem gás, gelada", 2.5, "diversos", "prod-water.jpg"],
  ["Água Mineral 1,5L", "Sem gás", 5.5, "diversos", "prod-water.jpg"],
  ["Coca-Cola Lata 350ml", "Lata gelada individual", 4.5, "diversos", "prod-coca.jpg"],
  ["Guaraná Antártica Lata 350ml", "Lata gelada", 4.5, "diversos", null],
  ["Água Tônica", "Água tônica gelada", 4.5, "diversos", "prod-water.jpg"],
  ["Guaravita", "Refresco de guaraná", 2.5, "diversos", null],
  ["Gatorade", "Isotônico", 6.5, "diversos", null],
  ["Miojo", "Macarrão instantâneo", 3.5, "diversos", null],
  ["Fofura", "Salgadinho", 3.5, "diversos", null],
  ["Torcida", "Salgadinho", 3.0, "diversos", null],
  ["Trakinas", "Biscoito recheado", 3.5, "diversos", null],
  ["Piraquê", "Biscoito", 5.0, "diversos", null],
  ["Barra de Chocolate", "Chocolate", 7.0, "diversos", null],
  ["Bala Halls", "Bala", 2.0, "diversos", null],
  ["Trident", "Chiclete", 3.0, "diversos", null],

  // ===== PROMOÇÕES =====
  ["3 Latões por BH", "3 latões Brahma", 13.5, "promocao", "prod-beer-can.jpg"],
  ["3 Latões por ANT", "3 latões Antártica", 13.5, "promocao", "prod-beer-can.jpg"],
  ["3 Latões por ITA", "3 latões Itaipava", 10.5, "promocao", "prod-beer-can.jpg"],
  ["3 Latões por IMPE", "3 latões Império", 11.5, "promocao", "prod-beer-can.jpg"],
  ["3 Long Neck por GOLD", "3 long necks", 12.5, "promocao", "prod-heineken.jpg"],
  ["Combo do 22 Maluco", "Vodka Leonoff + 2 Energéticos", 26.0, "promocao", "prod-vodka.jpg"],
  ["Fardo de Heineken Long C24", "24 unidades 330ml", 144.0, "promocao", "prod-heineken.jpg"],
  ["Pack Heineken Latão 473ml C12", "12 unidades 473ml", 66.0, "promocao", "prod-beer-can.jpg"],
  ["Pack Império Latão 473ml C12", "12 unidades 473ml", 42.99, "promocao", "prod-beer-can.jpg"],
  ["Pack Brahma 473ml C12", "12 unidades 473ml", 50.99, "promocao", "prod-beer-can.jpg"],
  ["Pack Antártica Latão 473ml C12", "12 unidades 473ml", 50.99, "promocao", "prod-beer-can.jpg"],
  ["Pack Itaipava 473ml C12", "12 unidades 473ml", 40.99, "promocao", "prod-beer-can.jpg"],
  ["4 por Cracudinha ANT", "4 cracudinhas Antártica", 11.5, "promocao", "prod-beer-can.jpg"],
  ["4 por Cracudinha BH", "4 cracudinhas Brahma", 11.0, "promocao", "prod-beer-can.jpg"],
  ["Caixa Império Lager 355ml C12", "Caixa com 12 unidades", 54.0, "promocao", "prod-beer-can.jpg"],
  ["Caixa Império Gold C18", "Caixa com 18 unidades", 67.0, "promocao", "prod-beer-can.jpg"],
];

const rows = catalog.map(([name, description, price, category, img, esgotado]) => ({
  name,
  description,
  price,
  category,
  image_url: IMG(img),
  stock_qty: esgotado ? 0 : 40,
  stock_min: 5,
  active: true,
}));

async function main() {
  console.log(`Catálogo: ${rows.length} produtos.`);

  // --- Substituição SEGURA do catálogo (mexe SÓ na tabela products) ---
  // NÃO toca em pedidos/histórico. Produtos antigos referenciados por pedidos
  // ou alertas são apenas desativados (preserva integridade); os demais são
  // removidos. Depois insere o catálogo novo.
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

  // Inserção do catálogo novo
  const { data, error } = await supabase.from("products").insert(rows).select("id");
  if (error) { console.error("Erro inserindo produtos:", error.message); process.exit(1); }
  console.log(`✅ Inseridos ${data.length} produtos.`);

  // Resumo por categoria
  const { data: cats } = await supabase.from("products").select("category");
  const counts = {};
  for (const c of cats ?? []) counts[c.category] = (counts[c.category] ?? 0) + 1;
  console.log("Por categoria:", counts);
}

main();
