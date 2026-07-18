"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { demoData, emptyData } from "@/lib/demo-data";
import type { AppData, Cost, Repair, Sale, Vehicle } from "@/lib/types";

type Store = {
  data: AppData; ready: boolean;
  addVehicle: (vehicle: Omit<Vehicle, "id" | "createdAt" | "updatedAt">) => string;
  updateVehicle: (id: string, fields: Partial<Vehicle>) => void;
  addRepair: (repair: Omit<Repair, "id">) => void;
  addCost: (cost: Omit<Cost, "id">) => void;
  sellVehicle: (sale: Omit<Sale, "id">) => void;
  correctSale: (sale: Sale) => void;
  deleteVehicle: (id: string) => void;
  resetDemo: () => void;
};

const AppContext = createContext<Store | null>(null);
const storageKey = "parc-auto-data-v1";
const uid = () => typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData>(emptyData);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    setData(saved ? JSON.parse(saved) : demoData);
    setReady(true);
  }, []);
  useEffect(() => { if (ready) window.localStorage.setItem(storageKey, JSON.stringify(data)); }, [data, ready]);

  const store = useMemo<Store>(() => ({
    data, ready,
    addVehicle(vehicle) {
      const id = uid(); const now = new Date().toISOString();
      setData((current) => ({ ...current, vehicles: [{ ...vehicle, id, createdAt: now, updatedAt: now }, ...current.vehicles] }));
      return id;
    },
    updateVehicle(id, fields) { setData((current) => ({ ...current, vehicles: current.vehicles.map((vehicle) => vehicle.id === id ? { ...vehicle, ...fields, updatedAt: new Date().toISOString() } : vehicle) })); },
    addRepair(repair) { setData((current) => ({ ...current, repairs: [{ ...repair, id: uid() }, ...current.repairs] })); },
    addCost(cost) { setData((current) => ({ ...current, costs: [{ ...cost, id: uid() }, ...current.costs] })); },
    sellVehicle(sale) { setData((current) => ({ ...current, sales: [...current.sales.filter((item) => item.vehicleId !== sale.vehicleId), { ...sale, id: uid() }] })); },
    correctSale(sale) { setData((current) => ({ ...current, sales: current.sales.map((item) => item.id === sale.id ? sale : item) })); },
    deleteVehicle(id) { setData((current) => ({ vehicles: current.vehicles.filter((item) => item.id !== id), repairs: current.repairs.filter((item) => item.vehicleId !== id), costs: current.costs.filter((item) => item.vehicleId !== id), sales: current.sales.filter((item) => item.vehicleId !== id) })); },
    resetDemo() { setData(demoData); }
  }), [data, ready]);

  return <AppContext.Provider value={store}>{children}</AppContext.Provider>;
}

export function useAppData() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppData must be used inside AppProviders");
  return context;
}
