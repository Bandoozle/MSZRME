// Ported from mszrme-dealer-runtime.js — generateReport() HTML export.

import type { KpiPeriod } from "../data/kpi";
import type { Peer } from "../data/kpi";
import { TIER_DEFS, type TierId } from "../data/nav";
import { REPORT_TITLES } from "../data/reports";

export interface ReportContext {
  kpi: KpiPeriod;
  peers: Peer[];
  currentTier: TierId;
  bizName?: string;
}

function youRank(peers: Peer[]): number {
  return (
    [...peers]
      .sort((a, b) => b.rev - a.rev)
      .findIndex((p) => p.you) + 1
  );
}

function avgRev(peers: Peer[]): number {
  return Math.round(peers.reduce((s, p) => s + p.rev, 0) / peers.length);
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function buildReportBodyHtml(idx: number, ctx: ReportContext): string {
  const d = ctx.kpi;
  const gm = d.gm ?? 43;
  const svc = d.svc ?? d.sales;
  const rank = youRank(ctx.peers);
  const avg = avgRev(ctx.peers);
  const tier = TIER_DEFS[ctx.currentTier];
  const biz = ctx.bizName ?? "North Van HVAC Solutions";

  const kpiRows = [
    ["Total Revenue", "$" + Math.round((d.tsr + d.svr) / 1000) + "K"],
    ["Install Revenue", "$" + Math.round(d.tsr / 1000) + "K"],
    ["Service Revenue", "$" + Math.round(d.svr / 1000) + "K"],
    ["Gross Margin", gm + "%"],
    ["Closing Ratio", d.cr + "%"],
    ["Maintenance Agreements", String(d.mc)],
    ["Contracts Completed", String(svc)],
    ["Avg Ticket", "$" + d.ast],
  ];

  switch (idx) {
    case 0:
      return (
        `<h2 style="color:#003D2B">Monthly KPI Summary</h2>` +
        `<p style="color:#7A9A7A">${escapeHtml(biz)} · May 2026</p>` +
        `<hr style="border:none;border-top:1px solid #EEF0EE;margin:16px 0">` +
        `<table style="width:100%;border-collapse:collapse">` +
        kpiRows
          .map(
            (r) =>
              `<tr style="border-bottom:1px solid #EEF0EE"><td style="padding:10px;font-weight:600;color:#0A160A">${r[0]}</td><td style="padding:10px;text-align:right;font-weight:800;color:#003D2B">${r[1]}</td></tr>`
          )
          .join("") +
        `</table>`
      );
    case 1:
      return (
        `<h2 style="color:#003D2B">Market Position Report</h2>` +
        `<p style="color:#7A9A7A">BC HVAC Market · May 2026</p>` +
        `<hr style="border:none;border-top:1px solid #EEF0EE;margin:16px 0">` +
        `<p><strong>Market Rank:</strong> #${rank} of ${ctx.peers.length} dealers in British Columbia</p>` +
        `<p><strong>Revenue:</strong> $452K — 16% above market average of $${Math.round(avg / 1000)}K</p>` +
        `<p><strong>Growth Rate:</strong> +14.8% — highest in peer group</p>` +
        ctx.peers
          .slice(0, 5)
          .map(
            (p, i) =>
              `<div style="padding:8px 0;border-bottom:1px solid #EEF0EE"><strong>${i + 1}. ${escapeHtml(p.biz)}</strong> — $${Math.round(p.rev / 1000)}K · ${p.growth}% growth</div>`
          )
          .join("")
      );
    case 2:
      return (
        `<h2 style="color:#003D2B">Gross Margin Analysis</h2>` +
        `<p style="color:#7A9A7A">Q2 2026</p>` +
        `<hr style="border:none;border-top:1px solid #EEF0EE;margin:16px 0">` +
        `<p><strong>Overall GM:</strong> ${gm}% — Target 45%</p>` +
        `<p><strong>Equipment markup:</strong> Avg 42%</p>` +
        `<p><strong>Labour margin:</strong> Avg 58%</p>` +
        `<p><strong>Maintenance agreements:</strong> ${d.mc} active</p>` +
        `<div style="background:#F0F8F0;padding:12px;border-radius:8px;margin-top:16px"><strong>Recommendation:</strong> A 2% GM improvement on current volume adds ~$18K annually.</div>`
      );
    case 3:
      return (
        `<h2 style="color:#003D2B">Coaching Progress Report</h2>` +
        `<p style="color:#7A9A7A">YTD 2026 · Tier ${ctx.currentTier} — ${escapeHtml(tier.name)}</p>` +
        `<hr style="border:none;border-top:1px solid #EEF0EE;margin:16px 0">` +
        `<p><strong>Coaching cadence:</strong> ${escapeHtml(tier.calls)}</p>` +
        `<p><strong>Milestones completed:</strong> 2/4 toward Tier 2</p>` +
        `<ul>` +
        tier.milestones
          .map(
            (m, i) =>
              `<li style="margin:6px 0">${i < 2 ? "✅" : "⬜"} ${escapeHtml(m)}</li>`
          )
          .join("") +
        `</ul>`
      );
    default:
      return "";
  }
}

export function openReport(idx: number, ctx: ReportContext): boolean {
  const title = REPORT_TITLES[idx];
  const body = buildReportBodyHtml(idx, ctx);
  const dateStr = new Date().toLocaleDateString("en-CA", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const reportHTML =
    `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${escapeHtml(title)}</title>` +
    `<style>body{font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text","SF Pro","Inter",sans-serif;max-width:800px;margin:40px auto;padding:0 20px;color:#0A160A}hr{border:none;border-top:1px solid #EEF0EE;margin:20px 0}table{width:100%}@media print{body{margin:20px}}</style>` +
    `</head><body>` +
    `<div style="display:flex;align-items:center;gap:12px;margin-bottom:24px;padding-bottom:16px;border-bottom:2px solid #003D2B">` +
    `<div style="background:linear-gradient(135deg,#003D2B,#00694A);border-radius:8px;width:36px;height:36px;display:flex;align-items:center;justify-content:center;color:white;font-weight:900;font-size:14px">M</div>` +
    `<div><div style="font-weight:800;color:#003D2B;font-size:16px">MSZRME Social</div><div style="font-size:12px;color:#7A9A7A">Generated ${dateStr}</div></div>` +
    `<button onclick="window.print()" style="margin-left:auto;padding:8px 16px;background:#003D2B;color:white;border:none;border-radius:8px;cursor:pointer;font-family:inherit;font-weight:600">Print / Save PDF</button>` +
    `</div>` +
    body +
    `</body></html>`;

  const win = window.open("", "_blank");
  if (win && !win.closed) {
    win.document.write(reportHTML);
    win.document.close();
    return true;
  }
  return false;
}
