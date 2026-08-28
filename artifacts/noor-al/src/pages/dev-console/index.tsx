import * as React from "react";
import { useLocation } from "wouter";
import {
  LayoutDashboard, Users, MessageSquare, DollarSign, ToggleLeft,
  Database, Shield, Radio, Activity, LogOut, Terminal, Clock,
} from "lucide-react";
import { getDevSession, clearDevSession, touchDevSession } from "@/lib/dev-session";
import Header from "@/components/layout/header";
import OverviewSection from "./overview";
import UsersSection from "./users";
import FeedbackSection from "./feedback-section";
import FinancialSection from "./financial";
import ContentControlSection from "./content-control";
import DatabaseSection from "./database";
import SecuritySection from "./security";
import BroadcastSection from "./broadcast";
import ApiStatusSection from "./api-status";
import { cn } from "@/lib/utils";

type Section =
  | "overview" | "users" | "feedback" | "financial"
  | "content" | "database" | "security" | "broadcast" | "api";

const NAV: { id: Section; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "overview",  label: "Overview",         icon: LayoutDashboard },
  { id: "users",     label: "Users",             icon: Users },
  { id: "feedback",  label: "Support & Feedback", icon: MessageSquare },
  { id: "financial", label: "Financial",         icon: DollarSign },
  { id: "content",   label: "Content Control",   icon: ToggleLeft },
  { id: "database",  label: "Database",          icon: Database },
  { id: "security",  label: "Security",          icon: Shield },
  { id: "broadcast", label: "Broadcast",         icon: Radio },
  { id: "api",       label: "API Status",        icon: Activity },
];

function SessionTimer({ loginTime }: { loginTime: number }) {
  const [remaining, setRemaining] = React.useState(0);

  React.useEffect(() => {
    const TTL = 30 * 60 * 1000;
    const update = () => {
      const elapsed = Date.now() - loginTime;
      setRemaining(Math.max(0, TTL - elapsed));
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [loginTime]);

  const mins = Math.floor(remaining / 60000);
  const secs = Math.floor((remaining % 60000) / 1000);
  const urgent = remaining < 5 * 60 * 1000;

  return (
    <span className={cn("flex items-center gap-1.5 text-xs tabular-nums", urgent ? "text-red-400" : "text-zinc-400")}>
      <Clock className="size-3" />
      {mins}:{String(secs).padStart(2, "0")} remaining
    </span>
  );
}

export default function DevConsolePage() {
  const [, setLocation] = useLocation();
  const [section, setSection] = React.useState<Section>("overview");

  const session = getDevSession();

  React.useEffect(() => {
    if (!session) { setLocation("/"); return; }
    const id = setInterval(() => {
      if (!getDevSession()) setLocation("/");
    }, 30000);
    return () => clearInterval(id);
  }, []);

  React.useEffect(() => {
    touchDevSession();
  }, [section]);

  if (!session) return null;

  const handleLogout = () => {
    clearDevSession();
    setLocation("/");
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#0a0a0a] text-zinc-100">
      {/* App header */}
      <div className="shrink-0">
        <Header />
      </div>

      {/* Console body: sidebar + content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-56 shrink-0 border-r border-zinc-800 flex flex-col bg-[#0d0d0d]">
          <div className="px-4 py-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <div className="size-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                <Terminal className="size-3.5 text-amber-400" />
              </div>
              <span className="text-sm font-bold text-amber-400 tracking-wide">Dev Console</span>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
            {NAV.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setSection(id)}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left",
                  section === id
                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                )}
              >
                <Icon className="size-4 shrink-0" />
                {label}
              </button>
            ))}
          </nav>

          <div className="px-3 py-3 border-t border-zinc-800">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="size-4" />
              Logout
            </button>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Console top bar */}
          <div className="h-11 border-b border-zinc-800 bg-[#0d0d0d] flex items-center justify-between px-5 shrink-0">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-zinc-200">NoorAl Dev Console</span>
              <span className="text-xs text-zinc-600">|</span>
              <span className="text-xs text-amber-400 font-medium">{session.name}</span>
            </div>
            <SessionTimer loginTime={session.loginTime} />
          </div>

          {/* Content */}
          <main className="flex-1 overflow-y-auto p-6 bg-[#0a0a0a]">
            {section === "overview"  && <OverviewSection />}
            {section === "users"     && <UsersSection />}
            {section === "feedback"  && <FeedbackSection />}
            {section === "financial" && <FinancialSection />}
            {section === "content"   && <ContentControlSection />}
            {section === "database"  && <DatabaseSection />}
            {section === "security"  && <SecuritySection />}
            {section === "broadcast" && <BroadcastSection />}
            {section === "api"       && <ApiStatusSection />}
          </main>
        </div>
      </div>
    </div>
  );
}
