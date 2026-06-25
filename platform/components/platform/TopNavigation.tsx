"use client";

import type { DealerPageId } from "@/lib/platform/data/nav";

const TAB_PAGES: { id: DealerPageId; title: string }[] = [
  { id: "dashboard", title: "Dashboard" },
  { id: "financials", title: "Financials" },
  { id: "market", title: "Market Pulse" },
  { id: "lognumbers", title: "Log Numbers" },
  { id: "messages", title: "Messages" },
];

function TabIcon({ pageId }: { pageId: DealerPageId }) {
  switch (pageId) {
    case "dashboard":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 22 22"
          width="22"
          height="22"
        >
          <g transform="translate(-0.707,18.318) scale(0.010136,-0.010136)">
            <path
              d="M278 692C303 692 324 706 342 721L1129 1382C1137 1389 1147 1392 1155 1392C1163 1392 1172 1389 1180 1382L1968 721C1986 706 2007 692 2032 692C2081 692 2110 727 2110 764C2110 784 2101 806 2082 822L1255 1516C1223 1542 1189 1555 1155 1555C1121 1555 1086 1542 1055 1516L228 822C209 806 200 784 200 764C200 727 229 692 278 692ZM1656 1143 1872 961V1323C1872 1361 1847 1385 1809 1385H1719C1682 1385 1656 1361 1656 1323ZM623 -111H1686C1803 -111 1872 -44 1872 70V940L1727 1036V107C1727 60 1701 33 1656 33H654C609 33 582 60 582 107V1036L438 940V70C438 -44 507 -111 623 -111Z"
              fill="currentColor"
            />
          </g>
        </svg>
      );
    case "financials":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 22 22"
          width="22"
          height="22"
        >
          <g transform="translate(4.152,19.060) scale(0.011171,-0.011171)">
            <path
              d="M622 21C881 21 1110 157 1110 416V417C1110 628 966 734 709 796L560 832C387 874 326 948 326 1046V1047C326 1157 428 1266 622 1266C786 1266 905 1179 921 1036L922 1027H1096L1095 1042C1080 1269 880 1422 622 1422C353 1422 152 1271 152 1038V1037C152 839 286 728 535 668L684 632C881 584 936 515 936 406V405C936 278 850 177 624 177C404 177 314 283 292 412L290 424H116L117 410C134 167 356 21 622 21ZM558 -145H678V1588H558Z"
              fill="currentColor"
            />
          </g>
        </svg>
      );
    case "market":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 22 22"
          width="22"
          height="22"
        >
          <g transform="translate(-0.705,25.621) scale(0.020251,-0.020251)">
            <path
              d="M181 369H293C347 369 375 396 375 446V777C375 828 347 855 293 855H181C128 855 100 828 100 777V446C100 396 128 369 181 369ZM523 369H633C688 369 715 396 715 446V887C715 938 688 965 633 965H523C468 965 441 938 441 887V446C441 396 468 369 523 369ZM863 369H974C1028 369 1056 396 1056 446V998C1056 1048 1028 1075 974 1075H863C809 1075 781 1048 781 998V446C781 396 809 369 863 369Z"
              fill="currentColor"
            />
          </g>
        </svg>
      );
    case "lognumbers":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 22 22"
          width="22"
          height="22"
        >
          <g transform="translate(-1.070,26.882) scale(0.023901,-0.023901)">
            <path
              d="M174 872C215 872 248 905 248 946C248 987 215 1020 174 1020C134 1020 100 986 100 946C100 906 134 872 174 872ZM174 598C215 598 248 631 248 672C248 713 215 745 174 745C133 745 100 712 100 672C100 631 133 598 174 598ZM174 309C215 309 248 342 248 383C248 424 215 457 174 457C134 457 100 423 100 383C100 343 134 309 174 309ZM396 889H853C884 889 910 915 910 946C910 977 884 1003 853 1003H396C365 1003 339 977 339 946C339 915 365 889 396 889ZM396 615H853C885 615 910 640 910 672C910 703 885 728 853 728H396C364 728 339 703 339 672C339 640 364 615 396 615ZM396 326H853C884 326 910 352 910 383C910 414 885 439 853 439H396C364 439 339 414 339 383C339 352 365 326 396 326Z"
              fill="currentColor"
            />
          </g>
        </svg>
      );
    case "messages":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 22 22"
          width="22"
          height="22"
        >
          <g transform="translate(-0.974,26.323) scale(0.022938,-0.022938)">
            <path
              d="M334 269C351 269 362 277 382 296L520 422H763C881 422 944 487 944 605V885C944 1002 881 1067 763 1067H281C163 1067 100 1002 100 885V605C100 487 163 422 281 422H296V313C296 287 309 269 334 269Z"
              fill="currentColor"
            />
          </g>
        </svg>
      );
    default:
      return null;
  }
}

export interface TopNavigationProps {
  activePage: DealerPageId;
  onNavigate: (page: DealerPageId) => void;
  onSearchFocus?: () => void;
  onSearchChange?: (value: string) => void;
  searchQuery?: string;
  onToggleNotifs?: () => void;
  notifsOpen?: boolean;
  onToggleTheme?: () => void;
  userInitials: string;
  onAvatarClick?: () => void;
}

export function TopNavigation({
  activePage,
  onNavigate,
  onSearchFocus,
  onSearchChange,
  searchQuery = "",
  onToggleNotifs,
  onToggleTheme,
  userInitials,
  onAvatarClick,
}: TopNavigationProps) {
  return (
    <div id="topbar">
      <div className="tb-left">
        <div className="tb-search">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            placeholder="Search"
            id="searchInput"
            value={searchQuery}
            onFocus={onSearchFocus}
            onChange={(e) => onSearchChange?.(e.target.value)}
          />
        </div>
      </div>

      <div
        id="mobile-title"
        style={{
          alignItems: "center",
          justifyContent: "center",
          fontSize: "17px",
          fontWeight: 600,
          color: "var(--label-1)",
          letterSpacing: "-.022em",
        }}
      >
        MSZRME
      </div>

      <div className="tb-center">
        {TAB_PAGES.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`tb-tab${activePage === tab.id ? " active" : ""}`}
            id={`tab-${tab.id}`}
            title={tab.title}
            onClick={() => onNavigate(tab.id)}
          >
            <TabIcon pageId={tab.id} />
          </button>
        ))}
      </div>

      <div className="tb-right">
        <button
          type="button"
          className="ib"
          onClick={onToggleNotifs}
          id="notif-btn"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 15 15"
            width="15"
            height="15"
          >
            <g transform="translate(1.946,11.968) scale(0.006137,-0.006137)">
              <path
                d="M159 304C159 240 209 197 294 197H600C607 44 731 -95 905 -95C1078 -95 1202 44 1210 197H1516C1601 197 1651 240 1651 304C1651 382 1569 454 1500 523C1455 568 1437 661 1435 731C1435 787 1432 839 1428 889C1386 876 1329 869 1286 873C1290 828 1293 778 1293 721C1295 575 1330 498 1377 444C1416 400 1459 360 1476 342V332H334V342C351 360 394 400 433 444C480 498 515 575 517 721C518 1095 627 1201 760 1238C778 1242 787 1252 787 1270C788 1353 834 1408 905 1408C917 1408 929 1407 939 1404C955 1445 977 1484 1005 1517C975 1531 942 1539 905 1539C785 1539 699 1456 670 1356C456 1274 376 1065 374 731C373 661 354 568 310 523C240 454 159 382 159 304ZM739 197H1071C1065 95 998 30 905 30C811 30 745 95 739 197Z"
                fill="currentColor"
              />
            </g>
          </svg>
          <div className="notif-dot" />
        </button>

        <button
          type="button"
          className="ib"
          id="theme-toggle-btn"
          onClick={onToggleTheme}
          title="Toggle light / dark"
        >
          <svg
            id="theme-icon"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
        </button>

        <div className="tb-av" onClick={onAvatarClick ?? (() => onNavigate("settings"))}>
          {userInitials}
        </div>
      </div>
    </div>
  );
}
