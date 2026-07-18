import Link from "next/link";
import { BackIcon } from "@/components/icons";
import { VehicleForm } from "@/components/vehicle-form";
export default function NewVehiclePage() { return <main className="mx-auto min-h-[100dvh] max-w-md bg-[#f7f7f5]"><header className="flex items-center gap-3 border-b border-[#e2e7e2] bg-[#fbfcfa] px-4 py-4"><Link href="/vehicles" className="rounded-xl p-2 text-[#355242] active:scale-[.95]"><BackIcon className="h-5 w-5" /></Link><div><h1 className="font-bold">Ajouter un véhicule</h1><p className="text-xs text-[#718077]">Tous les champs sont facultatifs.</p></div></header><VehicleForm /></main>; }
