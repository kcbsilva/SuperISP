// src/components/finances/entry-categories/types.ts
export type EntryCategory = {
    id: string;
    name: string;
    type: 'Income' | 'Expense';
    description?: string | null;
    parentCategoryId?: string | null;
    createdAt: Date;
  };
  