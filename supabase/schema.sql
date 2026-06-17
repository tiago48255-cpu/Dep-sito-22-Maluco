-- 22 Maluco — Schema do banco de dados
-- Execute no SQL Editor do Supabase

-- Extensões
create extension if not exists "uuid-ossp";

-- Tipos
create type user_role as enum ('cliente', 'admin', 'motoboy');
create type order_status as enum ('pendente', 'aceito', 'preparando', 'saiu', 'entregue', 'cancelado');
create type payment_method as enum ('pix', 'credito', 'debito', 'dinheiro');

-- Profiles (extensão do auth.users)
create table profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  name text not null,
  phone text,
  address_default text,
  cashback_balance numeric(10,2) not null default 0,
  role user_role not null default 'cliente',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Criar profile automaticamente ao registrar
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Produtos
create table products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  price numeric(10,2) not null,
  category text not null,
  image_url text,
  stock_qty integer not null default 0,
  stock_min integer not null default 5,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Motoboys
create table motoboys (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  phone text not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Pedidos
create table orders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id),
  status order_status not null default 'pendente',
  total numeric(10,2) not null,
  payment_method payment_method not null,
  change_for numeric(10,2),
  delivery_address text not null,
  motoboy_id uuid references motoboys(id),
  notes text,
  -- Rastreio do entregador em tempo real (GPS)
  driver_lat numeric(10,7),
  driver_lng numeric(10,7),
  driver_updated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Itens do pedido
create table order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid not null references products(id),
  qty integer not null,
  price_at_time numeric(10,2) not null
);

-- Alertas de estoque
create table stock_alerts (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references products(id),
  triggered_at timestamptz not null default now(),
  resolved boolean not null default false,
  resolved_at timestamptz
);

-- Trigger pra atualizar updated_at
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on profiles
  for each row execute function update_updated_at();

create trigger products_updated_at before update on products
  for each row execute function update_updated_at();

create trigger orders_updated_at before update on orders
  for each row execute function update_updated_at();

-- Trigger pra gerar alerta quando estoque cair abaixo do mínimo
create or replace function check_stock_alert()
returns trigger language plpgsql as $$
begin
  if new.stock_qty <= new.stock_min and (old.stock_qty > old.stock_min or old.stock_qty is null) then
    insert into stock_alerts (product_id) values (new.id);
  end if;
  return new;
end;
$$;

create trigger products_stock_alert after update of stock_qty on products
  for each row execute function check_stock_alert();

-- RLS (Row Level Security)
alter table profiles enable row level security;
alter table products enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table motoboys enable row level security;
alter table stock_alerts enable row level security;

-- Profiles: usuário vê e edita só o próprio
create policy "profiles_select_own" on profiles for select using (auth.uid() = id);
create policy "profiles_update_own" on profiles for update using (auth.uid() = id);

-- Products: todos veem, só admin edita
create policy "products_select_all" on products for select using (active = true);
create policy "products_admin_all" on products for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Orders: cliente vê os próprios, admin/motoboy veem todos
create policy "orders_select_own" on orders for select using (
  auth.uid() = user_id or
  exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'motoboy'))
);
create policy "orders_insert_own" on orders for insert with check (auth.uid() = user_id);
create policy "orders_update_admin" on orders for update using (
  exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'motoboy'))
);

-- Order items: segue as mesmas regras do pedido
create policy "order_items_select" on order_items for select using (
  exists (
    select 1 from orders
    where orders.id = order_items.order_id
    and (orders.user_id = auth.uid() or
      exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'motoboy')))
  )
);
create policy "order_items_insert" on order_items for insert with check (
  exists (select 1 from orders where orders.id = order_id and orders.user_id = auth.uid())
);

-- Motoboys: só admin gerencia
create policy "motoboys_select_admin" on motoboys for select using (
  exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'motoboy'))
);
create policy "motoboys_admin_all" on motoboys for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Stock alerts: só admin
create policy "stock_alerts_admin" on stock_alerts for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Índices
create index orders_user_id_idx on orders(user_id);
create index orders_status_idx on orders(status);
create index orders_created_at_idx on orders(created_at desc);
create index order_items_order_id_idx on order_items(order_id);
create index products_category_idx on products(category);
create index products_active_idx on products(active);
create index stock_alerts_resolved_idx on stock_alerts(resolved) where resolved = false;
