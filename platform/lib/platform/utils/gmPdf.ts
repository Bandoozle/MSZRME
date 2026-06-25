// Ported from mszrme-dealer-runtime.js — exportGMToPdf().

import type { GmInputs, GmResult } from "./calculator";
import { fmtD } from "./calculator";

export function openGmPdfExport(
  inputs: GmInputs,
  result: GmResult,
  provName: string
): boolean {
  if (result.sell <= 0) return false;

  const costs: [string, number][] = [];
  const costEntries: [string, number][] = [
    ["Equipment", inputs.equipment],
    ["Materials", inputs.materials],
    ["Labour", inputs.labour],
    ["Subcontract", inputs.subcon],
    ["Electrical", inputs.electrical],
    ["Other/Warranty", inputs.other],
  ];
  for (const entry of costEntries) {
    if (entry[1] > 0) costs.push(entry);
  }

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-CA", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const timeStr = now.toLocaleTimeString("en-CA", {
    hour: "numeric",
    minute: "2-digit",
  });

  const rowsHtml = costs
    .map(
      (r) =>
        `<tr><td>${r[0]}</td><td class="r">${fmtD(r[1])}</td></tr>`
    )
    .join("");

  const pdfHtml =
    `<!DOCTYPE html><html><head><meta charset="utf-8"><title>GM Calculator — Pricing Worksheet</title>` +
    `<style>` +
    `body{font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text","SF Pro","Inter",sans-serif;max-width:780px;margin:36px auto;padding:0 26px;color:#0A160A;line-height:1.5}` +
    `h1{font-size:20px;color:#003D2B;margin:0;letter-spacing:-.02em}` +
    `.sub{color:#7A9A7A;font-size:12px;margin-top:3px}` +
    `.hdr{display:flex;align-items:center;gap:14px;padding-bottom:14px;border-bottom:2px solid #003D2B;margin-bottom:20px}` +
    `.logo{background:linear-gradient(135deg,#003D2B,#00694A);border-radius:8px;width:42px;height:42px;display:flex;align-items:center;justify-content:center;color:white;font-weight:900;font-size:16px}` +
    `.print-btn{margin-left:auto;padding:8px 16px;background:#003D2B;color:white;border:none;border-radius:8px;cursor:pointer;font-family:inherit;font-weight:600;font-size:12px}` +
    `table{width:100%;border-collapse:collapse;margin:8px 0 18px;font-size:13px}` +
    `th,td{padding:8px 10px;text-align:left;border-bottom:0.5px solid #EEF0EE}` +
    `th{font-size:9px;text-transform:uppercase;color:#4A6A50;letter-spacing:.06em;font-weight:700}` +
    `.r{text-align:right;font-variant-numeric:tabular-nums}` +
    `.section-title{font-size:9px;text-transform:uppercase;color:#7A9A7A;letter-spacing:.08em;font-weight:700;margin:18px 0 6px}` +
    `.hero{background:linear-gradient(135deg,#003D2B,#00694A 65%,#00B478 130%);color:white;border-radius:12px;padding:18px 22px;margin:12px 0 20px;display:flex;justify-content:space-between;align-items:flex-end}` +
    `.hero-l{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:rgba(255,255,255,0.7);margin-bottom:4px}` +
    `.hero-v{font-size:28px;font-weight:800;letter-spacing:-.05em;line-height:1}` +
    `.summary{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:18px}` +
    `.cell{border:1px solid #EEF0EE;border-radius:10px;padding:10px 14px}` +
    `.cell-l{font-size:9px;color:#7A9A7A;text-transform:uppercase;letter-spacing:.06em;font-weight:700;margin-bottom:3px}` +
    `.cell-v{font-size:15px;font-weight:700;color:#0A160A;font-variant-numeric:tabular-nums}` +
    `.disclaimer{font-size:10px;color:#7A9A7A;line-height:1.5;margin-top:22px;padding-top:14px;border-top:1px solid #EEF0EE}` +
    `@media print{body{margin:18px;max-width:none}.print-btn{display:none}}` +
    `</style></head><body>` +
    `<div class="hdr">` +
    `<div class="logo">M</div>` +
    `<div><h1>GM Calculator — Pricing Worksheet</h1><div class="sub">Generated ${dateStr} at ${timeStr}</div></div>` +
    `<button class="print-btn" onclick="window.print()">Print / Save PDF</button>` +
    `</div>` +
    `<div class="hero">` +
    `<div><div class="hero-l">Required Selling Price</div><div class="hero-v">${fmtD(result.sell)}</div></div>` +
    `<div style="text-align:right"><div class="hero-l">Actual GM</div><div class="hero-v">${(result.actGM * 100).toFixed(1)}%</div></div>` +
    `</div>` +
    `<div class="section-title">Job Costs</div>` +
    `<table><thead><tr><th>Item</th><th class="r">Amount</th></tr></thead><tbody>${rowsHtml}` +
    `<tr style="border-top:1.5px solid #003D2B"><td style="font-weight:700">Total COGS</td><td class="r" style="font-weight:700;color:#003D2B">${fmtD(result.cogs)}</td></tr></tbody></table>` +
    `<div class="section-title">Rates Applied</div>` +
    `<div class="summary">` +
    `<div class="cell"><div class="cell-l">Province / Market</div><div class="cell-v">${provName}</div></div>` +
    `<div class="cell"><div class="cell-l">Tax Rate</div><div class="cell-v">${inputs.hst.toFixed(2)}%</div></div>` +
    `<div class="cell"><div class="cell-l">Target GM</div><div class="cell-v">${inputs.targetGm.toFixed(1)}%</div></div>` +
    `<div class="cell"><div class="cell-l">Commission</div><div class="cell-v">${inputs.commission.toFixed(1)}%</div></div>` +
    `<div class="cell" style="grid-column:1/-1"><div class="cell-l">Financing Charge</div><div class="cell-v">${inputs.financing.toFixed(2)}%</div></div>` +
    `</div>` +
    `<div class="section-title">Pricing Breakdown</div>` +
    `<div class="summary">` +
    `<div class="cell"><div class="cell-l">Gross Profit</div><div class="cell-v" style="color:#00694A">${fmtD(result.gp)}</div></div>` +
    `<div class="cell"><div class="cell-l">Commission $</div><div class="cell-v">${fmtD(result.commD)}</div></div>` +
    `<div class="cell"><div class="cell-l">Financing Cost</div><div class="cell-v">${fmtD(result.finC)}</div></div>` +
    `<div class="cell"><div class="cell-l">Price Multiplier</div><div class="cell-v">${result.mult.toFixed(2)}×</div></div>` +
    `<div class="cell" style="grid-column:1/-1;border-color:#1A4DB0;background:rgba(26,77,176,0.04)"><div class="cell-l" style="color:#1A4DB0">Customer Total (incl. tax)</div><div class="cell-v" style="font-size:18px;color:#1A4DB0">${fmtD(result.custT)}</div></div>` +
    `</div>` +
    `<div class="disclaimer"><strong>For internal pricing reference only.</strong> Figures are calculated from inputs entered in the MSZRME GM Calculator and do not represent a binding quotation or contract. All cost categories must be verified against actual invoices and labour records before quoting a customer. Tax rates and rules vary by jurisdiction and transaction type — consult your accountant for guidance on application.</div>` +
    `</body></html>`;

  const win = window.open("", "_blank");
  if (win && !win.closed) {
    win.document.write(pdfHtml);
    win.document.close();
    return true;
  }
  return false;
}
