import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth, useUser, useClerk } from "@/lib/auth";
import { useAuthModal } from "@/lib/auth-modal-store";
import { useTranslation } from "react-i18next";
import {
  BookOpen, LayoutDashboard, Brain, FileText, Search,
  Settings, Book, Menu, LogOut, BookMarked, Palette, Bookmark, Library, Heart, CalendarDays, TrendingUp, Terminal, Radio, Mic, FolderHeart, User, ImageIcon, LifeBuoy,
} from "lucide-react";
import { SupportDialog } from "@/components/support-dialog";
import { isDevSessionActive } from "@/lib/dev-session";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppStore } from "@/lib/store";
import { PrayerTimesWidget } from "@/components/PrayerTimesWidget";
import TasbihModal from "@/components/tasbih-modal";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const DESKTOP_NAV_KEYS = [
  { href: "/reader",       tKey: "nav.read",      icon: BookOpen },
  { href: "/dashboard",    tKey: "nav.dashboard", icon: LayoutDashboard },
  { href: "/memorization", tKey: "nav.memorize",  icon: Brain },
  { href: "/library",      tKey: "nav.library",   icon: Library },
  { href: "/search",       tKey: "nav.search",    icon: Search },
];

const NAV_LINK_KEYS = [
  { href: "/reader",       tKey: "nav.read",        icon: BookOpen },
  { href: "/dashboard",    tKey: "nav.dashboard",   icon: LayoutDashboard },
  { href: "/memorization", tKey: "nav.memorize",    icon: Brain },
  { href: "/library",      tKey: "nav.library",     icon: Library },
  { href: "/notes",        tKey: "nav.notes",       icon: FileText },
  { href: "/bookmarks",    tKey: "nav.bookmarks",   icon: Bookmark },
  { href: "/ahadith",      tKey: "nav.ahadith",     icon: Book },
  { href: "/search",       tKey: "nav.search",      icon: Search },
  { href: "/radio",        tKey: "nav.radio",       icon: Radio },
  { href: "/reciters",     tKey: "nav.reciters",    icon: Mic },
  { href: "/collections",  tKey: "nav.collections", icon: FolderHeart },
  { href: "/calendar",     tKey: "nav.calendar",    icon: CalendarDays },
  { href: "/media",        tKey: "nav.media",       icon: ImageIcon },
];

const NAV_ITEM_KEYS = [
  { icon: User,            tKey: "nav.profile",       href: "/profile" },
  { icon: LayoutDashboard, tKey: "nav.dashboard",     href: "/dashboard" },
  { icon: BookOpen,        tKey: "nav.read",          href: "/reader" },
  { icon: Brain,           tKey: "nav.memorize",      href: "/memorization" },
  { icon: CalendarDays,    tKey: "nav.calendar",      href: "/calendar" },
  { icon: Library,         tKey: "nav.library",       href: "/library" },
  { icon: Bookmark,        tKey: "nav.bookmarks",     href: "/bookmarks" },
  { icon: Book,            tKey: "nav.ahadith",       href: "/ahadith" },
  { icon: Radio,           tKey: "nav.radio",         href: "/radio" },
  { icon: Mic,             tKey: "nav.reciters",      href: "/reciters" },
  { icon: FolderHeart,     tKey: "nav.collections",   href: "/collections" },
  { icon: ImageIcon,       tKey: "nav.verseImages",   href: "/media" },
];

function UserMenu() {
  const { t } = useTranslation();
  const { user } = useUser();
  const { signOut } = useClerk();
  const [supportOpen, setSupportOpen] = useState(false);

  const initials = user
    ? ((user.firstName?.[0] ?? "") + (user.lastName?.[0] ?? user.username?.[0] ?? "")).toUpperCase()
    : "?";

  const displayName = user?.fullName || user?.username || "Account";
  const handle = user?.primaryEmailAddress?.emailAddress
    ? `@${user.primaryEmailAddress.emailAddress.split("@")[0]}`
    : user?.username ? `@${user.username}` : "";

  return (
    <>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer size-9 border-2 border-border hover:border-primary/60 transition-colors ring-0 focus-visible:ring-2 focus-visible:ring-primary">
          <AvatarImage src={user?.imageUrl ?? undefined} alt={displayName} />
          <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-[300px] rounded-2xl bg-background p-0 border-border shadow-xl"
        align="end"
        sideOffset={10}
      >
        {/* ── Main card ── */}
        <section className="bg-card rounded-2xl p-1 shadow-sm border border-border/60 m-1">

          {/* Identity row — always visible, not scrolled */}
          <div className="flex items-center gap-2.5 px-2 py-2.5">
            <Avatar className="size-10 border border-border shrink-0">
              <AvatarImage src={user?.imageUrl ?? undefined} alt={displayName} />
              <AvatarFallback className="bg-primary text-primary-foreground text-sm font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-foreground truncate">{displayName}</p>
              <p className="text-xs text-muted-foreground truncate">{handle}</p>
            </div>
            <Badge className="bg-primary/10 text-primary border border-primary/20 text-[11px] rounded-md shrink-0 font-medium px-1.5">
              {t("header.active")}
            </Badge>
          </div>

          {/* Appearance — always visible */}
          <div className="flex items-center justify-between px-2 py-2">
            <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Palette className="size-4 shrink-0" />
              {t("header.appearance")}
            </span>
            <ThemeToggle />
          </div>

          <DropdownMenuSeparator className="bg-border/60 my-0.5" />

          {/* Scrollable nav + preferences */}
          <div className="max-h-[320px] overflow-y-auto overflow-x-hidden scrollbar-thin">
            {/* Navigation group */}
            <DropdownMenuGroup>
              {NAV_ITEM_KEYS.map(({ icon: Icon, tKey, href }) => (
                <DropdownMenuItem key={href} asChild>
                  <Link
                    href={href}
                    className="flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground"
                  >
                    <Icon className="size-4 shrink-0" />
                    {t(tKey)}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="bg-border/60 my-0.5" />

            {/* Preferences group */}
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link
                  href="/settings"
                  className="flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  <Settings className="size-4 shrink-0" />
                  {t("nav.settings")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSupportOpen(true)}
                className="flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                <LifeBuoy className="size-4 shrink-0 text-primary" />
                Support
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/notes"
                  className="flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  <BookMarked className="size-4 shrink-0" />
                  {t("header.myNotes")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/give"
                  className="flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  <Heart className="size-4 shrink-0 text-amber-500" />
                  {t("header.give")}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </div>
        </section>

        {/* ── Dev Console (hidden, only when dev session active) ── */}
        {isDevSessionActive() && (
          <section className="px-1 pt-1">
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 overflow-hidden">
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link
                    href="/dev-console"
                    className="flex items-center gap-2 px-2 py-2 rounded-xl cursor-pointer text-sm font-medium text-amber-400 hover:text-amber-300 hover:bg-amber-500/10"
                  >
                    <Terminal className="size-4 shrink-0" />
                    ⚙ {t("header.devConsole")}
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </div>
          </section>
        )}

        {/* ── Bottom: sign out ── */}
        <section className="px-1 pb-1">
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => signOut({ redirectUrl: "/" })}
              className="flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer text-sm font-medium text-destructive hover:bg-destructive/10 focus:bg-destructive/10 focus:text-destructive mt-0.5"
            >
              <LogOut className="size-4 shrink-0" />
              {t("header.signOut")}
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </section>
      </DropdownMenuContent>
    </DropdownMenu>

    <SupportDialog open={supportOpen} onOpenChange={setSupportOpen} />
    </>
  );
}

export default function Header() {
  const { t } = useTranslation();
  const [location] = useLocation();
  const { isSignedIn } = useAuth();
  const { theme, setTheme } = useAppStore();
  const openModal = useAuthModal((s) => s.openModal);
  const [isTasbihOpen, setIsTasbihOpen] = useState(false);
  const [hijriDate, setHijriDate] = useState("");

  useEffect(() => {
    try {
      const date = new Intl.DateTimeFormat("en-US-u-ca-islamic", {
        day: "numeric", month: "long", year: "numeric",
      }).format(new Date());
      setHijriDate(date);
    } catch {
      // not supported in this env
    }
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        window.location.href = "/search?focus=1";
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">

        {/* Mobile: hamburger + logo */}
        <div className="flex items-center gap-2 md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side={document.documentElement.dir === "rtl" ? "right" : "left"} className="w-[280px] sm:w-[350px]">
              <div className="flex flex-col gap-6 py-6">
                <Link href="/" className="text-2xl font-bold font-arabic text-primary px-2">نور</Link>
                <nav className="flex flex-col gap-1">
                  {NAV_LINK_KEYS.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link key={link.href} href={link.href}>
                        <Button
                          variant={location === link.href ? "secondary" : "ghost"}
                          className="w-full justify-start"
                        >
                          <Icon className="me-2 h-4 w-4" />
                          {t(link.tKey)}
                        </Button>
                      </Link>
                    );
                  })}
                </nav>
                {/* Theme toggle in mobile menu too */}
                <div className="px-2 flex flex-col gap-2">
                  <p className="text-xs text-muted-foreground font-medium">{t("header.appearance")}</p>
                  <ThemeToggle />
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <Link href="/reader" className="text-2xl font-bold font-arabic text-primary">نور</Link>
        </div>

        {/* Desktop: logo + nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-3xl font-bold font-arabic text-primary translate-y-1">نور</span>
            <span className="font-bold text-lg hidden lg:inline-block">NoorAl</span>
          </Link>
          <nav className="flex items-center gap-0.5">
            {DESKTOP_NAV_KEYS.map((link) => {
              const Icon = link.icon;
              return (
                <Link key={link.href} href={link.href}>
                  <Button
                    variant={location === link.href ? "secondary" : "ghost"}
                    className="h-9 px-3 text-sm font-medium"
                  >
                    <Icon className="mr-1.5 h-4 w-4 hidden lg:inline-block" />
                    {t(link.tKey)}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {hijriDate && (
            <span className="hidden xl:inline-block text-sm text-muted-foreground mr-1 font-medium">
              {hijriDate}
            </span>
          )}

          <PrayerTimesWidget />

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsTasbihOpen(true)}
            className="hidden sm:flex"
          >
            {t("header.tasbih")}
          </Button>

          {/* Theme toggle — visible on desktop, outside profile */}
          <ThemeToggle className="hidden sm:inline-flex" />

          {/* Auth */}
          {isSignedIn ? (
            <UserMenu />
          ) : (
            <Button size="sm" className="rounded-xl" onClick={() => openModal("sign-in")}>{t("header.signIn")}</Button>
          )}
        </div>
      </div>

      <TasbihModal open={isTasbihOpen} onOpenChange={setIsTasbihOpen} />
    </header>
  );
}
