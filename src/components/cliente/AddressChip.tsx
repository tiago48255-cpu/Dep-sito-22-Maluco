"use client";

import { Icon } from "@/components/ui/Icon";
import { useAddress } from "@/hooks/useAddress";

// variant "pill" = barra de endereço do desktop nav; "bar" = header mobile
export function AddressChip({ variant = "pill" }: { variant?: "pill" | "bar" }) {
  const { address, hydrated, openModal } = useAddress();
  const label = hydrated && address ? address.formatted : "Informe seu endereço";

  if (variant === "bar") {
    return (
      <button onClick={() => openModal()} className="flex items-center gap-2 max-w-[72%] active:scale-95 transition-transform text-left">
        <Icon name="location_on" filled className="text-xl text-primary shrink-0" />
        <div className="flex flex-col min-w-0">
          <span className="text-label-sm text-on-surface-variant leading-none">Entregar em:</span>
          <span className="text-label-md text-on-surface truncate mt-0.5 flex items-center gap-0.5">
            {label} <Icon name="expand_more" className="text-base shrink-0" />
          </span>
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={() => openModal()}
      className="hidden lg:flex items-center bg-surface-container-high rounded-full px-4 py-2 border border-outline-variant/20 hover:border-primary transition-all cursor-pointer max-w-[320px]"
    >
      <Icon name="location_on" className="text-on-surface-variant mr-2 text-xl shrink-0" />
      <span className="text-label-lg text-on-surface truncate">{label}</span>
      <Icon name="expand_more" className="text-on-surface-variant ml-2 text-xl shrink-0" />
    </button>
  );
}
