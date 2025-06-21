// src/components/ui/date-range-picker.tsx
'use client';

import * as React from 'react';

type DateRange = {
  from: Date;
  to: Date;
};

type Props = {
  value: DateRange;
  onChange: (value: DateRange) => void;
};

export function DateRangePicker({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="date"
        value={value.from.toISOString().split('T')[0]}
        onChange={(e) => onChange({ ...value, from: new Date(e.target.value) })}
        className="border rounded px-2 py-1 text-sm"
      />
      <span className="text-muted-foreground text-sm">to</span>
      <input
        type="date"
        value={value.to.toISOString().split('T')[0]}
        onChange={(e) => onChange({ ...value, to: new Date(e.target.value) })}
        className="border rounded px-2 py-1 text-sm"
      />
    </div>
  );
}
