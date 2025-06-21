// src/app/admin/setup-wizard/page.tsx
'use client';

import SetupWizard from '@/components/setup-wizard';

export default function SetupWizardPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <SetupWizard />
      </div>
    </div>
  );
}
