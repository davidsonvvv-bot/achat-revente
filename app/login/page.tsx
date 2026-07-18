"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppData } from "@/components/app-providers";

export default function LoginPage() {
  const router = useRouter(); const { backendEnabled, authenticated, signIn } = useAppData(); const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  if (!backendEnabled) return <main className="mx-auto flex min-h-[100dvh] max-w-md items-center bg-[#f7f7f5] px-5"><div className="rounded-3xl border border-[#dce5de] bg-white p-6"><h1 className="text-2xl font-bold">Mode démo actif</h1><p className="mt-3 text-sm text-[#6b786f]">Ajoutez `NEXT_PUBLIC_POCKETBASE_URL` dans `.env.local` pour activer la connexion PocketBase.</p></div></main>;
  if (authenticated) { router.replace("/vehicles"); return null; }
  const submit = async (event: FormEvent) => { event.preventDefault(); setError(""); setBusy(true); try { await signIn(email, password); router.replace("/vehicles"); } catch { setError("E-mail ou mot de passe incorrect."); } finally { setBusy(false); } };
  return <main className="mx-auto flex min-h-[100dvh] max-w-md items-center bg-[#f7f7f5] px-5"><form onSubmit={submit} className="w-full rounded-3xl border border-[#dce5de] bg-white p-6 shadow-[0_20px_35px_-30px_rgba(20,70,44,.45)]"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#65806f]">Parc automobile</p><h1 className="mt-2 text-3xl font-bold tracking-tight">Connexion</h1><p className="mt-2 text-sm text-[#6b786f]">Utilisez le compte créé dans PocketBase.</p><label className="mt-6 block text-xs font-semibold text-[#526259]">E-mail<input className="mt-2" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label><label className="mt-4 block text-xs font-semibold text-[#526259]">Mot de passe<input className="mt-2" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>{error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}<button disabled={busy} className="mt-6 w-full rounded-2xl bg-[#1d6144] px-4 py-4 font-bold text-white active:scale-[.98] disabled:opacity-60">{busy ? "Connexion…" : "Se connecter"}</button></form></main>;
}
