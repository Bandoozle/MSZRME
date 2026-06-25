"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AdminAccount } from "@/lib/platform/data/kpi";
import {
  ADM_ACCOUNTS as SEED_ACCOUNTS,
  ADM_INVOICES as SEED_INVOICES,
  ADM_LOGS as SEED_LOGS,
  ADM_MONTHLY,
  ADM_NOTES_TIMELINE as SEED_NOTES_TIMELINE,
  ADM_NOTIF_HISTORY,
  ADM_SCHEDULED as SEED_SCHEDULED,
  ADM_TAGS as SEED_TAGS,
  ADM_THREADS as SEED_THREADS,
  ADM_TIERS,
  FEATURE_FLAGS as SEED_FEATURE_FLAGS,
  INITIAL_AI_MESSAGES,
  INITIAL_CALL_LOGS,
  type AdminCallLogsStore,
  type AdminLogEntry,
  type AdminNotesTimelineStore,
  type AdminScheduledNotif,
  type AdminTagsStore,
  type AdminThreadsStore,
  type ExitDeal,
  type FeatureFlag,
} from "@/lib/platform/data/admin";
import type { AdminAccountExt } from "@/lib/platform/utils/admin";
import type { AdminPageId, DetailTabId, ToastType } from "./types";

type ConfirmState = {
  title: string;
  body: string;
  confirmLabel: string;
  confirmStyle: string;
  onConfirm: () => void;
};

type InputModalState = {
  title: string;
  fields: {
    id: string;
    label: string;
    type?: string;
    placeholder?: string;
    value?: string;
    hint?: string;
    options?: string[];
  }[];
  confirmLabel: string;
  onConfirm: (vals: Record<string, string>) => void;
};

interface AdminContextValue {
  page: AdminPageId;
  setPage: (p: AdminPageId) => void;
  accounts: AdminAccountExt[];
  threads: AdminThreadsStore;
  invoices: typeof SEED_INVOICES;
  logs: AdminLogEntry[];
  featureFlags: FeatureFlag[];
  callLogs: AdminCallLogsStore;
  tags: AdminTagsStore;
  notesTimeline: AdminNotesTimelineStore;
  setNotesTimeline: React.Dispatch<
    React.SetStateAction<AdminNotesTimelineStore>
  >;
  scheduled: AdminScheduledNotif[];
  exitPipeline: ExitDeal[];
  supportThread: string;
  setSupportThread: (id: string) => void;
  detailAccount: AdminAccountExt | null;
  detailTab: DetailTabId;
  detailOpen: boolean;
  openDetail: (id: string) => void;
  closeDetail: () => void;
  setDetailTab: (tab: DetailTabId) => void;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  isDark: boolean;
  toggleTheme: () => void;
  toast: string | null;
  toastType: ToastType;
  showToast: (msg: string, type?: ToastType) => void;
  confirm: ConfirmState | null;
  setConfirm: (c: ConfirmState | null) => void;
  inputModal: InputModalState | null;
  setInputModal: (m: InputModalState | null) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  searchOpen: boolean;
  setSearchOpen: (o: boolean) => void;
  pendingTier: number | null;
  setPendingTier: (t: number | null) => void;
  addAuditLog: (
    user: string,
    action: string,
    detail: string,
    level?: AdminLogEntry["level"]
  ) => void;
  suspendAccount: (id: string) => void;
  createAccount: (vals: Record<string, string>) => void;
  sendSupportMessage: (msg: string) => void;
  monthly: typeof ADM_MONTHLY;
  tiers: typeof ADM_TIERS;
  aiMessages: { role: "user" | "assistant"; content: string }[];
  setAiMessages: React.Dispatch<
    React.SetStateAction<{ role: "user" | "assistant"; content: string }[]>
  >;
  aiLoading: boolean;
  setAiLoading: (v: boolean) => void;
  setAccounts: React.Dispatch<React.SetStateAction<AdminAccountExt[]>>;
  setFeatureFlags: React.Dispatch<React.SetStateAction<FeatureFlag[]>>;
  setCallLogs: React.Dispatch<React.SetStateAction<AdminCallLogsStore>>;
  setTags: React.Dispatch<React.SetStateAction<AdminTagsStore>>;
  setScheduled: React.Dispatch<React.SetStateAction<AdminScheduledNotif[]>>;
  setExitPipeline: React.Dispatch<React.SetStateAction<ExitDeal[]>>;
  showDealerExit?: boolean;
  onExitAdmin?: () => void;
  onLogout?: () => void;
  notifHistory: typeof ADM_NOTIF_HISTORY;
}

const AdminContext = createContext<AdminContextValue | null>(null);

function cloneAccounts(): AdminAccountExt[] {
  return SEED_ACCOUNTS.map((a) => ({ ...a }));
}

function cloneFlags(): FeatureFlag[] {
  return SEED_FEATURE_FLAGS.map((f) => ({
    ...f,
    accounts: { ...f.accounts },
  }));
}

export function AdminProvider({
  children,
  showDealerExit,
  onExitAdmin,
  onLogout,
}: {
  children: ReactNode;
  showDealerExit?: boolean;
  onExitAdmin?: () => void;
  onLogout?: () => void;
}) {
  const [page, setPageState] = useState<AdminPageId>("overview");
  const [accounts, setAccounts] = useState<AdminAccountExt[]>(cloneAccounts);
  const [threads, setThreads] = useState<AdminThreadsStore>({
    ...SEED_THREADS,
  });
  const [logs, setLogs] = useState<AdminLogEntry[]>([...SEED_LOGS]);
  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>(cloneFlags);
  const [callLogs, setCallLogs] =
    useState<AdminCallLogsStore>(INITIAL_CALL_LOGS);
  const [tags, setTags] = useState<AdminTagsStore>({ ...SEED_TAGS });
  const [notesTimeline, setNotesTimeline] = useState<AdminNotesTimelineStore>({
    ...SEED_NOTES_TIMELINE,
  });
  const [scheduled, setScheduled] = useState([...SEED_SCHEDULED]);
  const [exitPipeline, setExitPipeline] = useState<ExitDeal[]>([]);
  const [supportThread, setSupportThread] = useState("A005");
  const [detailAccount, setDetailAccount] = useState<AdminAccountExt | null>(
    null
  );
  const [detailTab, setDetailTab] = useState<DetailTabId>("overview");
  const [detailOpen, setDetailOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [toastType, setToastType] = useState<ToastType>("info");
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);
  const [inputModal, setInputModal] = useState<InputModalState | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [pendingTier, setPendingTier] = useState<number | null>(null);
  const [aiMessages, setAiMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([...INITIAL_AI_MESSAGES]);
  const [aiLoading, setAiLoading] = useState(false);

  const showToast = useCallback((msg: string, type: ToastType = "info") => {
    setToast(msg);
    setToastType(type);
    window.setTimeout(() => setToast(null), 2600);
  }, []);

  const addAuditLog = useCallback(
    (
      user: string,
      action: string,
      detail: string,
      level: AdminLogEntry["level"] = "admin"
    ) => {
      const t = new Date().toLocaleTimeString("en-CA", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setLogs((prev) => [{ t, user, action, detail, level }, ...prev]);
    },
    []
  );

  const setPage = useCallback((p: AdminPageId) => {
    setPageState(p);
    setDetailOpen(false);
    setDetailAccount(null);
    setSidebarOpen(false);
  }, []);

  const openDetail = useCallback(
    (id: string) => {
      const a = accounts.find((x) => x.id === id);
      if (!a) return;
      setDetailAccount(a);
      setDetailTab("overview");
      setDetailOpen(true);
      addAuditLog("sarah.admin", "ACCOUNT_VIEW", `Viewed ${a.id} — ${a.name}`);
    },
    [accounts, addAuditLog]
  );

  const closeDetail = useCallback(() => {
    setDetailOpen(false);
    setDetailAccount(null);
    setPendingTier(null);
  }, []);

  useEffect(() => {
    if (!detailAccount) return;
    const updated = accounts.find((x) => x.id === detailAccount.id);
    if (updated) setDetailAccount(updated);
  }, [accounts, detailAccount?.id]);

  const suspendAccount = useCallback(
    (id: string) => {
      const a = accounts.find((x) => x.id === id);
      if (!a) return;
      setConfirm({
        title: `Suspend ${a.name}?`,
        body: "The dealer will lose access immediately. You can reinstate at any time.",
        confirmLabel: "Suspend Account",
        confirmStyle: "background:#EF4444;color:white",
        onConfirm: () => {
          setAccounts((prev) =>
            prev.map((x) =>
              x.id === id ? { ...x, status: "Suspended" } : x
            )
          );
          showToast(`${a.name} suspended`, "warn");
          addAuditLog(
            "sarah.admin",
            "SUSPEND",
            `Suspended account ${a.id} — ${a.name}`
          );
          setConfirm(null);
        },
      });
    },
    [accounts, addAuditLog, showToast]
  );

  const createAccount = useCallback(
    (vals: Record<string, string>) => {
      if (!vals.name || vals.name.trim().length < 2) {
        showToast("Business name is required", "error");
        return;
      }
      if (!vals.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(vals.email)) {
        showToast("A valid email address is required", "error");
        return;
      }
      if (accounts.find((a) => a.email === vals.email)) {
        showToast("An account with that email already exists", "error");
        return;
      }
      const newId = "A00" + (accounts.length + 1);
      const plan = vals.plan || "Trial";
      const row: AdminAccountExt = {
        id: newId,
        alias: "Dealer " + String.fromCharCode(65 + accounts.length),
        name: vals.name,
        email: vals.email,
        phone: vals.phone || "",
        city: vals.city || "",
        stage: "Yellow",
        contact: vals.name.split(" ")[0] || "Owner",
        type: "Residential",
        mrr: plan === "Pro" ? 550 : 0,
        status: "Active",
        lastLogin: "Never",
        cr: 0,
        rev: 0,
        mc: 0,
        inst: 0,
        joined: new Date().toLocaleDateString("en-CA", {
          month: "short",
          year: "numeric",
        }),
        plan,
        tfa: false,
        sessions: 0,
        billingDay: 1,
        credits: 0,
        notes: "New account",
      };
      setAccounts((prev) => [...prev, row]);
      showToast(`Account created: ${vals.name}`, "success");
      addAuditLog(
        "sarah.admin",
        "ACCOUNT_CREATE",
        `Created account ${newId} — ${vals.name}`
      );
    },
    [accounts, addAuditLog, showToast]
  );

  const sendSupportMessage = useCallback(
    (msg: string) => {
      if (!supportThread || !msg.trim()) return;
      setThreads((prev) => {
        const list = [...(prev[supportThread] || [])];
        list.push({ from: "us", msg: msg.trim(), t: "Now" });
        return { ...prev, [supportThread]: list };
      });
      addAuditLog(
        "sarah.admin",
        "SUPPORT_MSG",
        `Replied to ${supportThread}: "${msg.slice(0, 40)}..."`
      );
    },
    [supportThread, addAuditLog]
  );

  const value = useMemo<AdminContextValue>(
    () => ({
      page,
      setPage,
      accounts,
      threads,
      invoices: SEED_INVOICES,
      logs,
      featureFlags,
      callLogs,
      tags,
      notesTimeline,
      setNotesTimeline,
      scheduled,
      exitPipeline,
      supportThread,
      setSupportThread,
      detailAccount,
      detailTab,
      detailOpen,
      openDetail,
      closeDetail,
      setDetailTab,
      sidebarOpen,
      toggleSidebar: () => setSidebarOpen((o) => !o),
      closeSidebar: () => setSidebarOpen(false),
      isDark,
      toggleTheme: () => {
        setIsDark((d) => !d);
        showToast(isDark ? "Light mode" : "Dark mode");
      },
      toast,
      toastType,
      showToast,
      confirm,
      setConfirm,
      inputModal,
      setInputModal,
      searchQuery,
      setSearchQuery,
      searchOpen,
      setSearchOpen,
      pendingTier,
      setPendingTier,
      addAuditLog,
      suspendAccount,
      createAccount,
      sendSupportMessage,
      monthly: ADM_MONTHLY,
      tiers: ADM_TIERS,
      aiMessages,
      setAiMessages,
      aiLoading,
      setAiLoading,
      setAccounts,
      setFeatureFlags,
      setCallLogs,
      setTags,
      setScheduled,
      setExitPipeline,
      showDealerExit,
      onExitAdmin,
      onLogout,
      notifHistory: ADM_NOTIF_HISTORY,
    }),
    [
      page,
      setPage,
      accounts,
      threads,
      logs,
      featureFlags,
      callLogs,
      tags,
      notesTimeline,
      scheduled,
      exitPipeline,
      supportThread,
      detailAccount,
      detailTab,
      detailOpen,
      openDetail,
      closeDetail,
      sidebarOpen,
      isDark,
      toast,
      toastType,
      showToast,
      confirm,
      inputModal,
      searchQuery,
      searchOpen,
      pendingTier,
      addAuditLog,
      suspendAccount,
      createAccount,
      sendSupportMessage,
      aiMessages,
      aiLoading,
    ]
  );

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}
