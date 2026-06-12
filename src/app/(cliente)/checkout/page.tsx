import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CheckoutForm } from "@/components/cliente/CheckoutForm";
import type { Profile } from "@/lib/types/queries";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function CheckoutPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/checkout");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single() as { data: Profile | null };

  return (
    <div className="text-white min-h-screen bg-black">
      <header className="page-header">
        <Link
          href="/carrinho"
          className="text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-full w-9 h-9 flex items-center justify-center transition-colors shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-sm font-bold text-white flex-1 text-center -ml-9 pr-9">Checkout</h1>
      </header>
      <CheckoutForm profile={profile} />
    </div>
  );
}
