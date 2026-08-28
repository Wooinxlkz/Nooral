import { useState, useRef, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAppStore } from "@/lib/store";

// ─── Types ────────────────────────────────────────────────────────────────────

type Era = "pre-ibrahim" | "ibrahim" | "bani-israel" | "muhammad";

interface Node {
  id: string;
  num: number;
  nameEn: string;
  nameAr: string;
  era: Era;
  period: string;
  sentTo: string;
  miracle: string;
  x: number;
  y: number;
}

// ─── Palette ──────────────────────────────────────────────────────────────────

const ERA_COLOR: Record<Era, string> = {
  "pre-ibrahim": "#8B5CF6",
  ibrahim:       "#10B981",
  "bani-israel": "#3B82F6",
  muhammad:      "#C0A060",
};

const ERA_LABEL_EN: Record<Era, string> = {
  "pre-ibrahim": "Pre-Ibrahim Prophets",
  ibrahim:       "Ibrahim ﷺ & Lineage",
  "bani-israel": "Prophets of Bani Israel",
  muhammad:      "Final Prophet ﷺ",
};

const ERA_LABEL_AR: Record<Era, string> = {
  "pre-ibrahim": "الأنبياء قبل إبراهيم",
  ibrahim:       "إبراهيم ﷺ وذريته",
  "bani-israel": "أنبياء بني إسرائيل",
  muhammad:      "خاتم الأنبياء ﷺ",
};

// ─── Prophet nodes ─────────────────────────────────────────────────────────────

const NODES: Node[] = [
  // Pre-Ibrahim
  { num:1,  id:"adam",      nameEn:"Adam",       nameAr:"آدَم",       era:"pre-ibrahim", period:"Beginning of creation",  sentTo:"All humanity",            miracle:"Created by Allah from clay; angels prostrated to him",      x:100, y:240 },
  { num:2,  id:"idris",     nameEn:"Idris",      nameAr:"إِدْرِيس",   era:"pre-ibrahim", period:"Early humanity",         sentTo:"Early humans",            miracle:"Raised to a high station by Allah (19:57)",                 x:215, y:110 },
  { num:3,  id:"nuh",       nameEn:"Nuh",        nameAr:"نُوح",       era:"pre-ibrahim", period:"~3000+ BCE",             sentTo:"His people",              miracle:"The Great Ark — 950 years of da'wah",                       x:360, y:240 },
  { num:4,  id:"hud",       nameEn:"Hud",        nameAr:"هُود",       era:"pre-ibrahim", period:"~2400 BCE",              sentTo:"'Ad people",              miracle:"'Ad destroyed by violent wind for 8 days",                  x:205, y:390 },
  { num:5,  id:"salih",     nameEn:"Salih",      nameAr:"صَالِح",     era:"pre-ibrahim", period:"~2000 BCE",              sentTo:"Thamud people",           miracle:"She-camel brought from solid rock",                         x:470, y:380 },
  // Ibrahim lineage
  { num:6,  id:"ibrahim",   nameEn:"Ibrahim",    nameAr:"إِبْرَاهِيم",era:"ibrahim",     period:"~2000–1800 BCE",         sentTo:"Babylon & Makkah",        miracle:"Fire made cool; rebuilt the Kaaba; Khalilullah",            x:650, y:220 },
  { num:7,  id:"lut",       nameEn:"Lut",        nameAr:"لُوط",       era:"ibrahim",     period:"~2000–1800 BCE",         sentTo:"Sodom (Qawm Lut)",        miracle:"City turned upside down and rained with stones",             x:770, y:390 },
  { num:8,  id:"ismail",    nameEn:"Ismail",     nameAr:"إِسْمَاعِيل",era:"ibrahim",     period:"~1900 BCE",              sentTo:"Arabs of the Hijaz",      miracle:"Patient in the great sacrifice; built Kaaba with Ibrahim",  x:800, y:100 },
  { num:9,  id:"ishaq",     nameEn:"Ishaq",      nameAr:"إِسْحَاق",   era:"ibrahim",     period:"~1900 BCE",              sentTo:"Canaan",                  miracle:"Born miraculously to elderly parents",                      x:920, y:250 },
  { num:10, id:"yaqub",     nameEn:"Ya'qub",     nameAr:"يَعْقُوب",   era:"ibrahim",     period:"~1850 BCE",              sentTo:"Canaan",                  miracle:"Sight restored by Yusuf's shirt after decades",             x:1020, y:120 },
  { num:11, id:"yusuf",     nameEn:"Yusuf",      nameAr:"يُوسُف",     era:"ibrahim",     period:"~1800 BCE",              sentTo:"Egypt",                   miracle:"Divine dream interpretation; preserved through every trial", x:1100, y:360 },
  // Bani Israel
  { num:12, id:"ayyub",     nameEn:"Ayyub",      nameAr:"أَيُّوب",    era:"bani-israel", period:"~1700 BCE",              sentTo:"Uz (Syria/Arabia)",       miracle:"Healed after 18 years of patient endurance",               x:1210, y:175 },
  { num:13, id:"shuayb",    nameEn:"Shu'ayb",    nameAr:"شُعَيْب",    era:"bani-israel", period:"~1600 BCE",              sentTo:"Madyan",                  miracle:"Madyan destroyed for fraud in weights and measures",        x:1310, y:395 },
  { num:14, id:"musa",      nameEn:"Musa",       nameAr:"مُوسَى",     era:"bani-israel", period:"~1400 BCE",              sentTo:"Bani Israel / Egypt",     miracle:"Staff into serpent; Red Sea split",                         x:1450, y:210 },
  { num:15, id:"harun",     nameEn:"Harun",      nameAr:"هَارُون",    era:"bani-israel", period:"~1400 BCE",              sentTo:"Bani Israel",             miracle:"Prophet and spokesperson alongside Musa",                   x:1570, y:105 },
  { num:16, id:"dhulkifl",  nameEn:"Dhul-Kifl",  nameAr:"ذُو الكِفْل",era:"bani-israel", period:"~1300 BCE",             sentTo:"Bani Israel",             miracle:"Patient in all circumstances; righteous judgments",         x:1510, y:410 },
  { num:17, id:"dawud",     nameEn:"Dawud",      nameAr:"دَاوُد",     era:"bani-israel", period:"~1000 BCE",              sentTo:"Bani Israel",             miracle:"Iron made soft; mountains & birds glorified with him",      x:1680, y:250 },
  { num:18, id:"sulayman",  nameEn:"Sulayman",   nameAr:"سُلَيْمَان", era:"bani-israel", period:"~970–931 BCE",           sentTo:"Bani Israel & beyond",    miracle:"Commanded jinn, wind, animals; spoke to birds and ants",    x:1800, y:115 },
  { num:19, id:"ilyas",     nameEn:"Ilyas",      nameAr:"إِلْيَاس",   era:"bani-israel", period:"~900 BCE",               sentTo:"Bani Israel (Baalbek)",   miracle:"Called people away from idol Ba'l",                         x:1800, y:415 },
  { num:20, id:"alyasa",    nameEn:"Al-Yasa'",   nameAr:"الْيَسَع",   era:"bani-israel", period:"~850 BCE",               sentTo:"Bani Israel",             miracle:"Successor of Ilyas; greatly praised by Allah",              x:1920, y:295 },
  { num:21, id:"yunus",     nameEn:"Yunus",      nameAr:"يُونُس",     era:"bani-israel", period:"~800 BCE",               sentTo:"Nineveh (Iraq)",          miracle:"Survived in whale by dhikr; entire city repented",          x:1960, y:455 },
  { num:22, id:"zakariyya", nameEn:"Zakariyya",  nameAr:"زَكَرِيَّا", era:"bani-israel", period:"~100 BCE",               sentTo:"Bani Israel (Jerusalem)", miracle:"Son Yahya born despite extreme old age and barren wife",    x:2040, y:170 },
  { num:23, id:"yahya",     nameEn:"Yahya",      nameAr:"يَحْيَى",    era:"bani-israel", period:"~1 BCE – 30 CE",         sentTo:"Bani Israel (Jordan)",    miracle:"Named directly by Allah; given wisdom as a child",          x:2140, y:340 },
  { num:24, id:"isa",       nameEn:"Isa",        nameAr:"عِيسَى",     era:"bani-israel", period:"~0 – 33 CE",             sentTo:"Bani Israel",             miracle:"Virgin birth; spoke in cradle; raised the dead",            x:2240, y:200 },
  // Final Prophet
  { num:25, id:"muhammad",  nameEn:"Muhammad ﷺ", nameAr:"مُحَمَّد",   era:"muhammad",    period:"570 – 632 CE",           sentTo:"All of humanity",         miracle:"The eternal Quran; Isra wal Miraj; split the moon",         x:2440, y:255 },
];

const NODE_MAP: Record<string, Node> = {};
for (const n of NODES) NODE_MAP[n.id] = n;

// ─── Edges ────────────────────────────────────────────────────────────────────

interface Edge { from: string; to: string; style: "lineage" | "related" }

const EDGES: Edge[] = [
  { from: "adam",      to: "nuh",       style: "lineage" },
  { from: "nuh",       to: "ibrahim",   style: "lineage" },
  { from: "ibrahim",   to: "ismail",    style: "lineage" },
  { from: "ibrahim",   to: "ishaq",     style: "lineage" },
  { from: "ishaq",     to: "yaqub",     style: "lineage" },
  { from: "yaqub",     to: "yusuf",     style: "lineage" },
  { from: "dawud",     to: "sulayman",  style: "lineage" },
  { from: "zakariyya", to: "yahya",     style: "lineage" },
  { from: "ismail",    to: "muhammad",  style: "lineage" },
  { from: "adam",      to: "idris",     style: "related" },
  { from: "idris",     to: "nuh",       style: "related" },
  { from: "nuh",       to: "hud",       style: "related" },
  { from: "nuh",       to: "salih",     style: "related" },
  { from: "hud",       to: "salih",     style: "related" },
  { from: "salih",     to: "ibrahim",   style: "related" },
  { from: "ibrahim",   to: "lut",       style: "related" },
  { from: "yusuf",     to: "ayyub",     style: "related" },
  { from: "ayyub",     to: "shuayb",    style: "related" },
  { from: "shuayb",    to: "musa",      style: "related" },
  { from: "musa",      to: "harun",     style: "related" },
  { from: "musa",      to: "dhulkifl",  style: "related" },
  { from: "dawud",     to: "ilyas",     style: "related" },
  { from: "ilyas",     to: "alyasa",    style: "related" },
  { from: "alyasa",    to: "yunus",     style: "related" },
  { from: "zakariyya", to: "isa",       style: "related" },
  { from: "yahya",     to: "isa",       style: "related" },
  { from: "isa",       to: "muhammad",  style: "related" },
];

// ─── Era background regions ───────────────────────────────────────────────────

const ERA_REGIONS = [
  { era: "pre-ibrahim"  as Era, x: 28,   y: 52,  w: 512,  h: 415 },
  { era: "ibrahim"      as Era, x: 575,  y: 52,  w: 590,  h: 380 },
  { era: "bani-israel"  as Era, x: 1165, y: 52,  w: 1142, h: 450 },
  { era: "muhammad"     as Era, x: 2348, y: 148, w: 162,  h: 218 },
];

// ─── SVG helpers ──────────────────────────────────────────────────────────────

function bezierPath(x1: number, y1: number, x2: number, y2: number): string {
  const cx1 = x1 + (x2 - x1) * 0.45;
  const cx2 = x1 + (x2 - x1) * 0.55;
  return `M ${x1},${y1} C ${cx1},${y1} ${cx2},${y2} ${x2},${y2}`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ProphetTimeline() {
  const [, setLocation] = useLocation();
  const [selected, setSelected] = useState<string | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const language = useAppStore((s) => s.language);
  const isArabic = language === "ar";

  const selectedNode = selected ? NODE_MAP[selected] : null;
  const eraColor = selectedNode ? ERA_COLOR[selectedNode.era] : "#3B82F6";

  // ── Scroll arrow logic ────────────────────────────────────────────────────
  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  }, []);

  useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollState, { passive: true });
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);
    return () => { el.removeEventListener("scroll", updateScrollState); ro.disconnect(); };
  }, [updateScrollState]);

  const scrollBy = (delta: number) => {
    scrollRef.current?.scrollBy({ left: delta, behavior: "smooth" });
  };

  // ── Scroll to prophet card below diagram ─────────────────────────────────
  const scrollToCard = (prophetId: string) => {
    const el = document.getElementById(`prophet-${prophetId}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  // ── Drag-to-scroll for desktop ────────────────────────────────────────────
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragScrollLeft = useRef(0);

  const onMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    isDragging.current = true;
    dragStartX.current = e.pageX - scrollRef.current.offsetLeft;
    dragScrollLeft.current = scrollRef.current.scrollLeft;
    scrollRef.current.style.cursor = "grabbing";
  };
  const onMouseUp = () => {
    isDragging.current = false;
    if (scrollRef.current) scrollRef.current.style.cursor = "grab";
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    scrollRef.current.scrollLeft = dragScrollLeft.current - (x - dragStartX.current);
  };

  return (
    <div className="space-y-4">

      {/* ── Legend ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs px-4 md:px-6">
        {(Object.entries(ERA_COLOR) as [Era, string][]).map(([era, color]) => (
          <span key={era} className="flex items-center gap-1.5">
            <span
              className="w-3 h-3 rounded-full inline-block shrink-0"
              style={{ background: color }}
            />
            <span className="text-muted-foreground">
              {isArabic ? ERA_LABEL_AR[era] : ERA_LABEL_EN[era]}
            </span>
          </span>
        ))}
        <span className="flex items-center gap-1.5 ml-2">
          <svg width="24" height="8" viewBox="0 0 24 8">
            <line x1="0" y1="4" x2="24" y2="4" stroke="#94a3b8" strokeWidth="2" />
          </svg>
          <span className="text-muted-foreground">{isArabic ? "النسب" : "Lineage"}</span>
        </span>
        <span className="flex items-center gap-1.5">
          <svg width="24" height="8" viewBox="0 0 24 8">
            <line x1="0" y1="4" x2="24" y2="4" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 3" />
          </svg>
          <span className="text-muted-foreground">
            {isArabic ? "معاصرة / علاقة" : "Related / contemporary"}
          </span>
        </span>
      </div>

      {/* ── Scrollable SVG canvas with nav arrows ──────────────────────────── */}
      <div className="relative group/timeline">
        {/* Left arrow */}
        <button
          onClick={() => scrollBy(-400)}
          aria-label="Scroll left"
          className={`
            absolute left-2 top-1/2 -translate-y-1/2 z-10
            h-9 w-9 rounded-full bg-card border border-border shadow-md
            flex items-center justify-center
            text-muted-foreground hover:text-foreground
            transition-all duration-200
            hidden md:flex
            ${canScrollLeft ? "opacity-100" : "opacity-0 pointer-events-none"}
          `}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Right arrow */}
        <button
          onClick={() => scrollBy(400)}
          aria-label="Scroll right"
          className={`
            absolute right-2 top-1/2 -translate-y-1/2 z-10
            h-9 w-9 rounded-full bg-card border border-border shadow-md
            flex items-center justify-center
            text-muted-foreground hover:text-foreground
            transition-all duration-200
            hidden md:flex
            ${canScrollRight ? "opacity-100" : "opacity-0 pointer-events-none"}
          `}
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        {/* SVG scroll container */}
        <div
          ref={scrollRef}
          className="w-full overflow-x-auto rounded-xl border bg-card shadow-sm"
          style={{
            cursor: "grab",
            scrollbarWidth: "thin",
            WebkitOverflowScrolling: "touch",
          }}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onMouseMove={onMouseMove}
        >
          <svg
            width="2560"
            height="530"
            viewBox="0 0 2560 530"
            style={{ display: "block" }}
            aria-label={isArabic ? "خريطة الأنبياء" : "Prophet Timeline"}
          >
            <defs>
              <filter id="node-glow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="muhammad-glow">
                <feGaussianBlur stdDeviation="8" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Era background bands */}
            {ERA_REGIONS.map(({ era, x, y, w, h }) => (
              <rect
                key={era}
                x={x} y={y} width={w} height={h} rx="18"
                fill={ERA_COLOR[era]}
                fillOpacity={0.06}
                stroke={ERA_COLOR[era]}
                strokeOpacity={0.2}
                strokeWidth={1}
              />
            ))}

            {/* Era labels */}
            {ERA_REGIONS.map(({ era, x, w }) => (
              <text
                key={`label-${era}`}
                x={x + w / 2}
                y={36}
                textAnchor="middle"
                fontSize="10.5"
                fill={ERA_COLOR[era]}
                fontFamily="system-ui, sans-serif"
                fontWeight="700"
                opacity={0.8}
              >
                {isArabic ? ERA_LABEL_AR[era] : ERA_LABEL_EN[era]}
              </text>
            ))}

            {/* Edges */}
            {EDGES.map((edge, i) => {
              const a = NODE_MAP[edge.from];
              const b = NODE_MAP[edge.to];
              if (!a || !b) return null;
              const isLineage = edge.style === "lineage";
              const color = isLineage ? ERA_COLOR[a.era] : "#94a3b8";
              return (
                <path
                  key={i}
                  d={bezierPath(a.x, a.y, b.x, b.y)}
                  fill="none"
                  stroke={color}
                  strokeWidth={isLineage ? 2.2 : 1.3}
                  strokeDasharray={isLineage ? undefined : "6 4"}
                  opacity={isLineage ? 0.5 : 0.3}
                />
              );
            })}

            {/* Nodes */}
            {NODES.map((node) => {
              const color = ERA_COLOR[node.era];
              const isMuhammad = node.era === "muhammad";
              const r = isMuhammad ? 40 : 28;
              const isSel = selected === node.id;
              const arSize = isMuhammad ? 13 : 10.5;
              const enSize = isMuhammad ? 9 : 7.5;

              return (
                <g
                  key={node.id}
                  onClick={() => setSelected((s) => (s === node.id ? null : node.id))}
                  style={{ cursor: "pointer" }}
                  filter={
                    isMuhammad
                      ? "url(#muhammad-glow)"
                      : isSel
                      ? "url(#node-glow)"
                      : undefined
                  }
                >
                  {/* Outer glow ring */}
                  <circle
                    cx={node.x} cy={node.y} r={r + 9}
                    fill={color}
                    opacity={isSel ? 0.22 : isMuhammad ? 0.15 : 0.06}
                  />
                  {/* Selection ring */}
                  {isSel && (
                    <circle
                      cx={node.x} cy={node.y} r={r + 5}
                      fill="none"
                      stroke="#C0A060"
                      strokeWidth={2.5}
                      opacity={0.9}
                    />
                  )}
                  {/* Main circle */}
                  <circle
                    cx={node.x} cy={node.y} r={r}
                    fill={color}
                    stroke={isMuhammad ? "#C0A060" : isSel ? "white" : color}
                    strokeWidth={isMuhammad ? 3 : isSel ? 2.5 : 0}
                    opacity={isSel ? 1 : 0.9}
                  />
                  {/* Arabic name */}
                  <text
                    x={node.x} y={node.y - 4}
                    textAnchor="middle"
                    fill="white"
                    fontSize={arSize}
                    fontFamily="'Scheherazade New', 'Amiri', serif"
                    fontWeight="bold"
                    style={{ userSelect: "none" }}
                  >
                    {node.nameAr}
                  </text>
                  {/* English name */}
                  <text
                    x={node.x} y={node.y + 11}
                    textAnchor="middle"
                    fill="white"
                    fontSize={enSize}
                    fontFamily="system-ui, sans-serif"
                    opacity={0.88}
                    style={{ userSelect: "none" }}
                  >
                    {node.nameEn}
                  </text>
                  {/* Number badge */}
                  <circle
                    cx={node.x + r - 2} cy={node.y - r + 2} r={8.5}
                    fill="white" opacity={0.95}
                  />
                  <text
                    x={node.x + r - 2} y={node.y - r + 6.5}
                    textAnchor="middle"
                    fontSize={7}
                    fontFamily="system-ui, sans-serif"
                    fontWeight="bold"
                    fill={color}
                    style={{ userSelect: "none" }}
                  >
                    {node.num}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Scroll hint */}
      <p className="text-xs text-muted-foreground text-center">
        {isArabic
          ? "انقر على أي نبي لعرض التفاصيل • مرّر أفقياً لرؤية جميع الأنبياء ﷺ"
          : "Click any prophet to see details • Scroll or drag right to see all 25 prophets"}
      </p>

      {/* ── Detail card ────────────────────────────────────────────────────── */}
      {selectedNode && (
        <div
          className="mx-4 md:mx-6 rounded-2xl border p-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200"
          style={{ borderColor: eraColor + "44", background: eraColor + "0a" }}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <p
                className="text-3xl font-arabic leading-relaxed"
                dir="rtl"
                style={{ color: eraColor }}
              >
                {selectedNode.nameAr} عليه السلام
              </p>
              <h3 className="text-xl font-bold text-foreground mt-0.5">
                {selectedNode.nameEn}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isArabic ? "النبي رقم" : "Prophet"} #{selectedNode.num}{" "}
                {isArabic ? "من الأنبياء المذكورين في القرآن الكريم" : "of 25 in the Quran"}
              </p>
            </div>
            <span
              className="text-xs px-3 py-1.5 rounded-full font-semibold shrink-0"
              style={{ background: eraColor + "22", color: eraColor }}
            >
              {isArabic ? ERA_LABEL_AR[selectedNode.era] : ERA_LABEL_EN[selectedNode.era]}
            </span>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
            <div className="bg-background/60 rounded-xl px-4 py-3 border border-border/40">
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-1">
                {isArabic ? "العصر التقريبي" : "Approximate Period"}
              </p>
              <p className="font-medium text-foreground">{selectedNode.period}</p>
            </div>
            <div className="bg-background/60 rounded-xl px-4 py-3 border border-border/40">
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-1">
                {isArabic ? "أُرسل إلى" : "Sent To"}
              </p>
              <p className="font-medium text-foreground">{selectedNode.sentTo}</p>
            </div>
            <div className="bg-background/60 rounded-xl px-4 py-3 border border-border/40">
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-1">
                {isArabic ? "المعجزة / العلامة الكبرى" : "Key Miracle / Sign"}
              </p>
              <p className="font-medium text-foreground">{selectedNode.miracle}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setLocation(`/library/prophets/${selectedNode.id}`)}
              className="text-sm font-semibold text-white px-5 py-2.5 rounded-xl transition-opacity hover:opacity-90 active:scale-95"
              style={{ background: eraColor }}
            >
              {isArabic ? "← اقرأ القصة كاملة" : "Read Full Story →"}
            </button>
            <button
              onClick={() => {
                setSelected(null);
                setTimeout(() => scrollToCard(selectedNode.id), 50);
              }}
              className="text-sm font-medium px-4 py-2.5 rounded-xl border border-border hover:bg-muted transition-colors text-foreground"
            >
              {isArabic ? "انتقل إلى البطاقة ↓" : "Jump to Card ↓"}
            </button>
            <button
              onClick={() => setSelected(null)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2.5"
            >
              {isArabic ? "إغلاق" : "Close"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
