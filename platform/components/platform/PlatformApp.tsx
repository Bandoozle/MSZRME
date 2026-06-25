"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { usePlatform } from "@/context/PlatformContext";
import { AdminApp } from "@/components/platform/admin/AdminApp";
import { AppShell } from "@/components/platform/AppShell";
import { LoginScreen, V2Badge } from "@/components/platform/LoginScreen";
import { LegalModal } from "@/components/platform/LegalModal";
import { NotificationList } from "@/components/platform/overlays/NotificationList";
import { SearchResults } from "@/components/platform/overlays/SearchResults";
import {
  StageListBody,
  stageModalHeader,
} from "@/components/platform/overlays/StageListBody";
import { CalculatorPage } from "@/components/platform/pages/CalculatorPage";
import { DashboardPage } from "@/components/platform/pages/DashboardPage";
import { EnterpriseValuePage } from "@/components/platform/pages/EnterpriseValuePage";
import { FinancialsPage } from "@/components/platform/pages/FinancialsPage";
import { GoalsPage } from "@/components/platform/pages/GoalsPage";
import { LogNumbersPage } from "@/components/platform/pages/LogNumbersPage";
import { MarketPage, type MarketSortKey } from "@/components/platform/pages/MarketPage";
import { MessagesPage } from "@/components/platform/pages/MessagesPage";
import { NotesPage } from "@/components/platform/pages/NotesPage";
import { ReportsPage } from "@/components/platform/pages/ReportsPage";
import { SalesTeamPage } from "@/components/platform/pages/SalesTeamPage";
import { SeasonalPage } from "@/components/platform/pages/SeasonalPage";
import { SettingsPage } from "@/components/platform/pages/SettingsPage";
import { PEERS, THREADS, type ThreadsStore } from "@/lib/platform/data/kpi";
import type { DealerPageId, StageId } from "@/lib/platform/data/nav";
import {
  buildNotifications,
  type PlatformNotification,
} from "@/lib/platform/utils/notifications";
import { computeStageInfo, computeStageProgress } from "@/lib/platform/utils/stage";

type AppView = "dealer" | "admin";

export function PlatformApp() {
  const router = useRouter();
  const ctx = usePlatform();
  const {
    user,
    dark,
    page,
    period,
    kpi,
    insight,
    toast,
    notifOpen,
    searchOpen,
    menuOpen,
    stageModalOpen,
    sidebarOpen,
    fromWebsite,
    signedUp,
    initialEmail,
    login,
    logout,
    goTo,
    setPeriod,
    toggleTheme,
    toggleNotifs,
    openSearch,
    closeSearch,
    openMenuSheet,
    closeMenuSheet,
    openStageModal,
    closeStageModal,
    closeSidebar,
    showToast,
  } = ctx;

  const [loginError, setLoginError] = useState("");
  const [appView, setAppView] = useState<AppView>("dealer");
  const [searchQuery, setSearchQuery] = useState("");
  const [mSort, setMSort] = useState<MarketSortKey>("rev");
  const [activeMsgContact, setActiveMsgContact] = useState("TJ");
  const [threads, setThreads] = useState<ThreadsStore>(() => ({ ...THREADS }));
  const [notifications, setNotifications] = useState<PlatformNotification[]>([]);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.pathname === "/admin" && user?.role === "admin") {
      setAppView("admin");
    }
  }, [user?.role]);

  const stageId = (user?.stage ?? "green") as StageId;
  const yearKpi = kpi.Year;
  const stageInfo = useMemo(
    () => computeStageInfo(stageId, yearKpi.tsr || 0),
    [stageId, yearKpi.tsr]
  );
  const stageProgress = useMemo(
    () => computeStageProgress(stageId, yearKpi),
    [stageId, yearKpi]
  );
  const stageModal = stageModalHeader(stageId);

  useEffect(() => {
    setNotifications(buildNotifications(period, kpi[period], stageId));
  }, [period, kpi, stageId]);

  const handleLogin = useCallback(
    (email: string, password: string) => {
      const ok = login(email, password);
      if (!ok) {
        setLoginError("Invalid email or password.");
        return;
      }
      setLoginError("");
      const key = email.trim().toLowerCase();
      if (key === "admin@mszrme.com") {
        setAppView("admin");
        router.replace("/admin");
      } else {
        setAppView("dealer");
      }
    },
    [login, router]
  );

  const handleLogout = useCallback(() => {
    logout();
    setAppView("dealer");
  }, [logout]);

  const markNotifRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllNotifsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const sendMessage = useCallback((contactInit: string, text: string) => {
    const now = new Date();
    const t = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    setThreads((prev) => ({
      ...prev,
      [contactInit]: [
        ...(prev[contactInit] ?? []),
        { from: "me" as const, text, t },
      ],
    }));
  }, []);

  const userProfile = user
    ? {
        name: user.name,
        biz: user.biz,
        initials: user.initials,
        email: user.email,
      }
    : {
        name: "John Smith",
        biz: "North Vancouver HVAC",
        initials: "JS",
      };

  const coach = { initials: "TJ", name: "Tom", status: "Online" };

  function renderPage() {
    const periodKpi = kpi[period];
    switch (page) {
      case "dashboard":
        return (
          <DashboardPage
            period={period}
            onPeriodChange={setPeriod}
            onNavigate={(id) => goTo(id as DealerPageId)}
            kpi={periodKpi}
          />
        );
      case "goals":
        return (
          <GoalsPage
            period={period}
            kpi={kpi}
            goTo={goTo}
            showToast={showToast}
          />
        );
      case "financials":
        return (
          <FinancialsPage
            period={period}
            kpi={kpi}
            goTo={goTo}
            showToast={showToast}
          />
        );
      case "lognumbers":
        return (
          <LogNumbersPage
            period={period}
            kpi={kpi}
            goTo={goTo}
            showToast={showToast}
            tier={user?.tier}
          />
        );
      case "market":
        return (
          <MarketPage
            sort={mSort}
            onSortChange={setMSort}
            userInitials={userProfile.initials}
            dark={dark}
          />
        );
      case "messages":
        return (
          <MessagesPage
            activeContact={activeMsgContact}
            onActiveContactChange={setActiveMsgContact}
            threads={threads}
            onSendMessage={sendMessage}
          />
        );
      case "seasonal":
        return (
          <SeasonalPage
            kpi={periodKpi}
            onNavigate={(id) => goTo(id as DealerPageId)}
            dark={dark}
          />
        );
      case "reports":
        return (
          <ReportsPage
            kpi={periodKpi}
            peers={PEERS}
            currentTier={user?.tier as 1 | 2 | 3 | 4 | undefined}
            bizName={userProfile.biz}
          />
        );
      case "calculator":
        return <CalculatorPage onToast={showToast} />;
      case "notes":
        return (
          <NotesPage
            isFirstTime={user?.role === "new"}
            onToast={showToast}
          />
        );
      case "settings":
        return (
          <SettingsPage
            user={userProfile}
            stageId={stageId}
            currentTier={(user?.tier ?? 1) as 1 | 2 | 3 | 4}
            onLogout={handleLogout}
            onToast={showToast}
            onShowStageModal={openStageModal}
          />
        );
      case "salesteam":
        return <SalesTeamPage onToast={showToast} />;
      case "ev":
        return <EnterpriseValuePage />;
      default:
        return (
          <DashboardPage
            period={period}
            onPeriodChange={setPeriod}
            onNavigate={(id) => goTo(id as DealerPageId)}
            kpi={periodKpi}
          />
        );
    }
  }

  if (!user) {
    return (
      <>
        <LoginScreen
          onLogin={handleLogin}
          error={loginError}
          fromWebsite={fromWebsite}
          initialEmail={initialEmail}
          signedUp={signedUp}
        />
        <V2Badge />
        {toast ? <div className="toast">{toast}</div> : null}
      </>
    );
  }

  if (appView === "admin" || user.role === "admin") {
    return (
      <div id="admin-app">
        <AdminApp
          showDealerExit={user.role === "dealer"}
          onExitAdmin={() => {
            setAppView("dealer");
            goTo("dashboard");
          }}
          onLogout={handleLogout}
        />
        {toast ? <div className="toast">{toast}</div> : null}
      </div>
    );
  }

  return (
    <>
      <AppShell
        activePage={page}
        onNavigate={goTo}
        user={userProfile}
        stage={stageInfo}
        stageId={stageId}
        tier={user.tier}
        coach={coach}
        aiInsight={insight}
        stageProgress={stageProgress}
        searchQuery={searchQuery}
        onSearchFocus={openSearch}
        onSearchChange={setSearchQuery}
        onToggleNotifs={toggleNotifs}
        notifsOpen={notifOpen}
        notifList={
          <NotificationList
            notifications={notifications}
            onMarkAllRead={markAllNotifsRead}
            onClose={toggleNotifs}
            onNavigate={goTo}
            onMarkRead={markNotifRead}
          />
        }
        onToggleTheme={toggleTheme}
        sidebarOpen={sidebarOpen}
        onCloseSidebar={closeSidebar}
        menuSheetOpen={menuOpen}
        onOpenMenuSheet={openMenuSheet}
        onCloseMenuSheet={closeMenuSheet}
        onShowStageModal={openStageModal}
        stageModalOpen={stageModalOpen}
        onCloseStageModal={closeStageModal}
        stageModalLabel={stageModal.label}
        stageModalRev={stageModal.rev}
        stageModalDotColor={stageModal.dotColor}
        stageListBody={<StageListBody currentStage={stageId} />}
        searchOverlayOpen={searchOpen}
        onCloseSearch={closeSearch}
        onSearchOverlayInput={setSearchQuery}
        searchResults={
          <SearchResults
            query={searchQuery}
            onSelect={(p) => {
              closeSearch();
              goTo(p);
            }}
          />
        }
        onPrivacy={() => setPrivacyOpen(true)}
        onTerms={() => setTermsOpen(true)}
        onSupport={() => showToast("Support: support@mszrme.com")}
        messageBadge={3}
      >
        {renderPage()}
      </AppShell>

      <LegalModal
        open={termsOpen}
        title="Terms of Service"
        subtitle="VERSION 1.0 · EFFECTIVE MAY 17, 2026 · MSZRME SOCIAL INC."
        onClose={() => setTermsOpen(false)}
      >
        <p>
          These Terms of Service govern your access to and use of the MSZRME
          platform, coaching programme, and all related services. By creating an
          account or using MSZRME in any way, you agree to these terms in full.
        </p>
        <p>
          <b>Your account.</b> You must be at least 18 years old and responsible
          for everything that happens under your account. Keep your credentials
          secure.
        </p>
        <p>
          <b>What you&apos;re subscribing to.</b> MSZRME offers subscription
          plans at different tiers. Features depend on your tier. Subscriptions
          renew automatically unless cancelled.
        </p>
        <p>
          <b>Coaching services.</b> Coaching is not professional advice and does
          not create a fiduciary, accountant-client, or lawyer-client
          relationship.
        </p>
        <p>
          <b>Limitation of liability.</b> MSZRME&apos;s total liability is
          capped at subscription fees paid in the three months before the claim.
        </p>
        <p>
          MSZRME Social Inc. · legal@mszrme.com · Greater Vancouver Regional
          District, British Columbia, Canada
        </p>
        <p style={{ textAlign: "right", paddingTop: "8px" }}>
          <button
            type="button"
            onClick={() => setTermsOpen(false)}
            style={{
              fontSize: "11px",
              padding: "5px 14px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              background: "#f5f5f5",
              cursor: "pointer",
              fontFamily: "Georgia, serif",
            }}
          >
            Close
          </button>
        </p>
      </LegalModal>

      <LegalModal
        open={privacyOpen}
        title="Privacy Policy, Terms of Data Use & Advisory Disclaimer"
        subtitle="VERSION 4.0 · EFFECTIVE MAY 17, 2026 · MSZRME SOCIAL INC."
        onClose={() => setPrivacyOpen(false)}
      >
        <p>
          MSZRME Social Inc. operates the MSZRME platform. This policy explains
          what data we collect, how we use it, and your rights.
        </p>
        <p>
          <b>What you give us directly.</b> Account details, business
          information, and every financial and operational figure you enter into
          the platform — revenue, margins, leads, goals, notes, and coaching
          session content.
        </p>
        <p>
          <b>Platform recommendations are not professional advice.</b> All KPIs,
          benchmarks, scores, and AI outputs are for general informational
          purposes only.
        </p>
        <p>
          Contact: privacy@mszrme.com · MSZRME Social Inc., British Columbia,
          Canada.
        </p>
        <p style={{ textAlign: "right", paddingTop: "8px" }}>
          <button
            type="button"
            onClick={() => setPrivacyOpen(false)}
            style={{
              fontSize: "11px",
              padding: "5px 14px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              background: "#f5f5f5",
              cursor: "pointer",
              fontFamily: "Georgia, serif",
            }}
          >
            Close
          </button>
        </p>
      </LegalModal>

      {toast ? <div className="toast">{toast}</div> : null}
    </>
  );
}
