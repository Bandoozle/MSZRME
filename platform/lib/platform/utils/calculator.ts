// Ported from mszrme-dealer-runtime.js — calcGM() logic.

export interface GmInputs {
  equipment: number;
  materials: number;
  labour: number;
  subcon: number;
  electrical: number;
  other: number;
  targetGm: number;
  commission: number;
  financing: number;
  hst: number;
}

export interface GmResult {
  cogs: number;
  sell: number;
  commD: number;
  finC: number;
  hstD: number;
  custT: number;
  gp: number;
  actGM: number;
  mult: number;
  denom: number;
}

export interface GmScenarioRow {
  gm: number;
  sell: number;
  gp: number;
  actGM: number;
  mult: number;
  current: boolean;
}

export function fmtD(n: number): string {
  return (
    "$" +
    n.toLocaleString("en-CA", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

export function fmtP(n: number): string {
  return (n * 100).toFixed(1) + "%";
}

export function computeGm(inputs: GmInputs): GmResult {
  const cogs =
    inputs.equipment +
    inputs.materials +
    inputs.labour +
    inputs.subcon +
    inputs.electrical +
    inputs.other;
  const targetGM = inputs.targetGm / 100;
  const commission = inputs.commission / 100;
  const financing = inputs.financing / 100;
  const hst = inputs.hst / 100;

  const denom = 1 - targetGM - commission - (1 + hst) * financing;
  const sell = denom > 0 && cogs > 0 ? cogs / denom : 0;
  const commD = sell * commission;
  const finC = sell * (1 + hst) * financing;
  const hstD = sell * hst;
  const custT = sell + hstD;
  const totC = cogs + commD + finC;
  const gp = sell - totC;
  const actGM = sell > 0 ? gp / sell : 0;
  const mult = cogs > 0 ? sell / cogs : 0;

  return {
    cogs,
    sell,
    commD,
    finC,
    hstD,
    custT,
    gp,
    actGM,
    mult,
    denom,
  };
}

export function buildGmScenarios(
  inputs: GmInputs,
  targetGmPct: number
): GmScenarioRow[] {
  const commission = inputs.commission / 100;
  const financing = inputs.financing / 100;
  const hst = inputs.hst / 100;
  const cogs =
    inputs.equipment +
    inputs.materials +
    inputs.labour +
    inputs.subcon +
    inputs.electrical +
    inputs.other;
  const targetGM = targetGmPct / 100;

  const rows: GmScenarioRow[] = [];
  for (let gm = 30; gm <= 50; gm++) {
    const t = gm / 100;
    const d2 = 1 - t - commission - (1 + hst) * financing;
    const s2 = d2 > 0 && cogs > 0 ? cogs / d2 : 0;
    const tc2 = cogs + s2 * commission + s2 * (1 + hst) * financing;
    const gp2 = s2 - tc2;
    const ag2 = s2 > 0 ? gp2 / s2 : 0;
    const mx2 = cogs > 0 ? s2 / cogs : 0;
    rows.push({
      gm,
      sell: s2,
      gp: gp2,
      actGM: ag2,
      mult: mx2,
      current: Math.abs(t - targetGM) < 0.0001,
    });
  }
  return rows;
}
