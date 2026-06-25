"use client";

import {
  useCallback,
  useEffect,
  useState,
  type KeyboardEvent,
} from "react";
import {
  INITIATIVES_STORAGE_KEY,
  NOTES_NEXT_ID_KEY,
  NOTES_STORAGE_KEY,
  SEED_NOTES,
  seedInitiatives,
  type Initiative,
  type Note,
  type NoteType,
} from "@/lib/platform/data/notes";

type NotesTab = "Notes" | "Initiatives";

function loadNotes(): Note[] {
  if (typeof window === "undefined") return SEED_NOTES;
  try {
    const raw = localStorage.getItem(NOTES_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Note[]) : SEED_NOTES;
  } catch {
    return SEED_NOTES;
  }
}

function loadNextId(notes: Note[]): number {
  if (typeof window === "undefined") return 3;
  try {
    const raw = localStorage.getItem(NOTES_NEXT_ID_KEY);
    return raw ? Number(raw) : notes.length + 1;
  } catch {
    return notes.length + 1;
  }
}

function loadInitiatives(isFirstTime: boolean): Initiative[] {
  if (typeof window === "undefined") return isFirstTime ? [] : seedInitiatives();
  try {
    const raw = localStorage.getItem(INITIATIVES_STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Initiative[];
    if (isFirstTime) {
      localStorage.setItem(INITIATIVES_STORAGE_KEY, JSON.stringify([]));
      return [];
    }
    const seeded = seedInitiatives();
    localStorage.setItem(INITIATIVES_STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  } catch {
    return isFirstTime ? [] : seedInitiatives();
  }
}

function NotesHeader() {
  return (
    <div style={{ padding: "4px 0 12px" }}>
      <div
        style={{
          fontSize: "22px",
          fontWeight: 700,
          color: "#0A160A",
          letterSpacing: "-.03em",
        }}
      >
        Notes / Checklists
      </div>
      <div style={{ fontSize: "13px", color: "#7A9A7A", marginTop: "2px" }}>
        Track your day-to-day items and your strategic priorities.
      </div>
    </div>
  );
}

function TabBar({
  tab,
  onTab,
}: {
  tab: NotesTab;
  onTab: (t: NotesTab) => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: 0,
        background: "rgba(118,118,128,0.1)",
        borderRadius: "13px",
        padding: "3px",
        marginBottom: "10px",
      }}
    >
      {(["Notes", "Initiatives"] as const).map((t) => {
        const active = tab === t;
        return (
          <button
            key={t}
            type="button"
            onClick={() => onTab(t)}
            style={{
              flex: 1,
              padding: "8px 4px",
              borderRadius: "10px",
              border: "none",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all .15s",
              background: active ? "#FFFFFF" : "transparent",
              color: active ? "#00694A" : "#4A6A50",
              boxShadow: active ? "0 1px 3px rgba(0,0,0,0.12)" : "none",
              fontFamily: "inherit",
            }}
          >
            {t}
          </button>
        );
      })}
    </div>
  );
}

export interface NotesPageProps {
  isFirstTime?: boolean;
  onToast?: (message: string) => void;
}

export function NotesPage({
  isFirstTime = false,
  onToast,
}: NotesPageProps) {
  const [tab, setTab] = useState<NotesTab>("Notes");
  const [notes, setNotes] = useState<Note[]>(SEED_NOTES);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [nextId, setNextId] = useState(3);
  const [newItemText, setNewItemText] = useState<Record<number, string>>({});
  const [initiatives, setInitiatives] = useState<Initiative[]>([]);
  const [newInitiative, setNewInitiative] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const loaded = loadNotes();
    setNotes(loaded);
    setNextId(loadNextId(loaded));
    setInitiatives(loadInitiatives(isFirstTime));
    setHydrated(true);
  }, [isFirstTime]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
    localStorage.setItem(NOTES_NEXT_ID_KEY, String(nextId));
  }, [notes, nextId, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(INITIATIVES_STORAGE_KEY, JSON.stringify(initiatives));
  }, [initiatives, hydrated]);

  const noteNew = useCallback(
    (type: NoteType) => {
      const id = nextId;
      setNextId((n) => n + 1);
      const note: Note = {
        id,
        title: "",
        type,
        created: "Today",
        items: [],
      };
      setNotes((prev) => [note, ...prev]);
      setActiveId(id);
    },
    [nextId]
  );

  const noteOpen = useCallback((id: number) => {
    setActiveId((cur) => (cur === id ? null : id));
  }, []);

  const noteDelete = useCallback((id: number) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    setActiveId((cur) => (cur === id ? null : cur));
  }, []);

  const noteToggle = useCallback((noteId: number, idx: number) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id !== noteId
          ? n
          : {
              ...n,
              items: n.items.map((item, i) =>
                i === idx ? { ...item, done: !item.done } : item
              ),
            }
      )
    );
  }, []);

  const noteAddItem = useCallback(
    (noteId: number) => {
      const txt = (newItemText[noteId] ?? "").trim();
      if (!txt) return;
      setNotes((prev) =>
        prev.map((n) =>
          n.id !== noteId
            ? n
            : { ...n, items: [...n.items, { text: txt, done: false }] }
        )
      );
      setNewItemText((prev) => ({ ...prev, [noteId]: "" }));
    },
    [newItemText]
  );

  const noteDeleteItem = useCallback((noteId: number, idx: number) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id !== noteId
          ? n
          : { ...n, items: n.items.filter((_, i) => i !== idx) }
      )
    );
  }, []);

  const noteSetTitle = useCallback((id: number, title: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, title } : n))
    );
  }, []);

  const addInitiative = useCallback(() => {
    const title = newInitiative.trim();
    if (!title) return;
    setInitiatives((prev) => {
      const maxPos = prev.reduce((m, i) => Math.max(m, i.position || 0), 0);
      return [
        ...prev,
        {
          id: "i" + Date.now(),
          title,
          status: "backlog",
          position: maxPos + 1,
          createdAt: Date.now(),
        },
      ];
    });
    setNewInitiative("");
  }, [newInitiative]);

  const completeInitiative = useCallback(
    (id: string) => {
      setInitiatives((prev) => {
        const items = [...prev];
        const idx = items.findIndex((i) => i.id === id);
        if (idx < 0) return prev;
        items[idx] = {
          ...items[idx],
          status: "done",
          completedAt: Date.now(),
        };
        const nextUp = items
          .filter((i) => i.status === "backlog")
          .sort((a, b) => (a.position || 0) - (b.position || 0))[0];
        if (nextUp) nextUp.status = "active";
        if (nextUp) {
          onToast?.(
            "Initiative completed · promoted \"" +
              (nextUp.title.length > 40
                ? nextUp.title.slice(0, 40) + "…"
                : nextUp.title) +
              "\""
          );
        } else {
          onToast?.("Initiative completed");
        }
        return items;
      });
    },
    [onToast]
  );

  const promoteInitiative = useCallback(
    (id: string) => {
      const activeCount = initiatives.filter((i) => i.status === "active").length;
      if (activeCount >= 3) {
        onToast?.("Complete an active initiative first — only 3 at a time");
        return;
      }
      setInitiatives((prev) =>
        prev.map((i) => (i.id === id ? { ...i, status: "active" } : i))
      );
    },
    [initiatives, onToast]
  );

  const deleteInitiative = useCallback((id: string) => {
    setInitiatives((prev) => prev.filter((i) => i.id !== id));
  }, []);

  if (tab === "Initiatives") {
    const active = initiatives
      .filter((i) => i.status === "active")
      .sort((a, b) => (a.position || 0) - (b.position || 0));
    const backlog = initiatives
      .filter((i) => i.status === "backlog")
      .sort((a, b) => (a.position || 0) - (b.position || 0));
    const done = initiatives
      .filter((i) => i.status === "done")
      .sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0));

    return (
      <>
        <NotesHeader />
        <TabBar tab={tab} onTab={setTab} />
        <div
          style={{
            background:
              "linear-gradient(135deg,#003D2B,#00694A 70%,#00B478 130%)",
            borderRadius: "14px",
            padding: "14px 18px",
            marginBottom: "12px",
            color: "white",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              fontSize: "10px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: ".12em",
              color: "rgba(255,255,255,0.7)",
              marginBottom: "5px",
            }}
          >
            3 at a time
          </div>
          <div style={{ fontSize: "13px", color: "white", lineHeight: 1.5 }}>
            Strategic initiatives work best when you focus on three at once.
            Finish one and the next promotes automatically from your backlog.
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "8px",
            marginBottom: "14px",
          }}
        >
          {[0, 1, 2].map((idx) => {
            const a = active[idx];
            if (!a) {
              return (
                <div
                  key={idx}
                  style={{
                    background: "rgba(0,105,74,0.03)",
                    border: "1.5px dashed rgba(0,105,74,0.25)",
                    borderRadius: "14px",
                    padding: "18px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "22px",
                      height: "22px",
                      borderRadius: "50%",
                      background: "rgba(0,105,74,0.1)",
                      color: "#00694A",
                      fontSize: "11px",
                      fontWeight: 800,
                      marginBottom: "6px",
                    }}
                  >
                    {idx + 1}
                  </div>
                  <div style={{ fontSize: "12px", color: "#7A9A7A" }}>
                    Empty slot — promote from backlog
                  </div>
                </div>
              );
            }
            const daysActive = Math.round(
              (Date.now() - (a.createdAt || Date.now())) / 86400000
            );
            return (
              <div
                key={a.id}
                style={{
                  background: "#FFFFFF",
                  borderRadius: "14px",
                  padding: "16px 18px",
                  boxShadow:
                    "0 1px 0 rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.06)",
                  borderLeft: "4px solid #00694A",
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                }}
              >
                <div
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg,#003D2B,#00694A)",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "13px",
                    fontWeight: 800,
                    flexShrink: 0,
                  }}
                >
                  {idx + 1}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "#0A160A",
                      letterSpacing: "-.01em",
                      lineHeight: 1.35,
                    }}
                  >
                    {a.title}
                  </div>
                  <div
                    style={{
                      fontSize: "10px",
                      color: "#7A9A7A",
                      marginTop: "3px",
                    }}
                  >
                    In progress · {daysActive} day{daysActive === 1 ? "" : "s"}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => completeInitiative(a.id)}
                  style={{
                    padding: "7px 14px",
                    borderRadius: "20px",
                    background: "#00694A",
                    color: "white",
                    border: "none",
                    fontSize: "11px",
                    fontWeight: 700,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    flexShrink: 0,
                  }}
                >
                  Mark Done
                </button>
              </div>
            );
          })}
        </div>

        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "14px",
            padding: "14px 18px",
            boxShadow:
              "0 1px 0 rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.06)",
            marginBottom: "14px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <input
            type="text"
            placeholder="What do you want to accomplish?"
            value={newInitiative}
            onChange={(e) => setNewInitiative(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") addInitiative();
            }}
            style={{
              flex: 1,
              padding: "9px 12px",
              borderRadius: "8px",
              border: "1px solid rgba(0,0,0,0.1)",
              background: "#F0F3F0",
              fontSize: "13px",
              fontFamily: "inherit",
              outline: "none",
            }}
          />
          <button
            type="button"
            onClick={addInitiative}
            style={{
              padding: "9px 18px",
              borderRadius: "8px",
              background: "#00694A",
              color: "white",
              border: "none",
              fontSize: "12px",
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Add
          </button>
        </div>

        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "14px",
            boxShadow:
              "0 1px 0 rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.06)",
            overflow: "hidden",
            marginBottom: "14px",
          }}
        >
          <div
            style={{
              padding: "14px 18px",
              borderBottom: "0.5px solid rgba(0,0,0,0.06)",
            }}
          >
            <div
              style={{
                fontSize: "13px",
                fontWeight: 800,
                color: "#0A160A",
                letterSpacing: "-.02em",
              }}
            >
              Backlog
            </div>
            <div style={{ fontSize: "11px", color: "#7A9A7A", marginTop: "1px" }}>
              {backlog.length} waiting · promote to active when a slot opens
            </div>
          </div>
          {backlog.length === 0 ? (
            <div
              style={{
                padding: "20px",
                textAlign: "center",
                color: "#7A9A7A",
                fontSize: "12px",
              }}
            >
              No items in backlog
            </div>
          ) : (
            backlog.map((b) => (
              <div
                key={b.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "11px 18px",
                  borderBottom: "0.5px solid rgba(0,0,0,0.05)",
                }}
              >
                <div
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "#B8CCB8",
                    flexShrink: 0,
                  }}
                />
                <div
                  style={{
                    flex: 1,
                    minWidth: 0,
                    fontSize: "13px",
                    color: "#0A160A",
                    lineHeight: 1.4,
                  }}
                >
                  {b.title}
                </div>
                <button
                  type="button"
                  onClick={() => promoteInitiative(b.id)}
                  style={{
                    padding: "5px 11px",
                    borderRadius: "14px",
                    background: "rgba(0,105,74,0.08)",
                    border: "1px solid rgba(0,105,74,0.18)",
                    color: "#00694A",
                    fontSize: "10px",
                    fontWeight: 700,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    whiteSpace: "nowrap",
                  }}
                >
                  ↑ Promote
                </button>
                <button
                  type="button"
                  onClick={() => deleteInitiative(b.id)}
                  style={{
                    padding: "4px 8px",
                    border: "none",
                    background: "none",
                    color: "#B8CCB8",
                    fontSize: "16px",
                    cursor: "pointer",
                    lineHeight: 1,
                  }}
                  title="Remove"
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>

        {done.length > 0 ? (
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "14px",
              boxShadow:
                "0 1px 0 rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.06)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "14px 18px",
                borderBottom: "0.5px solid rgba(0,0,0,0.06)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 800,
                    color: "#0A160A",
                    letterSpacing: "-.02em",
                  }}
                >
                  Completed
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "#7A9A7A",
                    marginTop: "1px",
                  }}
                >
                  {done.length} initiative{done.length === 1 ? "" : "s"} shipped
                </div>
              </div>
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  color: "#00694A",
                  background: "rgba(0,180,120,0.1)",
                  padding: "3px 9px",
                  borderRadius: "8px",
                  letterSpacing: ".06em",
                  textTransform: "uppercase",
                }}
              >
                Wins
              </span>
            </div>
            {done.slice(0, 5).map((d) => {
              const daysAgo = Math.round(
                (Date.now() - (d.completedAt || Date.now())) / 86400000
              );
              return (
                <div
                  key={d.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "10px 18px",
                    borderBottom: "0.5px solid rgba(0,0,0,0.05)",
                  }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="14"
                    height="14"
                    fill="none"
                    stroke="#00694A"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <div
                    style={{
                      flex: 1,
                      minWidth: 0,
                      fontSize: "12px",
                      color: "#4A6A50",
                      textDecoration: "line-through",
                      lineHeight: 1.4,
                    }}
                  >
                    {d.title}
                  </div>
                  <div
                    style={{
                      fontSize: "10px",
                      color: "#7A9A7A",
                      flexShrink: 0,
                    }}
                  >
                    {daysAgo}d ago
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}
      </>
    );
  }

  return (
    <>
      <NotesHeader />
      <TabBar tab={tab} onTab={setTab} />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "4px 0 16px",
        }}
      >
        <div />
        <div style={{ display: "flex", gap: "6px" }}>
          {(["bullet", "numbered"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => noteNew(type)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                padding: "7px 12px",
                borderRadius: "20px",
                border: "1px solid rgba(0,105,74,0.2)",
                background: "rgba(0,105,74,0.06)",
                color: "#00694A",
                fontSize: "11px",
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              <svg
                viewBox="0 0 24 24"
                width="12"
                height="12"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              {type === "bullet" ? "Bullet" : "Numbered"}
            </button>
          ))}
        </div>
      </div>

      {notes.length === 0 ? (
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "16px",
            padding: "48px 24px",
            textAlign: "center",
            boxShadow:
              "0 1px 0 rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.06)",
          }}
        >
          <div style={{ fontSize: "32px", marginBottom: "12px" }}>📋</div>
          <div
            style={{
              fontSize: "15px",
              fontWeight: 600,
              color: "#0A160A",
              marginBottom: "6px",
            }}
          >
            No notes yet
          </div>
          <div style={{ fontSize: "12px", color: "#7A9A7A" }}>
            Tap + Bullet or + Numbered to create your first checklist
          </div>
        </div>
      ) : (
        notes.map((note) => {
          const isOpen = activeId === note.id;
          const done = note.items.filter((i) => i.done).length;
          const total = note.items.length;
          return (
            <div
              key={note.id}
              style={{
                background: "#FFFFFF",
                borderRadius: "14px",
                boxShadow:
                  "0 1px 0 rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.06)",
                overflow: "hidden",
                marginBottom: "8px",
                borderTop: isOpen
                  ? "2px solid #00694A"
                  : "1px solid rgba(0,180,120,0.1)",
              }}
            >
              <div
                role="button"
                tabIndex={0}
                onClick={() => noteOpen(note.id)}
                onKeyDown={(e: KeyboardEvent) => {
                  if (e.key === "Enter" || e.key === " ") noteOpen(note.id);
                }}
                style={{
                  padding: "14px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  cursor: "pointer",
                  background: isOpen ? "rgba(0,105,74,0.02)" : "transparent",
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  {isOpen ? (
                    <input
                      type="text"
                      value={note.title}
                      placeholder="Note title…"
                      onInput={(e) =>
                        noteSetTitle(note.id, e.currentTarget.value)
                      }
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        fontSize: "14px",
                        fontWeight: 700,
                        color: "#0A160A",
                        border: "none",
                        outline: "none",
                        background: "transparent",
                        fontFamily: "inherit",
                        width: "100%",
                        padding: 0,
                        margin: 0,
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: 700,
                        color: "#0A160A",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {note.title || "Untitled"}
                    </div>
                  )}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginTop: "3px",
                    }}
                  >
                    <span
                      style={{
                        color: "#7A9A7A",
                        display: "flex",
                        alignItems: "center",
                        gap: "3px",
                      }}
                    >
                      {note.type === "numbered" ? (
                        <svg
                          viewBox="0 0 24 24"
                          width="13"
                          height="13"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <line x1="10" y1="6" x2="21" y2="6" />
                          <line x1="10" y1="12" x2="21" y2="12" />
                          <line x1="10" y1="18" x2="21" y2="18" />
                          <path d="M4 6h1v4" />
                          <path d="M4 10h2" />
                          <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
                        </svg>
                      ) : (
                        <svg
                          viewBox="0 0 24 24"
                          width="13"
                          height="13"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <line x1="9" y1="6" x2="20" y2="6" />
                          <line x1="9" y1="12" x2="20" y2="12" />
                          <line x1="9" y1="18" x2="20" y2="18" />
                          <circle cx="4" cy="6" r="1" fill="currentColor" />
                          <circle cx="4" cy="12" r="1" fill="currentColor" />
                          <circle cx="4" cy="18" r="1" fill="currentColor" />
                        </svg>
                      )}
                      <span style={{ fontSize: "10px" }}>
                        {note.type === "numbered" ? "Numbered" : "Bullet"}
                      </span>
                    </span>
                    <span style={{ fontSize: "10px", color: "#7A9A7A" }}>·</span>
                    <span style={{ fontSize: "10px", color: "#7A9A7A" }}>
                      {total} item{total !== 1 ? "s" : ""}
                      {total > 0 ? ` · ${done} done` : ""}
                    </span>
                    <span style={{ fontSize: "10px", color: "#7A9A7A" }}>
                      · {note.created}
                    </span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  {total > 0 && done === total ? (
                    <div
                      style={{
                        fontSize: "9px",
                        fontWeight: 700,
                        color: "#00694A",
                        background: "rgba(0,105,74,0.1)",
                        padding: "2px 8px",
                        borderRadius: "20px",
                      }}
                    >
                      DONE
                    </div>
                  ) : null}
                  <svg
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    fill="none"
                    stroke="#B8CCB8"
                    strokeWidth="2"
                    style={{
                      transform: `rotate(${isOpen ? 180 : 0}deg)`,
                      transition: "transform .2s",
                      flexShrink: 0,
                    }}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>

              {isOpen ? (
                <div
                  style={{
                    padding: "0 16px 14px",
                    borderTop: "0.5px solid rgba(0,0,0,0.06)",
                  }}
                >
                  {note.items.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "8px 0",
                        borderBottom: "0.5px solid rgba(0,0,0,0.05)",
                      }}
                    >
                      {note.type === "numbered" ? (
                        <div
                          style={{
                            width: "20px",
                            height: "20px",
                            borderRadius: "50%",
                            background: item.done
                              ? "#00694A"
                              : "rgba(0,0,0,0.08)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            fontSize: "10px",
                            fontWeight: 700,
                            color: item.done ? "white" : "#7A9A7A",
                            cursor: "pointer",
                          }}
                          onClick={() => noteToggle(note.id, idx)}
                        >
                          {idx + 1}
                        </div>
                      ) : (
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={() => noteToggle(note.id, idx)}
                          style={{
                            width: "20px",
                            height: "20px",
                            borderRadius: "50%",
                            border: `2px solid ${item.done ? "#00694A" : "rgba(0,0,0,0.18)"}`,
                            background: item.done ? "#00694A" : "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            cursor: "pointer",
                            transition: "all .15s",
                          }}
                        >
                          {item.done ? (
                            <svg
                              viewBox="0 0 24 24"
                              width="11"
                              height="11"
                              fill="none"
                              stroke="white"
                              strokeWidth="3"
                              strokeLinecap="round"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          ) : null}
                        </div>
                      )}
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() => noteToggle(note.id, idx)}
                        style={{
                          flex: 1,
                          fontSize: "13px",
                          color: item.done ? "#7A9A7A" : "#0A160A",
                          textDecoration: item.done ? "line-through" : "none",
                          transition: "all .15s",
                          cursor: "pointer",
                        }}
                      >
                        {item.text}
                      </div>
                      <button
                        type="button"
                        onClick={() => noteDeleteItem(note.id, idx)}
                        style={{
                          border: "none",
                          background: "none",
                          cursor: "pointer",
                          padding: "2px",
                          color: "#B8CCB8",
                          fontSize: "16px",
                          lineHeight: 1,
                          flexShrink: 0,
                        }}
                        title="Remove"
                      >
                        ×
                      </button>
                    </div>
                  ))}

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "10px 0 2px",
                    }}
                  >
                    {note.type === "numbered" ? (
                      <div
                        style={{
                          width: "20px",
                          height: "20px",
                          borderRadius: "50%",
                          background: "rgba(0,0,0,0.06)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          fontSize: "10px",
                          color: "#7A9A7A",
                        }}
                      >
                        {note.items.length + 1}
                      </div>
                    ) : (
                      <div
                        style={{
                          width: "20px",
                          height: "20px",
                          borderRadius: "50%",
                          border: "2px dashed rgba(0,0,0,0.15)",
                          flexShrink: 0,
                        }}
                      />
                    )}
                    <input
                      type="text"
                      placeholder="Add item…"
                      value={newItemText[note.id] ?? ""}
                      onChange={(e) =>
                        setNewItemText((prev) => ({
                          ...prev,
                          [note.id]: e.target.value,
                        }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          noteAddItem(note.id);
                        }
                      }}
                      style={{
                        flex: 1,
                        border: "none",
                        outline: "none",
                        fontSize: "13px",
                        color: "#0A160A",
                        background: "transparent",
                        fontFamily: "inherit",
                        padding: 0,
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => noteAddItem(note.id)}
                      style={{
                        border: "none",
                        background: "rgba(0,105,74,0.08)",
                        color: "#00694A",
                        fontSize: "11px",
                        fontWeight: 700,
                        borderRadius: "20px",
                        padding: "4px 12px",
                        cursor: "pointer",
                        fontFamily: "inherit",
                        flexShrink: 0,
                      }}
                    >
                      Add
                    </button>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginTop: "12px",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => noteDelete(note.id)}
                      style={{
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                        fontSize: "11px",
                        color: "#B8CCB8",
                        fontFamily: "inherit",
                        padding: "4px 0",
                      }}
                    >
                      Delete note
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          );
        })
      )}
    </>
  );
}

export default NotesPage;
