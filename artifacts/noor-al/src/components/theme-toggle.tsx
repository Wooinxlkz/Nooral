import React from 'react';
import { SunIcon, MoonStarIcon, ScrollText } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';

const THEME_OPTIONS = [
  { icon: SunIcon,      value: 'light', label: 'Light' },
  { icon: MoonStarIcon, value: 'dark',  label: 'Dark'  },
  { icon: ScrollText,   value: 'sepia', label: 'Sepia' },
] as const;

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useAppStore();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className={cn(
        'bg-muted/80 inline-flex items-center overflow-hidden rounded-md border border-border',
        className,
      )}
      role="radiogroup"
      aria-label="Select theme"
    >
      {THEME_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          className={cn(
            'relative flex size-7 cursor-pointer items-center justify-center rounded-md transition-all',
            theme === option.value
              ? 'text-foreground'
              : 'text-muted-foreground hover:text-foreground',
          )}
          role="radio"
          aria-checked={theme === option.value}
          aria-label={`Switch to ${option.label} theme`}
          onClick={() => setTheme(option.value)}
        >
          {theme === option.value && (
            <motion.div
              layoutId="theme-option-indicator"
              transition={{ type: 'spring', bounce: 0.1, duration: 0.55 }}
              className="absolute inset-0 rounded-md border border-muted-foreground/40 bg-background shadow-sm"
            />
          )}
          <option.icon className="relative z-10 size-3.5" />
        </button>
      ))}
    </motion.div>
  );
}
