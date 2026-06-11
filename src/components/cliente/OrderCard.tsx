import Link from "next/link";
import { ChevronRight, CheckCircle2, Clock, XCircle } from "lucide-react";
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
  const StatusIcon =
    status === "entregue" ? CheckCircle2
    : status === "cancelado" ? XCircle
    : Clock;

  const iconClass =
    status === "entregue" ? "text-green-400"
    : status === "cancelado" ? "text-brand-secondary"
    : "text-brand-primary animate-pulse";

  return (
    <Link href={`/pedidos/${id}`} className="glass-panel rounded-2xl p-4 block hover:border-white/10 transition-colors">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <StatusIcon className={`w-4 h-4 shrink-0 ${iconClass}`} />
          <span className="text-white font-bold text-sm">#{shortId}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <StatusBadge status={status} />
          <ChevronRight className="w-4 h-4 text-neutral-600" />
        </div>
      </div>
      <p className="text-neutral-500 text-xs mb-2">{date}</p>
      <div className="border-t border-white/5 pt-2 space-y-0.5">
        {items.slice(0, 3).map((item, i) => (
          <p key={i} className="text-neutral-400 text-xs">
            {item.qty}× {item.name}
          </p>
        ))}
        {items.length > 3 && (
          <p className="text-neutral-600 text-xs">+{items.length - 3} mais</p>
        )}
      </div>
      <div className="flex justify-between items-center mt-3 pt-2 border-t border-white/5">
        <span className="text-neutral-500 text-xs">Total</span>
        <span className="text-brand-primary font-black text-sm">
          R$ {total.toFixed(2).replace(".", ",")}
        </span>
      </div>
    </Link>
  );
}
