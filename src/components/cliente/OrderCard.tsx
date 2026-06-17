import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { StatusBadge } from "@/components/ui/Badge";
import type { OrderStatus } from "@/lib/types/database";

interface OrderCardProps {
  id: string;
  shortId: string;
  date: string;
  status: OrderStatus;
  items: { name: string; qty: number }[];
  total: number;
}

export function OrderCard({ id, shortId, date, status, items, total }: OrderCardProps) {
  const statusIcon =
    status === "entregue" ? "check_circle"
    : status === "cancelado" ? "cancel"
    : "schedule";

  const iconClass =
    status === "entregue" ? "text-green-400"
    : status === "cancelado" ? "text-secondary"
    : "text-primary";

  return (
    <Link href={`/pedidos/${id}`} className="glass-panel rounded-2xl p-4 block hover:border-white/10 transition-colors">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <Icon name={statusIcon} filled className={`text-lg shrink-0 ${iconClass}`} />
          <span className="text-on-surface font-bold text-body-sm">#{shortId}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <StatusBadge status={status} />
          <Icon name="chevron_right" className="text-lg text-on-surface-variant" />
        </div>
      </div>
      <p className="text-on-surface-variant text-label-md mb-2">{date}</p>
      <div className="border-t border-white/5 pt-2 space-y-0.5">
        {items.slice(0, 3).map((item, i) => (
          <p key={i} className="text-on-surface-variant text-label-md">{item.qty}× {item.name}</p>
        ))}
        {items.length > 3 && (
          <p className="text-on-surface-variant/60 text-label-md">+{items.length - 3} mais</p>
        )}
      </div>
      <div className="flex justify-between items-center mt-3 pt-2 border-t border-white/5">
        <span className="text-on-surface-variant text-label-md">Total</span>
        <span className="text-primary font-bold text-body-sm">R$ {total.toFixed(2).replace(".", ",")}</span>
      </div>
    </Link>
  );
}
