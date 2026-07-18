"use client";
import { useAppData } from "@/components/app-providers";
import { PageShell } from "@/components/page-shell";
import { VehicleCard } from "@/components/vehicle-card";

export default function SoldPage() {
  const { data, ready } = useAppData(); const vehicles = data.vehicles.filter((vehicle) => data.sales.some((sale) => sale.vehicleId === vehicle.id));
  return <PageShell><header className="px-5 pb-5 pt-7"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#65806f]">Historique</p><h1 className="mt-1 text-3xl font-bold tracking-tight">Vendus</h1><p className="mt-1 text-sm text-[#718077]">{ready ? `${vehicles.length} véhicule${vehicles.length !== 1 ? "s" : ""} vendu${vehicles.length !== 1 ? "s" : ""}` : "Chargement…"}</p></header><section className="space-y-4 px-4">{vehicles.map((vehicle) => <VehicleCard key={vehicle.id} vehicle={vehicle} data={data} sold />)}{ready && !vehicles.length && <div className="rounded-2xl border border-dashed border-[#ccd5ce] bg-white px-6 py-12 text-center"><p className="font-bold">Aucune vente pour l’instant</p><p className="mt-2 text-sm text-[#718077]">Les véhicules déclarés vendus apparaîtront ici.</p></div>}</section></PageShell>;
}
