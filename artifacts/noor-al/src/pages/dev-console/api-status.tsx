import * as React from "react";
import { RefreshCw, CheckCircle2, AlertCircle, XCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ApiCheck {
  name: string;
  url: string;
  status: "checking" | "online" | "degraded" | "down";
  responseTime: number | null;
  lastChecked: Date | null;
  history: number[];
}

const APIS = [
  { name: "Quran.com API",     url: "https://api.quran.com/api/v4/chapters/1" },
  { name: "Ahadith API",       url: "https://ahadith.co/api/books" },
  { name: "Prayer Times API",  url: "https://api.aladhan.com/v1/timings?city=London&country=UK" },
];

async function pingApi(url: string): Promise<{ status: "online" | "degraded" | "down"; ms: number }> {
  const start = Date.now();
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    const ms = Date.now() - start;
    if (res.ok) return { status: ms > 3000 ? "degraded" : "online", ms };
    return { status: "degraded", ms };
  } catch {
    return { status: "down", ms: Date.now() - start };
  }
}

function Sparkline({ values }: { values: number[] }) {
  if (!values.length) return <span className="text-zinc-600 text-xs">—</span>;
  const max = Math.max(...values, 1);
  return (
    <svg width={60} height={20} className="inline-block">
      {values.slice(-10).map((v, i, arr) => {
        const x = (i / (arr.length - 1 || 1)) * 56 + 2;
        const y = 18 - (v / max) * 16;
        if (i === 0) return null;
        const px = ((i - 1) / (arr.length - 1 || 1)) * 56 + 2;
        const py = 18 - (values[values.length - arr.length + i - 1] / max) * 16;
        return <line key={i} x1={px} y1={py} x2={x} y2={y} stroke="#f59e0b" strokeWidth={1.5} />;
      })}
    </svg>
  );
}

export default function ApiStatusSection() {
  const [checks, setChecks] = React.useState<ApiCheck[]>(
    APIS.map((a) => ({ ...a, status: "checking", responseTime: null, lastChecked: null, history: [] }))
  );
  const [autoRefresh, setAutoRefresh] = React.useState(true);

  const runChecks = React.useCallback(async () => {
    setChecks((prev) => prev.map((c) => ({ ...c, status: "checking" as const })));
    const results = await Promise.all(APIS.map((api) => pingApi(api.url)));
    setChecks((prev) =>
      prev.map((c, i) => ({
        ...c,
        status: results[i].status,
        responseTime: results[i].ms,
        lastChecked: new Date(),
        history: [...c.history.slice(-9), results[i].ms],
      }))
    );
  }, []);

  React.useEffect(() => {
    runChecks();
  }, []);

  React.useEffect(() => {
    if (!autoRefresh) return;
    const id = setInterval(runChecks, 60000);
    return () => clearInterval(id);
  }, [autoRefresh, runChecks]);

  const StatusIcon = ({ status }: { status: ApiCheck["status"] }) => {
    if (status === "checking") return <RefreshCw className="size-4 text-zinc-500 animate-spin" />;
    if (status === "online")   return <CheckCircle2 className="size-4 text-green-400" />;
    if (status === "degraded") return <AlertCircle className="size-4 text-amber-400" />;
    return <XCircle className="size-4 text-red-400" />;
  };

  const hasDown = checks.some((c) => c.status === "down");
  const hasDegraded = checks.some((c) => c.status === "degraded");

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-zinc-100">API Status Monitor</h1>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1.5 text-xs text-zinc-500 cursor-pointer">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded"
            />
            Auto-refresh (60s)
          </label>
          <button onClick={runChecks} className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
            <RefreshCw className="size-3.5" /> Check Now
          </button>
        </div>
      </div>

      {(hasDown || hasDegraded) && (
        <div className={cn(
          "border rounded-xl p-4 flex items-start gap-3",
          hasDown ? "bg-red-500/10 border-red-500/30" : "bg-amber-500/10 border-amber-500/30"
        )}>
          <AlertCircle className={cn("size-5 shrink-0 mt-0.5", hasDown ? "text-red-400" : "text-amber-400")} />
          <p className={cn("text-sm", hasDown ? "text-red-300" : "text-amber-300")}>
            {hasDown ? "⚠ One or more APIs are currently down." : "⚠ One or more APIs are degraded (slow response)."}
          </p>
        </div>
      )}

      <div className="space-y-3">
        {checks.map((check) => (
          <div key={check.name} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <StatusIcon status={check.status} />
                <div>
                  <p className="text-sm font-semibold text-zinc-200">{check.name}</p>
                  <p className="text-[11px] font-mono text-zinc-600 mt-0.5 truncate max-w-[280px]">{check.url}</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className={cn(
                  "text-xs font-semibold px-2 py-0.5 rounded-full border",
                  check.status === "online"   ? "bg-green-500/10 text-green-400 border-green-500/20" :
                  check.status === "degraded" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                  check.status === "down"     ? "bg-red-500/10 text-red-400 border-red-500/20" :
                  "bg-zinc-800 text-zinc-500 border-zinc-700"
                )}>
                  {check.status === "checking" ? "Checking…" : check.status.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-5 text-xs text-zinc-500">
              {check.responseTime !== null && (
                <span className={cn(
                  "flex items-center gap-1",
                  check.responseTime < 1000 ? "text-green-400" :
                  check.responseTime < 3000 ? "text-amber-400" : "text-red-400"
                )}>
                  <Clock className="size-3" />
                  {check.responseTime}ms
                </span>
              )}
              {check.lastChecked && (
                <span>Last checked: {check.lastChecked.toLocaleTimeString()}</span>
              )}
              {check.history.length > 1 && (
                <span className="flex items-center gap-1.5">
                  Trend: <Sparkline values={check.history} />
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
