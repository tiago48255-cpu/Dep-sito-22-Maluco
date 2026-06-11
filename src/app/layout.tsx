import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "22 Maluco — Depósito de Bebidas 24h",
  description: "Delivery de bebidas geladas 24 horas. Cervejas, destilados, energéticos e mais. Caioaba, Nova Iguaçu.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={plusJakartaSans.variable}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
