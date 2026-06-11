const ZAPI_BASE = `https://api.z-api.io/instances/${process.env.ZAPI_INSTANCE_ID}/token/${process.env.ZAPI_TOKEN}`;

export async function sendWhatsApp(to: string, message: string) {
  if (!process.env.ZAPI_INSTANCE_ID || !process.env.ZAPI_TOKEN) {
    console.warn("[zapi] Variáveis não configuradas — mensagem não enviada");
    return;
  }

  const phone = to.replace(/\D/g, "");

  const res = await fetch(`${ZAPI_BASE}/send-text`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Client-Token": process.env.ZAPI_CLIENT_TOKEN!,
    },
    body: JSON.stringify({ phone, message }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error("[zapi] Falha ao enviar mensagem:", body);
  }
}

export async function notifyLowStock(productName: string, currentQty: number) {
  const adminPhone = process.env.ADMIN_WHATSAPP;
  if (!adminPhone) return;

  const message = `⚠️ *ESTOQUE BAIXO — 22 Maluco*\n\nProduto: *${productName}*\nQuantidade atual: *${currentQty} unidade(s)*\n\nReponha o estoque o quanto antes!`;

  await sendWhatsApp(adminPhone, message);
}
