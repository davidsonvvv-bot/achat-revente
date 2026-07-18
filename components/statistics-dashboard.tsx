"use client";

import { useMemo, useState, type ReactNode } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useAppData } from "./app-providers";
import { actualProfit, margin, money, totalCost, vehicleSale } from "@/lib/financials";
import type { Sale, Vehicle } from "@/lib/types";

type Range = "month" | "year" | "all";
const categoryColors = ["#276749", "#5e8e70", "#a9c4b1", "#d7e4d8", "#8f735d", "#c6a98b", "#4e7661", "#b8cdbd"];
const within = (sale: Sale, range: Range) => {
  if (range === "all") return true;
  const now = new Date(); const date = new Date(`${sale.date}T12:00:00`);
  return range === "month" ? date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear() : date.getFullYear() === now.getFullYear();
};
export function StatisticsDashboard() {
  const { data, ready } = useAppData(); const [range, setRange] = useState<Range>("year");
  const stats = useMemo(() => calculateStats(data, range), [data, range]);
  if (!ready) return <div className="p-5 text-sm text-[#718077]">Chargement…</div>;
  return <div className="space-y-6 px-4 pb-4"><div className="grid grid-cols-3 rounded-xl bg-[#e5ebe6] p-1">{(["month", "year", "all"] as Range[]).map((item) => <button key={item} onClick={() => setRange(item)} className={`rounded-lg py-2 text-xs font-bold transition active:scale-[.97] ${range === item ? "bg-white text-[#1d6144] shadow-sm" : "text-[#66766c]"}`}>{item === "month" ? "Ce mois" : item === "year" ? "Cette année" : "Toujours"}</button>)}</div>
    <div className="grid grid-cols-2 gap-3"><Metric title="Chiffre d’affaires" value={money(stats.revenue)} /><Metric title="Bénéfice total" value={money(stats.profit)} accent /><Metric title="Coûts totaux" value={money(stats.costs)} /><Metric title="Véhicules vendus" value={String(stats.count)} /></div>
    <section><h2 className="mb-3 text-sm font-bold">Vue du parc</h2><div className="divide-y divide-[#e8ece8] rounded-2xl border border-[#e1e7e1] bg-white px-4"><Row label="Valeur actuelle du stock" value={money(stats.stockValue)} /><Row label="Capital actuellement investi" value={money(stats.capital)} /><Row label="Bénéfice moyen par véhicule" value={stats.count ? money(stats.profit / stats.count) : "—"} /><Row label="Marge moyenne" value={stats.count ? `${stats.averageMargin.toFixed(1)} %` : "—"} /><Row label="Encore en stock" value={`${stats.stockCount} véhicule${stats.stockCount !== 1 ? "s" : ""}`} /></div></section>
    <ChartCard title="Chiffre d’affaires et bénéfice par mois"><ResponsiveContainer width="100%" height={220}><BarChart data={stats.monthly} margin={{ left: -18, right: 4, top: 8 }}><CartesianGrid vertical={false} stroke="#e9eeea" /><XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "#6b786f", fontSize: 11 }} /><YAxis tickFormatter={(value) => `${value / 1000}k`} tickLine={false} axisLine={false} tick={{ fill: "#6b786f", fontSize: 10 }} /><Tooltip formatter={(value) => money(Number(value))} cursor={{ fill: "#eff4f0" }} /><Bar dataKey="revenue" name="CA" fill="#276749" radius={[5, 5, 0, 0]} /><Bar dataKey="profit" name="Bénéfice" fill="#a9c4b1" radius={[5, 5, 0, 0]} /></BarChart></ResponsiveContainer></ChartCard>
    <ChartCard title="Répartition des coûts par catégorie">{stats.costByCategory.length ? <div className="flex items-center gap-2"><ResponsiveContainer width="48%" height={180}><PieChart><Pie data={stats.costByCategory} dataKey="value" nameKey="name" innerRadius={47} outerRadius={70} paddingAngle={2}>{stats.costByCategory.map((_, index) => <Cell key={index} fill={categoryColors[index % categoryColors.length]} />)}</Pie><Tooltip formatter={(value) => money(Number(value))} /></PieChart></ResponsiveContainer><div className="min-w-0 flex-1 space-y-2">{stats.costByCategory.map((item, index) => <div className="flex items-center justify-between gap-2 text-xs" key={item.name}><span className="flex min-w-0 items-center gap-1.5"><i className="h-2 w-2 shrink-0 rounded-full" style={{ background: categoryColors[index % categoryColors.length] }} /> <span className="truncate">{item.name}</span></span><b>{money(item.value)}</b></div>)}</div></div> : <p className="py-10 text-center text-sm text-[#718077]">Aucun coût pour cette période.</p>}</ChartCard>
  </div>;
}
function calculateStats(data: ReturnType<typeof useAppData>["data"], range: Range) {
  const salePairs = data.sales.filter((sale) => within(sale, range)).map((sale) => ({ sale, vehicle: data.vehicles.find((vehicle) => vehicle.id === sale.vehicleId) })).filter((pair): pair is { sale: Sale; vehicle: Vehicle } => Boolean(pair.vehicle));
  const revenue = salePairs.reduce((sum, pair) => sum + pair.sale.price, 0); const profit = salePairs.reduce((sum, pair) => sum + actualProfit(pair.vehicle, data), 0); const costs = salePairs.reduce((sum, pair) => sum + totalCost(pair.vehicle, data), 0);
  const sold = new Set(data.sales.map((sale) => sale.vehicleId)); const stock = data.vehicles.filter((vehicle) => !sold.has(vehicle.id));
  const months = Array.from({ length: 12 }, (_, index) => ({ label: new Intl.DateTimeFormat("fr-BE", { month: "short" }).format(new Date(2026, index, 1)).replace(".", ""), revenue: 0, profit: 0 }));
  salePairs.forEach(({ sale, vehicle }) => { const month = new Date(`${sale.date}T12:00:00`).getMonth(); months[month].revenue += sale.price; months[month].profit += actualProfit(vehicle, data); });
  const costsForRange = data.costs.filter((cost) => range === "all" || new Date(`${cost.date}T12:00:00`).getFullYear() === new Date().getFullYear() && (range !== "month" || new Date(`${cost.date}T12:00:00`).getMonth() === new Date().getMonth()));
  const costByCategory = Object.entries(costsForRange.reduce<Record<string, number>>((map, cost) => ({ ...map, [cost.category]: (map[cost.category] || 0) + cost.amount }), {})).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  return { revenue, profit, costs, count: salePairs.length, stockValue: stock.reduce((sum, vehicle) => sum + Number(vehicle.targetPrice || 0), 0), capital: stock.reduce((sum, vehicle) => sum + totalCost(vehicle, data), 0), stockCount: stock.length, averageMargin: salePairs.length ? salePairs.reduce((sum, pair) => sum + margin(pair.sale.price, actualProfit(pair.vehicle, data)), 0) / salePairs.length : 0, monthly: months, costByCategory };
}
function Metric({ title, value, accent = false }: { title: string; value: string; accent?: boolean }) { return <div className={`rounded-2xl border p-4 ${accent ? "border-[#d4e5d9] bg-[#e7f1eb]" : "border-[#e1e7e1] bg-white"}`}><p className="text-[11px] font-semibold leading-tight text-[#6d7b72]">{title}</p><p className={`mt-2 text-lg font-bold tracking-tight ${accent ? "text-[#17623d]" : ""}`}>{value}</p></div>; }
function Row({ label, value }: { label: string; value: string }) { return <div className="flex justify-between gap-4 py-3 text-sm"><span className="text-[#647269]">{label}</span><b className="text-right">{value}</b></div>; }
function ChartCard({ title, children }: { title: string; children: ReactNode }) { return <section><h2 className="mb-3 text-sm font-bold">{title}</h2><div className="rounded-2xl border border-[#e1e7e1] bg-white p-3">{children}</div></section>; }
