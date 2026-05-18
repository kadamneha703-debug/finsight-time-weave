import { compute } from "./calc";
import { fmt, fmtMonths } from "./calc";
import type { Inputs } from "./types";
import { TrendingUp, AlertTriangle, Sparkles } from "lucide-react";

export function ScenarioCards({ inputs }: { inputs: Inputs }) {
  const current = compute(inputs);
  const risky = compute(inputs, { shopping: 0, foodCut: -30, shoppingCut: -50 } as never);
  // Risky: increase discretionary spending (negative cuts) — simulate inflation of lifestyle
  const riskyAdj = compute({ ...inputs, shopping: inputs.shopping * 1.6, food: inputs.food * 1.25, travel: inputs.travel * 1.4 });
  const optimized = compute(inputs, { foodCut: 20, shoppingCut: 40 });

  const items = [
    {
      title: "Current Path",
      icon: TrendingUp,
      color: "oklch(0.85 0.17 90)",
      desc: "Your trajectory if nothing changes.",
      m: current,
    },
    {
      title: "Risky Future",
      icon: AlertTriangle,
      color: "oklch(0.68 0.24 25)",
      desc: "Lifestyle inflation hits — more dining, travel, shopping.",
      m: riskyAdj,
    },
    {
      title: "Optimized Future",
      icon: Sparkles,
      color: "oklch(0.78 0.18 150)",
      desc: "AI-tuned cuts: −20% food, −40% shopping.",
      m: optimized,
    },
  ];

  return (
    <section>
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="text-xl font-semibold">Scenario Comparison</h2>
        <span className="text-xs text-muted-foreground font-mono">3 timelines · live</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map(({ title, icon: Icon, color, desc, m }) => (
          <div
            key={title}
            className="glass rounded-2xl p-5 relative overflow-hidden transition hover:-translate-y-1"
            style={{ boxShadow: `0 10px 40px -10px ${color}` }}
          >
            <div className="absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4" style={{ color }} />
              <h3 className="font-display text-lg font-semibold">{title}</h3>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
            <div className="mt-5 space-y-2.5 text-sm">
              <Row label="Surplus" value={fmt(m.surplus)} />
              <Row label="Goal ETA" value={fmtMonths(m.goalEtaMonths)} />
              <Row label="Emergency" value={`${m.emergencyMonths.toFixed(1)} mo`} />
              <Row label="Health" value={`${m.healthScore}/100`} accent={color} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-mono font-medium" style={{ color: accent }}>{value}</span>
    </div>
  );
}
