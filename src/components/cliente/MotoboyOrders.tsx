"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MapPin, Phone, CheckCircle, Navigation, Square, Package, RefreshCw } from "lucide-react";

interface Order {
  id: string;
  status: string;
  delivery_address: string;
  total: number;
  payment_method: string;
  change_for: number | null;
  notes: string | null;
  profiles: { name: string; phone: string } | null;
  order_items: { qty: number; price_at_time: number; products: { name: string } | null }[];
}

// Compartilha a localização do entregador (GPS do celular) com o cliente em tempo real.
function LocationShare({ orderId }: { orderId: string }) {
  const [sharing, setSharing] = useState(false);
  const [err, setErr] = useState("");
  const [pings, setPings] = useState(0);
  const watchRef = useRef<number | null>(null);
  const lastSent = useRef(0);

  function start() {
    setErr("");
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setErr("GPS indisponível neste dispositivo.");
      return;
    }
    if (!window.isSecureContext) {
      setErr("Localização exige HTTPS — abra o site publicado (não o IP local).");
      return;
    }
    const supabase = createClient();
    watchRef.current = navigator.geolocation.watchPosition(
      async (pos) => {
        const now = Date.now();
        if (now - lastSent.current < 4000) return;
        lastSent.current = now;
        await supabase
          .from("orders")
          .update({
            driver_lat: pos.coords.latitude,
            driver_lng: pos.coords.longitude,
            driver_updated_at: new Date().toISOString(),
          })
          .eq("id", orderId);
        setPings((n) => n + 1);
      },
      (e) => setErr(e.code === 1 ? "Permissão de localização negada." : "Não foi possível obter a localização."),
      { enableHighAccuracy: true, maximumAge: 2000, timeout: 15000 }
    );
    setSharing(true);
  }

  function stop() {
    if (watchRef.current != null) navigator.geolocation.clearWatch(watchRef.current);
    watchRef.current = null;
    setSharing(false);
  }

  useEffect(() => () => {
    if (watchRef.current != null) navigator.geolocation.clearWatch(watchRef.current);
  }, []);

  return (
    <div className="mb-3">
      {sharing ? (
        <Button onClick={stop} variant="secondary" className="w-full gap-2">
          <Square size={14} /> Parar de compartilhar {pings > 0 && `· ${pings} envios`}
        </Button>
      ) : (
        <Button onClick={start} variant="secondary" className="w-full gap-2">
          <Navigation size={16} /> Compartilhar localização
        </Button>
      )}
      {sharing && !err && (
        <p className="text-green-400 text-xs mt-1.5 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block" />
          Cliente acompanhando você ao vivo
        </p>
      )}
      {err && <p className="text-yellow-400 text-xs mt-1.5">{err}</p>}
    </div>
  );
}

const STATUS_LABEL: Record<string, string> = {
  aceito: "Pronto pra buscar",
  saiu: "A caminho",
  entregue: "Entregue",
};

const STATUS_COLOR: Record<string, string> = {
  aceito: "bg-yellow-500/20 text-yellow-400",
  saiu: "bg-blue-500/20 text-blue-400",
  entregue: "bg-green-500/20 text-green-400",
};

export function MotoboyOrders({
  orders: initialOrders,
  motoboyId,
}: {
  orders: Order[];
  motoboyId: string | null;
}) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [connected, setConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const fetchOrders = useCallback(async () => {
    const supabase = createClient();
    let query = supabase
      .from("orders")
      .select(
        "id, status, delivery_address, total, payment_method, change_for, notes, profiles(name, phone), order_items(qty, price_at_time, products(name))"
      )
      .in("status", ["aceito", "saiu", "entregue"])
      .order("created_at", { ascending: false })
      .limit(30);

    if (motoboyId) {
      query = query.eq("motoboy_id", motoboyId);
    } else {
      query = query.eq("status", "saiu").is("motoboy_id", null);
    }

    const { data } = await query;
    if (data) {
      setOrders(data as unknown as Order[]);
      setLastUpdate(new Date());
    }
  }, [motoboyId]);

  async function markDelivered(orderId: string) {
    const supabase = createClient();
    await supabase.from("orders").update({ status: "entregue" }).eq("id", orderId);
    await fetchOrders();
  }

  async function confirmPickup(orderId: string) {
    const supabase = createClient();
    await supabase.from("orders").update({ status: "saiu" }).eq("id", orderId);
    await fetchOrders();
  }

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("motoboy-orders")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        async () => {
          await fetchOrders();
          // Toca som quando chega pedido novo
          try {
            if (!audioRef.current) {
              audioRef.current = new Audio(
                "data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAA..."
              );
            }
          } catch {}
        }
      )
      .subscribe((status) => {
        setConnected(status === "SUBSCRIBED");
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchOrders]);

  const activeOrders = orders.filter((o) => o.status !== "entregue");
  const doneOrders = orders.filter((o) => o.status === "entregue");

  return (
    <div className="flex flex-col gap-4">
      {/* Status da conexão */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs">
          <span className={`w-2 h-2 rounded-full ${connected ? "bg-green-400 animate-pulse" : "bg-yellow-400"}`} />
          <span className={connected ? "text-green-400" : "text-yellow-400"}>
            {connected ? "Online — recebendo pedidos em tempo real" : "Conectando..."}
          </span>
        </div>
        <button
          onClick={fetchOrders}
          className="text-[#9999BB] hover:text-white transition-colors p-1"
          title="Atualizar"
        >
          <RefreshCw size={14} />
        </button>
      </div>

      {lastUpdate && (
        <p className="text-[#666] text-xs">
          Atualizado às {lastUpdate.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
        </p>
      )}

      {/* Pedidos ativos */}
      {activeOrders.length === 0 ? (
        <div className="text-center py-16 text-[#9999BB]">
          <p className="text-4xl mb-3">🛵</p>
          <p className="font-medium">Nenhum pedido no momento.</p>
          <p className="text-sm mt-1 text-[#666]">Quando um pedido for atribuído, aparece aqui.</p>
        </div>
      ) : (
        activeOrders.map((order) => (
          <Card key={order.id} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <p className="text-white font-bold">#{order.id.slice(-8).toUpperCase()}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLOR[order.status] ?? "bg-white/10 text-white"}`}>
                {STATUS_LABEL[order.status] ?? order.status}
              </span>
            </div>

            <div className="flex items-start gap-2 mb-2">
              <MapPin size={16} className="text-[#9999BB] mt-0.5 flex-shrink-0" />
              <p className="text-white text-sm">{order.delivery_address}</p>
            </div>

            {order.profiles?.phone && (
              <a
                href={`tel:${order.profiles.phone}`}
                className="flex items-center gap-2 mb-2 text-blue-400 hover:text-blue-300 transition-colors"
              >
                <Phone size={16} />
                <p className="text-sm">{order.profiles.name} · {order.profiles.phone}</p>
              </a>
            )}

            <div className="bg-[#0A0A1A] rounded-lg p-3 mb-3 text-sm text-[#9999BB]">
              {order.order_items.map((item, i) => (
                <p key={i}>{item.qty}x {item.products?.name}</p>
              ))}
              <p className="text-white font-bold mt-2">Total: R$ {order.total.toFixed(2).replace(".", ",")}</p>
              {order.change_for && (
                <p className="text-yellow-400">Troco pra R$ {order.change_for.toFixed(2).replace(".", ",")}</p>
              )}
            </div>

            {order.notes && (
              <p className="text-[#9999BB] text-xs bg-[#2A2A4A]/50 rounded p-2 mb-3">📝 {order.notes}</p>
            )}

            {order.status === "aceito" && (
              <Button
                onClick={() => confirmPickup(order.id)}
                variant="secondary"
                className="w-full gap-2 mb-2"
              >
                <Package size={16} /> Confirmar retirada
              </Button>
            )}

            {order.status === "saiu" && <LocationShare orderId={order.id} />}

            {order.status === "saiu" && (
              <Button
                onClick={() => markDelivered(order.id)}
                variant="primary"
                className="w-full gap-2"
              >
                <CheckCircle size={16} /> Confirmar entrega
              </Button>
            )}
          </Card>
        ))
      )}

      {/* Histórico */}
      {doneOrders.length > 0 && (
        <div className="mt-2">
          <p className="text-[#666] text-xs uppercase tracking-wider mb-3">Entregues hoje</p>
          {doneOrders.map((order) => (
            <div key={order.id} className="flex items-center justify-between py-2 border-b border-white/5 text-sm">
              <span className="text-[#9999BB]">#{order.id.slice(-8).toUpperCase()}</span>
              <span className="text-[#9999BB] truncate max-w-[160px] mx-2">{order.delivery_address}</span>
              <span className="text-green-400 font-bold shrink-0">R$ {order.total.toFixed(2).replace(".", ",")}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
