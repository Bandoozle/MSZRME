"use client";

import Script from "next/script";

/** Loads HTML prototype runtimes used by dealer page bridges. */
export function PrototypeScripts() {
  return (
    <>
      <Script src="/mszrme-dealer-runtime.js" strategy="afterInteractive" />
      <Script src="/mszrme-init-runtime.js" strategy="afterInteractive" />
    </>
  );
}
