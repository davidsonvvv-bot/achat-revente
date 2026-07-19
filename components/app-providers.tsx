"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { emptyData } from "@/lib/demo-data";
import { dataUrlToFile, hasPocketBase, loadPocketBaseData, pb } from "@/lib/pocketbase";
import type { AppData, Cost, Repair, Sale, Vehicle } from "@/lib/types";

type Store = {
  data: AppData; ready: boolean; backendEnabled: boolean; authenticated: boolean; userEmail?: string; error: string;
  signIn: (email: string, password: string) => Promise<void>; signOut: () => void; refresh: () => Promise<void>;
  addVehicle: (vehicle: Omit<Vehicle, "id" | "createdAt" | "updatedAt">) => Promise<string>;
  updateVehicle: (id: string, fields: Partial<Vehicle>) => Promise<void>;
  addRepair: (repair: Omit<Repair, "id">) => Promise<void>; addCost: (cost: Omit<Cost, "id">) => Promise<void>;
  sellVehicle: (sale: Omit<Sale, "id">) => Promise<void>; correctSale: (sale: Sale) => Promise<void>;
  deleteVehicle: (id: string) => Promise<void>;
};
const AppContext = createContext<Store | null>(null);
const storageKey = "parc-auto-data-v2";
const uid = () => typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
const localDate = (value: string) => value ? `${value} 12:00:00.000Z` : "";

export function AppProviders({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(emptyData); const [ready, setReady] = useState(false); const [error, setError] = useState("");
  const authenticated = true; const userEmail = undefined;
  const refresh = useCallback(async () => {
    if (!hasPocketBase) { setData(emptyData); setReady(true); return; }
    try { setError(""); setData(await loadPocketBaseData()); } catch (cause) { setError(cause instanceof Error ? cause.message : "Impossible de charger les données PocketBase."); } finally { setReady(true); }
  }, []);

  useEffect(() => {
    if (hasPocketBase) { void refresh(); return; }
    const saved = window.localStorage.getItem(storageKey); setData(saved ? JSON.parse(saved) : emptyData); setReady(true);
  }, [refresh]);
  useEffect(() => { if (!hasPocketBase && ready) window.localStorage.setItem(storageKey, JSON.stringify(data)); }, [data, ready]);
  useEffect(() => {
    if (!pb) return;
    const pocketBase = pb;
    let active = true;
    const collections = ["vehicles", "repairs", "costs", "sales"];
    const subscribe = async () => {
      try { await Promise.all(collections.map((collection) => pocketBase.collection(collection).subscribe("*", () => { if (active) void refresh(); }))); }
      catch { /* Data loading already displays a useful error if the server is unavailable. */ }
    };
    const refreshWhenVisible = () => { if (document.visibilityState === "visible") void refresh(); };
    void subscribe();
    document.addEventListener("visibilitychange", refreshWhenVisible);
    return () => { active = false; document.removeEventListener("visibilitychange", refreshWhenVisible); collections.forEach((collection) => { void pocketBase.collection(collection).unsubscribe("*"); }); };
  }, [refresh]);

  const localAddVehicle = (vehicle: Omit<Vehicle, "id" | "createdAt" | "updatedAt">) => { const id = uid(); const now = new Date().toISOString(); setData((current) => ({ ...current, vehicles: [{ ...vehicle, id, createdAt: now, updatedAt: now }, ...current.vehicles] })); return id; };
  const store = useMemo<Store>(() => ({
    data, ready, backendEnabled: hasPocketBase, authenticated, userEmail, error,
    async signIn() { await refresh(); },
    signOut() { setData(emptyData); setReady(true); }, refresh,
    async addVehicle(vehicle) {
      if (!pb) return localAddVehicle(vehicle);
      const body: Record<string, unknown> = { brand: vehicle.brand, model: vehicle.model, trim: vehicle.trim, year: vehicle.year || 0, fuel: vehicle.fuel, transmission: vehicle.transmission, mileage: vehicle.mileage, purchase_date: localDate(vehicle.purchaseDate), purchase_price: vehicle.purchasePrice, target_price: vehicle.targetPrice || 0, registration: vehicle.registration, vin: vehicle.vin, seller: vehicle.seller, seller_phone: vehicle.sellerPhone, description: vehicle.description, notes: vehicle.notes, status: vehicle.status };
      if (vehicle.photo?.startsWith("data:")) body.main_photo = await dataUrlToFile(vehicle.photo);
      const record = await pb.collection("vehicles").create(body); await refresh(); return record.id;
    },
    async updateVehicle(id, fields) {
      if (!pb) { setData((current) => ({ ...current, vehicles: current.vehicles.map((vehicle) => vehicle.id === id ? { ...vehicle, ...fields, updatedAt: new Date().toISOString() } : vehicle) })); return; }
      const body: Record<string, unknown> = {}; const map: Record<string, string> = { purchaseDate: "purchase_date", purchasePrice: "purchase_price", targetPrice: "target_price", sellerPhone: "seller_phone" };
      Object.entries(fields).forEach(([key, value]) => { if (value !== undefined && !["id", "createdAt", "updatedAt", "photo"].includes(key)) body[map[key] || key] = key === "purchaseDate" ? localDate(String(value)) : value; });
      await pb.collection("vehicles").update(id, body); await refresh();
    },
    async addRepair(repair) { if (!pb) { setData((current) => ({ ...current, repairs: [{ ...repair, id: uid() }, ...current.repairs] })); return; } await pb.collection("repairs").create({ vehicle: repair.vehicleId, title: repair.title, description: repair.description, repair_date: localDate(repair.date), amount: repair.amount, provider: repair.provider, status: repair.status }); await refresh(); },
    async addCost(cost) { if (!pb) { setData((current) => ({ ...current, costs: [{ ...cost, id: uid() }, ...current.costs] })); return; } await pb.collection("costs").create({ vehicle: cost.vehicleId, title: cost.title, category: cost.category, amount: cost.amount, cost_date: localDate(cost.date), comment: cost.comment }); await refresh(); },
    async sellVehicle(sale) { if (!pb) { setData((current) => ({ ...current, sales: [...current.sales.filter((item) => item.vehicleId !== sale.vehicleId), { ...sale, id: uid() }] })); return; } await pb.collection("sales").create({ vehicle: sale.vehicleId, sale_date: localDate(sale.date), sale_price: sale.price, buyer_name: sale.buyerName, buyer_phone: sale.buyerPhone, sale_mileage: sale.mileage, comment: sale.comment }); await refresh(); },
    async correctSale(sale) { if (!pb) { setData((current) => ({ ...current, sales: current.sales.map((item) => item.id === sale.id ? sale : item) })); return; } await pb.collection("sales").update(sale.id, { sale_date: localDate(sale.date), sale_price: sale.price, buyer_name: sale.buyerName, buyer_phone: sale.buyerPhone, sale_mileage: sale.mileage, comment: sale.comment }); await refresh(); },
    async deleteVehicle(id) { if (!pb) { setData((current) => ({ vehicles: current.vehicles.filter((item) => item.id !== id), repairs: current.repairs.filter((item) => item.vehicleId !== id), costs: current.costs.filter((item) => item.vehicleId !== id), sales: current.sales.filter((item) => item.vehicleId !== id) })); return; } await pb.collection("vehicles").delete(id); await refresh(); }
  }), [data, ready, authenticated, userEmail, error, refresh]);
  return <AppContext.Provider value={store}>{children}</AppContext.Provider>;
}
export function useAppData() { const context = useContext(AppContext); if (!context) throw new Error("useAppData must be used inside AppProviders"); return context; }
