import * as React from "react";
import { devFetch } from "@/lib/dev-session";
import { RefreshCw, Download } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from "recharts";

function downloadCSV(data: any[], filename: string) {
  if (!data.length) return;
  const headers = Object.keys(data[0]);
  const rows = data.map((r) => headers.map((h) => JSON.stringify(r[h] ?? "")).join(","));
  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

export default function FinancialSection() {
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [typeFilter, setTypeFilter] = React.useState("all");

  const load = async () => {
    setLoading(true);
    try {
      const res = await devFetch(`${import.meta.env.BASE_URL}api/dev/financial`);
      if (res.ok) setData(await res.json());
    } finally { setLoading(false); }
  };

  React.useEffect(() => { load(); }, []);

  const donations = data?.donations ?? [];
  const filtered = typeFilter === "all" ? donations : donations.filter((d: any) => d.type === typeFilter);

  const chartData = React.useMemo(() => {
    const map: Record<string, { month: string; support: number; sadaqah: number }> = {};
    (data?.monthly ?? []).forEach((r: any) => {
      if (!map[r.month]) map[r.month] = { month: r.month, support: 0, sadaqah: 0 };
      if (r.type === "support") map[r.month].support = Number(r.total ?? 0);
      if (r.type === "sadaqah") map[r.month].sadaqah = Number(r.total ?? 0);
    });
    return Object.values(map).slice(-12);
  }, [data]);

  const s = data?.summary ?? {};

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-zinc-100">Financial Dashboard</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => downloadCSV(filtered, "donations.csv")}
            className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 bg-zinc-800 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Download className="size-3.5" /> Export CSV
          </button>
          <button onClick={load} className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
            <RefreshCw className="size-3.5" /> Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Support", value: `${Number(s.totalSupport || 0).toFixed(0)} DZD`, color: "text-green-400" },
          { label: "Total Sadaqah", value: `${Number(s.totalSadaqah || 0).toFixed(0)} DZD`, color: "text-amber-400" },
          { label: "This Month", value: `${Number(s.thisMonth || 0).toFixed(0)} DZD`, color: "text-blue-400" },
          { label: "This Week", value: `${Number(s.thisWeek || 0).toFixed(0)} DZD`, color: "text-purple-400" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <p className="text-xs text-zinc-500 mb-1">{label}</p>
            <p className={`text-xl font-bold ${color}`}>{loading ? "—" : value}</p>
          </div>
        ))}
      </div>

      {chartData.length > 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-zinc-300 mb-4">Monthly Income (Last 12 months)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="month" tick={{ fill: "#71717a", fontSize: 10 }} />
              <YAxis tick={{ fill: "#71717a", fontSize: 10 }} />
              <Tooltip contentStyle={{ background: "#18181b", border: "1px solid #3f3f46", borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 12, color: "#a1a1aa" }} />
              <Bar dataKey="support" fill="#22c55e" radius={[4,4,0,0]} name="Support" />
              <Bar dataKey="sadaqah" fill="#f59e0b" radius={[4,4,0,0]} name="Sadaqah" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="flex gap-2 mb-3">
        {["all", "support", "sadaqah"].map((t) => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              typeFilter === t ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        {filtered.length > 50 && (
          <div className="px-4 py-2 border-b border-zinc-800 bg-amber-500/5 text-xs text-amber-400 flex items-center justify-between">
            <span>Showing first 50 of {filtered.length} records</span>
            <button
              onClick={() => downloadCSV(filtered, "donations.csv")}
              className="underline hover:text-amber-300 transition-colors"
            >
              Export all as CSV
            </button>
          </div>
        )}
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500">Date</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500">Type</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-zinc-500">Amount</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500">Email</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500">Note</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-zinc-800/60">
                  {Array.from({ length: 5 }).map((_, j) => <td key={j} className="px-4 py-3"><div className="h-4 bg-zinc-800 rounded animate-pulse" /></td>)}
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-zinc-500">No donations yet</td></tr>
            ) : (
              filtered.slice(0, 50).map((d: any) => (
                <tr key={d.id} className="border-b border-zinc-800/60 hover:bg-zinc-800/30 transition-colors">
                  <td className="px-4 py-3 text-xs text-zinc-400">{new Date(d.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                      d.type === "support" ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    }`}>{d.type}</span>
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-zinc-200">{d.amount ? `${d.amount} ${d.currency}` : "—"}</td>
                  <td className="px-4 py-3 text-xs text-zinc-400">{d.isAnonymous ? "Anonymous" : (d.email ?? "—")}</td>
                  <td className="px-4 py-3 text-xs text-zinc-500 truncate max-w-[180px]">{d.note ?? "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
