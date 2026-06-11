import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { notifyLowStock } from "@/lib/zapi";

// Chamado pelo Supabase webhook quando stock_alerts recebe novo registro
export async function POST(request: Request) {
  const body = await request.json();

  // Supabase webhook payload
  const record = body?.record;
  if (!record?.product_id) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: product } = await supabase
    .from("products")
    .select("name, stock_qty")
    .eq("id", record.product_id)
    .single();

  if (product) {
    await notifyLowStock(product.name, product.stock_qty);
  }

  return NextResponse.json({ ok: true });
}
