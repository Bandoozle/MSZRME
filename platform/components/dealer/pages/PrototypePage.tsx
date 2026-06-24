"use client";

import { useEffect } from "react";
import { runPrototypePage } from "@/lib/prototypePage";

interface Props {
  page: string;
  label: string;
  renderKey: string;
}

export function PrototypePage({ page, label, renderKey }: Props) {
  useEffect(() => {
    const run = () => runPrototypePage(page, label, renderKey);
    run();
    window.addEventListener("mszrme-runtime-ready", run);
    return () => window.removeEventListener("mszrme-runtime-ready", run);
  }, [page, label, renderKey]);

  return null;
}

export default PrototypePage;
