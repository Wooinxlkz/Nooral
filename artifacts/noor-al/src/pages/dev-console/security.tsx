import * as React from "react";
import { devFetch, getDevSession, clearDevSession } from "@/lib/dev-session";
import { RefreshCw, AlertTriangle, Shield, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const TIME_FILTERS = [
  { label: "All Time", hours: 0 },
  { label: "Last Hour", hours: 1 },
  { label: "Last 24h", hours: 24 },
  { label: "Last 7d", hours: 168 },
];

export default function SecuritySection() {
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [timeFilter, setTimeFilter] = React.useState(0);
  const [activeTab, setActiveTab] = React.useState<"logins" | "activity">("logins");

  const load = async () => {
    setLoading(true);
    try {
      const res = await devFetch(`${import.meta.env.BASE_URL}api/dev/security-log`);
      if (res.ok) setData(await res.json());
    } finally { setLoading(false); }
  };

  React.useEffect(() => { load(); }, []);

  const session = getDevSession();

  const allFailed: any[] = data?.failedLogins ?? [];
  const allActivity: any[] = data?.activity ?? [];

  const filterByTime = (rows: any[], key: string) => {
    if (timeFilter === 0) return rows;
    const cutoff = Date.now() - timeFilter * 3600 * 1000;
    return rows.filter((r) => new Date(r[key]).getTime() >= cutoff);
  };

  const failedLogins = filterByTime(allFailed, "timestamp");
  const activity = filterByTime(allActivity, "timestamp");

  const recentFailed10min = allFailed.filter((l: any) =>
    Date.now() - new Date(l.timestamp).getTime() < 10 * 60 * 1000
  );
  const ipGroups: Record<string, number> = {};
  recentFailed10min.forEach((l: any) => {
    const ip = l.ip ?? "unknown";
    ipGroups[ip] = (ipGroups[ip] ?? 0) + 1;
  });
  const alertIPs = Object.entries(ipGroups).filter(([, c]) => c >= 3);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-zinc-100">Security Log</h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            {allFailed.length} failed login{allFailed.length !== 1 ? "s" : ""} · {allActivity.length} activity events
          </p>
        </div>
        <button onClick={load} className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
          <RefreshCw className="size-3.5" /> Refresh
        </button>
      </div>

      {alertIPs.length > 0 && (
        <div className="bg-red-500/10 border border-red-500/40 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="size-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-400">⚠ Brute Force Alert</p>
            <p className="text-xs text-red-300 mt-1">
              {alertIPs.map(([ip, c]) => `${ip} (${c} attempts)`).join(", ")} in the last 10 minutes.
            </p>
          </div>
        </div>
      )}

      {session && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Shield className="size-4 text-amber-400" />
            <h2 className="text-sm font-semibold text-zinc-200">Active Dev Session</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-zinc-500">Name</p>
              <p className="text-zinc-200 font-medium mt-0.5">{session.name}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500">Login Time</p>
              <p className="text-zinc-200 font-medium mt-0.5">{new Date(session.loginTime).toLocaleTimeString()}</p>
            </div>
          </div>
          <button
            onClick={() => { clearDevSession(); window.location.href = "/"; }}
            className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium rounded-lg py-2 transition-colors border border-red-500/20"
          >
            Invalidate Session & Lock Out
          </button>
        </div>
      )}

      {/* Time filter + tab switcher */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex gap-1.5">
          {["logins", "activity"].map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t as any)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                activeTab === t
                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                  : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
              )}
            >
              {t === "logins"
                ? `Failed Logins (${failedLogins.length})`
                : `Dev Activity (${activity.length})`
              }
            </button>
          ))}
        </div>
        <div className="flex gap-1.5">
          {TIME_FILTERS.map(({ label, hours }) => (
            <button
              key={hours}
              onClick={() => setTimeFilter(hours)}
              className={cn(
                "flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs transition-colors",
                timeFilter === hours
                  ? "bg-zinc-700 text-zinc-200"
                  : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              <Clock className="size-3" /> {label}
            </button>
          ))}
        </div>
      </div>

      {/* Failed Logins Table */}
      {activeTab === "logins" && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-zinc-300">Failed Login Attempts</h2>
            <span className="text-xs text-zinc-600">{failedLogins.length} record{failedLogins.length !== 1 ? "s" : ""}</span>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500">Timestamp</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500">Attempted Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500">IP Address</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500">Result</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-b border-zinc-800/60">
                    {Array.from({ length: 4 }).map((_, j) => (
                      <td key={j} className="px-4 py-3"><div className="h-4 bg-zinc-800 rounded animate-pulse" /></td>
                    ))}
                  </tr>
                ))
              ) : failedLogins.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-zinc-500">
                    {timeFilter > 0 ? `No failed logins in the selected window` : "No failed login attempts recorded"}
                  </td>
                </tr>
              ) : (
                failedLogins.map((l: any) => (
                  <tr key={l.id} className="border-b border-zinc-800/60 hover:bg-zinc-800/30 bg-red-500/5 transition-colors">
                    <td className="px-4 py-3 text-xs text-zinc-400">{new Date(l.timestamp).toLocaleString()}</td>
                    <td className="px-4 py-3 text-xs text-zinc-300 font-mono">{l.attemptedName ?? "—"}</td>
                    <td className="px-4 py-3 font-mono text-xs text-zinc-400">{l.ip ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                        Failed
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Activity Log Table */}
      {activeTab === "activity" && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-zinc-300">Dev Activity Log</h2>
            <span className="text-xs text-zinc-600">{activity.length} event{activity.length !== 1 ? "s" : ""}</span>
          </div>
          {activity.length === 0 ? (
            <p className="px-4 py-8 text-sm text-zinc-500 text-center">
              {timeFilter > 0 ? "No activity in the selected window" : "No activity recorded yet"}
            </p>
          ) : (
            <div className="divide-y divide-zinc-800/60">
              {activity.map((a: any) => (
                <div key={a.id} className="flex items-start justify-between px-4 py-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full">
                        {a.action}
                      </span>
                      {a.devName && (
                        <span className="text-[10px] text-zinc-600">by {a.devName}</span>
                      )}
                    </div>
                    {a.details && <p className="text-xs text-zinc-500 mt-0.5">{a.details}</p>}
                  </div>
                  <span className="text-[10px] text-zinc-600 shrink-0 ml-3 whitespace-nowrap">
                    {new Date(a.timestamp).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
