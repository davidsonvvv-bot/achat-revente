import type { AppData, Cost, Repair, Sale, Vehicle } from "./types";

export const money = (value: number) => new Intl.NumberFormat("fr-BE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value || 0);
export const dateLabel = (date?: string) => date ? new Intl.DateTimeFormat("fr-BE", { dateStyle: "medium" }).format(new Date(`${date}T12:00:00`)) : "—";
export const sum = (items: Array<{ amount: number }>) => items.reduce((total, item) => total + Number(item.amount || 0), 0);
export const vehicleRepairs = (data: AppData, id: string): Repair[] => data.repairs.filter((repair) => repair.vehicleId === id);
export const vehicleCosts = (data: AppData, id: string): Cost[] => data.costs.filter((cost) => cost.vehicleId === id);
export const vehicleSale = (data: AppData, id: string): Sale | undefined => data.sales.find((sale) => sale.vehicleId === id);
export const repairTotal = (data: AppData, id: string) => sum(vehicleRepairs(data, id));
export const otherCostTotal = (data: AppData, id: string) => sum(vehicleCosts(data, id));
export const totalCost = (vehicle: Vehicle, data: AppData) => Number(vehicle.purchasePrice || 0) + repairTotal(data, vehicle.id) + otherCostTotal(data, vehicle.id);
export const plannedProfit = (vehicle: Vehicle, data: AppData) => Number(vehicle.targetPrice || 0) - totalCost(vehicle, data);
export const actualProfit = (vehicle: Vehicle, data: AppData) => {
  const sale = vehicleSale(data, vehicle.id);
  return sale ? Number(sale.price) - totalCost(vehicle, data) : 0;
};
export const margin = (price: number, profit: number) => price > 0 ? (profit / price) * 100 : 0;
export const daysBetween = (start: string, end?: string) => end ? Math.max(0, Math.round((new Date(`${end}T12:00:00`).getTime() - new Date(`${start}T12:00:00`).getTime()) / 86400000)) : 0;
