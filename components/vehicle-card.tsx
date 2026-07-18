import Link from "next/link";
import { ArrowIcon } from "./icons";
import { StatusBadge } from "./status-badge";
import { money, plannedProfit, totalCost } from "@/lib/financials";
import type { AppData, Vehicle } from "@/lib/types";

export function VehicleCard({ vehicle, data, sold = false }: { vehicle: Vehicle; data: AppData; sold?: boolean }) {
  const sale = data.sales.find((item) => item.vehicleId === vehicle.id);
  const cost = totalCost(vehicle, data);
  const benefit = sold && sale ? sale.price - cost : plannedProfit(vehicle, data);
  return <Link href={`/${sold ? "sold" : "vehicles"}/${vehicle.id}`} className="block overflow-hidden rounded-2xl border border-[#e2e7e2] bg-white shadow-[0_12px_26px_-22px_rgba(21,49,34,.45)] transition active:scale-[.985]">
    <div className="relative aspect-[16/8] bg-[#e8ece7]">{vehicle.photo ? <img src={vehicle.photo} alt={`${vehicle.brand} ${vehicle.model}`} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-sm text-[#708077]">Sans photo</div>}
      <div className="absolute left-3 top-3">{sold ? <StatusBadge status="Terminée" /> : <StatusBadge status={vehicle.status} />}</div>
    </div>
    <div className="p-4"><div className="flex items-start justify-between gap-3"><div><h2 className="text-lg font-bold tracking-tight">{vehicle.brand} {vehicle.model}</h2><p className="mt-0.5 text-sm text-[#708077]">{vehicle.year || "Année inconnue"} · {vehicle.mileage.toLocaleString("fr-BE")} km</p></div><ArrowIcon className="mt-1 h-5 w-5 shrink-0 text-[#8a968f]" /></div>
      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-[#edf0ed] pt-3 text-xs"><Metric label="Achat" value={money(vehicle.purchasePrice)} /><Metric label="Coût total" value={money(cost)} /><Metric label={sold ? "Vente" : "Vente prévue"} value={money(sold ? sale?.price || 0 : vehicle.targetPrice || 0)} /><Metric label={sold ? "Bénéfice" : "Bénéfice prévu"} value={money(benefit)} emphasis /></div>
    </div>
  </Link>;
}
function Metric({ label, value, emphasis = false }: { label: string; value: string; emphasis?: boolean }) { return <div><p className="text-[#849087]">{label}</p><p className={`mt-0.5 font-bold ${emphasis ? "text-[#17623d]" : "text-[#2a3730]"}`}>{value}</p></div>; }
