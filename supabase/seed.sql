-- ============================================================================
-- 22 Maluco — SEED de validação local (MVP atual, pré-Sprint de Estoque)
-- ----------------------------------------------------------------------------
-- Como usar:
--   1. Aplique antes o schema (web/supabase/schema.sql).
--   2. Cole este arquivo no SQL Editor do Supabase e rode (usa service role,
--      ignora RLS — pode inserir produtos normalmente).
--   3. Crie os usuários pela UI (/cadastro) e depois rode a SEÇÃO 4 para
--      promover papéis (admin / motoboy).
--
-- Categorias batem com a UI atual (chaves minúsculas, com acento):
--   cerveja · refrigerante · energético · água · gelo · destilado
--
-- Distribuição de estoque para teste:
--   ✅ saudável        → stock_qty bem acima do stock_min
--   🟡 próximo do mín  → stock_qty logo acima do stock_min (sem alerta)
--   🔴 abaixo do mín   → stock_qty <= stock_min (gera alerta na SEÇÃO 3)
-- ============================================================================


-- ----------------------------------------------------------------------------
-- SEÇÃO 0 — (OPCIONAL) Limpeza para re-rodar do zero
-- ATENÇÃO: apaga pedidos e alertas. Descomente só se quiser resetar.
-- ----------------------------------------------------------------------------
-- delete from order_items;
-- delete from orders;
-- delete from stock_alerts;
-- delete from products;


-- ----------------------------------------------------------------------------
-- SEÇÃO 1 — Catálogo de produtos
-- ----------------------------------------------------------------------------
insert into products (name, description, price, category, stock_qty, stock_min, active) values
  -- 🍺 CERVEJAS
  ('Skol Lata 350ml',          'Pilsen gelada, a queridinha do gelo',        4.50,  'cerveja',      60, 12, true),  -- ✅ saudável
  ('Heineken Long Neck 330ml', 'Puro malte, garrafa long neck',              7.90,  'cerveja',      14, 12, true),  -- 🟡 próximo
  ('Brahma Litrão 1L',         'Pilsen retornável, ideal pra dividir',       8.50,  'cerveja',       4, 10, true),  -- 🔴 abaixo
  ('Corona Extra 330ml',       'Cerveja puro malte mexicana',                9.90,  'cerveja',       0,  6, false), -- ⛔ inativa (testa filtro/toggle)

  -- 🥤 REFRIGERANTES
  ('Coca-Cola 2L',             'Refrigerante de cola, garrafa família',      9.90,  'refrigerante', 40,  8, true),  -- ✅ saudável
  ('Guaraná Antarctica 2L',    'O sabor do Brasil',                          8.00,  'refrigerante',  9,  8, true),  -- 🟡 próximo
  ('Coca-Cola Lata 350ml',     'Lata gelada individual',                     4.00,  'refrigerante',  3, 10, true),  -- 🔴 abaixo

  -- ⚡ ENERGÉTICOS
  ('Red Bull 250ml',           'Energético que te dá asas',                 10.00,  'energético',   36, 10, true),  -- ✅ saudável
  ('TNT Energy 269ml',         'Energético, dá tudo de si',                  6.50,  'energético',    7,  6, true),  -- 🟡 próximo
  ('Monster Energy 473ml',     'Latão energético',                          12.00,  'energético',    2,  8, true),  -- 🔴 abaixo

  -- 💧 ÁGUA
  ('Água Mineral 500ml',       'Sem gás, gelada',                            2.50,  'água',         80, 20, true),  -- ✅ saudável
  ('Água com Gás 500ml',       'Mineral gaseificada',                        3.50,  'água',         11, 10, true),  -- 🟡 próximo

  -- 🧊 GELO
  ('Gelo em Cubo 5kg',         'Saco de gelo filtrado',                      8.00,  'gelo',         25,  6, true),  -- ✅ saudável
  ('Gelo de Coco 2kg',         'Gelo de água de coco',                      10.00,  'gelo',          1,  5, true),  -- 🔴 abaixo

  -- 🥃 DESTILADOS
  ('Vodka Smirnoff 998ml',     'Vodka tradicional',                         35.90,  'destilado',    18,  5, true),  -- ✅ saudável
  ('Whisky Red Label 1L',      'Johnnie Walker Red Label',                  89.90,  'destilado',     6,  5, true),  -- 🟡 próximo
  ('Gin Rocks 1L',             'Gin nacional para drinks',                  45.00,  'destilado',     2,  6, true);  -- 🔴 abaixo


-- ----------------------------------------------------------------------------
-- SEÇÃO 2 — Motoboy de teste (tabela motoboys, usada pelo admin)
-- ----------------------------------------------------------------------------
insert into motoboys (name, phone, active) values
  ('Entregador Teste', '5521968979426', true);


-- ----------------------------------------------------------------------------
-- SEÇÃO 3 — Gerar alertas de estoque baixo
-- Cria um stock_alert (não resolvido) para cada produto ativo com qty <= mínimo.
-- Idempotente: não duplica se já houver alerta aberto para o produto.
-- (Após a Sprint de Estoque, esses alertas passarão a nascer automaticamente
--  via trigger quando uma venda derrubar o estoque.)
-- ----------------------------------------------------------------------------
insert into stock_alerts (product_id)
select p.id
from products p
where p.active = true
  and p.stock_qty <= p.stock_min
  and not exists (
    select 1 from stock_alerts sa
    where sa.product_id = p.id and sa.resolved = false
  );


-- ----------------------------------------------------------------------------
-- SEÇÃO 4 — Promoção de papéis (rodar DEPOIS de cadastrar os usuários na UI)
-- Cadastre os e-mails em /cadastro, depois troque os e-mails abaixo e rode.
-- ----------------------------------------------------------------------------
-- update profiles set role = 'admin'
-- where id = (select id from auth.users where email = 'admin@teste.com');

-- update profiles set role = 'motoboy'
-- where id = (select id from auth.users where email = 'motoboy@teste.com');


-- ----------------------------------------------------------------------------
-- SEÇÃO 5 — Conferência rápida (selects de verificação)
-- ----------------------------------------------------------------------------
-- Resumo por categoria e situação de estoque:
-- select category,
--        count(*) as produtos,
--        count(*) filter (where stock_qty <= stock_min) as abaixo_ou_no_minimo
-- from products group by category order by category;

-- Produtos em alerta:
-- select name, stock_qty, stock_min from products
-- where active = true and stock_qty <= stock_min order by stock_qty;

-- Alertas abertos (deve bater com o KPI do dashboard):
-- select count(*) from stock_alerts where resolved = false;
