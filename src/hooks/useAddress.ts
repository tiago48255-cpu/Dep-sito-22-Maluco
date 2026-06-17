import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Address {
  cep: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  complement: string;
  lat?: number | null;
  lng?: number | null;
  formatted: string;
}

interface AddressStore {
  address: Address | null;
  hydrated: boolean;
  modalOpen: boolean;
  required: boolean; // quando true, o modal não fecha sem endereço
  setAddress: (a: Address) => void;
  clear: () => void;
  openModal: (required?: boolean) => void;
  closeModal: () => void;
}

export function formatAddress(a: Omit<Address, "formatted">): string {
  const main = [a.street, a.number].filter(Boolean).join(", ");
  const rest = [a.neighborhood, a.city && `${a.city}${a.state ? "/" + a.state : ""}`].filter(Boolean).join(" · ");
  return [main, rest].filter(Boolean).join(" — ");
}

export const useAddress = create<AddressStore>()(
  persist(
    (set, get) => ({
      address: null,
      hydrated: false,
      modalOpen: false,
      required: false,
      setAddress: (a) => set({ address: a, modalOpen: false, required: false }),
      clear: () => set({ address: null }),
      openModal: (required = false) => set({ modalOpen: true, required }),
      closeModal: () => {
        // se for obrigatório e ainda não tem endereço, não deixa fechar
        if (get().required && !get().address) return;
        set({ modalOpen: false });
      },
    }),
    {
      name: "22maluco-address",
      partialize: (s) => ({ address: s.address }),
      onRehydrateStorage: () => (state) => {
        if (state) state.hydrated = true;
      },
    }
  )
);
