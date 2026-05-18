import type { Inputs, RiskPref } from "./types";

const fields: { key: keyof Inputs; label: string; prefix?: string }[] = [
  { key: "income", label: "Monthly Income", prefix: "$" },
  { key: "savings", label: "Current Savings", prefix: "$" },
  { key: "rent", label: "Rent", prefix: "$" },
  { key: "food", label: "Food", prefix: "$" },
  { key: "travel", label: "Travel", prefix: "$" },
  { key: "shopping", label: "Shopping", prefix: "$" },
  { key: "subscriptions", label: "Subscriptions", prefix: "$" },
  { key: "utilities", label: "Utilities", prefix: "$" },
  { key: "emi", label: "EMI / Loans", prefix: "$" },
];

export function InputForm({ inputs, onChange }: { inputs: Inputs; onChange: (i: Inputs) => void }) {
  const setNum = (k: keyof Inputs) => (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange({ ...inputs, [k]: Number(e.target.value) || 0 });

  return (
    <section className="glass-strong rounded-3xl p-6 sm:p-8">
      <div className="flex items-baseline justify-between mb-6">
        <h2 className="text-xl font-semibold">Your Financial Snapshot</h2>
        <span className="text-xs text-muted-foreground font-mono">edit to recalculate</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {fields.map((f) => (
          <label key={f.key} className="block">
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground">{f.label}</span>
            <div className="mt-1 relative">
              {f.prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">{f.prefix}</span>}
              <input
                type="number"
                value={inputs[f.key] as number}
                onChange={setNum(f.key)}
                className="w-full rounded-xl bg-input/70 border border-border pl-7 pr-3 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-ring transition"
              />
            </div>
          </label>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-3 pt-6 border-t border-border">
        <label className="md:col-span-2">
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Goal Name</span>
          <input
            value={inputs.goalName}
            onChange={(e) => onChange({ ...inputs, goalName: e.target.value })}
            className="mt-1 w-full rounded-xl bg-input/70 border border-border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </label>
        <label>
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Goal Amount</span>
          <input
            type="number"
            value={inputs.goalAmount}
            onChange={(e) => onChange({ ...inputs, goalAmount: Number(e.target.value) || 0 })}
            className="mt-1 w-full rounded-xl bg-input/70 border border-border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </label>
        <label>
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Target Months</span>
          <input
            type="number"
            value={inputs.targetMonths}
            onChange={(e) => onChange({ ...inputs, targetMonths: Number(e.target.value) || 0 })}
            className="mt-1 w-full rounded-xl bg-input/70 border border-border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </label>
        <div className="md:col-span-4">
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Risk Preference</span>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {(["low", "medium", "high"] as RiskPref[]).map((r) => {
              const active = inputs.risk === r;
              const color = r === "low" ? "oklch(0.78 0.18 150)" : r === "medium" ? "oklch(0.85 0.17 90)" : "oklch(0.68 0.24 25)";
              return (
                <button
                  key={r}
                  onClick={() => onChange({ ...inputs, risk: r })}
                  className={`rounded-xl px-4 py-2.5 text-sm font-medium border transition capitalize ${
                    active ? "border-transparent text-foreground" : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                  style={active ? { background: `linear-gradient(135deg, ${color} / 0.25, transparent)`, borderColor: color, boxShadow: `0 0 24px ${color}` } : undefined}
                >
                  {r}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
