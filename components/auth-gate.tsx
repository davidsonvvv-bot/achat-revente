"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useAppData } from "./app-providers";

export function AuthGate({ children }: { children: ReactNode }) {
  const { ready, backendEnabled, authenticated, error } = useAppData();
  if (!ready) return <main className="mx-auto min-h-[100dvh] max-w-md bg-[#f7f7f5] px-5 pt-8"><div className="h-4 w-28 animate-pulse rounded bg-[#dfe7e0]" /><div className="mt-5 h-48 animate-pulse rounded-2xl bg-[#e8ede8]" /></main>;
  if (backendEnabled && !authenticated) return <main className="mx-auto flex min-h-[100dvh] max-w-md items-center bg-[#f7f7f5] px-5"><div className="w-full rounded-3xl border border-[#dce5de] bg-white p-6"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#65806f]">Parc automobile</p><h1 className="mt-2 text-3xl font-bold tracking-tight">Connectez-vous</h1><p className="mt-3 text-sm leading-relaxed text-[#6b786f]">Vos véhicules sont protégés par votre compte PocketBase.</p>{error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}<Link href="/login" className="mt-6 block rounded-2xl bg-[#1d6144] px-4 py-4 text-center font-bold text-white active:scale-[.98]">Se connecter</Link></div></main>;
  return <>{children}</>;
}
