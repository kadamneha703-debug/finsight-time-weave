export type RiskPref = "low" | "medium" | "high";

export type Inputs = {
  income: number;
  savings: number;
  rent: number;
  food: number;
  travel: number;
  shopping: number;
  subscriptions: number;
  utilities: number;
  emi: number;
  goalName: string;
  goalAmount: number;
  targetMonths: number;
  risk: RiskPref;
};

export const defaultInputs: Inputs = {
  income: 6500,
  savings: 12000,
  rent: 1500,
  food: 600,
  travel: 250,
  shopping: 400,
  subscriptions: 90,
  utilities: 180,
  emi: 700,
  goalName: "Buy a Tesla Model 3",
  goalAmount: 45000,
  targetMonths: 36,
  risk: "medium",
};
