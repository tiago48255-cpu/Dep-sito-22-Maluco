import { BottomNav } from "@/components/layout/BottomNav";
import { DesktopNav } from "@/components/layout/DesktopNav";
import { Footer } from "@/components/layout/Footer";
import { AgeGate } from "@/components/cliente/AgeGate";
import { CookieConsent } from "@/components/cliente/CookieConsent";
import { AddressModal } from "@/components/cliente/AddressModal";
import { AddressGate } from "@/components/cliente/AddressGate";
import { PwaRegister } from "@/components/cliente/PwaRegister";

export default function ClienteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Desktop: top navbar (Stitch) */}
      <DesktopNav />

      {/* Conteúdo principal — offset do top nav no desktop */}
      <div className="flex-1 md:pt-20 pb-24 md:pb-0">
        {children}
      </div>

      {/* Desktop: footer */}
      <Footer />

      {/* Mobile: bottom nav */}
      <BottomNav />

      {/* Camadas globais da loja */}
      <AgeGate />
      <AddressGate />
      <AddressModal />
      <CookieConsent />
      <PwaRegister />
    </div>
  );
}
