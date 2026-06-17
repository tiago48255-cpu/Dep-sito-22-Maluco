import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single() as { data: { role: string } | null };

  if (profile?.role !== "admin") redirect("/");

  return (
    <div className="min-h-screen flex bg-background text-on-surface">
      <AdminSidebar />
      <main className="flex-1 p-4 md:p-6 overflow-auto pt-16 md:pt-6">{children}</main>
    </div>
  );
}
