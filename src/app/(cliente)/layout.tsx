import { BottomNav } from "@/components/layout/BottomNav";
import { DesktopNav } from "@/components/layout/DesktopNav";

export default function ClienteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black">
      {/* Desktop: sidebar nav */}
      <DesktopNav />

      {/* Conteúdo principal — fluido, com offset no desktop */}
      <div className="md:ml-[240px] min-h-screen pb-20 md:pb-0">
        {children}
      </div>

      {/* Mobile: bottom nav */}
      <BottomNav />
    </div>
  );
}
