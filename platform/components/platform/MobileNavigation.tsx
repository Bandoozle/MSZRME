"use client";

import type { DealerPageId } from "@/lib/platform/data/nav";

const MOB_TABS: {
  id: DealerPageId | "more";
  tabId: string;
  badge?: number;
}[] = [
  { id: "dashboard", tabId: "mobtab-dashboard" },
  { id: "financials", tabId: "mobtab-financials" },
  { id: "market", tabId: "mobtab-market" },
  { id: "messages", tabId: "mobtab-messages", badge: 3 },
  { id: "more", tabId: "mobtab-more" },
];

export interface MobileNavigationProps {
  activePage: DealerPageId;
  onNavigate: (page: DealerPageId) => void;
  onOpenMenuSheet?: () => void;
  messageBadge?: number;
}

export function MobileNavigation({
  activePage,
  onNavigate,
  onOpenMenuSheet,
  messageBadge = 3,
}: MobileNavigationProps) {
  const isActive = (tabId: DealerPageId | "more") => {
    if (tabId === "more") return false;
    return activePage === tabId;
  };

  const handleClick = (tabId: DealerPageId | "more", button: HTMLButtonElement) => {
    if (tabId === "more") {
      onOpenMenuSheet?.();
      return;
    }
    onNavigate(tabId);
    document
      .querySelectorAll("#mobile-tabs .mob-tab")
      .forEach((el) => el.classList.remove("active"));
    button.classList.add("active");
  };

  return (
    <div id="mobile-tabs" style={{ display: "none" }}>
      {MOB_TABS.map((tab) => (
        <button
          key={tab.tabId}
          type="button"
          className={`mob-tab${isActive(tab.id) ? " active" : ""}`}
          id={tab.tabId}
          onClick={(e) => handleClick(tab.id, e.currentTarget)}
        >
          {tab.id === "messages" && messageBadge > 0 ? (
            <div className="mob-tab-badge">{messageBadge}</div>
          ) : null}

          {tab.id === "dashboard" ? (
            <>
              <svg
                className="icon-outline"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <svg
                className="icon-filled"
                viewBox="0 0 24 24"
                fill="currentColor"
                stroke="none"
              >
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
            </>
          ) : null}

          {tab.id === "financials" ? (
            <>
              <svg
                className="icon-outline"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
              <svg
                className="icon-filled"
                viewBox="0 0 24 24"
                fill="currentColor"
                stroke="none"
              >
                <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 5H4V7h16v2z" />
              </svg>
            </>
          ) : null}

          {tab.id === "market" ? (
            <>
              <svg
                className="icon-outline"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
              <svg
                className="icon-filled"
                viewBox="0 0 24 24"
                fill="currentColor"
                stroke="none"
              >
                <path d="M21 12h-3.57l-3.43 9-6-18L5.57 12H2a1 1 0 0 0 0 2h4.43l2.43-6.5 6 18 3.57-9.5H21a1 1 0 0 0 0-2z" />
              </svg>
            </>
          ) : null}

          {tab.id === "messages" ? (
            <>
              <svg
                className="icon-outline"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <svg
                className="icon-filled"
                viewBox="0 0 24 24"
                fill="currentColor"
                stroke="none"
              >
                <path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z" />
              </svg>
            </>
          ) : null}

          {tab.id === "more" ? (
            <>
              <svg
                className="icon-outline"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
              <svg
                className="icon-filled"
                viewBox="0 0 24 24"
                fill="currentColor"
                stroke="none"
              >
                <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
              </svg>
            </>
          ) : null}
        </button>
      ))}
    </div>
  );
}
