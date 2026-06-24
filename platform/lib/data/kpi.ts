import type { KPIData } from "@/lib/types";

/**
 * Seed KPI data — in production these come from the dealer's actual logged numbers.
 * Replace with API calls to your Supabase/database layer.
 */
export const KPI: KPIData = {
  Day: {
    installs: 1, installRev: 14000, installTarget: 10000,
    closingRatio: 66.7, avgTicket: 8000, avgTicketTarget: 8500,
    serviceRev: 2000, maintenanceContracts: 3, maintenanceTarget: 11,
    demandService: 2, leads: 4, estimates: 3, closedSales: 2,
    equipmentInstalls: 1, callbackRate: 0,
    maintenanceCalls: 3, demandCalls: 2, totalRev: 25000, revTarget: 10000,
  },
  Week: {
    installs: 4, installRev: 52000, installTarget: 55000,
    closingRatio: 62.5, avgTicket: 7800, avgTicketTarget: 8000,
    serviceRev: 9800, maintenanceContracts: 14, maintenanceTarget: 45,
    demandService: 9, leads: 18, estimates: 16, closedSales: 10,
    equipmentInstalls: 4, callbackRate: 1,
    maintenanceCalls: 14, demandCalls: 9, totalRev: 61800, revTarget: 65000,
  },
  Month: {
    installs: 16, installRev: 192000, installTarget: 200000,
    closingRatio: 64.0, avgTicket: 7750, avgTicketTarget: 8000,
    serviceRev: 38000, maintenanceContracts: 55, maintenanceTarget: 132,
    demandService: 38, leads: 72, estimates: 64, closedSales: 41,
    equipmentInstalls: 16, callbackRate: 2,
    maintenanceCalls: 55, demandCalls: 38, totalRev: 230000, revTarget: 240000,
  },
  YTD: {
    installs: 89, installRev: 1060000, installTarget: 1200000,
    closingRatio: 63.2, avgTicket: 7668, avgTicketTarget: 8000,
    serviceRev: 198000, maintenanceContracts: 142, maintenanceTarget: 600,
    demandService: 198, leads: 412, estimates: 370, closedSales: 234,
    equipmentInstalls: 89, callbackRate: 1.8,
    maintenanceCalls: 142, demandCalls: 198, totalRev: 1258000, revTarget: 1400000,
  },
  Year: {
    installs: 142, installRev: 1680000, installTarget: 2000000,
    closingRatio: 62.0, avgTicket: 7600, avgTicketTarget: 8000,
    serviceRev: 320000, maintenanceContracts: 142, maintenanceTarget: 1000,
    demandService: 320, leads: 680, estimates: 610, closedSales: 378,
    equipmentInstalls: 142, callbackRate: 2.1,
    maintenanceCalls: 142, demandCalls: 320, totalRev: 2000000, revTarget: 2400000,
  },
};
