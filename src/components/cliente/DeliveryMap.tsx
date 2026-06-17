"use client";

import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";

// Marcadores custom (divIcon) — evita o bug clássico dos ícones do Leaflet em bundler
const driverIcon = L.divIcon({
  className: "",
  html: `<div style="width:40px;height:40px;border-radius:50%;background:#1e2fbf;display:flex;align-items:center;justify-content:center;box-shadow:0 0 0 4px rgba(30,47,191,.35),0 4px 12px rgba(0,0,0,.5);font-size:20px">🛵</div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

const storeIcon = L.divIcon({
  className: "",
  html: `<div style="width:34px;height:34px;border-radius:50%;background:#a90111;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,.5);font-size:17px">🏪</div>`,
  iconSize: [34, 34],
  iconAnchor: [17, 17],
});

function Recenter({ lat, lng }: { lat: number | null; lng: number | null }) {
  const map = useMap();
  useEffect(() => {
    if (lat != null && lng != null) map.setView([lat, lng], map.getZoom(), { animate: true });
  }, [lat, lng, map]);
  return null;
}

export default function DeliveryMap({
  driverLat,
  driverLng,
  storeLat,
  storeLng,
}: {
  driverLat: number | null;
  driverLng: number | null;
  storeLat: number;
  storeLng: number;
}) {
  const hasDriver = driverLat != null && driverLng != null;
  const center: [number, number] = hasDriver ? [driverLat!, driverLng!] : [storeLat, storeLng];

  return (
    <MapContainer
      center={center}
      zoom={15}
      style={{ height: "100%", width: "100%", background: "#0a0a0f" }}
      zoomControl={false}
      attributionControl={false}
      scrollWheelZoom={false}
    >
      <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
      <Marker position={[storeLat, storeLng]} icon={storeIcon} />
      {hasDriver && <Marker position={[driverLat!, driverLng!]} icon={driverIcon} />}
      <Recenter lat={hasDriver ? driverLat : null} lng={hasDriver ? driverLng : null} />
    </MapContainer>
  );
}
