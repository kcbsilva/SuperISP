// src/components/setup-wizard/welcome.tsx
'use client';

import * as React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { type Locale, useLocale } from '@/contexts/LocaleContext';
import { ProlterLogo } from '@/components/prolter-logo'; // Replace with your actual logo if needed

interface WelcomeStepProps {
  onNext: () => void;
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  const { locale, setLocale } = useLocale();
  const [selectedLanguage, setSelectedLanguage] = React.useState<Locale>(locale);

  React.useEffect(() => {
    const savedLang = localStorage.getItem('setupLang');
    if (savedLang) {
      setSelectedLanguage(savedLang as Locale);
    }

    console.log('[SetupWizard] setupStep =', localStorage.getItem('setupStep'));
    console.log('[SetupWizard] setupComplete =', localStorage.getItem('setupComplete'));
  }, []);

  const handleNext = () => {
    localStorage.setItem('setupLang', selectedLanguage);
    setLocale(selectedLanguage);

    // ✅ Force reload so translation context updates
    window.location.reload();
  };

  const resetWizard = () => {
    [
      'setupStep',
      'setupComplete',
      'setupLang',
      'setupStep1',
      'setupStep2',
      'setupStep3',
      'setupStep4',
      'setupStep5',
    ].forEach((key) => localStorage.removeItem(key));
    location.reload();
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-6 animate-fadeIn">
      {/* Logo */}
      <div className="w-40 h-32">
        <ProlterLogo className="w-full h-full" />
      </div>

      {/* Title & Subtitle */}
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-primary">
          Welcome to <span className="text-yellow-500">Prolter</span>
        </h2>
        <p className="text-muted-foreground mt-2 text-sm">Select your language to begin</p>
      </div>

      {/* Language Selector */}
      <div className="max-w-xs w-full">
        <Select onValueChange={(val) => setSelectedLanguage(val as Locale)} defaultValue={selectedLanguage}>
          <SelectTrigger>
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="pt">Português</SelectItem>
            <SelectItem value="fr">Français</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Let's Start Button */}
      <div className="flex justify-end w-full max-w-xs">
        <Button className="w-full" onClick={handleNext}>
          Let&apos;s Start
        </Button>
      </div>

      {/* Optional Developer Reset */}
      <div className="pt-4">
        <Button variant="ghost" className="text-xs opacity-50 hover:opacity-100" onClick={resetWizard}>
          Reset Wizard (Dev Only)
        </Button>
      </div>
    </div>
  );
}
