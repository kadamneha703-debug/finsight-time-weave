import { Sparkles, Clock, Brain } from "lucide-react";

export function Hero() {
  return (
    <header className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 opacity-60">
        <div className="absolute top-10 left-1/4 h-72 w-72 rounded-full bg-[oklch(0.65_0.22_280/0.35)] blur-3xl animate-float-slow" />
        <div className="absolute top-20 right-1/4 h-72 w-72 rounded-full bg-[oklch(0.65_0.22_230/0.30)] blur-3xl animate-float-slow" style={{ animationDelay: "1.5s" }} />
      </div>
      <div className="mx-auto max-w-7xl px-6 pt-14 pb-10 animate-fade-up">
        <div className="flex items-center gap-2 mb-5">
          <span className="glass-strong inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-[oklch(0.78_0.18_150)]" />
            Agentic AI · Hackathon Build
          </span>
        </div>
        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-semibold leading-[1.02] tracking-tight">
          FutureFund <span className="text-ai-gradient">AI</span>
        </h1>
        <p className="mt-5 max-w-2xl text-base sm:text-lg text-muted-foreground">
          Travel through your financial future. Simulate scenarios, stress-test life shocks, and let an
          AI agent recommend the optimal path to your goals.
        </p>
        <div className="mt-6 flex flex-wrap gap-3 text-xs text-muted-foreground">
          <span className="glass inline-flex items-center gap-2 rounded-full px-3 py-1.5"><Clock className="h-3.5 w-3.5" /> Real-time simulation</span>
          <span className="glass inline-flex items-center gap-2 rounded-full px-3 py-1.5"><Brain className="h-3.5 w-3.5" /> Agentic reasoning</span>
        </div>
      </div>
    </header>
  );
}
