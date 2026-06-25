"use client";

import { PlatformProviderGate } from "@/components/platform/PlatformProviderGate";
import { PlatformApp } from "@/components/platform/PlatformApp";

/** Full V2 platform — React components, no HTML shell/runtime. */
export function PlatformShell() {
  return (
    <PlatformProviderGate>
      <PlatformApp />
    </PlatformProviderGate>
  );
}
