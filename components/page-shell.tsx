import { BottomNav } from "./bottom-nav";
import type { ReactNode } from "react";
import { AuthGate } from "./auth-gate";

export function PageShell({ children }: { children: ReactNode }) {
  return <AuthGate><main className="mx-auto min-h-[100dvh] max-w-md bg-[#f7f7f5] pb-28">{children}<BottomNav /></main></AuthGate>;
}
