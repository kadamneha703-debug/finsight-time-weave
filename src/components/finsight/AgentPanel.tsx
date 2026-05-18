import { useMemo } from "react";
import { Brain, Cpu, ArrowRight } from "lucide-react";
import type { Inputs } from "./types";
import { compute, fmt, fmtMonths } from "./calc";

type Msg = { role: "agent" | "log"; text: string; tag?: string };

export function AgentPanel({ inputs }: { inputs: Inputs }) {
  const m = compute(inputs);
  const optimized = compute(inputs, { foodCut: 20, shoppingCut: 40 });

  const messages = useMemo<Msg[]>(() => {
    const out: Msg[] = [];
    out.push({ role: "log", tag: "observe", text: `Income ${fmt(inputs.income)} · Expenses ${fmt(m.totalExpenses)} · Surplus ${fmt(m.surplus)}` });
    out.push({ role: "log", tag: "analyze", text: `Health=${m.healthScore} · Emergency=${m.emergencyMonths.toFixed(1)}mo · DebtRatio=${Math.round((inputs.emi / Math.max(1, inputs.income)) * 100)}%` });

    if (m.emergencyMonths < 3) {
      out.push({ role: "agent", text: `Your emergency buffer covers only ${m.emergencyMonths.toFixed(1)} months. I recommend prioritizing a 3-month cushion (${fmt(m.totalExpenses * 3)}) before aggressive goal-saving.` });
    }
    if (m.surplus < inputs.income * 0.2) {
      out.push({ role: "agent", text: `Savings rate is ${Math.round(m.savingsRate * 100)}%. Trimming shopping by 40% and food by 20% raises your health score to ${optimized.healthScore} and shortens "${inputs.goalName}" ETA to ${fmtMonths(optimized.goalEtaMonths)}.` });
    } else {
      out.push({ role: "agent", text: `Strong savings rate of ${Math.round(m.savingsRate * 100)}%. Channel ${fmt(m.surplus * 0.6)} toward "${inputs.goalName}" and ${fmt(m.surplus * 0.4)} into a ${inputs.risk === "high" ? "growth ETF" : inputs.risk === "low" ? "high-yield savings" : "diversified index"} sleeve.` });
    }
    out.push({ role: "log", tag: "plan", text: `Next 30 days · auto-route surplus · rebalance to ${inputs.risk} risk · alert if expenses > ${fmt(m.totalExpenses * 1.1)}` });
    if (isFinite(m.goalEtaMonths) && m.goalEtaMonths > inputs.targetMonths) {
      out.push({ role: "agent", text: `At current pace you'll reach "${inputs.goalName}" in ${fmtMonths(m.goalEtaMonths)} — ${m.goalEtaMonths - inputs.targetMonths} months past your ${inputs.targetMonths}-month target. Consider a side income of ${fmt(((inputs.goalAmount - inputs.savings) / inputs.targetMonths) - m.surplus)} / mo.` });
    }
    return out;
  }, [inputs, m, optimized]);

  return (
    <section className="glass-strong rounded-3xl p-6 sm:p-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-[oklch(0.70_0.22_280/0.30)] blur-3xl" />
      <div className="relative flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl flex items-center justify-center" style={{ background: "var(--gradient-ai)" }}>
            <Brain className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-display text-lg font-semibold">FinSight Agent</h2>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <span className="ring-dot bg-[oklch(0.78_0.18_150)] animate-pulse" />
              live · reasoning
            </div>
          </div>
        </div>
        <span className="text-[11px] font-mono text-muted-foreground">model: finsight-v1</span>
      </div>

      <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
        {messages.map((msg, i) => (
          <div key={i} className="animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
            {msg.role === "agent" ? (
              <div className="flex gap-3">
                <div className="h-7 w-7 shrink-0 rounded-lg flex items-center justify-center" style={{ background: "var(--gradient-ai)" }}>
                  <Brain className="h-3.5 w-3.5 text-primary-foreground" />
                </div>
                <div className="glass rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed">
                  {msg.text}
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-2 pl-10 text-xs font-mono text-muted-foreground">
                <Cpu className="h-3.5 w-3.5 mt-0.5 text-[oklch(0.65_0.22_250)]" />
                <span className="uppercase tracking-wider text-[oklch(0.65_0.22_250)]">{msg.tag}</span>
                <ArrowRight className="h-3 w-3 mt-1" />
                <span>{msg.text}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
