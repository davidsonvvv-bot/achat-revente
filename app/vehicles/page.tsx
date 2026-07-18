"use client";
import Link from "next/link";
import { useAppData } from "@/components/app-providers";
import { PageShell } from "@/components/page-shell";
import { PlusIcon } from "@/components/icons";
import { VehicleCard } from "@/components/vehicle-card";

export default function VehiclesPage() {
  const { data, ready } = useAppData(); const vehicles = data.vehicles.filter((vehicle) => !data.sales.some((sale) => sale.vehicleId === vehicle.id));
  return <PageShell><header className="px-5 pb-5 pt-7"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#65806f]">Parc automobile</p><div className="mt-1 flex items-end justify-between"><div><h1 className="text-3xl font-bold tracking-tight">Véhicules</h1><p className="mt-1 text-sm text-[#718077]">{ready ? `${vehicles.length} en stock` : "Chargement…"}</p></div><Link href="/vehicles/new" aria-label="Ajouter un véhicule" className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1d6144] text-white shadow-[0_10px_20px_-12px_rgba(14,69,43,.7)] active:scale-[.96]"><PlusIcon className="h-6 w-6" /></Link></div></header>
    <section className="space-y-4 px-4">{vehicles.map((vehicle) => <VehicleCard key={vehicle.id} vehicle={vehicle} data={data} />)}{ready && vehicles.length === 0 && <div className="rounded-2xl border border-dashed border-[#ccd5ce] bg-white px-6 py-12 text-center"><p className="font-bold">Votre stock est vide</p><p className="mt-2 text-sm text-[#718077]">Ajoutez votre premier véhicule pour commencer.</p><Link href="/vehicles/new" className="mt-5 inline-block rounded-xl bg-[#e3efe8] px-4 py-3 text-sm font-bold text-[#1d6144]">Ajouter un véhicule</Link></div>}</section>
  </PageShell>;
}
