import { useMemo, useState } from "react";
import type { Inputs } from "./types";
import { compute, fmt, fmtMonths } from "./calc";
import { Sliders } from "lucide-react";

export function WhatIfSimulator({ inputs }: { inputs: Inputs }) {
  const [foodCut, setFoodCut] = useState(15);
  const [shoppingCut, setShoppingCut] = useState(25);
  const [bonus, setBonus] = useState(2000);
  const [shock, setShock] = useState(0);

  const base = useMemo(() => compute(inputs), [inputs]);
  const sim = useMemo(() => compute(inputs, { foodCut, shoppingCut, bonus, shock }), [inputs, foodCut, shoppingCut, bonus, shock]);

  const delta = sim.healthScore - base.healthScore;

  return (
    <section className="glass-strong rounded-3xl p-6 sm:p-8">
      <div className="flex items-center gap-2 mb-1">
        <Sliders className="h-4 w-4 text-[oklch(0.70_0.22_280)]" />
        <h2 className="text-xl font-semibold">What-If Simulator</h2>
      </div>
      <p className="text-xs text-muted-foreground mb-6">Drag sliders and watch your future shift in real-time.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-5">
          <SliderRow label="Food Reduction" value={foodCut} onChange={setFoodCut} suffix="%" max={75} />
          <SliderRow label="Shopping Reduction" value={shoppingCut} onChange={setShoppingCut} suffix="%" max={90} />
          <NumberRow label="One-Time Bonus" value={bonus} onChange={setBonus} prefix="$" />
          <NumberRow label="Emergency Expense" value={shock} onChange={setShock} prefix="$" />
        </div>

        <div className="glass rounded-2xl p-5">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Simulated Outcome</div>
          <div className="mt-2 flex items-baseline gap-3">
            <span className="font-display text-5xl font-semibold text-ai-gradient">{sim.healthScore}</span>
            <span className={`text-sm font-mono ${delta >= 0 ? "text-[oklch(0.78_0.18_150)]" : "text-[oklch(0.68_0.24_25)]"}`}>
              {delta >= 0 ? "+" : ""}{delta} vs current
            </span>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <Stat label="New Surplus" value={fmt(sim.surplus)} />
            <Stat label="Goal ETA" value={fmtMonths(sim.goalEtaMonths)} />
            <Stat label="Savings Rate" value={`${Math.round(sim.savingsRate * 100)}%`} />
            <Stat label="Emergency" value={`${sim.emergencyMonths.toFixed(1)} mo`} />
          </div>
        </div>
      </div>
    </section>
  );
}

function SliderRow({ label, value, onChange, suffix, max = 100 }: { label: string; value: number; onChange: (n: number) => void; suffix?: string; max?: number }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="font-mono text-sm text-foreground">{value}{suffix}</span>
      </div>
      <input
        type="range"
        min={0}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[oklch(0.70_0.22_280)]"
        style={{ accentColor: "oklch(0.70 0.22 280)" }}
      />
    </div>
  );
}

function NumberRow({ label, value, onChange, prefix }: { label: string; value: number; onChange: (n: number) => void; prefix?: string }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <div className="relative">
        {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">{prefix}</span>}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          className="w-full rounded-xl bg-input/70 border border-border pl-7 pr-3 py-2.5 text-sm font-mono outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-input/40 border border-border p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 font-mono text-sm font-medium">{value}</div>
    </div>
  );
}
