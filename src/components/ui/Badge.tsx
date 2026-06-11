import type { OrderStatus } from "@/lib/types/database";

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
  pendente: { label: "Pendente", className: "bg-brand-tertiary/20 text-brand-tertiary border-brand-tertiary/30" },
  aceito: { label: "Aceito", className: "bg-brand-primary/20 text-brand-primary border-brand-primary/30" },
  preparando: { label: "Preparando", className: "bg-purple-500/20 text-purple-300 border-purple-500/30" },
  saiu: { label: "A caminho", className: "bg-brand-primary-container/30 text-brand-primary border-brand-primary/30" },
  entregue: { label: "Entregue", className: "bg-green-500/20 text-green-400 border-green-500/30" },
  cancelado: { label: "Cancelado", className: "bg-brand-secondary-container/30 text-brand-secondary border-brand-secondary-container/30" },
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  const config = statusConfig[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${config.className}`}>
      {config.label}
    </span>
  );
}

export function Badge({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${className}`}>
      {children}
    </span>
  );
}
