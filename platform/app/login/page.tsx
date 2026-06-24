import { Suspense } from "react";
import { PlatformShell } from "@/components/PlatformShell";

export default function LoginPage() {
  return (
    <Suspense>
      <PlatformShell entry="login" />
    </Suspense>
  );
}
