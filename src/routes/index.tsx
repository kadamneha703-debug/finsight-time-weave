import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { defaultInputs, type Inputs } from "@/components/finsight/types";
import { compute } from "@/components/finsight/calc";
import { Hero } from "@/components/finsight/Hero";
import { InputForm } from "@/components/finsight/InputForm";
import { DashboardCards } from "@/components/finsight/DashboardCards";
import { ScenarioCards } from "@/components/finsight/ScenarioCards";
import { WhatIfSimulator } from "@/components/finsight/WhatIfSimulator";
import { FutureShock } from "@/components/finsight/FutureShock";
import { AgentPanel } from "@/components/finsight/AgentPanel";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "FutureFund AI — Simulate Your Financial Future" },
      { name: "description", content: "Agentic AI fintech dashboard that simulates scenarios, stress-tests life shocks, and recommends the optimal path to your goals." },
    ],
  }),
});

function Index() {
  const [inputs, setInputs] = useState<Inputs>(defaultInputs);
  const metrics = useMemo(() => compute(inputs), [inputs]);

  return (
    <main className="min-h-screen pb-24">
      <Hero />
      <div className="mx-auto max-w-7xl px-6 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3"><InputForm inputs={inputs} onChange={setInputs} /></div>
          <div className="lg:col-span-2"><AgentPanel inputs={inputs} /></div>
        </div>
        <DashboardCards m={metrics} />
        <ScenarioCards inputs={inputs} />
        <WhatIfSimulator inputs={inputs} />
        <FutureShock inputs={inputs} />
        <footer className="text-center text-xs text-muted-foreground pt-8">
          FinSight Time Machine · Hackathon Demo · <span className="text-ai-gradient font-medium">Built with agentic AI</span>
        </footer>
      </div>
    </main>
  );
}
