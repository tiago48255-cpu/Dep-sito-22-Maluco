/**
 * POST /api/payments/pix
 *
 * Cria uma cobrança PIX via SDK MercadoPago v3.
 *
 * LIMITAÇÃO DE SCHEMA: a tabela `orders` não possui os campos
 * `payment_id`, `pix_qr_code` ou `pix_copy_paste`. Os dados do QR Code
 * são retornados apenas nesta resposta e mantidos em estado React no cliente.
 * Para persistência permanente, é necessário adicionar esses campos via migration.
 *
 * Env vars necessárias:
 *   MERCADO_PAGO_ACCESS_TOKEN — token de acesso (TEST-... para sandbox)
 */

import { NextRequest, NextResponse } from "next/server";
import MercadoPagoConfig, { Payment } from "mercadopago";

export async function POST(req: NextRequest) {
  const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;

  if (!accessToken || accessToken === "your-mercadopago-access-token") {
    return NextResponse.json(
      { error: "MERCADO_PAGO_ACCESS_TOKEN não configurado" },
      { status: 503 }
    );
  }

  const body = await req.json() as {
    orderId: string;
    amount: number;
    customerEmail: string;
    customerName: string;
  };

  const { orderId, amount, customerEmail, customerName } = body;

  if (!orderId || !amount || !customerEmail) {
    return NextResponse.json({ error: "Campos obrigatórios ausentes" }, { status: 400 });
  }

  const client = new MercadoPagoConfig({ accessToken });
  const payment = new Payment(client);

  const result = await payment.create({
    body: {
      transaction_amount: amount,
      description: `Pedido 22 Maluco #${orderId.slice(-8).toUpperCase()}`,
      payment_method_id: "pix",
      payer: {
        email: customerEmail,
        first_name: customerName.split(" ")[0] ?? customerName,
        last_name: customerName.split(" ").slice(1).join(" ") || undefined,
      },
      external_reference: orderId,
    },
  });

  const txData = result.point_of_interaction?.transaction_data;

  if (!txData?.qr_code) {
    return NextResponse.json(
      { error: "MercadoPago não retornou QR Code", detail: result },
      { status: 502 }
    );
  }

  return NextResponse.json({
    payment_id: result.id,
    qr_code: txData.qr_code,
    qr_code_base64: txData.qr_code_base64 ?? null,
  });
}
