export type VehicleStatus = "Acheté" | "En préparation" | "En réparation" | "Prêt à vendre" | "En vente" | "Réservé";
export type RepairStatus = "À faire" | "En cours" | "Terminée";
export type CostCategory = "Transport" | "Contrôle technique" | "Homologation" | "Carburant" | "Nettoyage" | "Publicité" | "Pièces" | "Taxe" | "Autre";

export type Repair = { id: string; vehicleId: string; title: string; description: string; date: string; amount: number; provider: string; status: RepairStatus; receipt?: string };
export type Cost = { id: string; vehicleId: string; title: string; category: CostCategory; amount: number; date: string; comment: string };
export type Sale = { id: string; vehicleId: string; date: string; price: number; buyerName: string; buyerPhone: string; mileage: number; comment: string };
export type Vehicle = {
  id: string; brand: string; model: string; trim: string; year?: number; fuel: string; transmission: string; mileage: number;
  purchaseDate: string; purchasePrice: number; targetPrice?: number; registration: string; vin: string; seller: string; sellerPhone: string;
  description: string; notes: string; photo?: string; status: VehicleStatus; createdAt: string; updatedAt: string;
};

export type AppData = { vehicles: Vehicle[]; repairs: Repair[]; costs: Cost[]; sales: Sale[] };
