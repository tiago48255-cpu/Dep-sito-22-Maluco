import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CheckoutForm } from "@/components/cliente/CheckoutForm";
import type { Profile } from "@/lib/types/queries";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

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
    <div className="text-on-surface min-h-screen">
      {/* Header — mobile */}
      <header className="page-header md:hidden">
        <Link href="/carrinho" className="text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-full w-9 h-9 flex items-center justify-center transition-colors shrink-0">
          <Icon name="arrow_back" className="text-xl" />
        </Link>
        <h1 className="text-body-md font-bold text-on-surface flex-1 text-center -ml-9 pr-9">Checkout</h1>
      </header>

      {/* Título desktop */}
      <div className="hidden md:block content-container pt-8">
        <h1 className="text-headline-lg text-on-surface">Finalizar pedido</h1>
      </div>

      <CheckoutForm profile={profile} />
    </div>
  );
}
