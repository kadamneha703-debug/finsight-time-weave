import { useState } from "react";
import { Zap, RefreshCw } from "lucide-react";
import type { Inputs } from "./types";
import { compute, fmt, fmtMonths } from "./calc";

const SHOCKS = [
  { name: "Job Loss", amount: 0, months: 4, plan: "Tap emergency fund · pause discretionary · negotiate fixed bills" },
  { name: "Medical Emergency", amount: 8000, months: 0, plan: "Use emergency fund · HSA · structured payment plan" },
  { name: "Car Repair", amount: 3500, months: 0, plan: "12-month interest-free financing · cut shopping 50% for 6 mo" },
  { name: "Market Crash −30%", amount: 0, months: 0, plan: "Hold positions · DCA opportunity · rebalance to risk profile" },
  { name: "Surprise Tax Bill", amount: 4200, months: 0, plan: "Quarterly tax setup · increase withholding · cut travel 60%" },
  { name: "Rent Hike +20%", amount: 0, months: 0, plan: "Negotiate lease · roommate option · relocate in 6 mo" },
];

export function FutureShock({ inputs }: { inputs: Inputs }) {
  const [shock, setShock] = useState<(typeof SHOCKS)[number] | null>(null);

  const trigger = () => {
    const next = SHOCKS[Math.floor(Math.random() * SHOCKS.length)];
    setShock(next);
  };

  const sim = shock ? compute(inputs, { shock: shock.amount + (shock.months * inputs.income) }) : null;
  const base = compute(inputs);
  const recoveryMonths = sim && base.surplus > 0 ? Math.ceil((shock!.amount + shock!.months * inputs.income) / base.surplus) : null;

  return (
    <section className="relative">
      <div className="glass-strong rounded-3xl p-6 sm:p-8 overflow-hidden relative">
        <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-[oklch(0.68_0.24_25/0.30)] blur-3xl" />
        <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-[oklch(0.85_0.17_90/0.25)] blur-3xl" />
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-semibold flex items-center gap-2">
              <Zap className="h-5 w-5 text-[oklch(0.85_0.17_90)]" /> Future Shock
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Roll the dice. Stress-test your finances against a random life event.
            </p>
          </div>
          <button
            onClick={trigger}
            className="group inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 font-semibold text-primary-foreground transition animate-pulse-glow"
            style={{ background: "var(--gradient-ai)" }}
          >
            {shock ? <RefreshCw className="h-4 w-4 group-hover:rotate-180 transition-transform" /> : <Zap className="h-4 w-4" />}
            {shock ? "Shock Me Again" : "Trigger Future Shock"}
          </button>
        </div>

        {shock && sim && (
          <div className="relative mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-up">
            <div className="md:col-span-1 glass rounded-2xl p-5 glow-danger">
              <div className="text-[11px] uppercase tracking-wider text-[oklch(0.68_0.24_25)]">Shock Event</div>
              <div className="mt-2 font-display text-xl font-semibold">{shock.name}</div>
              <div className="mt-2 text-xs text-muted-foreground">
                Impact: {shock.amount ? fmt(shock.amount) : "—"}{shock.months ? ` · ${shock.months} mo income lost` : ""}
              </div>
            </div>
            <div className="md:col-span-2 glass rounded-2xl p-5">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Recovery Plan</div>
              <div className="mt-2 text-sm">{shock.plan}</div>
              <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                <Mini label="New Health" value={`${sim.healthScore}/100`} />
                <Mini label="Emergency After" value={`${sim.emergencyMonths.toFixed(1)} mo`} />
                <Mini label="Recovery" value={recoveryMonths ? fmtMonths(recoveryMonths) : "∞"} />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-input/40 border border-border p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 font-mono text-sm font-medium">{value}</div>
    </div>
  );
}
