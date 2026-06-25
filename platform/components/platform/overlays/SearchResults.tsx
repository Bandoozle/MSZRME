"use client";

import { useMemo } from "react";
import { SEARCH_INDEX } from "@/lib/platform/data/search";
import type { DealerPageId } from "@/lib/platform/data/nav";

interface Props {
  query: string;
  onSelect: (page: DealerPageId) => void;
}

export function SearchResults({ query, onSelect }: Props) {
  const matches = useMemo(() => {
    const q = query.toLowerCase();
    return q
      ? SEARCH_INDEX.filter((i) => i.label.toLowerCase().includes(q))
      : SEARCH_INDEX;
  }, [query]);

  return (
    <>
      {matches.map((i) => (
        <div
          key={i.page + i.label}
          role="button"
          tabIndex={0}
          onClick={() => onSelect(i.page)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") onSelect(i.page);
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "10px 12px",
            borderRadius: "var(--rs)",
            cursor: "pointer",
            transition: "background .12s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#F2F5F2";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "none";
          }}
        >
          <span style={{ fontSize: "18px" }}>{i.icon}</span>
          <div style={{ fontSize: "14px", fontWeight: 500 }}>{i.label}</div>
        </div>
      ))}
    </>
  );
}
