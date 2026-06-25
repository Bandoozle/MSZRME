// Ported from mszrme-dealer-runtime.js — GM_PROVINCES + defaults.

export type ProvinceCode =
  | "BC"
  | "AB"
  | "ON"
  | "MB"
  | "SK"
  | "QC"
  | "NS"
  | "NB"
  | "NL"
  | "PE";

export interface ProvinceTax {
  rate: number;
  label: string;
  note: string;
}

export type GmProvinces = Record<ProvinceCode, ProvinceTax>;

export const GM_PROVINCES: GmProvinces = {
  BC: {
    rate: 12,
    label: "BC GST + PST %",
    note: "GST 5% (federal) + PST 7% (provincial). Applied separately at point of sale — combined rate used here.",
  },
  AB: {
    rate: 5,
    label: "Alberta GST %",
    note: "GST 5% only. Alberta has no provincial sales tax — the lowest tax burden in Canada.",
  },
  ON: {
    rate: 13,
    label: "Ontario HST %",
    note: "Harmonized Sales Tax — single rate applied to selling price at point of sale.",
  },
  MB: {
    rate: 12,
    label: "MB GST + PST %",
    note: "GST 5% (federal) + PST 7% (provincial). Applied separately — combined rate used here.",
  },
  SK: {
    rate: 11,
    label: "SK GST + PST %",
    note: "GST 5% (federal) + PST 6% (provincial). Applied separately — combined rate used here.",
  },
  QC: {
    rate: 14.975,
    label: "QC GST + QST %",
    note: "GST 5% (federal) + QST 9.975% (provincial). QST is charged on the GST-inclusive price.",
  },
  NS: {
    rate: 15,
    label: "Nova Scotia HST %",
    note: "Harmonized Sales Tax at 15%. One of the highest HST rates in Canada.",
  },
  NB: {
    rate: 15,
    label: "New Brunswick HST %",
    note: "Harmonized Sales Tax at 15%.",
  },
  NL: {
    rate: 15,
    label: "NL HST %",
    note: "Harmonized Sales Tax at 15%. Applies to Newfoundland & Labrador.",
  },
  PE: {
    rate: 15,
    label: "PEI HST %",
    note: "Harmonized Sales Tax at 15%. Applies to Prince Edward Island.",
  },
};

export const PROVINCE_OPTIONS: { value: ProvinceCode; label: string }[] = [
  { value: "BC", label: "British Columbia — GST 5% + PST 7% = 12%" },
  { value: "AB", label: "Alberta — GST 5% (no provincial tax)" },
  { value: "ON", label: "Ontario — HST 13%" },
  { value: "MB", label: "Manitoba — GST 5% + PST 7% = 12%" },
  { value: "SK", label: "Saskatchewan — GST 5% + PST 6% = 11%" },
  { value: "QC", label: "Quebec — GST 5% + QST 9.975% ≈ 14.975%" },
  { value: "NS", label: "Nova Scotia — HST 15%" },
  { value: "NB", label: "New Brunswick — HST 15%" },
  { value: "NL", label: "Newfoundland & Labrador — HST 15%" },
  { value: "PE", label: "Prince Edward Island — HST 15%" },
];

export const DEFAULT_JOB_COSTS = {
  equipment: 2379,
  materials: 250,
  labour: 0,
  subcon: 0,
  electrical: 0,
  other: 0,
  targetGm: 47,
  commission: 10,
  financing: 0,
} as const;
