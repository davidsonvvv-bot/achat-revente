"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CarIcon, ChartIcon, CheckCircleIcon } from "./icons";

const items = [
  { href: "/vehicles", label: "Véhicules", Icon: CarIcon, active: (path: string) => path.startsWith("/vehicles") },
  { href: "/statistics", label: "Statistiques", Icon: ChartIcon, active: (path: string) => path.startsWith("/statistics") },
  { href: "/sold", label: "Vendus", Icon: CheckCircleIcon, active: (path: string) => path.startsWith("/sold") }
];

export function BottomNav() {
  const pathname = usePathname();
  return <nav aria-label="Navigation principale" className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-md border-t border-[#dfe5df] bg-[#fbfcfa]/95 px-5 pb-[max(12px,env(safe-area-inset-bottom))] pt-2 backdrop-blur">
    <div className="grid grid-cols-3 gap-2">{items.map(({ href, label, Icon, active }) => {
      const selected = active(pathname);
      return <Link key={href} href={href} className={`flex flex-col items-center gap-1 rounded-xl py-2 text-[11px] font-semibold transition active:scale-[.97] ${selected ? "bg-[#e3efe8] text-[#216044]" : "text-[#708077]"}`}>
        <Icon className="h-5 w-5" /><span>{label}</span>
      </Link>;
    })}</div>
  </nav>;
}
