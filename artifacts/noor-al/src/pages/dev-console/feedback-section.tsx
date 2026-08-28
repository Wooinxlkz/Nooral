import * as React from "react";
import { devFetch } from "@/lib/dev-session";
import {
  RefreshCw, X, ChevronRight, Bug, Lightbulb, Globe2, MessageSquare,
  User, Mail, MapPin, Calendar, StickyNote, Inbox, CheckCircle2, Clock3,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Tag config ─────────────────────────────────────────────── */
const TYPE_CONFIG: Record<string, { label: string; icon: React.ComponentType<{ className?: string }>; color: string; bg: string; border: string }> = {
  bug:       { label: "Bug",       icon: Bug,           color: "text-rose-400",    bg: "bg-rose-500/10",    border: "border-rose-500/20" },
  feature:   { label: "Feature",   icon: Lightbulb,     color: "text-amber-400",   bg: "bg-amber-500/10",   border: "border-amber-500/20" },
  translate: { label: "Translate", icon: Globe2,         color: "text-blue-400",    bg: "bg-blue-500/10",    border: "border-blue-500/20" },
  general:   { label: "General",   icon: MessageSquare, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
};

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; icon: React.ComponentType<{ className?: string }> }> = {
  new:         { label: "New",         icon: Inbox,         color: "text-blue-400",   bg: "bg-blue-500/10",   border: "border-blue-500/20" },
  in_progress: { label: "In Progress", icon: Clock3,        color: "text-amber-400",  bg: "bg-amber-500/10",  border: "border-amber-500/20" },
  resolved:    { label: "Resolved",    icon: CheckCircle2,  color: "text-green-400",  bg: "bg-green-500/10",  border: "border-green-500/20" },
};

function TypeTag({ type }: { type: string }) {
  const cfg = TYPE_CONFIG[type] ?? TYPE_CONFIG.general;
  const Icon = cfg.icon;
  return (
    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border", cfg.color, cfg.bg, cfg.border)}>
      <Icon className="size-2.5" />
      {cfg.label}
    </span>
  );
}

function StatusTag({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.new;
  const Icon = cfg.icon;
  return (
    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border", cfg.color, cfg.bg, cfg.border)}>
      <Icon className="size-2.5" />
      {cfg.label}
    </span>
  );
}

/* ── Filter pill ─────────────────────────────────────────────── */
function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
        active
          ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
          : "bg-zinc-800 text-zinc-400 border border-transparent hover:text-zinc-200"
      )}
    >
      {children}
    </button>
  );
}

/* ── Detail panel ─────────────────────────────────────────────── */
function DetailPanel({ ticket, onClose, onUpdate, onDelete }: {
  ticket: any;
  onClose: () => void;
  onUpdate: (id: number, updates: Record<string, any>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}) {
  const [devNote, setDevNote] = React.useState(ticket.devNote ?? "");
  const [saving, setSaving] = React.useState(false);
  const typeCfg = TYPE_CONFIG[ticket.type] ?? TYPE_CONFIG.general;
  const TypeIcon = typeCfg.icon;

  const save = async (updates: Record<string, any>) => {
    setSaving(true);
    await onUpdate(ticket.id, updates);
    setSaving(false);
  };

  return (
    <div className="w-80 shrink-0 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className={cn("px-4 py-3 border-b border-zinc-800 flex items-start justify-between gap-2", typeCfg.bg)}>
        <div className="flex items-center gap-2 min-w-0">
          <TypeIcon className={cn("size-4 shrink-0", typeCfg.color)} />
          <p className="text-sm font-semibold text-zinc-100 truncate">{ticket.subject ?? "(no subject)"}</p>
        </div>
        <button onClick={onClose} className="text-zinc-400 hover:text-zinc-200 shrink-0 mt-0.5">
          <X className="size-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          <TypeTag type={ticket.type} />
          <StatusTag status={ticket.status} />
          {ticket.country && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border bg-zinc-800 text-zinc-400 border-zinc-700">
              <MapPin className="size-2.5" />
              {ticket.country}
            </span>
          )}
        </div>

        {/* Sender info */}
        <div className="space-y-1.5">
          <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Sender</p>
          <div className="bg-zinc-800/60 rounded-lg p-3 space-y-2">
            {ticket.name && (
              <div className="flex items-center gap-2 text-xs text-zinc-300">
                <User className="size-3.5 text-zinc-500 shrink-0" />
                {ticket.name}
              </div>
            )}
            <div className="flex items-center gap-2 text-xs text-zinc-300">
              <Mail className="size-3.5 text-zinc-500 shrink-0" />
              <a href={`mailto:${ticket.email}`} className="hover:text-amber-400 transition-colors truncate">
                {ticket.email ?? "Anonymous"}
              </a>
            </div>
            {ticket.country && (
              <div className="flex items-center gap-2 text-xs text-zinc-300">
                <MapPin className="size-3.5 text-zinc-500 shrink-0" />
                {ticket.country}
              </div>
            )}
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <Calendar className="size-3.5 shrink-0" />
              {new Date(ticket.createdAt).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-1.5">
          <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Message</p>
          <div className="bg-zinc-800/60 rounded-lg p-3">
            <p className="text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap">{ticket.message}</p>
          </div>
        </div>

        {/* Status */}
        <div className="space-y-1.5">
          <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Status</p>
          <select
            value={ticket.status}
            onChange={(e) => save({ status: e.target.value })}
            disabled={saving}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-amber-500/60"
          >
            <option value="new">New</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        {/* Dev note */}
        <div className="space-y-1.5">
          <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-1">
            <StickyNote className="size-3" /> Internal Note
          </p>
          <textarea
            value={devNote}
            onChange={(e) => setDevNote(e.target.value)}
            rows={3}
            placeholder="Private note visible only to dev…"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/60 resize-none"
          />
          <button
            onClick={() => save({ devNote })}
            disabled={saving}
            className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-black text-xs font-semibold rounded-lg py-2 transition-colors"
          >
            {saving ? "Saving…" : "Save Note"}
          </button>
        </div>

        {/* Reply shortcut */}
        {ticket.email && (
          <a
            href={`mailto:${ticket.email}?subject=Re: ${encodeURIComponent(ticket.subject ?? "Your NoorAl support ticket")}`}
            className="flex items-center justify-center gap-2 w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium rounded-lg py-2 transition-colors border border-zinc-700"
          >
            <Mail className="size-3.5" />
            Reply via email
          </a>
        )}

        {/* Delete */}
        <button
          onClick={() => onDelete(ticket.id)}
          className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium rounded-lg py-2 transition-colors border border-red-500/20"
        >
          Delete Ticket
        </button>
      </div>
    </div>
  );
}

/* ── Main section ─────────────────────────────────────────────── */
export default function FeedbackSection() {
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [typeFilter, setTypeFilter] = React.useState("all");
  const [selected, setSelected] = React.useState<any>(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await devFetch(
        `${import.meta.env.BASE_URL}api/dev/feedback?status=${statusFilter}&type=${typeFilter}`
      );
      if (res.ok) setData(await res.json());
    } finally { setLoading(false); }
  }, [statusFilter, typeFilter]);

  React.useEffect(() => { load(); }, [load]);

  const updateTicket = async (id: number, updates: Record<string, any>) => {
    const res = await devFetch(`${import.meta.env.BASE_URL}api/dev/feedback/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
    if (res.ok) {
      const updated = await res.json();
      setSelected(updated);
      load();
    }
  };

  const deleteTicket = async (id: number) => {
    if (!confirm("Permanently delete this ticket?")) return;
    await devFetch(`${import.meta.env.BASE_URL}api/dev/feedback/${id}`, { method: "DELETE" });
    setSelected(null);
    load();
  };

  return (
    <div className="space-y-5">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-zinc-100">Support & Feedback</h1>
          {data && (
            <p className="text-xs text-zinc-500 mt-0.5">
              {data.total} total · <span className="text-blue-400 font-medium">{data.unread} new</span>
            </p>
          )}
        </div>
        <button onClick={load} className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
          <RefreshCw className="size-3.5" /> Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="space-y-2">
        <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Status</p>
        <div className="flex flex-wrap gap-2">
          {["all", "new", "in_progress", "resolved"].map((s) => (
            <Pill key={s} active={statusFilter === s} onClick={() => setStatusFilter(s)}>
              {s === "in_progress" ? "In Progress" : s.charAt(0).toUpperCase() + s.slice(1)}
            </Pill>
          ))}
        </div>
        <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider pt-1">Type</p>
        <div className="flex flex-wrap gap-2">
          {["all", "bug", "feature", "translate", "general"].map((t) => {
            const cfg = t !== "all" ? TYPE_CONFIG[t] : null;
            const Icon = cfg?.icon;
            return (
              <Pill key={t} active={typeFilter === t} onClick={() => setTypeFilter(t)}>
                <span className="flex items-center gap-1">
                  {Icon && <Icon className={cn("size-3", cfg?.color)} />}
                  {t === "all" ? "All Types" : TYPE_CONFIG[t].label}
                </span>
              </Pill>
            );
          })}
        </div>
      </div>

      {/* Table + detail panel */}
      <div className="flex gap-4 min-h-0">
        <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/80">
                <th className="text-left px-4 py-3 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Type</th>
                <th className="text-left px-4 py-3 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">From</th>
                <th className="text-left px-4 py-3 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Preview</th>
                <th className="text-left px-4 py-3 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Date</th>
                <th className="text-left px-4 py-3 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-zinc-800/60">
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-zinc-800 rounded animate-pulse" style={{ width: j === 2 ? "80%" : "60%" }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : (data?.feedback ?? []).length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center gap-2 text-zinc-600">
                      <Inbox className="size-8" />
                      <p className="text-sm">No tickets match these filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                (data?.feedback ?? []).map((f: any) => (
                  <tr
                    key={f.id}
                    onClick={() => setSelected(f.id === selected?.id ? null : f)}
                    className={cn(
                      "border-b border-zinc-800/60 hover:bg-zinc-800/30 transition-colors cursor-pointer",
                      selected?.id === f.id && "bg-zinc-800/50 border-l-2 border-l-amber-500"
                    )}
                  >
                    <td className="px-4 py-3">
                      <TypeTag type={f.type} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-0.5">
                        <p className="text-xs font-medium text-zinc-200">{f.name ?? "—"}</p>
                        <p className="text-[10px] text-zinc-500">{f.email ?? "Anonymous"}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-400 max-w-[200px]">
                      <p className="truncate">{f.message}</p>
                    </td>
                    <td className="px-4 py-3 text-[10px] text-zinc-500 whitespace-nowrap">
                      {new Date(f.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <StatusTag status={f.status} />
                    </td>
                    <td className="px-4 py-3 text-zinc-500">
                      <ChevronRight className="size-3.5" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {selected && (
          <DetailPanel
            ticket={selected}
            onClose={() => setSelected(null)}
            onUpdate={async (id, updates) => {
              await updateTicket(id, updates);
            }}
            onDelete={async (id) => {
              await deleteTicket(id);
            }}
          />
        )}
      </div>
    </div>
  );
}
