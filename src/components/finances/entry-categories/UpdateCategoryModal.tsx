// src/components/finances/entry-categories/UpdateCategoryModal.tsx
'use client';

import * as React from 'react';
import { EntryCategory } from './types';
import { AddCategoryModal } from './AddCategoryModal';

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    type: 'Income' | 'Expense';
    description?: string;
    parentCategoryId?: string | null;
  }) => void;
  editingCategory: EntryCategory;
  availableParents: EntryCategory[];
  getCategoryNumber: (cat: EntryCategory, all: EntryCategory[]) => string;
};

export function UpdateCategoryModal(props: Props) {
  return (
    <AddCategoryModal
      open={props.open}
      onClose={props.onClose}
      onSubmit={props.onSubmit}
      editingCategory={props.editingCategory}
      availableParents={props.availableParents}
      getCategoryNumber={props.getCategoryNumber}
    />
  );
}
