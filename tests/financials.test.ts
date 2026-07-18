import test from "node:test";
import assert from "node:assert/strict";
import { actualProfit, margin, plannedProfit, totalCost } from "../lib/financials";
import type { AppData, Vehicle } from "../lib/types";

const vehicle: Vehicle = { id: "v1", brand: "Test", model: "Auto", trim: "", fuel: "", transmission: "", mileage: 100, purchaseDate: "2026-01-01", purchasePrice: 5000, targetPrice: 7000, registration: "", vin: "", seller: "", sellerPhone: "", description: "", notes: "", status: "Acheté", createdAt: "", updatedAt: "" };
const data: AppData = { vehicles: [vehicle], repairs: [{ id: "r", vehicleId: "v1", title: "Pneus", description: "", date: "2026-01-02", amount: 300, provider: "", status: "Terminée" }], costs: [{ id: "c", vehicleId: "v1", title: "Transport", category: "Transport", amount: 120, date: "2026-01-02", comment: "" }], sales: [] };
test("coût total et bénéfice prévu sont centralisés", () => { assert.equal(totalCost(vehicle, data), 5420); assert.equal(plannedProfit(vehicle, data), 1580); });
test("déclaration de vente calcule bénéfice réel et marge", () => { const sold = { ...data, sales: [{ id: "s", vehicleId: "v1", date: "2026-02-01", price: 6500, buyerName: "", buyerPhone: "", mileage: 100, comment: "" }] }; assert.equal(actualProfit(vehicle, sold), 1080); assert.equal(margin(6500, actualProfit(vehicle, sold)), 16.615384615384617); });
