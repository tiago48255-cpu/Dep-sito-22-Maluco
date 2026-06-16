/**
 * POST /api/webhooks/mercadopago
 *
 * Recebe notificações de pagamento do MercadoPago e atualiza o pedido.
 *
 * LIMITAÇÃO DE SCHEMA: a tabela `orders` não possui o campo `payment_status`.
 * Quando o pagamento é aprovado, atualizamos `status → "aceito"` (equivalente
 * mais próximo de "confirmado" no enum existente: pendente|aceito|preparando|saiu|entregue|cancelado).
 * Para separar status de entrega de status de pagamento, é necessário adicionar
 * o campo `payment_status` via migration.
 *
 * Env vars necessárias:
 *   MERCADO_PAGO_ACCESS_TOKEN — para verificar o pagamento na API do MP
 *   SUPABASE_SERVICE_ROLE_KEY  — para bypass de RLS ao atualizar o pedido
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import MercadoPagoConfig, { Payment } from "mercadopago";

export async function POST(req: NextRequest) {
  const body = await req.json() as {
    type?: string;
    action?: string;
    data?: { id?: string | number };
  };

  // MercadoPago envia type = "payment" quando um pagamento muda de estado
  if (body.type !== "payment" || !body.data?.id) {
    return NextResponse.json({ ok: true });
  }

  const paymentId = String(body.data.id);
  const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;

  if (!accessToken) {
    console.error("[webhook/mp] MERCADO_PAGO_ACCESS_TOKEN ausente");
    return NextResponse.json({ error: "config" }, { status: 503 });
  }

  // Busca o pagamento na API do MP para confirmar o status
  const client = new MercadoPagoConfig({ accessToken });
  const paymentApi = new Payment(client);
  const mp = await paymentApi.get({ id: paymentId });

  if (mp.status !== "approved") {
    // Nada a fazer para outros status (pending, rejected, etc.)
    return NextResponse.json({ ok: true, status: mp.status });
  }

  const orderId = mp.external_reference;
  if (!orderId) {
    console.warn("[webhook/mp] Pagamento sem external_reference:", paymentId);
    return NextResponse.json({ ok: true });
  }

  // Usa service role para bypass de RLS
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await supabase
    .from("orders")
    .update({
      // LIMITAÇÃO: sem campo payment_status — usamos status="aceito" como proxy
      // de "pagamento confirmado". Migration necessária para desacoplar os dois conceitos.
      status: "aceito",
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId)
    .eq("status", "pendente"); // Só avança se ainda estiver pendente

  if (error) {
    console.error("[webhook/mp] Erro ao atualizar pedido:", error);
    return NextResponse.json({ error: "db" }, { status: 500 });
  }

  console.log(`[webhook/mp] Pedido ${orderId} confirmado via PIX (payment ${paymentId})`);
  return NextResponse.json({ ok: true });
}
