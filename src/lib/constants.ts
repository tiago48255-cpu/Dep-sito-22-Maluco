export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5521968970411";

export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

// Endereço/localização da loja (fonte: AnotaAI — units[0].address)
export const STORE_ADDRESS = "Rua Barroso, 62 - Vila São Luís, Nova Iguaçu - RJ, 26.012-360";
export const STORE_LAT = -22.7394739;
export const STORE_LNG = -43.43635099999999;
export const STORE_MAPS_URL = `https://www.google.com/maps/dir/?api=1&destination=${STORE_LAT},${STORE_LNG}`;
