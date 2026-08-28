import * as React from "react";
import { devFetch } from "@/lib/dev-session";
import {
  Users, Bookmark, FileText, TrendingUp, DollarSign,
  UserPlus, Activity, RefreshCw, BookOpen,
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from "recharts";

function StatCard({ label, value, sub, icon: Icon, color = "amber" }: {
  label: string;
  value: string | number | null;
  sub?: string;
  icon: React.ComponentType<{ className?: string }>;
  color?: string;
}) {
  const colors: Record<string, string> = {
    amber:  "text-amber-400 bg-amber-500/10 border-amber-500/20",
    blue:   "text-blue-400 bg-blue-500/10 border-blue-500/20",
    green:  "text-green-400 bg-green-500/10 border-green-500/20",
    purple: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    red:    "text-red-400 bg-red-500/10 border-red-500/20",
  };
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-start gap-3">
      <div className={`size-9 rounded-lg border flex items-center justify-center shrink-0 ${colors[color]}`}>
        <Icon className="size-4" />
      </div>
      <div>
        <p className="text-xs text-zinc-500 mb-1">{label}</p>
        <p className="text-xl font-bold text-zinc-100">{value ?? "—"}</p>
        {sub && <p className="text-[10px] text-zinc-600 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export default function OverviewSection() {
  const [stats, setStats] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await devFetch(`${import.meta.env.BASE_URL}api/dev/stats`);
      if (!res.ok) throw new Error();
      setStats(await res.json());
    } catch {
      setError("Failed to load stats");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => { load(); }, []);

  const chartData = stats?.readingLast30Days?.map((d: any) => ({
    date: d.date?.slice(5, 10) ?? "",
    sessions: d.count,
  })) ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-zinc-100">Overview</h1>
          <p className="text-xs text-zinc-500 mt-0.5">Live data from Clerk + database</p>
        </div>
        <button onClick={load} className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
          <RefreshCw className="size-3.5" /> Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm text-red-400">{error}</div>
      )}

      {loading && !stats ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 h-20 animate-pulse" />
          ))}
        </div>
      ) : stats ? (
        <>
          {/* User stats — from Clerk */}
          <div>
            <p className="text-[10px] uppercase tracking-widest text-zinc-600 font-semibold mb-2 px-0.5">
              Users <span className="text-amber-600 ml-1">· from Clerk</span>
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard label="Total Registered" value={stats.totalUsers} icon={Users} color="amber" />
              <StatCard label="Active (24h)" value={stats.activeUsers24h} sub="have reading logs" icon={Activity} color="green" />
              <StatCard label="New Today" value={stats.newUsers24h} sub="registered in 24h" icon={UserPlus} color="purple" />
              <StatCard label="New This Week" value={stats.newUsers7d} sub="registered in 7d" icon={TrendingUp} color="blue" />
            </div>
          </div>

          {/* Content stats — from DB */}
          <div>
            <p className="text-[10px] uppercase tracking-widest text-zinc-600 font-semibold mb-2 px-0.5">
              Content <span className="text-blue-600 ml-1">· from database</span>
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard label="Total Bookmarks" value={stats.totalBookmarks} icon={Bookmark} color="amber" />
              <StatCard label="Total Notes" value={stats.totalNotes} icon={FileText} color="blue" />
              <StatCard label="Memorization Entries" value={stats.totalMemorization} icon={TrendingUp} color="green" />
              {stats.topSurahToday
                ? <StatCard label="Top Surah Today" value={stats.topSurahToday} icon={BookOpen} color="purple" />
                : <StatCard label="Support Received" value={`${Number(stats.totalDonationSupport || 0).toFixed(0)} DZD`} icon={DollarSign} color="amber" />
              }
            </div>
          </div>

          {/* Reading activity chart */}
          {chartData.length > 0 && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
              <h2 className="text-sm font-semibold text-zinc-300 mb-1">Reading Sessions — Last 30 Days</h2>
              <p className="text-xs text-zinc-600 mb-4">Each bar = number of surah reading sessions logged that day</p>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="date" tick={{ fill: "#71717a", fontSize: 10 }} />
                  <YAxis tick={{ fill: "#71717a", fontSize: 10 }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ background: "#18181b", border: "1px solid #3f3f46", borderRadius: 8 }}
                    labelStyle={{ color: "#e4e4e7" }}
                    itemStyle={{ color: "#fbbf24" }}
                    formatter={(v: any) => [v, "Sessions"]}
                  />
                  <Line type="monotone" dataKey="sessions" stroke="#f59e0b" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {chartData.length === 0 && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-center">
              <BookOpen className="size-8 text-zinc-700 mx-auto mb-2" />
              <p className="text-sm text-zinc-500">No reading sessions in the last 30 days yet</p>
              <p className="text-xs text-zinc-600 mt-1">Chart will populate as users read Quran</p>
            </div>
          )}

          {/* Donations breakdown */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
              <h2 className="text-sm font-semibold text-zinc-300 mb-3">Donations</h2>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Support</span>
                  <span className="text-green-400 font-medium">{Number(stats.totalDonationSupport || 0).toFixed(0)} DZD</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Sadaqah</span>
                  <span className="text-amber-400 font-medium">{Number(stats.totalDonationSadaqah || 0).toFixed(0)} DZD</span>
                </div>
                <div className="flex justify-between text-sm pt-1 border-t border-zinc-800">
                  <span className="text-zinc-400 font-medium">Total</span>
                  <span className="text-zinc-200 font-semibold">
                    {(Number(stats.totalDonationSupport || 0) + Number(stats.totalDonationSadaqah || 0)).toFixed(0)} DZD
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
              <h2 className="text-sm font-semibold text-zinc-300 mb-3">User Activity</h2>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Active today</span>
                  <span className="text-blue-400 font-medium">{stats.activeUsers24h} users</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Active this week</span>
                  <span className="text-blue-400 font-medium">{stats.activeUsers7d} users</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">New this week</span>
                  <span className="text-purple-400 font-medium">{stats.newUsers7d ?? "—"} users</span>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
