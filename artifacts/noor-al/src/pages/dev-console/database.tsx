import * as React from "react";
import { devFetch } from "@/lib/dev-session";
import { RefreshCw, Database } from "lucide-react";

export default function DatabaseSection() {
  const [counts, setCounts] = React.useState<any[]>([]);
  const [activity, setActivity] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [dbRes, secRes] = await Promise.all([
        devFetch(`${import.meta.env.BASE_URL}api/dev/db-stats`),
        devFetch(`${import.meta.env.BASE_URL}api/dev/security-log`),
      ]);
      if (dbRes.ok) setCounts(await dbRes.json());
      if (secRes.ok) {
        const data = await secRes.json();
        setActivity(data.activity ?? []);
      }
    } finally { setLoading(false); }
  };

  React.useEffect(() => { load(); }, []);

  const total = counts.reduce((s, c) => s + (c.count ?? 0), 0);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-zinc-100">Database Monitor</h1>
          <p className="text-xs text-zinc-500 mt-0.5">{total.toLocaleString()} total rows across all tables</p>
        </div>
        <button onClick={load} className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
          <RefreshCw className="size-3.5" /> Refresh
        </button>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-zinc-800">
          <h2 className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
            <Database className="size-4 text-amber-400" /> Table Row Counts
          </h2>
        </div>
        <div className="divide-y divide-zinc-800">
          {loading ? (
            Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-3">
                <div className="h-4 w-32 bg-zinc-800 rounded animate-pulse" />
                <div className="h-4 w-12 bg-zinc-800 rounded animate-pulse" />
              </div>
            ))
          ) : counts.map((c) => (
            <div key={c.name} className="flex items-center justify-between px-4 py-3 hover:bg-zinc-800/30 transition-colors">
              <span className="font-mono text-xs text-zinc-400">{c.name}</span>
              <span className="text-sm font-semibold text-zinc-200 tabular-nums">{Number(c.count).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-zinc-800">
          <h2 className="text-sm font-semibold text-zinc-300">Recent Dev Activity</h2>
        </div>
        <div className="divide-y divide-zinc-800/60">
          {activity.length === 0 ? (
            <p className="px-4 py-6 text-sm text-zinc-500 text-center">No recent activity</p>
          ) : activity.slice(0, 20).map((a: any) => (
            <div key={a.id} className="flex items-start justify-between px-4 py-3">
              <div>
                <p className="text-xs font-medium text-zinc-300">{a.action}</p>
                {a.details && <p className="text-xs text-zinc-500 mt-0.5">{a.details}</p>}
                {a.devName && <p className="text-[10px] text-zinc-600 mt-0.5">by {a.devName}</p>}
              </div>
              <span className="text-[10px] text-zinc-600 shrink-0 ml-3">
                {new Date(a.timestamp).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
