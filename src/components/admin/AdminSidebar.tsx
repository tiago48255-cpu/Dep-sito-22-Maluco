"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  AlertTriangle,
  Bike,
  BarChart2,
  LogOut,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/pedidos", icon: ShoppingBag, label: "Pedidos" },
  { href: "/admin/produtos", icon: Package, label: "Produtos" },
  { href: "/admin/estoque", icon: AlertTriangle, label: "Estoque" },
  { href: "/admin/motoboys", icon: Bike, label: "Motoboys" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <aside className="w-60 bg-[#12122A] border-r border-[#2A2A4A] flex flex-col min-h-screen sticky top-0">
      <div className="p-4 border-b border-[#2A2A4A]">
        <Link href="/admin" className="flex items-center gap-2">
          <Image src="/logo.png" alt="22 Maluco" width={36} height={36} className="rounded-full" />
          <div>
            <p className="text-white font-bold text-sm leading-tight">22 MALUCO</p>
            <p className="text-[#9999BB] text-xs">Admin</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-3 flex flex-col gap-1">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-[#2233CC] text-white"
                  : "text-[#9999BB] hover:bg-[#1A1A38] hover:text-white"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-[#2A2A4A]">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-[#9999BB] hover:text-red-400 hover:bg-red-500/10 w-full transition-colors"
        >
          <LogOut size={18} /> Sair
        </button>
      </div>
    </aside>
  );
}
