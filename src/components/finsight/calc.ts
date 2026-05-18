import type { Inputs } from "./types";

export type Metrics = {
  totalExpenses: number;
  surplus: number;
  savingsRate: number; // 0-1
  healthScore: number; // 0-100
  goalEtaMonths: number;
  emergencyMonths: number;
  riskLevel: "Low" | "Moderate" | "High";
};

export function compute(i: Inputs, adj?: Partial<{ foodCut: number; shoppingCut: number; bonus: number; shock: number }>): Metrics {
  const foodCut = adj?.foodCut ?? 0;
  const shoppingCut = adj?.shoppingCut ?? 0;
  const bonus = adj?.bonus ?? 0;
  const shock = adj?.shock ?? 0;

  const food = i.food * (1 - foodCut / 100);
  const shopping = i.shopping * (1 - shoppingCut / 100);
  const totalExpenses = i.rent + food + i.travel + shopping + i.subscriptions + i.utilities + i.emi;
  const surplus = i.income - totalExpenses;
  const savingsRate = i.income > 0 ? surplus / i.income : 0;

  const effectiveSavings = Math.max(0, i.savings + bonus - shock);
  const emergencyMonths = totalExpenses > 0 ? effectiveSavings / totalExpenses : 0;

  const remaining = Math.max(0, i.goalAmount - effectiveSavings);
  const goalEtaMonths = surplus > 0 ? Math.ceil(remaining / surplus) : Infinity;

  // Health score weighted: savings rate, emergency, debt ratio, goal feasibility
  const sr = Math.max(0, Math.min(1, savingsRate / 0.3));
  const em = Math.max(0, Math.min(1, emergencyMonths / 6));
  const debtRatio = i.income > 0 ? i.emi / i.income : 1;
  const dr = Math.max(0, Math.min(1, 1 - debtRatio / 0.4));
  const goalFit = i.targetMonths > 0 ? Math.max(0, Math.min(1, i.targetMonths / Math.max(1, goalEtaMonths))) : 0;
  const healthScore = Math.round((sr * 35 + em * 30 + dr * 20 + goalFit * 15));

  const riskLevel: Metrics["riskLevel"] =
    i.risk === "high" ? "High" : i.risk === "low" ? "Low" : "Moderate";

  return { totalExpenses, surplus, savingsRate, healthScore, goalEtaMonths, emergencyMonths, riskLevel };
}

export const fmt = (n: number) =>
  isFinite(n) ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n) : "∞";

export const fmtMonths = (n: number) => (isFinite(n) ? `${n} mo` : "∞");
