import { PageShell } from "@/components/page-shell";
import { StatisticsDashboard } from "@/components/statistics-dashboard";
export default function StatisticsPage() { return <PageShell><header className="px-5 pb-5 pt-7"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#65806f]">Pilotage</p><h1 className="mt-1 text-3xl font-bold tracking-tight">Statistiques</h1><p className="mt-1 text-sm text-[#718077]">Vos chiffres, sans confusion.</p></header><StatisticsDashboard /></PageShell>; }
