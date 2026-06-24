"use client";
import { useState, useEffect, useCallback } from "react";

export function useTheme() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("mszrme-theme");
    if (stored === "dark") setDark(true);
  }, []);

  const toggle = useCallback(() => {
    setDark((prev) => {
      const next = !prev;
      localStorage.setItem("mszrme-theme", next ? "dark" : "light");
      return next;
    });
  }, []);

  return { dark, toggle };
}
