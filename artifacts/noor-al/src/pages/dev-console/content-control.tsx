import * as React from "react";
import { devFetch } from "@/lib/dev-session";
import { RefreshCw, Plus, Trash2, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

const FLAG_LABELS: Record<string, string> = {
  quran_reader: "Quran Reader",
  library: "Library",
  memorization: "Memorization Tracker",
  ahadith: "Ahadith Section",
  duas_adhkar: "Duas & Adhkar",
  prayer_times: "Prayer Times Widget",
  support_sadaqah: "Support / Sadaqah Page",
  user_registration: "User Registration",
  audio_player: "Audio Player",
  maintenance_mode: "Maintenance Mode",
};

export default function ContentControlSection() {
  const [flags, setFlags] = React.useState<any[]>([]);
  const [announcements, setAnnouncements] = React.useState<any[]>([]);
  const [loadingFlags, setLoadingFlags] = React.useState(true);
  const [newAnn, setNewAnn] = React.useState({ messageEn: "", messageAr: "", active: false });
  const [preview, setPreview] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  const loadFlags = async () => {
    setLoadingFlags(true);
    try {
      const res = await devFetch(`${import.meta.env.BASE_URL}api/dev/feature-flags`);
      if (res.ok) setFlags(await res.json());
    } finally { setLoadingFlags(false); }
  };

  const loadAnn = async () => {
    const res = await devFetch(`${import.meta.env.BASE_URL}api/dev/announcements`);
    if (res.ok) setAnnouncements(await res.json());
  };

  React.useEffect(() => { loadFlags(); loadAnn(); }, []);

  const toggleFlag = async (flagName: string, enabled: boolean) => {
    const res = await devFetch(`${import.meta.env.BASE_URL}api/dev/feature-flags/${flagName}`, {
      method: "PATCH",
      body: JSON.stringify({ enabled }),
    });
    if (res.ok) {
      const updated = await res.json();
      setFlags((prev) => prev.map((f) => f.flagName === flagName ? updated : f));
    }
  };

  const publishAnn = async () => {
    setSaving(true);
    try {
      const res = await devFetch(`${import.meta.env.BASE_URL}api/dev/announcements`, {
        method: "POST",
        body: JSON.stringify(newAnn),
      });
      if (res.ok) {
        setNewAnn({ messageEn: "", messageAr: "", active: false });
        loadAnn();
      }
    } finally { setSaving(false); }
  };

  const toggleAnn = async (id: number, current: any) => {
    const res = await devFetch(`${import.meta.env.BASE_URL}api/dev/announcements/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ ...current, active: !current.active }),
    });
    if (res.ok) loadAnn();
  };

  const deleteAnn = async (id: number) => {
    if (!confirm("Delete this announcement?")) return;
    await devFetch(`${import.meta.env.BASE_URL}api/dev/announcements/${id}`, { method: "DELETE" });
    loadAnn();
  };

  const maintenanceFlag = flags.find((f) => f.flagName === "maintenance_mode");
  const featureFlags = flags.filter((f) => f.flagName !== "maintenance_mode");

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-bold text-zinc-100">Content Control</h1>

      {/* Maintenance Mode */}
      {maintenanceFlag && (
        <div className={cn(
          "border rounded-xl p-4 flex items-center justify-between",
          maintenanceFlag.enabled ? "bg-red-500/10 border-red-500/30" : "bg-zinc-900 border-zinc-800"
        )}>
          <div>
            <p className="font-semibold text-zinc-200">🚧 Maintenance Mode</p>
            <p className="text-xs text-zinc-500 mt-0.5">When on, all pages show a maintenance screen</p>
          </div>
          <button
            onClick={() => toggleFlag("maintenance_mode", !maintenanceFlag.enabled)}
            className={cn(
              "relative inline-flex h-6 w-11 rounded-full transition-colors",
              maintenanceFlag.enabled ? "bg-red-500" : "bg-zinc-700"
            )}
          >
            <span className={cn(
              "inline-block h-5 w-5 rounded-full bg-white shadow transition-transform mt-0.5",
              maintenanceFlag.enabled ? "translate-x-5" : "translate-x-0.5"
            )} />
          </button>
        </div>
      )}

      {/* Feature Flags */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
          <div>
            <h2 className="text-sm font-semibold text-zinc-200">Feature Flags</h2>
            <p className="text-[10px] text-zinc-600 mt-0.5">Stored in DB only — wire to app code to enforce these flags</p>
          </div>
          <button onClick={loadFlags} className="text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1">
            <RefreshCw className="size-3" /> Refresh
          </button>
        </div>
        <div className="divide-y divide-zinc-800">
          {loadingFlags ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-3">
                <div className="h-4 w-40 bg-zinc-800 rounded animate-pulse" />
                <div className="h-6 w-11 bg-zinc-800 rounded-full animate-pulse" />
              </div>
            ))
          ) : featureFlags.map((flag) => (
            <div key={flag.flagName} className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-sm text-zinc-200">{FLAG_LABELS[flag.flagName] ?? flag.flagName}</p>
                <p className="text-xs text-zinc-500">{flag.flagName}</p>
              </div>
              <button
                onClick={() => toggleFlag(flag.flagName, !flag.enabled)}
                className={cn(
                  "relative inline-flex h-6 w-11 rounded-full transition-colors",
                  flag.enabled ? "bg-amber-500" : "bg-zinc-700"
                )}
              >
                <span className={cn(
                  "inline-block h-5 w-5 rounded-full bg-white shadow transition-transform mt-0.5",
                  flag.enabled ? "translate-x-5" : "translate-x-0.5"
                )} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Announcements */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-zinc-200">Sitewide Announcement Banner</h2>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-zinc-500 mb-1 block">English Message</label>
            <input
              value={newAnn.messageEn}
              onChange={(e) => setNewAnn((p) => ({ ...p, messageEn: e.target.value }))}
              placeholder="Announcement in English…"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-500 mb-1 block">Arabic Message</label>
            <input
              value={newAnn.messageAr}
              onChange={(e) => setNewAnn((p) => ({ ...p, messageAr: e.target.value }))}
              dir="rtl"
              placeholder="الإعلان بالعربية…"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer">
              <input
                type="checkbox"
                checked={newAnn.active}
                onChange={(e) => setNewAnn((p) => ({ ...p, active: e.target.checked }))}
                className="rounded"
              />
              Publish immediately
            </label>
            <button
              onClick={() => setPreview(!preview)}
              className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300"
            >
              <Eye className="size-3.5" /> Preview
            </button>
          </div>
          {preview && (newAnn.messageEn || newAnn.messageAr) && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 text-sm">
              {newAnn.messageEn && <p className="text-amber-300">{newAnn.messageEn}</p>}
              {newAnn.messageAr && <p className="text-amber-300 text-right mt-1" dir="rtl">{newAnn.messageAr}</p>}
            </div>
          )}
          <button
            onClick={publishAnn}
            disabled={saving || (!newAnn.messageEn && !newAnn.messageAr)}
            className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-black text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="size-4" /> Publish Announcement
          </button>
        </div>

        {announcements.length > 0 && (
          <div className="space-y-2 mt-4">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Existing Announcements</p>
            {announcements.map((a) => (
              <div key={a.id} className={cn(
                "flex items-start justify-between gap-3 p-3 rounded-lg border",
                a.active ? "bg-amber-500/10 border-amber-500/30" : "bg-zinc-800/50 border-zinc-700"
              )}>
                <div className="flex-1 min-w-0">
                  {a.messageEn && <p className="text-xs text-zinc-300 truncate">{a.messageEn}</p>}
                  {a.messageAr && <p className="text-xs text-zinc-400 truncate" dir="rtl">{a.messageAr}</p>}
                  <p className="text-[10px] text-zinc-600 mt-1">{new Date(a.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleAnn(a.id, a)}
                    className={cn(
                      "relative inline-flex h-5 w-9 rounded-full transition-colors",
                      a.active ? "bg-amber-500" : "bg-zinc-700"
                    )}
                  >
                    <span className={cn("inline-block h-4 w-4 rounded-full bg-white shadow transition-transform mt-0.5", a.active ? "translate-x-4" : "translate-x-0.5")} />
                  </button>
                  <button onClick={() => deleteAnn(a.id)} className="text-zinc-600 hover:text-red-400 transition-colors">
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
