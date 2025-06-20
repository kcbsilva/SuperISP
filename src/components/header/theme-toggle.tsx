// src/components/header/theme-toggle.tsx
'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ThemeToggleProps {
  mounted: boolean;
  theme: string | undefined;
  setTheme: (theme: string) => void;
}

export function ThemeToggle({ mounted, theme, setTheme }: ThemeToggleProps) {
  const iconSize = 'h-3 w-3';

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      aria-label="Toggle theme"
      className="text-foreground hover:bg-muted/50"
    >
      {mounted ? (theme === 'light' ? <Moon className={iconSize} /> : <Sun className={iconSize} />) : null}
    </Button>
  );
}
