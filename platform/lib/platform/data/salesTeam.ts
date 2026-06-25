// Ported from renderSalesTeam() in mszrme-dealer-runtime.js

export interface SalesRepPeriod {
  estimates: number;
  sales: number;
  revenue: number;
  cr: number;
  ast: number;
  goal: number;
}

export interface SalesRep {
  id: string;
  name: string;
  role: string;
  avatar: string;
  color: string;
  mth: SalesRepPeriod;
  ytd: SalesRepPeriod;
}

export const SALES_REPS: SalesRep[] = [
  {
    id: "r1",
    name: "Jordan Park",
    role: "Senior Sales",
    avatar: "JP",
    color: "#00694A",
    mth: {
      estimates: 48,
      sales: 31,
      revenue: 286400,
      cr: 64.6,
      ast: 9239,
      goal: 280000,
    },
    ytd: {
      estimates: 218,
      sales: 142,
      revenue: 1314600,
      cr: 65.1,
      ast: 9258,
      goal: 1400000,
    },
  },
  {
    id: "r2",
    name: "Mike Tremblay",
    role: "Sales Rep",
    avatar: "MT",
    color: "#1A4DB0",
    mth: {
      estimates: 36,
      sales: 19,
      revenue: 172200,
      cr: 52.8,
      ast: 9063,
      goal: 220000,
    },
    ytd: {
      estimates: 174,
      sales: 96,
      revenue: 864600,
      cr: 55.2,
      ast: 9006,
      goal: 1100000,
    },
  },
  {
    id: "r3",
    name: "Priya Sandhu",
    role: "Sales Rep",
    avatar: "PS",
    color: "#00B478",
    mth: {
      estimates: 42,
      sales: 27,
      revenue: 241300,
      cr: 64.3,
      ast: 8937,
      goal: 230000,
    },
    ytd: {
      estimates: 198,
      sales: 124,
      revenue: 1097200,
      cr: 62.6,
      ast: 8848,
      goal: 1150000,
    },
  },
  {
    id: "r4",
    name: "Adam Coello",
    role: "Junior Sales",
    avatar: "AC",
    color: "#8A9BA8",
    mth: {
      estimates: 24,
      sales: 11,
      revenue: 95800,
      cr: 45.8,
      ast: 8709,
      goal: 140000,
    },
    ytd: {
      estimates: 96,
      sales: 42,
      revenue: 374100,
      cr: 43.8,
      ast: 8907,
      goal: 700000,
    },
  },
];
