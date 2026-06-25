// Ported from mszrme-dealer-runtime.js — values must match exactly.

export type TierId = 1 | 2 | 3 | 4;

export interface TierDef {
  name: string;
  tagline: string;
  price: number;
  priceSuffix: string;
  calls: string;
  color: string;
  gradient: string;
  features: string[];
  locked: string[];
  focus: string;
  milestones: string[];
}

export type TierDefs = Record<TierId, TierDef>;

export type StageId =
  | "white"
  | "yellow"
  | "orange"
  | "red"
  | "green"
  | "purple"
  | "blue"
  | "black";

export interface StageDef {
  id: StageId;
  label: string;
  color: string;
  bg: string;
  border: string;
  rev: string;
  minRev: number;
  maxRev: number;
}

export type DealerPageId =
  | "dashboard"
  | "goals"
  | "lognumbers"
  | "calculator"
  | "financials"
  | "reports"
  | "market"
  | "seasonal"
  | "messages"
  | "ev"
  | "salesteam"
  | "notes"
  | "settings";

export interface NavDef {
  label: string;
  svg: string;
}

export type AllNavDefs = Record<DealerPageId, NavDef>;

export type StageNav = Record<StageId, DealerPageId[]>;

export interface NavLayout {
  primary: DealerPageId[];
  groups: unknown[];
  drawer: DealerPageId[];
}

/** Revenue-based colour stages (source: CLIENT_STAGES). */
export const STAGE_DEFS: StageDef[] = [
  {
    id: "white",
    label: "White",
    color: "#C0C8D0",
    bg: "rgba(192,200,208,0.15)",
    border: "rgba(192,200,208,0.35)",
    rev: "$0 – $250K",
    minRev: 0,
    maxRev: 250000
  },
  {
    id: "yellow",
    label: "Yellow",
    color: "#F5A623",
    bg: "rgba(245,166,35,0.12)",
    border: "rgba(245,166,35,0.35)",
    rev: "$250K – $500K",
    minRev: 250000,
    maxRev: 500000
  },
  {
    id: "orange",
    label: "Orange",
    color: "#E8681A",
    bg: "rgba(232,104,26,0.12)",
    border: "rgba(232,104,26,0.35)",
    rev: "$500K – $1M",
    minRev: 500000,
    maxRev: 1000000
  },
  {
    id: "red",
    label: "Red",
    color: "#C62828",
    bg: "rgba(198,40,40,0.10)",
    border: "rgba(198,40,40,0.32)",
    rev: "$1M – $2.4M",
    minRev: 1000000,
    maxRev: 2400000
  },
  {
    id: "green",
    label: "Green",
    color: "#00B478",
    bg: "rgba(0,180,120,0.12)",
    border: "rgba(0,180,120,0.35)",
    rev: "$2.4M – $5M",
    minRev: 2400000,
    maxRev: 5000000
  },
  {
    id: "purple",
    label: "Purple",
    color: "#7B2FBE",
    bg: "rgba(123,47,190,0.12)",
    border: "rgba(123,47,190,0.35)",
    rev: "$5M – $8M",
    minRev: 5000000,
    maxRev: 8000000
  },
  {
    id: "blue",
    label: "Blue",
    color: "#4A7FD4",
    bg: "rgba(74,127,212,0.12)",
    border: "rgba(74,127,212,0.35)",
    rev: "$8M – $15M",
    minRev: 8000000,
    maxRev: 15000000
  },
  {
    id: "black",
    label: "Black",
    color: "#1F2937",
    bg: "rgba(31,41,55,0.10)",
    border: "rgba(31,41,55,0.32)",
    rev: "$15M+",
    minRev: 15000000,
    maxRev: 99999999
  }
] as const satisfies StageDef[];

export const TIER_DEFS: TierDefs = {
  1: {
    name: "Base",
    tagline: "Get the Numbers Right",
    price: 750,
    priceSuffix: "/mo",
    calls: "Quarterly check-in call",
    color: "#4A6A50",
    gradient: "linear-gradient(145deg,#2D4A32,#4A6A50)",
    features: [
      "Full KPI dashboard",
      "Daily / weekly number logging",
      "GM Calculator",
      "Notes & checklists",
      "Quarterly check-in with your coach"
    ],
    locked: [],
    focus: "Establish the habit of measurement. Build the foundation.",
    milestones: [
      "Daily log streak of 30 days",
      "Closing ratio above 50% for 3 months",
      "GM target hit for the quarter"
    ]
  },
  2: {
    name: "Starter",
    tagline: "Measure, Set, Hit",
    price: 999,
    priceSuffix: "/mo",
    calls: "Monthly coaching call",
    color: "#00694A",
    gradient: "linear-gradient(145deg,#003D2B,#00694A)",
    features: [
      "Everything in Base",
      "Goals & milestone tracking",
      "Full Financials view (P&L, COGS)",
      "Downloadable performance reports",
      "Monthly 1-on-1 coaching call"
    ],
    locked: [],
    focus: "Know your numbers, set targets, hit them month over month.",
    milestones: [
      "Closing ratio above 55% for 3 months",
      "30+ active maintenance agreements",
      "GM target hit 3 consecutive months",
      "Daily log streak of 60 days"
    ]
  },
  3: {
    name: "Growth",
    tagline: "Marketing, Market & Margin",
    price: 1899,
    priceSuffix: "/mo",
    calls: "Biweekly coaching calls",
    color: "#00B478",
    gradient: "linear-gradient(145deg,#00694A,#00B478)",
    features: [
      "Everything in Starter",
      "Market Pulse leaderboard",
      "Seasonal Planner (ML forecast + 90-day marketing plan)",
      "Marketing Inputs (Weather, Co-op, Utility rebates)",
      "Pricing / Price Book module",
      "Biweekly 1-on-1 coaching calls"
    ],
    locked: [],
    focus: "Grow revenue. Dominate your market. Lift gross margin.",
    milestones: [
      "$2M+ annual revenue run rate",
      "Top 3 in market leaderboard",
      "50+ active maintenance agreements",
      "Sustained 45%+ gross margin"
    ]
  },
  4: {
    name: "Scale",
    tagline: "Team, Expansion & Exit Readiness",
    price: 3500,
    priceSuffix: "/mo + success fee at sale",
    calls: "Weekly calls + advisory access",
    color: "#1A4DB0",
    gradient: "linear-gradient(145deg,#003D2B,#1A4DB0)",
    features: [
      "Everything in Growth",
      "Sales Manager Tracker (multi-rep)",
      "Enterprise Value Calculator",
      "Exit Readiness scoring",
      "Business Sale-ready financial package",
      "Hiring & manager coaching",
      "Buyer network & deal advisory",
      "Weekly 1-on-1 coaching calls"
    ],
    locked: [],
    focus: "Build the org. Scale without breaking. Prepare the exit.",
    milestones: [
      "$5M+ revenue",
      "15%+ EBITDA margin",
      "Owner role < 10 hrs/week operational",
      "Business sale-ready financials"
    ]
  }
} as const satisfies TierDefs;

export const STAGE_NAV: StageNav = {
  white: [
    "dashboard",
    "lognumbers",
    "goals",
    "notes",
    "messages",
    "calculator",
    "settings"
  ],
  yellow: [
    "dashboard",
    "lognumbers",
    "financials",
    "goals",
    "reports",
    "notes",
    "messages",
    "calculator",
    "settings"
  ],
  orange: [
    "dashboard",
    "lognumbers",
    "financials",
    "goals",
    "reports",
    "notes",
    "messages",
    "calculator",
    "settings"
  ],
  red: [
    "dashboard",
    "lognumbers",
    "financials",
    "goals",
    "reports",
    "market",
    "notes",
    "messages",
    "calculator",
    "settings"
  ],
  green: [
    "dashboard",
    "lognumbers",
    "financials",
    "goals",
    "seasonal",
    "market",
    "reports",
    "notes",
    "messages",
    "calculator",
    "salesteam",
    "settings"
  ],
  purple: [
    "dashboard",
    "lognumbers",
    "financials",
    "goals",
    "seasonal",
    "market",
    "reports",
    "notes",
    "messages",
    "calculator",
    "salesteam",
    "settings"
  ],
  blue: [
    "dashboard",
    "lognumbers",
    "financials",
    "goals",
    "seasonal",
    "market",
    "reports",
    "notes",
    "messages",
    "calculator",
    "salesteam",
    "ev",
    "settings"
  ],
  black: [
    "dashboard",
    "lognumbers",
    "financials",
    "goals",
    "seasonal",
    "market",
    "reports",
    "notes",
    "messages",
    "calculator",
    "salesteam",
    "ev",
    "settings"
  ]
} as const satisfies StageNav;

export const NAV_LAYOUT: NavLayout = {
  primary: [
    "dashboard",
    "lognumbers",
    "goals",
    "financials",
    "calculator",
    "market",
    "seasonal",
    "reports",
    "messages",
    "notes",
    "settings"
  ],
  groups: [],
  drawer: [
    "salesteam",
    "ev"
  ]
} as const satisfies NavLayout;

export const ALL_NAV_DEFS: AllNavDefs = {
  dashboard: {
    label: "Dashboard",
    svg: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 21 21\" width=\"21\" height=\"21\"><g transform=\"translate(-0.421,17.327) scale(0.009455,-0.009455)\"><path d=\"M278 692C303 692 324 706 342 721L1129 1382C1137 1389 1147 1392 1155 1392C1163 1392 1172 1389 1180 1382L1968 721C1986 706 2007 692 2032 692C2081 692 2110 727 2110 764C2110 784 2101 806 2082 822L1255 1516C1223 1542 1189 1555 1155 1555C1121 1555 1086 1542 1055 1516L228 822C209 806 200 784 200 764C200 727 229 692 278 692ZM1656 1143 1872 961V1323C1872 1361 1847 1385 1809 1385H1719C1682 1385 1656 1361 1656 1323ZM623 -111H1686C1803 -111 1872 -44 1872 70V940L1727 1036V107C1727 60 1701 33 1656 33H654C609 33 582 60 582 107V1036L438 940V70C438 -44 507 -111 623 -111Z\" fill=\"currentColor\"/></g></svg>"
  },
  goals: {
    label: "Goals",
    svg: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 21 21\" width=\"21\" height=\"21\"><g transform=\"translate(-0.964,27.173) scale(0.024340,-0.024340)\"><path d=\"M387 317C356 317 331 330 307 361L121 594C108 611 100 632 100 652C100 692 131 726 172 726C197 726 217 717 239 688L383 495L702 1012C719 1040 742 1053 766 1053C805 1053 842 1027 842 985C842 965 830 944 819 925L462 361C444 332 418 317 387 317Z\" fill=\"currentColor\"/></g></svg>"
  },
  lognumbers: {
    label: "Log Numbers",
    svg: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 21 21\" width=\"21\" height=\"21\"><g transform=\"translate(-0.760,25.316) scale(0.022296,-0.022296)\"><path d=\"M174 872C215 872 248 905 248 946C248 987 215 1020 174 1020C134 1020 100 986 100 946C100 906 134 872 174 872ZM174 598C215 598 248 631 248 672C248 713 215 745 174 745C133 745 100 712 100 672C100 631 133 598 174 598ZM174 309C215 309 248 342 248 383C248 424 215 457 174 457C134 457 100 423 100 383C100 343 134 309 174 309ZM396 889H853C884 889 910 915 910 946C910 977 884 1003 853 1003H396C365 1003 339 977 339 946C339 915 365 889 396 889ZM396 615H853C885 615 910 640 910 672C910 703 885 728 853 728H396C364 728 339 703 339 672C339 640 364 615 396 615ZM396 326H853C884 326 910 352 910 383C910 414 885 439 853 439H396C364 439 339 414 339 383C339 352 365 326 396 326Z\" fill=\"currentColor\"/></g></svg>"
  },
  calculator: {
    label: "GM Calculator",
    svg: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 21 21\" width=\"21\" height=\"21\"><g transform=\"translate(0.141,20.282) scale(0.016722,-0.016722)\"><path d=\"M155 619H1084V781H155ZM540 274H699V1125H540ZM155 45H1084V184H155Z\" fill=\"currentColor\"/></g></svg>"
  },
  financials: {
    label: "Financials",
    svg: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 21 21\" width=\"21\" height=\"21\"><g transform=\"translate(4.112,18.019) scale(0.010421,-0.010421)\"><path d=\"M622 21C881 21 1110 157 1110 416V417C1110 628 966 734 709 796L560 832C387 874 326 948 326 1046V1047C326 1157 428 1266 622 1266C786 1266 905 1179 921 1036L922 1027H1096L1095 1042C1080 1269 880 1422 622 1422C353 1422 152 1271 152 1038V1037C152 839 286 728 535 668L684 632C881 584 936 515 936 406V405C936 278 850 177 624 177C404 177 314 283 292 412L290 424H116L117 410C134 167 356 21 622 21ZM558 -145H678V1588H558Z\" fill=\"currentColor\"/></g></svg>"
  },
  reports: {
    label: "Reports",
    svg: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 21 21\" width=\"21\" height=\"21\"><g transform=\"translate(1.224,18.234) scale(0.010712,-0.010712)\"><path d=\"M200 653C224 656 248 658 272 658C296 658 320 656 344 653V1308C344 1380 383 1421 459 1421H796V976C796 872 849 819 953 819H1387V136C1387 64 1348 23 1273 23H780C768 -28 749 -77 723 -121H1280C1448 -121 1532 -36 1532 134V831C1532 941 1520 989 1451 1060L1036 1484C971 1551 917 1565 821 1565H451C283 1565 200 1480 200 1310ZM930 994V1394L1360 954H970C942 954 930 966 930 994Z\" fill=\"currentColor\"/></g></svg>"
  },
  market: {
    label: "Market Pulse",
    svg: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 21 21\" width=\"21\" height=\"21\"><g transform=\"translate(-0.419,24.139) scale(0.018891,-0.018891)\"><path d=\"M181 369H293C347 369 375 396 375 446V777C375 828 347 855 293 855H181C128 855 100 828 100 777V446C100 396 128 369 181 369ZM523 369H633C688 369 715 396 715 446V887C715 938 688 965 633 965H523C468 965 441 938 441 887V446C441 396 468 369 523 369ZM863 369H974C1028 369 1056 396 1056 446V998C1056 1048 1028 1075 974 1075H863C809 1075 781 1048 781 998V446C781 396 809 369 863 369Z\" fill=\"currentColor\"/></g></svg>"
  },
  seasonal: {
    label: "Seasonal Planner",
    svg: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 21 21\" width=\"21\" height=\"21\"><g transform=\"translate(-0.834,18.804) scale(0.011518,-0.011518)\"><path d=\"M455 -8H1245C1219 37 1200 86 1188 137H441C379 137 344 170 344 235V987C344 1052 379 1085 441 1085H1526C1588 1085 1624 1052 1624 987V766C1648 769 1672 771 1696 771C1720 771 1744 769 1768 766V1198C1768 1366 1684 1450 1513 1450H455C285 1450 200 1366 200 1198V244C200 76 285 -8 455 -8ZM832 802H878C908 802 918 812 918 841V887C918 916 908 926 878 926H832C803 926 793 916 793 887V841C793 812 803 802 832 802ZM1090 802H1136C1165 802 1175 812 1175 841V887C1175 916 1165 926 1136 926H1090C1060 926 1050 916 1050 887V841C1050 812 1060 802 1090 802ZM1347 802H1393C1422 802 1433 812 1433 841V887C1433 916 1422 926 1393 926H1347C1317 926 1307 916 1307 887V841C1307 812 1317 802 1347 802ZM575 549H621C651 549 661 559 661 588V634C661 663 651 673 621 673H575C546 673 535 663 535 634V588C535 559 546 549 575 549ZM832 549H878C908 549 918 559 918 588V634C918 663 908 673 878 673H832C803 673 793 663 793 634V588C793 559 803 549 832 549ZM1090 549H1136C1165 549 1175 559 1175 588V634C1175 663 1165 673 1136 673H1090C1060 673 1050 663 1050 634V588C1050 559 1060 549 1090 549ZM575 296H621C651 296 661 306 661 335V381C661 410 651 420 621 420H575C546 420 535 410 535 381V335C535 306 546 296 575 296ZM832 296H878C908 296 918 306 918 335V381C918 410 908 420 878 420H832C803 420 793 410 793 381V335C793 306 803 296 832 296ZM1090 296H1136C1165 296 1175 306 1175 335V381C1175 410 1165 420 1136 420H1090C1060 420 1050 410 1050 381V335C1050 306 1060 296 1090 296Z\" fill=\"currentColor\"/></g></svg>"
  },
  messages: {
    label: "Messages",
    svg: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 21 21\" width=\"21\" height=\"21\"><g transform=\"translate(-0.670,24.794) scale(0.021398,-0.021398)\"><path d=\"M334 269C351 269 362 277 382 296L520 422H763C881 422 944 487 944 605V885C944 1002 881 1067 763 1067H281C163 1067 100 1002 100 885V605C100 487 163 422 281 422H296V313C296 287 309 269 334 269Z\" fill=\"currentColor\"/></g></svg>"
  },
  ev: {
    label: "Exit Value",
    svg: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 21 21\" width=\"21\" height=\"21\"><g transform=\"translate(4.112,18.019) scale(0.010421,-0.010421)\"><path d=\"M622 21C881 21 1110 157 1110 416V417C1110 628 966 734 709 796L560 832C387 874 326 948 326 1046V1047C326 1157 428 1266 622 1266C786 1266 905 1179 921 1036L922 1027H1096L1095 1042C1080 1269 880 1422 622 1422C353 1422 152 1271 152 1038V1037C152 839 286 728 535 668L684 632C881 584 936 515 936 406V405C936 278 850 177 624 177C404 177 314 283 292 412L290 424H116L117 410C134 167 356 21 622 21ZM558 -145H678V1588H558Z\" fill=\"currentColor\"/></g></svg>"
  },
  salesteam: {
    label: "Sales Team",
    svg: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 21 21\" width=\"21\" height=\"21\"><g transform=\"translate(-0.278,23.743) scale(0.017483,-0.017483)\"><path d=\"M581 416H1047C1112 416 1133 435 1133 468C1133 566 1011 700 815 700C617 700 494 566 494 468C494 435 516 416 581 416ZM815 767C895 767 966 841 966 936C966 1031 895 1099 815 1099C732 1099 662 1028 662 935C662 841 732 767 815 767ZM170 416H447C409 480 461 595 542 655C499 682 446 701 378 701C207 701 100 574 100 471C100 437 119 416 170 416ZM378 759C449 759 511 823 511 906C511 988 449 1048 378 1048C308 1048 245 986 245 905C245 823 308 759 378 759Z\" fill=\"currentColor\"/></g></svg>"
  },
  notes: {
    label: "Notes/Checklists",
    svg: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 21 21\" width=\"21\" height=\"21\"><g transform=\"translate(-0.834,18.804) scale(0.011518,-0.011518)\"><path d=\"M455 -8H1245C1219 37 1200 86 1188 137H441C379 137 344 170 344 235V987C344 1052 379 1085 441 1085H1526C1588 1085 1624 1052 1624 987V766C1648 769 1672 771 1696 771C1720 771 1744 769 1768 766V1198C1768 1366 1684 1450 1513 1450H455C285 1450 200 1366 200 1198V244C200 76 285 -8 455 -8ZM583 790H1386C1417 790 1440 814 1440 845C1440 875 1417 898 1386 898H583C551 898 528 875 528 845C528 814 551 790 583 790ZM583 557H1276C1306 598 1341 634 1381 665H583C551 665 528 641 528 610C528 580 551 557 583 557ZM583 324H1086C1117 324 1140 347 1140 377C1140 408 1117 432 1086 432H583C551 432 528 408 528 377C528 347 551 324 583 324Z\" fill=\"currentColor\"/></g></svg>"
  },
  settings: {
    label: "Settings",
    svg: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 21 21\" width=\"21\" height=\"21\"><g transform=\"translate(-0.502,24.715) scale(0.019716,-0.019716)\"><path d=\"M519 263H598C620 263 636 277 641 298L665 396C682 402 700 409 715 416L801 365C819 353 840 354 855 370L910 424C925 439 928 462 915 481L864 565C871 581 878 598 883 615L982 637C1003 642 1016 659 1016 682V759C1016 780 1003 796 982 801L884 825C878 844 871 861 865 875L917 961C928 979 928 1001 911 1016L855 1071C840 1085 820 1089 802 1078L715 1025C700 1032 683 1039 665 1045L641 1144C636 1165 620 1179 598 1179H519C497 1179 481 1165 475 1144L452 1046C434 1040 416 1033 400 1025L315 1078C297 1089 276 1086 261 1071L205 1016C189 1001 189 979 200 961L252 875C246 861 238 844 232 825L134 801C113 796 100 780 100 759V682C100 659 113 642 134 637L233 615C238 598 245 581 253 565L202 481C189 462 191 439 207 424L261 370C276 354 297 353 316 365L401 416C416 409 434 402 452 396L475 298C481 277 497 263 519 263ZM558 569C474 569 405 638 405 722C405 806 474 875 558 875C643 875 711 806 711 722C711 638 643 569 558 569Z\" fill=\"currentColor\"/></g></svg>"
  }
} as const satisfies AllNavDefs;

/** Returns nav page ids available for a stage and subscription tier. */
export function getAvailableNavItems(stageId: StageId, tier: number): DealerPageId[] {
  const stageItems = [...(STAGE_NAV[stageId] ?? STAGE_NAV.white)];
  const available = stageItems.filter((id) => {
    if (id === "salesteam" || id === "ev") return tier >= 4;
    return true;
  });
  if (tier >= 4 && !available.includes("ev")) {
    available.push("ev");
  }
  return available;
}
