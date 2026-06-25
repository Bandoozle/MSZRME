"use client";

import type { DealerPageId } from "@/lib/platform/data/nav";
import {
  notificationColor,
  type PlatformNotification,
} from "@/lib/platform/utils/notifications";

interface Props {
  notifications: PlatformNotification[];
  onMarkAllRead: () => void;
  onClose: () => void;
  onNavigate: (page: DealerPageId) => void;
  onMarkRead: (id: string) => void;
}

export function NotificationList({
  notifications,
  onMarkAllRead,
  onClose,
  onNavigate,
  onMarkRead,
}: Props) {
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <>
      <div
        style={{
          padding: "14px 18px",
          borderBottom: "0.5px solid rgba(0,0,0,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ fontSize: "15px", fontWeight: 700, color: "#0A160A" }}>
          Notifications
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {unread > 0 ? (
            <button
              type="button"
              onClick={onMarkAllRead}
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "#00694A",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Mark all read
            </button>
          ) : null}
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "rgba(0,0,0,0.06)",
              border: "none",
              borderRadius: "50%",
              width: "24px",
              height: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: "16px",
              lineHeight: 1,
              color: "#4A6A50",
            }}
          >
            ×
          </button>
        </div>
      </div>

      {notifications.map((n) => {
        const c = notificationColor(n.type);
        return (
          <div
            key={n.id}
            role="button"
            tabIndex={0}
            onClick={() => {
              onMarkRead(n.id);
              onNavigate(n.page as DealerPageId);
              onClose();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                onMarkRead(n.id);
                onNavigate(n.page as DealerPageId);
                onClose();
              }
            }}
            style={{
              padding: "13px 18px",
              borderBottom: "0.5px solid rgba(0,0,0,0.05)",
              cursor: "pointer",
              display: "flex",
              gap: "10px",
              alignItems: "flex-start",
              background: n.read ? "transparent" : "rgba(0,105,74,0.03)",
            }}
          >
            <div
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "50%",
                background: `${c}18`,
                border: `1px solid ${c}33`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                fontSize: "15px",
              }}
            >
              {n.icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: n.read ? 600 : 700,
                  color: "#0A160A",
                  marginBottom: "2px",
                }}
              >
                {n.title}
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: "#7A9A7A",
                  lineHeight: 1.4,
                }}
              >
                {n.body}
              </div>
              <div
                style={{
                  fontSize: "10px",
                  fontWeight: 600,
                  color: c,
                  marginTop: "4px",
                }}
              >
                {n.time}
              </div>
            </div>
            {!n.read ? (
              <div
                style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  background: c,
                  flexShrink: 0,
                  marginTop: "4px",
                }}
              />
            ) : null}
          </div>
        );
      })}

      <div style={{ padding: "12px 18px", textAlign: "center" }}>
        <span style={{ fontSize: "11px", color: "#B8CCB8" }}>
          {notifications.length} notifications
        </span>
      </div>
    </>
  );
}
