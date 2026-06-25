"use client";

import { useEffect, useRef, useState, type ChangeEvent, type KeyboardEvent, type ReactNode } from "react";
import {
  CONTACTS,
  type Contact,
  type ThreadMessage,
  type ThreadsStore,
} from "@/lib/platform/data/kpi";

export interface ChatBubblesProps {
  contactInit: string;
  messages: ThreadMessage[];
}

export function ChatBubbles({ contactInit, messages }: ChatBubblesProps) {
  if (!messages.length) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "30px",
          color: "#7A9A7A",
          fontSize: "13px",
        }}
      >
        No messages yet.
      </div>
    );
  }

  const nodes: ReactNode[] = [];

  messages.forEach((m, i) => {
    const isMe = m.from === "me";
    const showTime = i === 0 || messages[i - 1]?.t !== m.t;
    if (showTime && i > 0) {
      nodes.push(
        <div
          key={`time-${i}`}
          style={{
            textAlign: "center",
            fontSize: "11px",
            color: "#7A9A7A",
            padding: "10px 0 4px",
            fontWeight: 500,
          }}
        >
          {m.t}
        </div>
      );
    }
    const roundBR = isMe ? "4px" : "18px";
    const roundBL = !isMe ? "4px" : "18px";
    nodes.push(
      <div
        key={`msg-${contactInit}-${i}`}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: isMe ? "flex-end" : "flex-start",
          marginBottom: "2px",
        }}
      >
        <div
          style={{
            maxWidth: "72%",
            padding: "10px 14px",
            borderRadius: "18px",
            borderBottomRightRadius: roundBR,
            borderBottomLeftRadius: roundBL,
            background: isMe
              ? "linear-gradient(135deg,#0C2D6E,#1A4DB0)"
              : "var(--msg-bubble-bg,#E9E9EB)",
            color: isMe ? "#FFFFFF" : "var(--msg-bubble-fg,#0A160A)",
            fontSize: "15px",
            lineHeight: 1.4,
            letterSpacing: "-.01em",
            ...(isMe
              ? {
                  boxShadow: "0 2px 8px rgba(12,45,110,0.3)",
                  border: "1px solid rgba(30,90,180,0.25)",
                }
              : {}),
          }}
        >
          {m.text}
        </div>
      </div>
    );
  });

  return <>{nodes}</>;
}

export interface MessagesPageProps {
  activeContact: string;
  onActiveContactChange: (init: string) => void;
  threads: ThreadsStore;
  onSendMessage: (contactInit: string, text: string) => void;
  contacts?: readonly Contact[];
  onAttach?: (files: FileList) => void;
}

export function MessagesPage({
  activeContact,
  onActiveContactChange,
  threads,
  onSendMessage,
  contacts = CONTACTS,
  onAttach,
}: MessagesPageProps) {
  const contact =
    contacts.find((c) => c.init === activeContact) ?? contacts[0];
  const [draft, setDraft] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const msgs = threads[activeContact] ?? [];

  useEffect(() => {
    const area = chatRef.current;
    if (area) area.scrollTop = area.scrollHeight;
  }, [activeContact, msgs.length]);

  function send() {
    const text = draft.trim();
    if (!text) return;
    onSendMessage(activeContact, text);
    setDraft("");
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.length && onAttach) onAttach(e.target.files);
    e.target.value = "";
  }

  return (
    <div
      className="msg-layout"
      id="msg-layout"
      style={{
        height: "calc(100vh - var(--th) - 28px)",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow:
          "0 1px 0 rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      <div className="msg-list-panel" style={{ background: "#FFFFFF" }}>
        <div style={{ padding: "16px 16px 8px" }}>
          <div
            style={{
              fontSize: "22px",
              fontWeight: 700,
              color: "#0A160A",
              letterSpacing: "-.03em",
            }}
          >
            Messages
          </div>
        </div>
        <div style={{ padding: "0 12px 10px" }}>
          <div style={{ position: "relative" }}>
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#7A9A7A"
              strokeWidth="2"
              style={{
                position: "absolute",
                left: "10px",
                top: "50%",
                transform: "translateY(-50%)",
              }}
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              placeholder="Search"
              readOnly
              style={{
                width: "100%",
                padding: "7px 12px 7px 30px",
                borderRadius: "10px",
                border: "none",
                background: "rgba(118,118,128,0.12)",
                fontSize: "14px",
                color: "#0A160A",
                fontFamily: "inherit",
              }}
            />
          </div>
        </div>
        <div style={{ overflowY: "auto", flex: 1 }}>
          {contacts.map((c) => {
            const lastMsg = (threads[c.init] ?? []).slice(-1)[0];
            const isActive = activeContact === c.init;
            return (
              <div
                key={c.init}
                role="button"
                tabIndex={0}
                onClick={() => onActiveContactChange(c.init)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ")
                    onActiveContactChange(c.init);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "11px 16px",
                  cursor: "pointer",
                  background: isActive
                    ? "rgba(0,122,255,0.06)"
                    : "transparent",
                  transition: "background .1s",
                  borderBottom: "0.5px solid rgba(0,0,0,0.06)",
                }}
              >
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <div
                    style={{
                      width: "46px",
                      height: "46px",
                      borderRadius: "50%",
                      background: c.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "16px",
                      fontWeight: 700,
                      color: "white",
                    }}
                  >
                    {c.init}
                  </div>
                  {c.online ? (
                    <div
                      style={{
                        position: "absolute",
                        bottom: "1px",
                        right: "1px",
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        background: "#34C759",
                        border: "2px solid white",
                      }}
                    />
                  ) : null}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      marginBottom: "2px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "15px",
                        fontWeight: 600,
                        color: "#0A160A",
                      }}
                    >
                      {c.name}
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#7A9A7A",
                        flexShrink: 0,
                        marginLeft: "8px",
                      }}
                    >
                      {lastMsg?.t ?? ""}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
                      color: "#7A9A7A",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {lastMsg?.text ?? "No messages"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="msg-chat-panel" style={{ background: "#FFFFFF" }}>
        <div
          style={{
            padding: "12px 16px 10px",
            borderBottom: "0.5px solid rgba(0,0,0,0.1)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            background: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div style={{ position: "relative" }}>
            <div
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "50%",
                background: contact.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "13px",
                fontWeight: 700,
                color: "white",
                flexShrink: 0,
              }}
            >
              {contact.init}
            </div>
            {contact.online ? (
              <div
                style={{
                  position: "absolute",
                  bottom: "1px",
                  right: "1px",
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: "#34C759",
                  border: "1.5px solid white",
                }}
              />
            ) : null}
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: "15px",
                fontWeight: 600,
                color: "#0A160A",
                letterSpacing: "-.01em",
              }}
            >
              {contact.name}
            </div>
            <div
              style={{
                fontSize: "11px",
                color: contact.online ? "#34C759" : "#7A9A7A",
              }}
            >
              {contact.online ? "Active Now" : contact.role}
            </div>
          </div>
          <div style={{ display: "flex", gap: "6px" }}>
            <button
              type="button"
              className="ib"
              style={{
                width: "34px",
                height: "34px",
                background: "rgba(0,122,255,0.1)",
                borderRadius: "50%",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#00B478"
                strokeWidth="2"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.77 12A19.79 19.79 0 0 1 1.7 3.33A2 2 0 0 1 3.68 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </button>
            <button
              type="button"
              className="ib"
              style={{
                width: "34px",
                height: "34px",
                background: "rgba(0,122,255,0.1)",
                borderRadius: "50%",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#00B478"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="1" />
                <circle cx="19" cy="12" r="1" />
                <circle cx="5" cy="12" r="1" />
              </svg>
            </button>
          </div>
        </div>

        <div
          ref={chatRef}
          id="chat-area"
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "2px",
            background: "#FFFFFF",
          }}
        >
          <ChatBubbles contactInit={activeContact} messages={msgs} />
        </div>

        <div
          style={{
            padding: "8px 12px 10px",
            borderTop: "0.5px solid rgba(0,0,0,0.1)",
            display: "flex",
            gap: "8px",
            alignItems: "flex-end",
            background: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(20px)",
          }}
        >
          <input
            ref={fileRef}
            type="file"
            id="msg-file-input"
            accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv"
            multiple
            style={{ display: "none" }}
            onChange={onFileChange}
          />
          <button
            type="button"
            className="ib"
            title="Attach image or file"
            onClick={() => fileRef.current?.click()}
            style={{
              width: "34px",
              height: "34px",
              flexShrink: 0,
              background: "rgba(0,122,255,0.1)",
              borderRadius: "50%",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#00B478"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
          </button>
          <textarea
            id="msg-input"
            rows={1}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Message"
            style={{
              flex: 1,
              padding: "9px 14px",
              borderRadius: "20px",
              border: "1px solid rgba(0,0,0,0.12)",
              background: "#FFFFFF",
              fontSize: "15px",
              resize: "none",
              maxHeight: "100px",
              lineHeight: 1.5,
              fontFamily: "inherit",
              color: "#0A160A",
              outline: "none",
            }}
          />
          <button
            type="button"
            onClick={send}
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "50%",
              background: "#00694A",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 2px 8px rgba(0,122,255,0.3)",
              transition: "all .15s",
            }}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default MessagesPage;
