import * as React from "react";
import { devFetch } from "@/lib/dev-session";
import { ChevronLeft, ChevronRight, RefreshCw, Search, User } from "lucide-react";

export default function UsersSection() {
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState("");
  const [searchInput, setSearchInput] = React.useState("");

  const load = React.useCallback(async (p: number, q: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p) });
      if (q) params.set("search", q);
      const res = await devFetch(`${import.meta.env.BASE_URL}api/dev/users?${params}`);
      if (res.ok) setData(await res.json());
    } finally { setLoading(false); }
  }, []);

  React.useEffect(() => { load(1, ""); }, [load]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchInput.trim();
    setSearch(q);
    setPage(1);
    load(1, q);
  };

  const goPage = (next: number) => {
    setPage(next);
    load(next, search);
  };

  const users = data?.users ?? [];

  function userLabel(u: any) {
    if (u.firstName || u.lastName) return `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim();
    if (u.username) return u.username;
    if (u.email) return u.email;
    return null;
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-zinc-100">User Management</h1>
          {data && (
            <p className="text-xs text-zinc-500 mt-0.5">
              {data.total} registered users (Clerk) · {users.filter((u: any) => u.sessions > 0).length} on this page have reading activity
            </p>
          )}
        </div>
        <button onClick={() => load(page, search)} className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
          <RefreshCw className="size-3.5" /> Refresh
        </button>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-zinc-600" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by name, email, or username…"
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-9 pr-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/60"
          />
        </div>
        <button type="submit" className="px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-400 hover:bg-amber-500/20 transition-colors">
          Search
        </button>
        {search && (
          <button type="button" onClick={() => { setSearchInput(""); setSearch(""); setPage(1); load(1, ""); }}
            className="px-3 py-2 rounded-lg bg-zinc-800 text-xs text-zinc-400 hover:bg-zinc-700 transition-colors">
            Clear
          </button>
        )}
      </form>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">User</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider hidden md:table-cell">Joined</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider hidden md:table-cell">Last Active</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Sessions</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Bookmarks</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider hidden md:table-cell">Notes</th>
            </tr>
          </thead>
          <tbody>
            {loading && !data ? (
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} className="border-b border-zinc-800/60">
                  {Array.from({ length: 6 }).map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-4 bg-zinc-800 rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-zinc-500 text-sm">
                  {search ? `No users matching "${search}"` : "No users found"}
                </td>
              </tr>
            ) : (
              users.map((u: any) => {
                const label = userLabel(u);
                return (
                  <tr key={u.userId} className="border-b border-zinc-800/60 hover:bg-zinc-800/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        {u.imageUrl ? (
                          <img src={u.imageUrl} alt="" className="size-7 rounded-full object-cover" />
                        ) : (
                          <div className="size-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                            <User className="size-3.5 text-zinc-500" />
                          </div>
                        )}
                        <div>
                          {label && <p className="text-xs text-zinc-200 font-medium">{label}</p>}
                          <p className="text-[10px] text-zinc-500 font-mono">{u.email ?? u.userId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-500 hidden md:table-cell">
                      {u.joinDate ? new Date(u.joinDate).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-400 hidden md:table-cell">
                      {u.lastActive ? new Date(u.lastActive).toLocaleDateString() : <span className="text-zinc-700">never</span>}
                    </td>
                    <td className="px-4 py-3 text-right text-zinc-300 font-medium">{u.sessions}</td>
                    <td className="px-4 py-3 text-right text-zinc-300 font-medium">{u.bookmarks}</td>
                    <td className="px-4 py-3 text-right text-zinc-300 font-medium hidden md:table-cell">{u.notes}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {data && data.pages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-500">Page {page} of {data.pages} · {data.total} total</span>
          <div className="flex gap-2">
            <button
              disabled={page <= 1 || loading}
              onClick={() => goPage(page - 1)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-800 text-xs text-zinc-300 hover:bg-zinc-700 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="size-3.5" /> Prev
            </button>
            <button
              disabled={page >= data.pages || loading}
              onClick={() => goPage(page + 1)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-800 text-xs text-zinc-300 hover:bg-zinc-700 disabled:opacity-40 transition-colors"
            >
              Next <ChevronRight className="size-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
