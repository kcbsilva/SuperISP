// src/components/ui/toggle.tsx
'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

type ToggleProps = {
  pressed: boolean;
  onPressedChange: (pressed: boolean) => void;
  children?: React.ReactNode;
};

export function Toggle({ pressed, onPressedChange, children }: ToggleProps) {
  return (
    <button
      type="button"
      onClick={() => onPressedChange(!pressed)}
      className={cn(
        'px-3 py-1 rounded-md text-sm font-medium border',
        pressed
          ? 'bg-primary text-primary-foreground border-primary'
          : 'bg-muted text-muted-foreground border-muted-foreground/20',
        'transition-colors duration-150'
      )}
      aria-pressed={pressed}
    >
      {children}
    </button>
  );
}
