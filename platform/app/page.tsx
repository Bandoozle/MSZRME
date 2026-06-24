import { Suspense } from "react";
import { PlatformShell } from "@/components/PlatformShell";

export default function Home() {
  return (
    <Suspense>
      <PlatformShell />
    </Suspense>
  );
}
