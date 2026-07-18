import { BottomNav } from "./bottom-nav";
import type { ReactNode } from "react";
import { AuthGate } from "./auth-gate";

export function PageShell({ children }: { children: ReactNode }) {
  return <AuthGate><main className="mx-auto min-h-[100dvh] max-w-md bg-[#f7f7f5] pb-[calc(env(safe-area-inset-bottom)+88px)]">{children}<BottomNav /></main></AuthGate>;
}
