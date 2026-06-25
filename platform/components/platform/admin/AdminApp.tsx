"use client";

import { AdminProvider, useAdmin } from "./AdminContext";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopbar } from "./AdminTopbar";
import { AdminDetailPanel } from "./AdminDetailPanel";
import {
  AdminConfirm,
  AdminInputModal,
  AdminToast,
} from "./components/AdminUi";
import { OverviewPage } from "./pages/OverviewPage";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { AccountsPage } from "./pages/AccountsPage";
import { CommsPage } from "./pages/CommsPage";
import { FinancialsAdminPage } from "./pages/FinancialsAdminPage";
import { ConfigPage } from "./pages/ConfigPage";
import { InputsPage } from "./pages/InputsPage";
import {
  BillingPage,
  InvoicesPage,
  LogsPage,
  SupportPage,
  SystemPage,
} from "./pages/SupportBillingInvoicesSystemLogs";
import type { AdminPageId } from "./types";

export type AdminAppProps = {
  showDealerExit?: boolean;
  onExitAdmin?: () => void;
  onLogout?: () => void;
};

function AdminPageRouter({ page }: { page: AdminPageId }) {
  switch (page) {
    case "overview":
      return <OverviewPage />;
    case "analytics":
      return <AnalyticsPage />;
    case "accounts":
      return <AccountsPage />;
    case "support":
      return <SupportPage />;
    case "comms":
      return <CommsPage />;
    case "billing":
      return <BillingPage />;
    case "financials-admin":
      return <FinancialsAdminPage />;
    case "invoices":
      return <InvoicesPage />;
    case "inputs":
      return <InputsPage />;
    case "config":
      return <ConfigPage />;
    case "system":
      return <SystemPage />;
    case "logs":
      return <LogsPage />;
    default:
      return null;
  }
}

function AdminAppShell() {
  const {
    page,
    detailOpen,
    toast,
    toastType,
    confirm,
    setConfirm,
    inputModal,
    setInputModal,
  } = useAdmin();

  return (
  <>
    <style>{`@keyframes admpulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
    <AdminSidebar />
    <AdminTopbar />
    <AdminDetailPanel />
    <div
      className="adm-main"
      id="adm-main-area"
      style={{ marginRight: detailOpen ? 460 : 0 }}
    >
      <div
        id={`admp-${page}`}
        className="adm-page active"
        style={page === "support" ? { padding: 0 } : undefined}
      >
        <AdminPageRouter page={page} />
      </div>
    </div>
    <AdminToast message={toast} type={toastType} />
    {confirm ? (
      <AdminConfirm
        title={confirm.title}
        body={confirm.body}
        confirmLabel={confirm.confirmLabel}
        confirmStyle={confirm.confirmStyle}
        onConfirm={confirm.onConfirm}
        onCancel={() => setConfirm(null)}
      />
    ) : null}
    {inputModal ? (
      <AdminInputModal
        title={inputModal.title}
        fields={inputModal.fields}
        confirmLabel={inputModal.confirmLabel}
        onConfirm={(vals) => {
          inputModal.onConfirm(vals);
          setInputModal(null);
        }}
        onCancel={() => setInputModal(null)}
      />
    ) : null}
  </>
  );
}

export function AdminApp({
  showDealerExit,
  onExitAdmin,
  onLogout,
}: AdminAppProps) {
  return (
    <AdminProvider
      showDealerExit={showDealerExit}
      onExitAdmin={onExitAdmin}
      onLogout={onLogout}
    >
      <AdminAppRoot />
    </AdminProvider>
  );
}

function AdminAppRoot() {
  const { isDark } = useAdmin();
  return (
    <div id="admin-app" className={!isDark ? "adm-light" : undefined}>
      <AdminAppShell />
    </div>
  );
}
