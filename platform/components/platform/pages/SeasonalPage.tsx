"use client";

import { useMemo, useState } from "react";
import { MARKETING_INPUTS } from "@/lib/platform/data/admin";
import type { KpiPeriod } from "@/lib/platform/data/kpi";

type ChannelId =
  | "tv"
  | "billboard"
  | "email"
  | "digital"
  | "social"
  | "community";

interface Campaign {
  action: string;
  by: string;
  conf: string;
  why: string;
  tag: string;
  week?: string;
}

interface PlanChannel {
  ch: ChannelId;
  priority: number;
  campaigns: Campaign[];
}

interface ChannelDef {
  id: ChannelId;
  icon: string;
  label: string;
  col: string;
  lo: string;
}

interface SportNote {
  league: string;
  note: string;
}

function weekDate(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

function buildSportsNow(mo: number): SportNote[] {
  const sportsNow: SportNote[] = [];
  if (mo >= 0 && mo <= 3)
    sportsNow.push({
      league: "NHL",
      note: "Playoffs start Apr · massive BC viewership",
    });
  if (mo >= 0 && mo <= 5)
    sportsNow.push({
      league: "NBA",
      note: "Finals in Jun · highest sports ad rates",
    });
  if (mo >= 3 && mo <= 9)
    sportsNow.push({
      league: "MLB",
      note: "Regular season Apr–Oct · local Rogers Sportsnet",
    });
  if (mo >= 6 && mo <= 10)
    sportsNow.push({
      league: "CFL",
      note: "Season Jun–Nov · BC Lions on TSN/ESPN+",
    });
  if (mo >= 8 && mo <= 12 || mo === 0)
    sportsNow.push({
      league: "NFL",
      note: "Regular + playoffs Sep–Feb · Sunday ratings peak",
    });
  if (mo >= 9 && mo <= 12 || mo <= 1)
    sportsNow.push({
      league: "CHL/WHL",
      note: "Junior hockey Oct–May · high community engagement",
    });
  if (sportsNow.length === 0)
    sportsNow.push({
      league: "Pre-Season",
      note: "Off-season: locked-in audience for news adjacency",
    });
  return sportsNow;
}

function buildPlanChannels(
  sportsNow: SportNote[],
  demandMsg: string
): PlanChannel[] {
  return [
    {
      ch: "tv",
      priority: 1,
      campaigns: [
        {
          action: sportsNow[0]
            ? `${sportsNow[0].league} · 15-sec spots on Sportsnet/TSN`
            : "Sports season · 15-sec spots on Sportsnet/TSN",
          by: "Jun 5",
          conf: "High",
          why: sportsNow[0]
            ? `${sportsNow[0].note} · ${demandMsg} demand peaks simultaneously`
            : "Sports adjacency delivers highest household reach for HVAC brand awareness",
          tag: "Brand reach",
        },
        {
          action: "News adjacency · CTV/Global morning drive + 6PM block",
          by: "Jun 8",
          conf: "High",
          why: "Morning news viewers skew 35–65 homeowner demo · same audience booking HVAC · CleanBC rebate angle resonates in news context",
          tag: "Homeowner reach",
        },
        {
          action:
            sportsNow.length > 1
              ? `${sportsNow[1].league} co-sponsorship spot`
              : "Late-night news · 11PM book on local stations",
          by: "Jun 20",
          conf: "Med",
          why:
            sportsNow.length > 1
              ? `${sportsNow[1].note} · dual-sport schedule maximises weekly GRPs`
              : "Late news audience planning major home decisions · heat pump consideration timing",
          tag: sportsNow.length > 1 ? "Sports brand" : "News reach",
        },
      ],
    },
    {
      ch: "billboard",
      priority: 2,
      campaigns: [
        {
          action: "2 × arterial boards near major service corridors · 4-week run",
          by: "Jun 10",
          conf: "High",
          why: "Commuter frequency builds brand recall with 8–12 exposures/week per driver · summer construction increases arterial traffic",
          tag: "Community brand",
        },
        {
          action:
            'Mall/transit poster · CleanBC rebate message · "Up to $11K back"',
          by: "Jun 15",
          conf: "High",
          why: "Shopper mindset = planning mode · rebate creative resonates at point of purchase decision · transit riders are homeowners in your service zone",
          tag: "Rebate capture",
        },
        {
          action: "Neighbourhood wraps near new-build permit clusters",
          by: "Jun 22",
          conf: "Med",
          why: "Permit data shows +18% new construction in catchment · early brand presence before competitor install",
          tag: "New home capture",
        },
      ],
    },
    {
      ch: "email",
      priority: 3,
      campaigns: [
        {
          action: 'CleanBC rebate window · "Act before Aug 31" · past customer list',
          by: "Jun 5",
          conf: "High",
          why: "Past customers converting to rebate-eligible heat pump = highest-ROI lead. 340+ contacts. 28–35% open rate expected.",
          tag: "Re-engage",
        },
        {
          action: "Summer tune-up offer · service agreement upsell",
          by: "Jun 12",
          conf: "High",
          why: "Annual tune-up email drives 18–24% booking rate. Position before July heat peak. Upsell maintenance agreements to customers without one.",
          tag: "Revenue",
        },
        {
          action: "Post-install follow-up sequence · 30/60/90 day",
          by: "Jun 18",
          conf: "High",
          why: "Automated 3-email sequence drives referrals and 5-star reviews. Each referral worth ~$4,200 in install revenue on average.",
          tag: "Referrals",
        },
        {
          action: '"Beat the fall rush" · early booking offer · Sept send',
          by: "Aug 25",
          conf: "Med",
          why: "Early fall bookings prevent September backlog. Customers who book in Aug–Sep avoid emergency service premiums and get priority scheduling.",
          tag: "Demand shift",
        },
      ],
    },
    {
      ch: "digital",
      priority: 4,
      campaigns: [
        {
          action: "Google Ads · heat pump + rebate keywords · increase spend Jun–Aug",
          by: "Jun 10",
          conf: "High",
          why: 'Search volume for "heat pump rebate BC" +44% YoY in Jun–Aug. First-page position drives 62% of lead volume.',
          tag: "Lead gen",
        },
        {
          action: "Google Display · in-market homeowner audience · retargeting",
          by: "Jun 15",
          conf: "Med",
          why: "Site visitors who see retargeting ads convert 70% more often. In-market homeowner audience aligns with the rebate window.",
          tag: "Retargeting",
        },
        {
          action: "YouTube pre-roll · 6-sec rebate hook · local geo",
          by: "Jun 20",
          conf: "Med",
          why: 'Unskippable 6-sec format builds brand recall. "CleanBC rebate" creative with local geo outperforms generic HVAC ads.',
          tag: "Awareness",
        },
      ],
    },
    {
      ch: "social",
      priority: 5,
      campaigns: [
        {
          week: "Week 1",
          action: "Is your AC ready for summer? · Pre-season checklist post",
          by: weekDate(0),
          conf: "High",
          why: "Early June weather warming trend · homeowners start thinking about cooling · positions you as the proactive expert before the heat hits",
          tag: "Education",
        },
        {
          week: "Week 2",
          action: "CleanBC rebate explained in 60 seconds · Reel or carousel",
          by: weekDate(7),
          conf: "High",
          why: "Rebate window open · educational content gets 3× share rate vs promotional · carousel format shows stacked rebate amounts",
          tag: "Rebate",
        },
        {
          week: "Week 3",
          action: "Before/after · recent heat pump install in the neighbourhood",
          by: weekDate(14),
          conf: "High",
          why: "Social proof drives bookings more than any ad · neighbourhood geo-tag builds local recognition · photo content highest organic reach",
          tag: "Social proof",
        },
        {
          week: "Week 4",
          action: '"First heat wave forecast" · emergency AC check reminder',
          by: weekDate(21),
          conf: "High",
          why: "Jul 8–12 heat event projected · reactive weather content gets 4–10× normal engagement · drives same-week booking enquiries",
          tag: "Weather reactive",
        },
        {
          week: "Week 5",
          action: "5 signs your furnace won't make it through winter · educational post",
          by: weekDate(28),
          conf: "Med",
          why: "Mid-summer is when homeowners plan fall purchases · furnace content seeds early fall demand · positions you for the shoulder season",
          tag: "Education",
        },
        {
          week: "Week 6",
          action: 'Customer testimonial · "Halved my hydro bill" · heat pump story',
          by: weekDate(35),
          conf: "Med",
          why: "Energy cost anxiety peaks in summer · bill savings story directly addresses objection · video testimonials outperform all other formats",
          tag: "Social proof",
        },
        {
          week: "Week 7",
          action: 'Wildfire smoke + IAQ · "Is your home air safe?" filter reminder',
          by: weekDate(42),
          conf: "Med",
          why: "Smoke season arrives late Jul · IAQ filter demand +24% · timely safety content drives urgent service calls and filter upgrades",
          tag: "Weather reactive",
        },
        {
          week: "Week 8",
          action: '"Beat the fall rush" · book your furnace tune-up now',
          by: weekDate(49),
          conf: "Med",
          why: "August posts seeding fall demand reduce the September booking crunch · early bookers refer 2× more than last-minute customers",
          tag: "Demand shift",
        },
      ],
    },
    {
      ch: "community",
      priority: 6,
      campaigns: [
        {
          action: "Community sponsorship · local sports team / arena naming rights",
          by: "Jun 25",
          conf: "Med",
          why: "Arena/field signage reaches high-income homeowner families 400–800 times per week. Builds long-term brand trust in catchment that no ad buy replicates.",
          tag: "Brand trust",
        },
        {
          action: "Home show / community fair booth · rebate education table",
          by: "Jul 10",
          conf: "Med",
          why: "Summer home shows attract active renovation planners. Face-to-face rebate consultation converts at 3× the rate of digital.",
          tag: "In-person",
        },
        {
          action: "Neighbourhood door-hanger · high-permit postal codes",
          by: "Jun 20",
          conf: "Med",
          why: "Permit data shows +18% new builds in catchment. Physical touchpoint builds local brand density before competitor entry.",
          tag: "Hyper-local",
        },
      ],
    },
  ];
}

const MN = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const ACTUAL = [
  1050, 1060, 1080, 1120, 1076, null, null, null, null, null, null, null,
];
const FORECAST = [
  1020, 1080, 1050, 1100, 1040, 1180, 1400, 1320, 1200, 1080, 1020, 1060,
];
const FORE_LO = [
  980, 1040, 1010, 1060, 1000, 1100, 1280, 1230, 1110, 990, 940, 970,
];
const FORE_HI = [
  1060, 1120, 1090, 1140, 1080, 1260, 1520, 1410, 1290, 1170, 1100, 1150,
];
const GRANT = [0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0];
const WEATHER = [1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1];
const C = {
  greenDark: "#003D2B",
  green: "#00694A",
  greenHi: "#00B478",
  blue: "#1A4DB0",
  amber: "#D97706",
};

export interface SeasonalPageProps {
  kpi?: KpiPeriod;
  activeChannel?: ChannelId;
  onChannelChange?: (id: ChannelId) => void;
  onNavigate: (pageId: string) => void;
  onExportPdf?: () => void;
  dark?: boolean;
}

export function SeasonalPage({
  activeChannel: controlledChannel,
  onChannelChange,
  onNavigate,
  onExportPdf,
  dark = false,
}: SeasonalPageProps) {
  const [internalChannel, setInternalChannel] = useState<ChannelId>("tv");
  const [inputsOpen, setInputsOpen] = useState(false);

  const activeChannel = controlledChannel ?? internalChannel;
  const setChannel = (id: ChannelId) => {
    onChannelChange?.(id);
    if (!controlledChannel) setInternalChannel(id);
  };

  const mo = new Date().getMonth();
  const now = mo;
  const MI = MARKETING_INPUTS;

  const c = dark
    ? {
        bg: "#000000",
        card: "#1C1C1E",
        card2: "#2C2C2E",
        t1: "rgba(255,255,255,0.92)",
        t2: "rgba(235,235,245,0.6)",
        t3: "rgba(235,235,245,0.35)",
        sep: "rgba(255,255,255,0.09)",
        blue: "#0A84FF",
        green: "#30D158",
        amber: "#FF9F0A",
        blueLo: "rgba(10,132,255,0.14)",
        greenLo: "rgba(48,209,88,0.12)",
        amberLo: "rgba(255,159,10,0.12)",
      }
    : {
        bg: "#F2F2F7",
        card: "#FFFFFF",
        card2: "rgba(0,0,0,0.03)",
        t1: "rgba(0,0,0,1)",
        t2: "rgba(60,60,67,0.6)",
        t3: "rgba(60,60,67,0.35)",
        sep: "rgba(0,0,0,0.06)",
        blue: "#0088FF",
        green: "#00694A",
        amber: "#D97706",
        blueLo: "rgba(0,136,255,0.07)",
        greenLo: "rgba(0,105,74,0.07)",
        amberLo: "rgba(217,119,6,0.08)",
      };

  const purple = dark ? "#BF5AF2" : "#8944AB";
  const purpleLo = dark ? "rgba(191,90,242,0.14)" : "rgba(137,68,171,0.09)";
  const red = dark ? "#FF453A" : "#C1121F";
  const redLo = dark ? "rgba(255,69,58,0.14)" : "rgba(193,18,31,0.09)";
  const teal = dark ? "#5AC8FA" : "#0E7490";
  const tealLo = dark ? "rgba(90,200,250,0.14)" : "rgba(14,116,144,0.09)";

  const hero = {
    headline: "+34% Heat Pump Demand",
    period: "July 2026",
    confidence: 89,
    drivers: [
      { label: "CleanBC Rebate window", value: "+22%", col: c.green },
      { label: "Heat forecast (+2.1°F)", value: "+8%", col: c.amber },
      { label: "Peer stocking trend", value: "+4%", col: c.blue },
    ],
  };

  const channels: ChannelDef[] = [
    { id: "tv", icon: "📺", label: "TV — Sports & News", col: purple, lo: purpleLo },
    { id: "billboard", icon: "🏙️", label: "Billboard", col: red, lo: redLo },
    { id: "email", icon: "📧", label: "Email Campaigns", col: c.blue, lo: c.blueLo },
    { id: "digital", icon: "🖥️", label: "Digital & Search", col: c.green, lo: c.greenLo },
    { id: "social", icon: "📱", label: "Social Media", col: c.amber, lo: c.amberLo },
    { id: "community", icon: "🤝", label: "Community & Local", col: teal, lo: tealLo },
  ];

  const sportsNow = useMemo(() => buildSportsNow(mo), [mo]);
  const demandCtx = mo >= 5 && mo <= 8 ? "cooling" : mo >= 9 || mo <= 2 ? "heating" : "shoulder";
  const demandMsg =
    demandCtx === "cooling"
      ? "AC + heat pump cooling"
      : demandCtx === "heating"
        ? "furnace + heat pump heating"
        : "heat pump + spring tune-up";

  const planChannels = useMemo(
    () => buildPlanChannels(sportsNow, demandMsg),
    [sportsNow, demandMsg]
  );
  const totalCampaigns = planChannels.reduce(
    (s, ch) => s + ch.campaigns.length,
    0
  );

  const allV = ACTUAL.filter((v): v is number => v != null).concat(FORECAST);
  const mx = Math.max(...allV);
  const mn2 = Math.min(...allV);
  const H = 90;
  const sc = (v: number) =>
    Math.round(((v - mn2) / (mx - mn2 || 1)) * (H - 12) + 8);

  const topWeather = MI.weather[0];
  const topCoop = [...MI.coop].sort(
    (a, b) =>
      new Date(`2026 ${a.expires}`).getTime() -
      new Date(`2026 ${b.expires}`).getTime()
  )[0];

  const signals = [
    {
      icon: "☀️",
      label: topWeather.impact,
      detail: topWeather.window,
      col: c.amber,
      lo: c.amberLo,
    },
    {
      icon: "💰",
      label: `${topCoop.name.split(" ").slice(0, 2).join(" ")} co-op`,
      detail: `${topCoop.available} expires ${topCoop.expires}`,
      col: c.green,
      lo: c.greenLo,
    },
    {
      icon: "🏛️",
      label: "CleanBC rebate active",
      detail: "$3K–$11K per customer",
      col: c.blue,
      lo: c.blueLo,
    },
  ];

  const coopTotal = MI.coop.reduce(
    (s, c2) => s + parseInt(c2.available.replace(/[^0-9]/g, ""), 10),
    0
  );

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          marginBottom: "16px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "22px",
              fontWeight: 700,
              color: c.t1,
              letterSpacing: "-.03em",
              margin: "0 0 2px",
            }}
          >
            Seasonal Planner
          </h1>
          <div style={{ fontSize: "13px", color: c.t2 }}>
            ML demand forecast + 90-day marketing plan
          </div>
        </div>
        <button
          type="button"
          onClick={() => onExportPdf?.()}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "9px 14px",
            borderRadius: "10px",
            border: `1px solid ${c.sep}`,
            background: c.card,
            color: c.t1,
            fontSize: "12px",
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="12" y1="18" x2="12" y2="12" />
            <polyline points="9 15 12 12 15 15" />
          </svg>
          Export PDF
        </button>
      </div>

      <div
        style={{
          position: "relative",
          background:
            "linear-gradient(135deg,#003D2B 0%,#00694A 55%,#00B478 130%)",
          borderRadius: "20px",
          padding: "22px 24px",
          marginBottom: "10px",
          overflow: "hidden",
          boxShadow: "0 8px 28px rgba(0,90,60,0.18)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 70% 80% at 100% 0%,rgba(0,180,120,0.28),transparent 60%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "1px",
            background:
              "linear-gradient(90deg,transparent,rgba(0,180,120,0.7),transparent)",
          }}
        />
        <div style={{ position: "relative" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              marginBottom: "10px",
            }}
          >
            <span
              style={{
                width: "5px",
                height: "5px",
                borderRadius: "50%",
                background: "#00B478",
                display: "inline-block",
                boxShadow: "0 0 10px rgba(0,180,120,0.9)",
              }}
            />
            <span
              style={{
                fontSize: "10px",
                fontWeight: 700,
                color: "rgba(255,255,255,0.7)",
                textTransform: "uppercase",
                letterSpacing: ".16em",
              }}
            >
              Top Forecast · {hero.period}
            </span>
          </div>
          <div
            style={{
              fontSize: "30px",
              fontWeight: 800,
              color: "white",
              letterSpacing: "-.05em",
              lineHeight: 1.05,
              marginBottom: "6px",
            }}
          >
            {hero.headline}
          </div>
          <div
            style={{
              fontSize: "12px",
              color: "rgba(255,255,255,0.65)",
              marginBottom: "14px",
            }}
          >
            <span style={{ color: "#00FFA8", fontWeight: 700 }}>
              {hero.confidence}% confidence
            </span>{" "}
            · driven by:
          </div>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {hero.drivers.map((d) => (
              <div
                key={d.label}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  padding: "4px 10px",
                  background: "rgba(255,255,255,0.10)",
                  border: "1px solid rgba(255,255,255,0.16)",
                  borderRadius: "20px",
                  fontSize: "11px",
                  color: "white",
                }}
              >
                <span style={{ fontWeight: 700 }}>{d.value}</span>
                <span style={{ color: "rgba(255,255,255,0.7)" }}>
                  {d.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        className="sp-signal-strip"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: "8px",
          marginBottom: "10px",
        }}
      >
        {signals.map((s) => (
          <div
            key={s.label}
            style={{
              background: c.card,
              borderRadius: "12px",
              padding: "12px 14px",
              display: "flex",
              alignItems: "flex-start",
              gap: "8px",
              boxShadow: "0 1px 0 rgba(0,0,0,0.04)",
            }}
          >
            <span
              style={{ fontSize: "16px", lineHeight: 1.2, flexShrink: 0 }}
            >
              {s.icon}
            </span>
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  color: s.col,
                  letterSpacing: "-.01em",
                  lineHeight: 1.3,
                  marginBottom: "2px",
                }}
              >
                {s.label}
              </div>
              <div
                style={{
                  fontSize: "10px",
                  color: c.t2,
                  lineHeight: 1.4,
                }}
              >
                {s.detail}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div
        id="order-plan"
        style={{
          background: c.card,
          borderRadius: "16px",
          overflow: "hidden",
          marginBottom: "10px",
          boxShadow:
            "0 1px 0 rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            padding: "15px 18px",
            borderBottom: `0.5px solid ${c.sep}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "14px",
                fontWeight: 700,
                color: c.t1,
                letterSpacing: "-.02em",
              }}
            >
              90-Day Marketing Plan
            </div>
            <div
              style={{
                fontSize: "11px",
                color: c.t2,
                marginTop: "1px",
              }}
            >
              ML-recommended across 6 channels · {totalCampaigns} actions
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              flexWrap: "wrap",
            }}
          >
            {sportsNow.slice(0, 2).map((s) => (
              <div
                key={s.league}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  padding: "3px 8px",
                  background: purpleLo,
                  borderRadius: "8px",
                }}
              >
                <span style={{ fontSize: "9px" }}>📺</span>
                <span
                  style={{
                    fontSize: "9px",
                    fontWeight: 700,
                    color: purple,
                  }}
                >
                  {s.league}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div
          id="sp-ch-tabs"
          style={{
            display: "flex",
            overflowX: "auto",
            borderBottom: `0.5px solid ${c.sep}`,
            background: c.card2,
            scrollbarWidth: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {channels.map((ch, i) => {
            const isActive = activeChannel === ch.id;
            return (
              <button
                key={ch.id}
                id={`sp-chtab-${ch.id}`}
                type="button"
                onClick={() => setChannel(ch.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  padding: "9px 10px",
                  border: "none",
                  background: isActive ? ch.lo : "transparent",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  whiteSpace: "nowrap",
                  borderBottom: `2.5px solid ${isActive ? ch.col : "transparent"}`,
                  transition: "all .15s",
                  flexShrink: 0,
                }}
              >
                <span style={{ fontSize: "14px", lineHeight: 1 }}>
                  {ch.icon}
                </span>
                <span
                  className="sp-tab-lbl"
                  style={{
                    fontSize: "11px",
                    fontWeight: isActive ? 700 : 600,
                    color: isActive ? ch.col : c.t2,
                    letterSpacing: "-.01em",
                  }}
                >
                  {ch.label}
                </span>
                <span
                  style={{
                    fontSize: "9px",
                    fontWeight: 700,
                    color: isActive ? ch.col : c.t3,
                    background: isActive ? ch.lo : "transparent",
                    padding: "1px 5px",
                    borderRadius: "5px",
                    minWidth: "16px",
                    textAlign: "center",
                  }}
                >
                  {planChannels[i].campaigns.length}
                </span>
              </button>
            );
          })}
        </div>

        {planChannels.map((ch, ci) => {
          const cdef = channels[ci];
          return (
            <div
              key={ch.ch}
              id={`sp-chpanel-${cdef.id}`}
              style={{
                display: activeChannel === cdef.id ? "block" : "none",
              }}
            >
              {ch.campaigns.map((r, i) => (
                <div
                  key={`${ch.ch}-${i}`}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "14px",
                    padding: "14px 18px",
                    borderBottom:
                      i < ch.campaigns.length - 1
                        ? `0.5px solid ${c.sep}`
                        : "none",
                  }}
                >
                  <div
                    style={{
                      flexShrink: 0,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "4px",
                      paddingTop: "1px",
                    }}
                  >
                    <div
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "8px",
                        background: cdef.lo,
                        border: `1px solid ${cdef.col}30`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: 800,
                          color: cdef.col,
                        }}
                      >
                        {r.week || i + 1}
                      </span>
                    </div>
                    {r.tag ? (
                      <span
                        style={{
                          fontSize: "8px",
                          fontWeight: 700,
                          color: cdef.col,
                          background: cdef.lo,
                          padding: "1px 4px",
                          borderRadius: "4px",
                          letterSpacing: ".03em",
                          textAlign: "center",
                          maxWidth: "44px",
                          lineHeight: 1.3,
                          textTransform: "uppercase",
                        }}
                      >
                        {r.tag}
                      </span>
                    ) : null}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: 700,
                        color: c.t1,
                        marginBottom: "4px",
                        letterSpacing: "-.01em",
                        lineHeight: 1.4,
                      }}
                    >
                      {r.action}
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: c.t2,
                        lineHeight: 1.55,
                      }}
                    >
                      {r.why}
                    </div>
                  </div>
                  <div
                    style={{
                      flexShrink: 0,
                      textAlign: "right",
                      minWidth: "52px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        color: c.t1,
                        marginBottom: "3px",
                      }}
                    >
                      → {r.by}
                    </div>
                    <span
                      style={{
                        fontSize: "8px",
                        fontWeight: 800,
                        color: cdef.col,
                        background: cdef.lo,
                        padding: "1px 5px",
                        borderRadius: "4px",
                        textTransform: "uppercase",
                        letterSpacing: ".04em",
                      }}
                    >
                      {r.conf}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          );
        })}

        <div
          style={{
            padding: "11px 18px",
            background: c.card2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: `0.5px solid ${c.sep}`,
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          <div style={{ fontSize: "10px", color: c.t2 }}>
            Recommendations calibrated to your trailing 12-month performance
            and active co-op windows
          </div>
          <button
            type="button"
            onClick={() => onNavigate("messages")}
            style={{
              padding: "8px 16px",
              borderRadius: "9px",
              background: c.blue,
              color: "white",
              border: "none",
              fontSize: "12px",
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
              letterSpacing: "-.01em",
            }}
          >
            Schedule campaigns
          </button>
        </div>
      </div>

      <div
        style={{
          background: c.card,
          borderRadius: "16px",
          overflow: "hidden",
          marginBottom: "10px",
          boxShadow:
            "0 1px 0 rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            padding: "14px 18px 10px",
            borderBottom: `0.5px solid ${c.sep}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: c.t1,
                letterSpacing: "-.02em",
              }}
            >
              12-Month Demand Forecast
            </div>
            <div
              style={{
                fontSize: "10px",
                color: c.t2,
                marginTop: "1px",
              }}
            >
              Actual (Jan–May) + ML forecast (Jun–Dec)
            </div>
          </div>
          <div
            style={{
              display: "flex",
              gap: "12px",
              fontSize: "10px",
              fontWeight: 600,
              color: c.t2,
              flexWrap: "wrap",
            }}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
              <span
                style={{
                  width: "9px",
                  height: "9px",
                  borderRadius: "2px",
                  background: "linear-gradient(135deg,#003D2B,#00694A)",
                  display: "inline-block",
                }}
              />
              Actual
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
              <span
                style={{
                  width: "9px",
                  height: "9px",
                  borderRadius: "2px",
                  background:
                    "repeating-linear-gradient(135deg,rgba(26,77,176,0.2) 0,rgba(26,77,176,0.2) 3px,transparent 3px,transparent 6px)",
                  border: "1px dashed #1A4DB0",
                  display: "inline-block",
                }}
              />
              Forecast
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
              <span
                style={{
                  width: "12px",
                  height: "2px",
                  background: `linear-gradient(90deg,transparent,${C.amber},transparent)`,
                  display: "inline-block",
                  borderRadius: "2px",
                }}
              />
              Rebate
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "3px" }}>
              <span style={{ fontSize: "10px" }}>⚡</span>
              Weather
            </span>
          </div>
        </div>
        <div style={{ padding: "14px 18px 10px" }}>
          <div
            style={{
              display: "flex",
              gap: 0,
              height: `${H + 16}px`,
              position: "relative",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                width: "36px",
                flexShrink: 0,
                paddingBottom: "12px",
                paddingTop: "4px",
              }}
            >
              {[mx, Math.round((mx + mn2) / 2), mn2].map((v) => (
                <div
                  key={v}
                  style={{
                    fontSize: "8px",
                    color: c.t3,
                    textAlign: "right",
                    paddingRight: "6px",
                  }}
                >
                  ${v}K
                </div>
              ))}
            </div>
            <div style={{ flex: 1, position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  top: "4px",
                  bottom: "12px",
                  left: 0,
                  right: 0,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  pointerEvents: "none",
                }}
              >
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    style={{
                      height: "0.5px",
                      background: c.sep,
                      width: "100%",
                    }}
                  />
                ))}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  gap: "3px",
                  height: "100%",
                  paddingBottom: "12px",
                }}
              >
                {MN.map((m, i) => {
                  const isPast = i <= now;
                  const v = isPast ? ACTUAL[i] : FORECAST[i];
                  if (!v) return <div key={m} style={{ flex: 1 }} />;
                  const h = sc(v);
                  const isCur = i === now;
                  const barBg = isPast
                    ? isCur
                      ? "linear-gradient(180deg,#00B478,#00694A)"
                      : "linear-gradient(180deg,#00694A,#003D2B)"
                    : "repeating-linear-gradient(135deg,rgba(26,77,176,0.18) 0px,rgba(26,77,176,0.18) 4px,rgba(26,77,176,0.06) 4px,rgba(26,77,176,0.06) 8px)";
                  const lblCol = isPast
                    ? isCur
                      ? "#00B478"
                      : "#00694A"
                    : "#1A4DB0";
                  return (
                    <div
                      key={m}
                      style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        position: "relative",
                        height: "100%",
                      }}
                    >
                      {!isPast ? (
                        <div
                          style={{
                            position: "absolute",
                            left: "50%",
                            transform: "translateX(-50%)",
                            bottom: `${sc(FORE_LO[i])}px`,
                            height: `${sc(FORE_HI[i]) - sc(FORE_LO[i])}px`,
                            width: "1.5px",
                            background: C.blue,
                            opacity: 0.4,
                          }}
                        />
                      ) : null}
                      {WEATHER[i] ? (
                        <div
                          style={{
                            position: "absolute",
                            top: "-2px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            fontSize: "9px",
                          }}
                        >
                          ⚡
                        </div>
                      ) : null}
                      <div
                        style={{
                          fontSize: "7px",
                          fontWeight: 700,
                          color: lblCol,
                          marginBottom: "1px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        ${v}K
                      </div>
                      <div
                        style={{
                          width: "75%",
                          height: `${h}px`,
                          background: barBg,
                          borderRadius: "3px 3px 0 0",
                          position: "relative",
                          ...(!isPast ? { border: `1px dashed ${C.blue}` } : {}),
                        }}
                      >
                        {GRANT[i] ? (
                          <div
                            style={{
                              position: "absolute",
                              bottom: "-6px",
                              left: 0,
                              right: 0,
                              height: "2px",
                              background: `linear-gradient(90deg,transparent,${C.amber},transparent)`,
                              borderRadius: "2px",
                            }}
                          />
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              gap: "3px",
              paddingLeft: "36px",
              marginTop: "4px",
            }}
          >
            {MN.map((m, i) => (
              <div
                key={m}
                style={{
                  flex: 1,
                  textAlign: "center",
                  fontSize: "8px",
                  fontWeight: i === now ? 700 : 400,
                  color:
                    i === now ? "#00B478" : i < now ? c.t2 : c.t3,
                }}
              >
                {m}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        style={{
          background: c.card,
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 1px 0 rgba(0,0,0,0.04)",
        }}
      >
        <button
          type="button"
          className="sp-toggle"
          onClick={() => setInputsOpen((o) => !o)}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 18px",
            border: "none",
            background: "transparent",
            cursor: "pointer",
            fontFamily: "inherit",
            textAlign: "left",
            height: "auto",
            boxShadow: "none",
            borderRadius: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: c.t1,
                letterSpacing: "-.01em",
              }}
            >
              Planning Inputs
            </span>
            <span style={{ fontSize: "10px", color: c.t2 }}>
              Weather · Co-op · Rebates
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{ fontSize: "10px", fontWeight: 600, color: c.blue }}
            >
              View all data
            </span>
            <svg
              className="sp-chev"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke={c.t3}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                transition: "transform .2s",
                flexShrink: 0,
                transform: inputsOpen ? "rotate(90deg)" : "rotate(0deg)",
              }}
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        </button>
        {inputsOpen ? (
          <div
            id="sp-inputs"
            style={{ borderTop: `0.5px solid ${c.sep}` }}
          >
            <div
              style={{
                padding: "10px 18px",
                background: c.amberLo,
                display: "flex",
                alignItems: "center",
                gap: "8px",
                borderBottom: `0.5px solid ${c.sep}`,
              }}
            >
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: c.amber,
                  textTransform: "uppercase",
                  letterSpacing: ".08em",
                }}
              >
                ☀️ Weather Forecast
              </span>
              <span style={{ fontSize: "10px", color: c.t3 }}>
                Next 90 days · Env. Canada + NOAA
              </span>
            </div>
            {MI.weather.map((w) => (
              <div
                key={w.label}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto auto",
                  gap: "12px",
                  alignItems: "center",
                  padding: "11px 18px",
                  borderBottom: `0.5px solid ${c.sep}`,
                }}
              >
                <div
                  style={{
                    fontSize: "12px",
                    color: c.t1,
                    fontWeight: 500,
                  }}
                >
                  {w.label}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    color: w.hot ? c.amber : c.blue,
                    whiteSpace: "nowrap",
                  }}
                >
                  {w.impact}
                </div>
                <div
                  style={{
                    fontSize: "10px",
                    color: c.t2,
                    background: c.card2,
                    padding: "2px 8px",
                    borderRadius: "6px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {w.window}
                </div>
              </div>
            ))}

            <div
              style={{
                padding: "10px 18px",
                background: c.greenLo,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: `0.5px solid ${c.sep}`,
              }}
            >
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: c.green,
                  textTransform: "uppercase",
                  letterSpacing: ".08em",
                }}
              >
                💰 Co-op Funds
              </span>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 800,
                  color: c.green,
                }}
              >
                ${coopTotal.toLocaleString()} available
              </span>
            </div>
            {MI.coop.map((co) => (
              <div
                key={co.name}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto auto",
                  gap: "12px",
                  alignItems: "center",
                  padding: "11px 18px",
                  borderBottom: `0.5px solid ${c.sep}`,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: c.t1,
                    }}
                  >
                    {co.name}
                  </div>
                  <div style={{ fontSize: "10px", color: c.t2 }}>
                    {co.used} used · {co.match} match
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: 800,
                      color: c.green,
                    }}
                  >
                    {co.available}
                  </div>
                  <div
                    style={{
                      fontSize: "9px",
                      color: c.t3,
                      textTransform: "uppercase",
                    }}
                  >
                    available
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "10px", color: c.t2 }}>Expires</div>
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      color: c.t1,
                    }}
                  >
                    {co.expires}
                  </div>
                </div>
              </div>
            ))}

            <div
              style={{
                padding: "10px 18px",
                background: c.blueLo,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: `0.5px solid ${c.sep}`,
              }}
            >
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: c.blue,
                  textTransform: "uppercase",
                  letterSpacing: ".08em",
                }}
              >
                🏛️ Utility Rebates
              </span>
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  color: c.blue,
                }}
              >
                {MI.utility.length} active programs
              </span>
            </div>
            {MI.utility.map((u, i) => (
              <div
                key={u.program}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto auto",
                  gap: "12px",
                  alignItems: "center",
                  padding: "11px 18px",
                  borderBottom:
                    i < MI.utility.length - 1
                      ? `0.5px solid ${c.sep}`
                      : "none",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: c.t1,
                    }}
                  >
                    {u.program}
                  </div>
                  <div style={{ fontSize: "10px", color: c.t2 }}>
                    {u.notes}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    color: c.blue,
                    background: c.blueLo,
                    padding: "2px 8px",
                    borderRadius: "6px",
                    textTransform: "uppercase",
                    letterSpacing: ".04em",
                  }}
                >
                  {u.audience}
                </div>
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: 800,
                      color: c.t1,
                    }}
                  >
                    {u.amount}
                  </div>
                  <div
                    style={{
                      fontSize: "9px",
                      color: c.t3,
                      textTransform: "uppercase",
                    }}
                  >
                    incentive
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </>
  );
}

export default SeasonalPage;
