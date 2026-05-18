import { Activity, Wallet, Target, ShieldCheck, Gauge } from "lucide-react";
import type { Metrics } from "./calc";
import { fmt, fmtMonths } from "./calc";

function riskColor(score: number) {
  if (score >= 75) return "oklch(0.78 0.18 150)";
  if (score >= 50) return "oklch(0.85 0.17 90)";
  return "oklch(0.68 0.24 25)";
}

function Card({
  icon: Icon,
  label,
  value,
  hint,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  hint?: string;
  accent: string;
}) {
  return (
    <div className="glass rounded-2xl p-5 relative overflow-hidden group transition hover:-translate-y-0.5">
      <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full opacity-40 blur-2xl" style={{ background: accent }} />
      <div className="flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</span>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="mt-3 font-display text-3xl font-semibold" style={{ color: accent }}>
        {value}
      </div>
      {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}

export function DashboardCards({ m }: { m: Metrics }) {
  const healthC = riskColor(m.healthScore);
  const surplusC = m.surplus > 0 ? "oklch(0.78 0.18 150)" : "oklch(0.68 0.24 25)";
  const emergencyC = m.emergencyMonths >= 3 ? "oklch(0.78 0.18 150)" : m.emergencyMonths >= 1 ? "oklch(0.85 0.17 90)" : "oklch(0.68 0.24 25)";
  const riskC = m.riskLevel === "Low" ? "oklch(0.78 0.18 150)" : m.riskLevel === "Moderate" ? "oklch(0.85 0.17 90)" : "oklch(0.68 0.24 25)";

  return (
    <section className="grid grid-cols-2 lg:grid-cols-5 gap-3">
      <Card icon={Activity} label="Health Score" value={`${m.healthScore}`} hint="out of 100" accent={healthC} />
      <Card icon={Wallet} label="Monthly Surplus" value={fmt(m.surplus)} hint={`${Math.round(m.savingsRate * 100)}% saved`} accent={surplusC} />
      <Card icon={Target} label="Goal ETA" value={fmtMonths(m.goalEtaMonths)} hint="at current pace" accent="oklch(0.70 0.22 280)" />
      <Card icon={ShieldCheck} label="Emergency Cover" value={`${m.emergencyMonths.toFixed(1)} mo`} hint="of expenses" accent={emergencyC} />
      <Card icon={Gauge} label="Risk Level" value={m.riskLevel} hint="appetite" accent={riskC} />
    </section>
  );
}
