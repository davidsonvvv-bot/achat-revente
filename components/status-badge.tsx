import type { RepairStatus, VehicleStatus } from "@/lib/types";

const tones: Record<VehicleStatus | RepairStatus, string> = {
  "Acheté": "bg-stone-200 text-stone-700", "En préparation": "bg-amber-100 text-amber-800", "En réparation": "bg-orange-100 text-orange-800", "Prêt à vendre": "bg-emerald-100 text-emerald-800", "En vente": "bg-sky-100 text-sky-800", "Réservé": "bg-violet-100 text-violet-800", "À faire": "bg-stone-200 text-stone-700", "En cours": "bg-amber-100 text-amber-800", "Terminée": "bg-emerald-100 text-emerald-800"
};
export function StatusBadge({ status }: { status: VehicleStatus | RepairStatus }) { return <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${tones[status]}`}>{status}</span>; }
