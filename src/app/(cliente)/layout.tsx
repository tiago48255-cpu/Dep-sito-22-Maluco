import { BottomNav } from "@/components/layout/BottomNav";

export default function ClienteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-[430px] mx-auto relative min-h-screen pb-20">
        {children}
      </div>
      <BottomNav />
    </div>
  );
}
