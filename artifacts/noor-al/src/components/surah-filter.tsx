import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem,
  CommandList, CommandSeparator,
} from "@/components/ui/command";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, X, MapPin, BookOpen, Layers3, FileText, Moon, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  HIZB_MAP, FilterOperator, QuranFilterType, QuranFilter,
} from "@/components/surah-filter.types";

const FILTER_OPTIONS: Record<QuranFilterType, string[]> = {
  [QuranFilterType.REVELATION]: ["Makkah", "Madinah"],
  [QuranFilterType.LENGTH]:     ["Short (1–20 ayahs)", "Medium (21–99 ayahs)", "Long (100+ ayahs)"],
  [QuranFilterType.JUZ]:        Array.from({ length: 30 }, (_, i) => `Juz ${i + 1}`),
  [QuranFilterType.PAGES]:      ["Short (≤5 pages)", "Medium (6–15 pages)", "Long (16+ pages)"],
  [QuranFilterType.SAJDA]:      ["Yes", "No"],
};

const FILTER_ICONS: Record<QuranFilterType, React.ReactNode> = {
  [QuranFilterType.REVELATION]: <MapPin className="w-3.5 h-3.5" />,
  [QuranFilterType.LENGTH]:     <BookOpen className="w-3.5 h-3.5" />,
  [QuranFilterType.JUZ]:        <Layers3 className="w-3.5 h-3.5" />,
  [QuranFilterType.PAGES]:      <FileText className="w-3.5 h-3.5" />,
  [QuranFilterType.SAJDA]:      <Moon className="w-3.5 h-3.5" />,
};

/* ── Animate height helper (from user code) ─────────────────── */
function AnimateChangeInHeight({ children, className }: { children: React.ReactNode; className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | "auto">("auto");
  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(entries => setHeight(entries[0].contentRect.height));
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);
  return (
    <motion.div
      className={cn(className, "overflow-hidden")}
      style={{ height }}
      animate={{ height }}
      transition={{ duration: 0.1, ease: "easeIn" }}
    >
      <div ref={containerRef}>{children}</div>
    </motion.div>
  );
}

/* ── Operator dropdown ──────────────────────────────────────── */
function OperatorDropdown({
  operator, setOperator,
}: { operator: FilterOperator; setOperator: (o: FilterOperator) => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="bg-muted hover:bg-muted/70 px-1.5 py-1 text-muted-foreground hover:text-primary transition text-xs shrink-0 border-x border-border">
        {operator}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-fit min-w-fit">
        {Object.values(FilterOperator).map(op => (
          <DropdownMenuItem key={op} onClick={() => setOperator(op)}>{op}</DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* ── Multi-select value combobox ────────────────────────────── */
function ValueCombobox({
  filterType, filterValues, setFilterValues,
}: { filterType: QuranFilterType; filterValues: string[]; setFilterValues: (v: string[]) => void }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const allOptions = FILTER_OPTIONS[filterType];
  const selected = filterValues;
  const unselected = allOptions.filter(o => !selected.includes(o));
  const filtered = (list: string[]) =>
    search ? list.filter(o => o.toLowerCase().includes(search.toLowerCase())) : list;

  return (
    <Popover open={open} onOpenChange={o => { setOpen(o); if (!o) setTimeout(() => setSearch(""), 200); }}>
      <PopoverTrigger className="bg-muted hover:bg-muted/70 px-1.5 py-1 text-muted-foreground hover:text-primary transition text-xs shrink-0">
        {selected.length === 0 ? "Select..." :
         selected.length === 1 ? selected[0] :
         `${selected.length} selected`}
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <AnimateChangeInHeight>
          <Command shouldFilter={false}>
            <CommandInput
              placeholder={filterType}
              className="h-8 text-xs"
              value={search}
              onValueChange={setSearch}
            />
            <CommandList>
              <CommandEmpty>No results.</CommandEmpty>
              {filtered(selected).length > 0 && (
                <CommandGroup>
                  {filtered(selected).map(v => (
                    <CommandItem
                      key={v}
                      className="flex gap-2 items-center text-xs"
                      onSelect={() => setFilterValues(selected.filter(x => x !== v))}
                    >
                      <Checkbox checked className="shrink-0" />
                      <span>{v}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
              {filtered(selected).length > 0 && filtered(unselected).length > 0 && <CommandSeparator />}
              {filtered(unselected).length > 0 && (
                <CommandGroup>
                  {filtered(unselected).map(v => (
                    <CommandItem
                      key={v}
                      className="group flex gap-2 items-center text-xs"
                      onSelect={() => setFilterValues([...selected, v])}
                    >
                      <Checkbox checked={false} className="opacity-0 group-data-[selected=true]:opacity-100 shrink-0" />
                      <span className="text-accent-foreground">{v}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </AnimateChangeInHeight>
      </PopoverContent>
    </Popover>
  );
}

/* ── Add filter popover ─────────────────────────────────────── */
function AddFilterPopover({
  onAdd,
  onHizbNav,
}: {
  onAdd: (type: QuranFilterType) => void;
  onHizbNav?: (hizb: number, surah: number, ayah: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const types = Object.values(QuranFilterType);
  const filteredTypes = search
    ? types.filter(t => t.toLowerCase().includes(search.toLowerCase()))
    : types;

  const filteredHizbs = search
    ? HIZB_MAP.filter(h =>
        `hizb ${h.hizb}`.includes(search.toLowerCase()) ||
        `${h.hizb}`.startsWith(search.replace(/\D/g, ""))
      ).slice(0, 8)
    : [];

  const showHizbHint = !search && !!onHizbNav;

  return (
    <Popover open={open} onOpenChange={o => { setOpen(o); if (!o) setTimeout(() => setSearch(""), 200); }}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-7 gap-1.5 text-xs px-2">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Filter
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[210px] p-0" align="start">
        <AnimateChangeInHeight>
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Filter surahs or jump to Hizb…"
              className="h-8 text-xs"
              value={search}
              onValueChange={setSearch}
            />
            <CommandList>
              <CommandEmpty>No results.</CommandEmpty>
              {filteredTypes.length > 0 && (
                <CommandGroup>
                  {filteredTypes.map(type => (
                    <CommandItem
                      key={type}
                      className="flex gap-2 items-center text-xs"
                      onSelect={() => { onAdd(type); setOpen(false); setSearch(""); }}
                    >
                      {FILTER_ICONS[type]}
                      <span>{type}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
              {filteredHizbs.length > 0 && (
                <>
                  {filteredTypes.length > 0 && <CommandSeparator />}
                  <CommandGroup heading="Jump to Hizb">
                    {filteredHizbs.map(h => (
                      <CommandItem
                        key={h.hizb}
                        className="flex gap-2 items-center text-xs"
                        onSelect={() => {
                          onHizbNav?.(h.hizb, h.surah, h.ayah);
                          setOpen(false);
                          setSearch("");
                        }}
                      >
                        <Navigation className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>Hizb {h.hizb}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}
              {showHizbHint && (
                <div className="px-3 py-2 text-[10px] text-muted-foreground border-t border-border/60 italic">
                  Type a number (e.g. "5") to jump to a Hizb
                </div>
              )}
            </CommandList>
          </Command>
        </AnimateChangeInHeight>
      </PopoverContent>
    </Popover>
  );
}

/* ── Active filter chip ─────────────────────────────────────── */
function FilterChip({
  filter, onChange, onRemove,
}: {
  filter: QuranFilter;
  onChange: (f: QuranFilter) => void;
  onRemove: () => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.15 }}
      className="flex gap-[1px] items-center text-xs h-7"
    >
      {/* Type label */}
      <div className="flex gap-1.5 shrink-0 rounded-l bg-muted px-1.5 py-1 items-center h-full">
        {FILTER_ICONS[filter.type]}
        <span className="font-medium">{filter.type}</span>
      </div>
      {/* Operator */}
      <OperatorDropdown
        operator={filter.operator}
        setOperator={op => onChange({ ...filter, operator: op })}
      />
      {/* Values */}
      <ValueCombobox
        filterType={filter.type}
        filterValues={filter.value}
        setFilterValues={vals => onChange({ ...filter, value: vals })}
      />
      {/* Remove */}
      <button
        onClick={onRemove}
        className="flex items-center justify-center h-full w-6 bg-muted rounded-r text-muted-foreground hover:text-destructive hover:bg-muted/70 transition"
      >
        <X className="w-3 h-3" />
      </button>
    </motion.div>
  );
}

/* ── Main exported component ────────────────────────────────── */
export function SurahFilterBar({
  filters, setFilters, onHizbNav,
}: {
  filters: QuranFilter[];
  setFilters: React.Dispatch<React.SetStateAction<QuranFilter[]>>;
  onHizbNav?: (hizb: number, surah: number, ayah: number) => void;
}) {
  const addFilter = useCallback((type: QuranFilterType) => {
    setFilters(prev => {
      // Don't add duplicate type
      if (prev.some(f => f.type === type)) return prev;
      return [...prev, {
        id: `${type}-${Date.now()}`,
        type,
        operator: FilterOperator.IS,
        value: [],
      }];
    });
  }, [setFilters]);

  const updateFilter = useCallback((updated: QuranFilter) => {
    setFilters(prev => prev.map(f => f.id === updated.id ? updated : f));
  }, [setFilters]);

  const removeFilter = useCallback((id: string) => {
    setFilters(prev => prev.filter(f => f.id !== id));
  }, [setFilters]);

  const activeCount = filters.filter(f => f.value.length > 0).length;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <AddFilterPopover onAdd={addFilter} onHizbNav={onHizbNav} />
      <AnimatePresence mode="popLayout">
        {filters.map(f => (
          <FilterChip
            key={f.id}
            filter={f}
            onChange={updateFilter}
            onRemove={() => removeFilter(f.id)}
          />
        ))}
      </AnimatePresence>
      {activeCount > 0 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setFilters([])}
          className="text-xs text-muted-foreground hover:text-destructive transition-colors"
        >
          Clear all
        </motion.button>
      )}
    </div>
  );
}
