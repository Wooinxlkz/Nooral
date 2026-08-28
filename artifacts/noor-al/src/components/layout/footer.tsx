import { Link } from "wouter";
import { Mail, Heart, Instagram, Github, Globe } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const navigation = [
  {
    id: "explore",
    name: "Explore",
    items: [
      { name: "Quran Reader", href: "/reader" },
      { name: "Memorization", href: "/memorization" },
      { name: "Library", href: "/library" },
    ],
  },
  {
    id: "features",
    name: "Features",
    items: [
      { name: "Search", href: "/search" },
      { name: "Bookmarks", href: "/bookmarks" },
      { name: "Notes", href: "/notes" },
    ],
  },
  {
    id: "listen",
    name: "Listen",
    items: [
      { name: "Quran Radio", href: "/radio" },
      { name: "Reciters", href: "/reciters" },
      { name: "Ahadith", href: "/ahadith" },
    ],
  },
  {
    id: "tools",
    name: "Tools",
    items: [
      { name: "Prayer Times", href: "/dashboard" },
      { name: "Calendar", href: "/calendar" },
      { name: "Collections", href: "/collections" },
    ],
  },
  {
    id: "account",
    name: "Account",
    items: [
      { name: "Dashboard", href: "/dashboard" },
      { name: "Profile", href: "/profile" },
      { name: "Settings", href: "/settings" },
    ],
  },
  {
    id: "company",
    name: "Company",
    items: [
      { name: "About", href: "/about" },
      { name: "Documentation", href: "/documentation" },
      { name: "Contribute", href: "/contribute" },
      { name: "Privacy", href: "/privacy" },
      { name: "Terms", href: "/terms" },
    ],
  },
];

const socialLinks = [
  { href: "mailto:karimsc01t@gmail.com", icon: Mail, label: "Email" },
  { href: "https://x.com/syncinitstation", icon: XIcon, label: "X" },
  { href: "https://www.instagram.com/ka._.r1m", icon: Instagram, label: "Instagram" },
  { href: "https://github.com/Wooinxlkz", icon: Github, label: "GitHub" },
  { href: "https://nulltrace.com", icon: Globe, label: "Website" },
];

const iconLinkClass =
  "hover:-translate-y-1 border border-dotted border-border/60 rounded-xl p-2.5 transition-all duration-200 text-muted-foreground hover:text-primary hover:border-primary/40";

export function Footer() {
  return (
    <footer className="border-t border-border/40 w-full">
      {/* ── Brand + description ── */}
      <div className="relative mx-auto grid max-w-7xl items-center justify-center gap-6 p-10 pb-0 md:flex">
        <Link href="/">
          <span className="flex items-center justify-center gap-2 shrink-0">
            <span className="text-4xl font-bold font-arabic text-primary translate-y-1 leading-none">نور</span>
            <span className="font-bold text-lg text-foreground">NoorAl</span>
          </span>
        </Link>
        <p className="bg-transparent text-center text-xs leading-5 text-muted-foreground md:text-left max-w-lg">
          NoorAl is your complete Quran companion — read, memorize, reflect, and connect
          with the words of Allah. Built with care to help Muslims around the world
          deepen their relationship with the Quran, one verse at a time.
        </p>
      </div>

      {/* ── Nav grid ── */}
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="border-b border-border/40 border-dotted" />
        <div className="py-10">
          <div className="grid grid-cols-3 gap-6 leading-6 md:flex md:flex-row md:justify-between">
            {navigation.map((section) => (
              <div key={section.id}>
                <p className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wider">
                  {section.name}
                </p>
                <ul role="list" className="flex flex-col space-y-2">
                  {section.items.map((item) => (
                    <li key={item.name} className="flow-root">
                      <Link
                        href={item.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150 md:text-xs"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="border-b border-border/40 border-dotted" />
      </div>

      {/* ── Social + theme ── */}
      <div className="flex flex-wrap justify-center gap-y-6">
        <div className="flex flex-wrap items-center justify-center gap-4 gap-y-4 px-6">
          {socialLinks.map(({ href, icon: Icon, label }) => (
            <a
              key={label}
              aria-label={label}
              href={href}
              rel="noreferrer"
              target="_blank"
              className={iconLinkClass}
            >
              <Icon strokeWidth={1.5} className="h-5 w-5" />
            </a>
          ))}
        </div>
        <div className="flex items-center px-6">
          <ThemeToggle />
        </div>
      </div>

      {/* ── Copyright ── */}
      <div className="mx-auto mb-10 mt-10 flex flex-col justify-between text-center text-xs md:max-w-7xl">
        <div className="flex flex-row items-center justify-center gap-1 text-muted-foreground flex-wrap">
          <span>©</span>
          <span>{new Date().getFullYear()}</span>
          <span>Made with</span>
          <Heart className="text-primary mx-1 h-3.5 w-3.5 animate-pulse" />
          <span>by the</span>
          <Link href="/about" className="font-semibold text-foreground hover:text-primary transition-colors ml-0.5">
            Nulltrace
          </Link>
          <span>team</span>
          <span className="mx-2 text-border">·</span>
          <span className="font-arabic text-sm text-primary/70">بِسْمِ اللَّهِ</span>
        </div>
      </div>
    </footer>
  );
}
