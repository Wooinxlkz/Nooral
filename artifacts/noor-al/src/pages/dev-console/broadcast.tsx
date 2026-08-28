import * as React from "react";
import { devFetch } from "@/lib/dev-session";
import { Send, RefreshCw, AlertTriangle, Users, Clock } from "lucide-react";

export default function BroadcastSection() {
  const [logs, setLogs] = React.useState<any[]>([]);
  const [form, setForm] = React.useState({ subject: "", recipientType: "all", body: "", specificEmail: "" });
  const [sending, setSending] = React.useState(false);
  const [result, setResult] = React.useState<any>(null);
  const [showConfirm, setShowConfirm] = React.useState(false);

  const loadLogs = async () => {
    const res = await devFetch(`${import.meta.env.BASE_URL}api/dev/broadcast-log`);
    if (res.ok) setLogs(await res.json());
  };

  React.useEffect(() => { loadLogs(); }, []);

  const send = async () => {
    setSending(true);
    setShowConfirm(false);
    setResult(null);
    try {
      const res = await devFetch(`${import.meta.env.BASE_URL}api/dev/broadcast`, {
        method: "POST",
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const data = await res.json();
        setResult(data);
        setForm({ subject: "", recipientType: "all", body: "", specificEmail: "" });
        loadLogs();
      }
    } finally { setSending(false); }
  };

  const recipientLabel = (type: string) => {
    if (type === "all") return "All registered users";
    if (type === "active") return "Active users (last 7 days)";
    if (type === "specific") return form.specificEmail || "Specific email";
    return type;
  };

  return (
    <div className="space-y-5">
      <h1 className="text-lg font-bold text-zinc-100">Broadcast / Email</h1>

      {/* Honest disclaimer */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="size-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-amber-300">No Email Provider Connected</p>
          <p className="text-xs text-amber-400/80 mt-1 leading-relaxed">
            Broadcasts are <strong>logged and counted</strong> but <strong>no emails are actually sent</strong> — an email provider
            (e.g. SendGrid, Resend, Mailgun) must be integrated first. Use this to plan and track intended broadcasts.
          </p>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-zinc-300">Compose Broadcast</h2>

        <div className="space-y-1.5">
          <label className="text-xs text-zinc-500">Recipients</label>
          <select
            value={form.recipientType}
            onChange={(e) => setForm((p) => ({ ...p, recipientType: e.target.value }))}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none"
          >
            <option value="all">All Registered Users</option>
            <option value="active">Active Users (Last 7 Days)</option>
            <option value="specific">Specific Email Address</option>
          </select>
        </div>

        {form.recipientType === "specific" && (
          <div className="space-y-1.5">
            <label className="text-xs text-zinc-500">Email Address</label>
            <input
              value={form.specificEmail}
              onChange={(e) => setForm((p) => ({ ...p, specificEmail: e.target.value }))}
              placeholder="user@example.com"
              type="email"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none"
            />
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-xs text-zinc-500">Subject</label>
          <input
            value={form.subject}
            onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
            placeholder="Message subject…"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs text-zinc-500">Body</label>
          <textarea
            value={form.body}
            onChange={(e) => setForm((p) => ({ ...p, body: e.target.value }))}
            placeholder="Write your message here…"
            rows={5}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none resize-none"
          />
        </div>

        {result && (
          <div className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 space-y-1">
            <p className="text-xs font-semibold text-zinc-300">✓ Broadcast logged</p>
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <Users className="size-3" />
              <span>
                Would reach <strong className="text-zinc-300">{result.recipientCount}</strong> {recipientLabel(result.recipientType)}
              </span>
            </div>
            <p className="text-[10px] text-amber-500 mt-1">No emails sent — connect an email provider to enable delivery.</p>
          </div>
        )}

        {!showConfirm ? (
          <button
            onClick={() => setShowConfirm(true)}
            disabled={!form.subject || !form.body || sending || (form.recipientType === "specific" && !form.specificEmail)}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-black text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            <Send className="size-4" /> Log Broadcast
          </button>
        ) : (
          <div className="flex items-center gap-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <p className="text-sm text-amber-300 flex-1">
              Log broadcast to <strong>{recipientLabel(form.recipientType)}</strong>? Subject: "{form.subject}"
            </p>
            <button
              onClick={send}
              disabled={sending}
              className="bg-amber-500 hover:bg-amber-400 text-black text-xs font-semibold px-3 py-1.5 rounded-lg"
            >
              {sending ? "Saving…" : "Confirm"}
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="text-zinc-400 hover:text-zinc-200 text-xs px-2 py-1.5"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
          <h2 className="text-sm font-semibold text-zinc-300">Broadcast Log</h2>
          <button onClick={loadLogs} className="text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1">
            <RefreshCw className="size-3" /> Refresh
          </button>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500">Date</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500">Subject</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500">Recipients</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-zinc-500">Count</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500">Logged By</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-zinc-500">No broadcasts logged yet</td>
              </tr>
            ) : logs.map((l: any) => (
              <tr key={l.id} className="border-b border-zinc-800/60 hover:bg-zinc-800/30 transition-colors">
                <td className="px-4 py-3 text-xs text-zinc-400 whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    <Clock className="size-3 text-zinc-600" />
                    {new Date(l.sentAt).toLocaleString()}
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-zinc-300 max-w-[200px] truncate">{l.subject}</td>
                <td className="px-4 py-3 text-xs text-zinc-400">{l.recipientType}</td>
                <td className="px-4 py-3 text-right text-xs font-mono text-zinc-200">{l.recipientCount ?? 0}</td>
                <td className="px-4 py-3 text-xs text-zinc-400">{l.sentBy ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
