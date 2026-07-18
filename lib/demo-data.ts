import type { AppData } from "./types";

export const emptyData: AppData = { vehicles: [], repairs: [], costs: [], sales: [] };

export const demoData: AppData = {
  vehicles: [
    { id: "v-208", brand: "Peugeot", model: "208", trim: "Allure 1.2 PureTech", year: 2020, fuel: "Essence", transmission: "Manuelle", mileage: 68400, purchaseDate: "2026-06-24", purchasePrice: 7250, targetPrice: 9800, registration: "2-ABX-418", vin: "VF3UPHNEKLT045821", seller: "Garage Lambert", sellerPhone: "+32 479 18 34 56", description: "Compacte soignée, carnet d'entretien complet.", notes: "Prévoir contrôle technique avant mise en vente.", photo: "https://picsum.photos/seed/peugeot208/900/600", status: "En préparation", createdAt: "2026-06-24", updatedAt: "2026-07-15" },
    { id: "v-golf", brand: "Volkswagen", model: "Golf", trim: "VII 1.6 TDI", year: 2018, fuel: "Diesel", transmission: "Manuelle", mileage: 112300, purchaseDate: "2026-07-02", purchasePrice: 8400, targetPrice: 11200, registration: "1-KDS-775", vin: "WVWZZZAUZJP102417", seller: "Mathieu De Clercq", sellerPhone: "+32 472 65 91 20", description: "Deuxième propriétaire, intérieur propre.", notes: "Attente devis carrosserie aile arrière.", photo: "https://picsum.photos/seed/golf-seven/900/600", status: "En réparation", createdAt: "2026-07-02", updatedAt: "2026-07-17" },
    { id: "v-clio", brand: "Renault", model: "Clio", trim: "V TCe 100 Intens", year: 2021, fuel: "Essence", transmission: "Manuelle", mileage: 41500, purchaseDate: "2026-05-04", purchasePrice: 9700, targetPrice: 12600, registration: "2-CEV-029", vin: "VF1RJA00765783491", seller: "Auto Marais", sellerPhone: "+32 486 52 72 08", description: "Entretien Renault suivi.", notes: "Photos prêtes, annonce à publier.", photo: "https://picsum.photos/seed/renaultclio/900/600", status: "En vente", createdAt: "2026-05-04", updatedAt: "2026-07-18" },
    { id: "v-yaris", brand: "Toyota", model: "Yaris", trim: "1.5 Hybrid", year: 2019, fuel: "Hybride", transmission: "Automatique", mileage: 58900, purchaseDate: "2026-02-16", purchasePrice: 9500, targetPrice: 12800, registration: "1-YAR-681", vin: "VNKKD3D300A510948", seller: "Denis Havelange", sellerPhone: "+32 475 39 01 82", description: "Hybride vendue avec deux clés.", notes: "", photo: "https://picsum.photos/seed/toyotayaris/900/600", status: "En vente", createdAt: "2026-02-16", updatedAt: "2026-04-02" }
  ],
  repairs: [
    { id: "r1", vehicleId: "v-208", title: "Pneus avant", description: "Deux pneus neufs montés et équilibrés.", date: "2026-07-08", amount: 235, provider: "Pneus du Centre", status: "Terminée" },
    { id: "r2", vehicleId: "v-golf", title: "Carrosserie aile arrière", description: "Débosselage et peinture localisée.", date: "2026-07-19", amount: 480, provider: "Carrosserie Vandevelde", status: "En cours" },
    { id: "r3", vehicleId: "v-clio", title: "Vidange", description: "Vidange et filtre à huile.", date: "2026-05-10", amount: 145, provider: "Renault Services", status: "Terminée" },
    { id: "r4", vehicleId: "v-yaris", title: "Révision", description: "Révision annuelle.", date: "2026-03-01", amount: 190, provider: "Toyota Care", status: "Terminée" }
  ],
  costs: [
    { id: "c1", vehicleId: "v-208", title: "Contrôle technique", category: "Contrôle technique", amount: 72, date: "2026-07-12", comment: "Repassage inclus" },
    { id: "c2", vehicleId: "v-golf", title: "Transport", category: "Transport", amount: 110, date: "2026-07-02", comment: "Convoyage depuis Namur" },
    { id: "c3", vehicleId: "v-clio", title: "Nettoyage intérieur", category: "Nettoyage", amount: 85, date: "2026-05-18", comment: "Préparation vente" },
    { id: "c4", vehicleId: "v-yaris", title: "Annonce", category: "Publicité", amount: 60, date: "2026-03-10", comment: "Diffusion annonce" }
  ],
  sales: [{ id: "s1", vehicleId: "v-yaris", date: "2026-04-02", price: 12600, buyerName: "Élodie Martin", buyerPhone: "+32 471 06 44 19", mileage: 59240, comment: "Vente réglée par virement." }]
};
