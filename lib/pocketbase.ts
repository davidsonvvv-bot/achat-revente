import PocketBase, { type RecordModel } from "pocketbase";
import type { AppData, Cost, Repair, Sale, Vehicle } from "./types";

export const pocketBaseUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL;
export const hasPocketBase = Boolean(pocketBaseUrl);
export const pb = hasPocketBase ? new PocketBase(pocketBaseUrl) : null;

const date = (value?: string) => value ? value.slice(0, 10) : "";
const string = (value: unknown) => typeof value === "string" ? value : "";
const number = (value: unknown) => Number(value || 0);

export function toVehicle(record: RecordModel): Vehicle {
  const photo = string(record.main_photo);
  return { id: record.id, brand: string(record.brand), model: string(record.model), trim: string(record.trim), year: record.year ? number(record.year) : undefined, fuel: string(record.fuel), transmission: string(record.transmission), mileage: number(record.mileage), purchaseDate: date(string(record.purchase_date)), purchasePrice: number(record.purchase_price), targetPrice: record.target_price ? number(record.target_price) : undefined, registration: string(record.registration), vin: string(record.vin), seller: string(record.seller), sellerPhone: string(record.seller_phone), description: string(record.description), notes: string(record.notes), photo: photo && pb ? pb.files.getURL(record, photo) : undefined, status: record.status as Vehicle["status"], createdAt: string(record.created), updatedAt: string(record.updated) };
}
export function toRepair(record: RecordModel): Repair { return { id: record.id, vehicleId: string(record.vehicle), title: string(record.title), description: string(record.description), date: date(string(record.repair_date)), amount: number(record.amount), provider: string(record.provider), status: record.status as Repair["status"], receipt: string(record.attachment) }; }
export function toCost(record: RecordModel): Cost { return { id: record.id, vehicleId: string(record.vehicle), title: string(record.title), category: record.category as Cost["category"], amount: number(record.amount), date: date(string(record.cost_date)), comment: string(record.comment) }; }
export function toSale(record: RecordModel): Sale { return { id: record.id, vehicleId: string(record.vehicle), date: date(string(record.sale_date)), price: number(record.sale_price), buyerName: string(record.buyer_name), buyerPhone: string(record.buyer_phone), mileage: number(record.sale_mileage), comment: string(record.comment) }; }

export async function loadPocketBaseData(): Promise<AppData> {
  if (!pb) throw new Error("PocketBase n’est pas configuré.");
  const [vehicles, repairs, costs, sales] = await Promise.all([pb.collection("vehicles").getFullList({ sort: "-created" }), pb.collection("repairs").getFullList({ sort: "-created" }), pb.collection("costs").getFullList({ sort: "-created" }), pb.collection("sales").getFullList({ sort: "-sale_date" })]);
  return { vehicles: vehicles.map(toVehicle), repairs: repairs.map(toRepair), costs: costs.map(toCost), sales: sales.map(toSale) };
}

export async function dataUrlToFile(dataUrl: string) {
  const blob = await (await fetch(dataUrl)).blob();
  return new File([blob], "main-photo.jpg", { type: blob.type || "image/jpeg" });
}
