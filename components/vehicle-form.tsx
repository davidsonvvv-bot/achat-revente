"use client";

import { FormEvent, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { CameraIcon } from "./icons";
import { useAppData } from "./app-providers";
import type { VehicleStatus } from "@/lib/types";

const statuses: VehicleStatus[] = ["Acheté", "En préparation", "En réparation", "Prêt à vendre", "En vente", "Réservé"];
const initial = { brand: "", model: "", trim: "", year: "", fuel: "", transmission: "", mileage: "", purchaseDate: new Date().toISOString().slice(0, 10), purchasePrice: "", targetPrice: "", registration: "", vin: "", seller: "", sellerPhone: "", description: "", notes: "", photo: "", status: "Acheté" as VehicleStatus };

export function VehicleForm() {
  const router = useRouter(); const { addVehicle } = useAppData();
  const [form, setForm] = useState(initial); const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  const change = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const image = (file?: File) => { if (!file) return; const reader = new FileReader(); reader.onload = () => change("photo", String(reader.result)); reader.readAsDataURL(file); };
  const submit = async (event: FormEvent) => {
    event.preventDefault(); setError("");
    if (!form.brand.trim() || !form.model.trim() || !form.mileage || !form.purchasePrice || !form.purchaseDate) { setError("Complétez la marque, le modèle, le kilométrage, le prix et la date d’achat."); return; }
    setBusy(true);
    try { const id = await addVehicle({ brand: form.brand.trim(), model: form.model.trim(), trim: form.trim.trim(), year: Number(form.year) || undefined, fuel: form.fuel, transmission: form.transmission, mileage: Number(form.mileage), purchaseDate: form.purchaseDate, purchasePrice: Number(form.purchasePrice), targetPrice: Number(form.targetPrice) || undefined, registration: form.registration, vin: form.vin, seller: form.seller, sellerPhone: form.sellerPhone, description: form.description, notes: form.notes, photo: form.photo || undefined, status: form.status }); router.replace(`/vehicles/${id}`); } catch (cause) { setError(cause instanceof Error ? cause.message : "Impossible d’ajouter le véhicule."); setBusy(false); }
  };
  return <form onSubmit={submit} className="space-y-6 px-4 pb-8 pt-5">
    <Section title="L’essentiel"><div className="grid grid-cols-2 gap-3"><Field label="Marque *"><input value={form.brand} onChange={(e) => change("brand", e.target.value)} placeholder="Peugeot" /></Field><Field label="Modèle *"><input value={form.model} onChange={(e) => change("model", e.target.value)} placeholder="208" /></Field></div><Field label="Version"><input value={form.trim} onChange={(e) => change("trim", e.target.value)} placeholder="1.2 PureTech Allure" /></Field><div className="grid grid-cols-3 gap-3"><Field label="Année"><input inputMode="numeric" value={form.year} onChange={(e) => change("year", e.target.value)} placeholder="2020" /></Field><Field label="Carburant"><input value={form.fuel} onChange={(e) => change("fuel", e.target.value)} placeholder="Essence" /></Field><Field label="Boîte"><input value={form.transmission} onChange={(e) => change("transmission", e.target.value)} placeholder="Auto." /></Field></div><Field label="Kilométrage *"><input inputMode="numeric" value={form.mileage} onChange={(e) => change("mileage", e.target.value)} placeholder="68 400" /></Field></Section>
    <Section title="Achat & revente"><div className="grid grid-cols-2 gap-3"><Field label="Date d’achat *"><input type="date" value={form.purchaseDate} onChange={(e) => change("purchaseDate", e.target.value)} /></Field><Field label="Statut"><select value={form.status} onChange={(e) => change("status", e.target.value)}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></Field><Field label="Prix d’achat *"><input inputMode="decimal" value={form.purchasePrice} onChange={(e) => change("purchasePrice", e.target.value)} placeholder="7 250" /></Field><Field label="Prix de vente prévu"><input inputMode="decimal" value={form.targetPrice} onChange={(e) => change("targetPrice", e.target.value)} placeholder="9 800" /></Field></div></Section>
    <Section title="Identification"><Field label="Immatriculation"><input value={form.registration} onChange={(e) => change("registration", e.target.value)} placeholder="1-ABC-123" /></Field><Field label="Numéro de châssis"><input value={form.vin} onChange={(e) => change("vin", e.target.value)} placeholder="VIN" /></Field></Section>
    <Section title="Vendeur"><div className="grid grid-cols-2 gap-3"><Field label="Vendeur"><input value={form.seller} onChange={(e) => change("seller", e.target.value)} placeholder="Nom ou garage" /></Field><Field label="Téléphone"><input type="tel" value={form.sellerPhone} onChange={(e) => change("sellerPhone", e.target.value)} placeholder="+32 ..." /></Field></div></Section>
    <Section title="Notes"><Field label="Description"><textarea rows={3} value={form.description} onChange={(e) => change("description", e.target.value)} placeholder="État général, historique…" /></Field><Field label="Notes privées"><textarea rows={3} value={form.notes} onChange={(e) => change("notes", e.target.value)} placeholder="À ne pas oublier…" /></Field></Section>
    <Section title="Photo principale"><label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-[#aeb9b0] bg-white px-4 py-7 text-sm font-semibold text-[#466153] active:scale-[.98]"><CameraIcon className="h-5 w-5" />{form.photo ? "Photo ajoutée — remplacer" : "Ajouter une photo"}<input type="file" accept="image/*" className="sr-only" onChange={(e) => image(e.target.files?.[0])} /></label>{form.photo && <img src={form.photo} alt="Aperçu de la photo" className="mt-3 aspect-[16/8] w-full rounded-xl object-cover" />}</Section>
    {error && <p role="alert" className="rounded-xl bg-red-50 px-3 py-3 text-sm font-medium text-red-700">{error}</p>}
    <button disabled={busy} className="w-full rounded-2xl bg-[#1d6144] px-5 py-4 font-bold text-white shadow-[0_12px_24px_-16px_rgba(14,69,43,.7)] transition active:scale-[.98] disabled:opacity-60">{busy ? "Ajout…" : "Ajouter le véhicule"}</button>
  </form>;
}
function Section({ title, children }: { title: string; children: ReactNode }) { return <section><h2 className="mb-3 text-sm font-bold text-[#2b3b31]">{title}</h2><div className="space-y-3">{children}</div></section>; }
function Field({ label, children }: { label: string; children: ReactNode }) { return <label className="block space-y-2 text-xs font-semibold text-[#526259]"><span>{label}</span>{children}</label>; }
