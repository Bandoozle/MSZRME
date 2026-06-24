/**
 * MSZRME dealer runtime — render*() functions for prototype page bridges.
 * Writes into #feed-wrap (provided by React DealerShell).
 */
(function () {
  "use strict";

  var KPI = {
    Day: { totalRev: 25000, revTarget: 10000, installRev: 14000, installTarget: 10000, closingRatio: 66.7, avgTicket: 8000, estimates: 3, serviceRev: 2000, maintenanceContracts: 3, maintenanceTarget: 11, demandService: 2 },
    Week: { totalRev: 61800, revTarget: 65000, installRev: 52000, installTarget: 55000, closingRatio: 62.5, avgTicket: 7800, estimates: 16, serviceRev: 9800, maintenanceContracts: 14, maintenanceTarget: 45, demandService: 9 },
    Month: { totalRev: 230000, revTarget: 240000, installRev: 192000, installTarget: 200000, closingRatio: 64, avgTicket: 7750, estimates: 64, serviceRev: 38000, maintenanceContracts: 55, maintenanceTarget: 132, demandService: 38 },
  };

  var PEERS = [
    { biz: "Vancouver Pro HVAC", rev: 537600, growth: 12.4, you: false },
    { biz: "North Van HVAC Solutions", rev: 452400, growth: 14.8, you: true },
    { biz: "Squamish Climate Control", rev: 394800, growth: 8.1, you: false },
    { biz: "Burnaby HVAC Experts", rev: 368000, growth: 11.2, you: false },
  ];

  var CONTACTS = [
    { name: "Tom", role: "Your Coach", preview: "Yes — you're at 142, Dealer A…", unread: 2, online: true },
    { name: "Sarah K.", role: "Office Manager", preview: "Got it. I'll process end of day.", unread: 1, online: true },
    { name: "Mike T.", role: "Lead Tech", preview: "Get back to them today…", unread: 0, online: false },
  ];

  function feed() {
    return document.getElementById("feed-wrap");
  }

  function render(html) {
    var el = feed();
    if (el) el.innerHTML = html;
  }

  function title(text, sub) {
    return (
      '<div style="margin-bottom:20px">' +
      '<h1 style="font-size:22px;font-weight:700;letter-spacing:-.03em;margin:0 0 4px;color:#0A160A">' + text + "</h1>" +
      (sub ? '<p style="margin:0;font-size:13px;color:rgba(0,0,0,.5)">' + sub + "</p>" : "") +
      "</div>"
    );
  }

  function statGrid(items) {
    return (
      '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:8px;margin-bottom:16px">' +
      items.map(function (s) {
        return (
          '<div class="card" style="padding:14px 12px">' +
          '<div style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:rgba(0,0,0,.45);margin-bottom:6px">' + s.label + "</div>" +
          '<div style="font-size:20px;font-weight:800;color:' + (s.color || "#00694A") + ';letter-spacing:-.04em">' + s.value + "</div>" +
          (s.sub ? '<div style="font-size:10px;color:rgba(0,0,0,.45);margin-top:3px">' + s.sub + "</div>" : "") +
          "</div>"
        );
      }).join("") +
      "</div>"
    );
  }

  function money(n) {
    return "$" + Math.round(n / 1000) + "K";
  }

  window.renderDashboard = function () {
    var d = KPI.Day;
    render(
      title("Dashboard", "Prototype runtime view") +
      statGrid([
        { label: "Total Revenue", value: money(d.totalRev), sub: ((d.totalRev / d.revTarget) * 100).toFixed(0) + "% of target", color: "#00694A" },
        { label: "Closing Ratio", value: d.closingRatio + "%", sub: "On " + d.estimates + " estimates", color: "#0088FF" },
        { label: "Avg Ticket", value: money(d.avgTicket), sub: "Install day", color: "#00694A" },
        { label: "Service Rev", value: money(d.serviceRev), sub: "Day total", color: "#0088FF" },
        { label: "Maint. Agmt", value: String(d.maintenanceContracts), sub: "of " + d.maintenanceTarget + " target", color: "#FF453A" },
        { label: "Demand Svc", value: String(d.demandService), sub: "Calls today", color: "#FF453A" },
      ]) +
      '<div class="card" style="padding:16px"><div style="font-size:13px;font-weight:600;color:#0A160A">Revenue vs target</div>' +
      '<div style="margin-top:10px;height:8px;background:#e6e6eb;border-radius:4px;overflow:hidden">' +
      '<div style="height:100%;width:' + Math.min(100, (d.totalRev / d.revTarget) * 100) + '%;background:linear-gradient(90deg,#003D2B,#00B478)"></div></div></div>'
    );
  };

  window.renderLogNumbers = function () {
    render(
      title("Log Numbers", "Record today's performance") +
      '<div class="card" style="padding:20px">' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">' +
      ["Install Revenue", "Service Revenue", "Leads", "Estimates", "Closed Sales", "Callbacks"].map(function (label) {
        return '<label style="display:block"><span style="font-size:12px;font-weight:600;color:rgba(0,0,0,.6)">' + label + '</span>' +
          '<input type="number" style="width:100%;margin-top:6px;padding:10px;border:1px solid rgba(0,0,0,.1);border-radius:10px;font-size:14px" placeholder="0" /></label>';
      }).join("") +
      '</div><button type="button" style="margin-top:16px;width:100%;padding:12px;background:#0088FF;color:#fff;border:none;border-radius:12px;font-weight:700;cursor:pointer">Save numbers</button></div>'
    );
  };

  window.renderGoals = function () {
    render(
      title("Goals", "Monthly targets") +
      statGrid([
        { label: "Revenue Goal", value: "$240K", sub: "Month target" },
        { label: "Install Goal", value: "16", sub: "Units" },
        { label: "Closing Ratio", value: "65%", sub: "Target" },
        { label: "Maint. Contracts", value: "132", sub: "Month target" },
      ]) +
      '<div class="card" style="padding:16px;font-size:13px;color:rgba(0,0,0,.55)">Adjust targets in Settings when your program tier includes goal planning.</div>'
    );
  };

  window.renderMarket = function () {
    render(
      title("Market Pulse", "Anonymous peer comparison") +
      '<div class="card" style="overflow:hidden;padding:0">' +
      PEERS.map(function (p) {
        return '<div style="display:flex;align-items:center;gap:12px;padding:12px 16px;border-bottom:1px solid rgba(0,0,0,.06)' + (p.you ? ";background:rgba(0,180,120,.08)" : "") + '">' +
          '<div style="flex:1"><div style="font-size:13px;font-weight:700;color:#0A160A">' + p.biz + (p.you ? " <span style=\"color:#00694A\">(You)</span>" : "") + '</div>' +
          '<div style="font-size:11px;color:rgba(0,0,0,.45)">Rev ' + money(p.rev) + '</div></div>' +
          '<div style="font-size:12px;font-weight:700;color:' + (p.growth >= 0 ? "#00694A" : "#FF453A") + '">' + (p.growth >= 0 ? "+" : "") + p.growth + '%</div></div>';
      }).join("") +
      "</div>"
    );
  };

  window.renderSeasonal = function () {
    render(
      title("Seasonal Planner", "North Vancouver, BC") +
      '<div class="card" style="padding:16px;margin-bottom:10px"><div style="font-size:11px;font-weight:700;text-transform:uppercase;color:rgba(0,0,0,.45);margin-bottom:8px">Weather signals</div>' +
      '<div style="font-size:13px;line-height:1.5;color:#0A160A">Cooling degree days <strong>+18%</strong> vs 10-yr avg · First major heat event projected <strong>Jul 8–12</strong></div></div>' +
      '<div class="card" style="padding:16px"><div style="font-size:11px;font-weight:700;text-transform:uppercase;color:rgba(0,0,0,.45);margin-bottom:8px">Co-op funds</div>' +
      '<div style="font-size:13px;color:#0A160A">Daikin Comfort Pro — <strong>$4,200</strong> available (expires Aug 31)</div></div>'
    );
  };

  window.renderMessages = function () {
    render(
      title("Messages", "Team & coach") +
      CONTACTS.map(function (c) {
        return '<div class="card" style="padding:14px 16px;margin-bottom:8px;display:flex;gap:12px;align-items:center">' +
          '<div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#003D2B,#00B478);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:12px">' + c.name.slice(0, 2).toUpperCase() + '</div>' +
          '<div style="flex:1;min-width:0"><div style="font-size:13px;font-weight:700">' + c.name + ' · <span style="font-weight:500;color:rgba(0,0,0,.45)">' + c.role + '</span></div>' +
          '<div style="font-size:12px;color:rgba(0,0,0,.5);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + c.preview + '</div></div>' +
          (c.unread ? '<span style="background:#FF453A;color:#fff;font-size:10px;font-weight:700;padding:2px 7px;border-radius:10px">' + c.unread + '</span>' : '') +
          '</div>';
      }).join("")
    );
  };

  window.renderFinancials = function () {
    render(
      title("Financials", "P&L snapshot") +
      statGrid([
        { label: "Gross Revenue", value: "$230K", sub: "Month" },
        { label: "COGS", value: "$138K", sub: "60% of rev" },
        { label: "Gross Margin", value: "40%", sub: "Target 42%" },
        { label: "Net Profit", value: "$28K", sub: "12.2% margin", color: "#00694A" },
      ])
    );
  };

  window.renderCalculator = function () {
    render(
      title("GM Calculator", "Price to hit target margin") +
      '<div class="card" style="padding:20px">' +
      '<label style="display:block;margin-bottom:12px"><span style="font-size:12px;font-weight:600">Equipment cost</span>' +
      '<input id="gm-cost" type="number" value="4200" style="width:100%;margin-top:6px;padding:10px;border:1px solid rgba(0,0,0,.1);border-radius:10px" /></label>' +
      '<label style="display:block;margin-bottom:12px"><span style="font-size:12px;font-weight:600">Target GM %</span>' +
      '<input id="gm-pct" type="number" value="42" style="width:100%;margin-top:6px;padding:10px;border:1px solid rgba(0,0,0,.1);border-radius:10px" /></label>' +
      '<div id="gm-result" style="font-size:22px;font-weight:800;color:#00694A;margin-top:8px">Sell at $7,241</div></div>'
    );
    var cost = document.getElementById("gm-cost");
    var pct = document.getElementById("gm-pct");
    var out = document.getElementById("gm-result");
    function calc() {
      var c = parseFloat(cost && cost.value) || 0;
      var p = parseFloat(pct && pct.value) || 42;
      var sell = p >= 100 ? 0 : c / (1 - p / 100);
      if (out) out.textContent = "Sell at $" + Math.round(sell).toLocaleString();
    }
    if (cost) cost.addEventListener("input", calc);
    if (pct) pct.addEventListener("input", calc);
    calc();
  };

  window.renderReports = function () {
    render(
      title("Reports", "Export & print") +
      '<div class="card" style="padding:20px;text-align:center">' +
      '<p style="font-size:13px;color:rgba(0,0,0,.55);margin:0 0 16px">Generate a PDF summary of your current period KPIs.</p>' +
      '<button type="button" onclick="window.print()" style="padding:12px 24px;background:#00694A;color:#fff;border:none;border-radius:12px;font-weight:700;cursor:pointer">Print report</button></div>'
    );
  };

  window.renderNotes = function () {
    render(
      title("Notes / Checklists", "") +
      '<div class="card" style="padding:16px;margin-bottom:8px"><div style="font-size:14px;font-weight:700">Morning huddle</div>' +
      '<ul style="margin:10px 0 0;padding-left:18px;font-size:13px;color:rgba(0,0,0,.65)"><li>Review yesterday close rate</li><li>Confirm 3 follow-up calls</li><li>Service truck stock check</li></ul></div>' +
      '<div class="card" style="padding:16px"><div style="font-size:14px;font-weight:700">Month-end</div>' +
      '<p style="margin:8px 0 0;font-size:13px;color:rgba(0,0,0,.55)">Reconcile QuickBooks · Submit co-op claims</p></div>'
    );
  };

  window.renderSettings = function () {
    render(
      title("Settings", "Account & preferences") +
      '<div class="card" style="padding:0;overflow:hidden">' +
      ["Profile", "Billing", "Integrations", "Notifications", "Team access"].map(function (row) {
        return '<div style="padding:14px 16px;border-bottom:1px solid rgba(0,0,0,.06);font-size:13px;font-weight:600;color:#0A160A">' + row + ' →</div>';
      }).join("") +
      "</div>"
    );
  };

  window.renderSalesTeam = function () {
    render(
      title("Sales Team", "Rep performance") +
      statGrid([
        { label: "Active reps", value: "4", sub: "This month" },
        { label: "Team close rate", value: "61%", sub: "+3% vs last month", color: "#00694A" },
        { label: "Top rep", value: "Mike T.", sub: "$84K sold" },
        { label: "Coaching due", value: "2", sub: "Reps below target", color: "#FF9F0A" },
      ])
    );
  };

  window.dispatchEvent(new Event("mszrme-runtime-ready"));
})();
