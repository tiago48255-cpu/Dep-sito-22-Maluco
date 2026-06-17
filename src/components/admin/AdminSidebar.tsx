"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { href: "/admin", icon: "dashboard", label: "Dashboard" },
  { href: "/admin/pedidos", icon: "receipt_long", label: "Pedidos" },
  { href: "/admin/produtos", icon: "inventory_2", label: "Produtos" },
  { href: "/admin/estoque", icon: "warehouse", label: "Estoque" },
  { href: "/admin/motoboys", icon: "sports_motorsports", label: "Motoboys" },
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
    <aside className="w-60 bg-surface border-r border-outline-variant/20 flex flex-col min-h-screen sticky top-0">
      <div className="p-4 border-b border-outline-variant/20">
        <Link href="/admin" className="flex items-center gap-2">
          <Image src="/logo.png" alt="22 Maluco" width={36} height={36} className="rounded-full" />
          <div>
            <p className="text-on-surface font-bold text-label-lg leading-tight">22 MALUCO</p>
            <p className="text-on-surface-variant text-label-md">Painel Admin</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-3 flex flex-col gap-1">
        {navItems.map(({ href, icon, label }) => {
          const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-label-lg transition-colors ${
                active
                  ? "bg-primary-container text-on-primary-container"
                  : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
              }`}
            >
              <Icon name={icon} filled={active} className="text-xl" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-outline-variant/20">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-label-lg text-on-surface-variant hover:text-secondary hover:bg-secondary/10 w-full transition-colors"
        >
          <Icon name="logout" className="text-xl" /> Sair
        </button>
      </div>
    </aside>
  );
}
