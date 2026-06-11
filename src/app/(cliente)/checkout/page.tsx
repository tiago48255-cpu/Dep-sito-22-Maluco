import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CheckoutForm } from "@/components/cliente/CheckoutForm";
import type { Profile } from "@/lib/types/queries";

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
      <header className="sticky top-0 z-40 bg-neutral-950/95 backdrop-blur-xl border-b border-white/5 px-5 py-3 flex items-center h-16 select-none">
        <h1 className="text-base font-bold text-white">Checkout</h1>
      </header>
      <CheckoutForm profile={profile} />
    </div>
  );
}
