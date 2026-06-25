"use client";

import { Suspense, type ReactNode } from "react";
import { PlatformProvider } from "@/context/PlatformContext";

function PlatformProviderInner({ children }: { children: ReactNode }) {
  return <PlatformProvider>{children}</PlatformProvider>;
}

/** Wraps PlatformProvider so useSearchParams is inside Suspense (Next.js requirement). */
export function PlatformProviderGate({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <PlatformProviderInner>{children}</PlatformProviderInner>
    </Suspense>
  );
}
