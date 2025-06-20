//src/app/admin/settings/license/page.tsx

'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { KeyRound, Loader2 } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';

export default function LicenseSettingsPage() {
  const { t } = useLocale();
  const iconSize = 'h-2.5 w-2.5';

  const [licenseKey, setLicenseKey] = React.useState('');
  const [status, setStatus] = React.useState<'idle' | 'checking' | 'valid' | 'invalid' | 'error'>('idle');

  const checkLicense = async () => {
    setStatus('checking');
    try {
      const response = await fetch('https://auth.prolter.com/api/license/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: licenseKey }),
      });
      if (!response.ok) throw new Error('server_error');
      const data = await response.json();
      setStatus(data.valid ? 'valid' : 'invalid');
    } catch (e) {
      console.error('License check failed:', e);
      setStatus('error');
    }
  };

  const renderStatusMessage = () => {
    switch (status) {
      case 'valid':
        return t('licensing_page.license_valid', 'License is valid.');
      case 'invalid':
        return t('licensing_page.license_invalid', 'License is invalid.');
      case 'error':
        return t('licensing_page.server_unavailable', 'License server unavailable.');
      case 'checking':
        return t('licensing_page.checking', 'Checking license...');
      default:
        return '';
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-base font-semibold flex items-center gap-2">
          <KeyRound className={`${iconSize} text-primary`} />
          {t('sidebar.settings_license', 'License')}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">{t('licensing_page.title', 'License Verification')}</CardTitle>
          <CardDescription className="text-xs">{t('licensing_page.description', 'Check the validity of your license key.')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="licenseKey" className="text-sm font-medium leading-none">
              {t('licensing_page.input_label', 'License Key')}
            </label>
            <Input
              id="licenseKey"
              value={licenseKey}
              onChange={(e) => setLicenseKey(e.target.value)}
              placeholder={t('licensing_page.input_placeholder', 'Enter your license key')}
            />
          </div>
          <Button type="button" onClick={checkLicense} disabled={status === 'checking'}>
            {status === 'checking' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('licensing_page.check_button', 'Check License')}
          </Button>
          {status !== 'idle' && (
            <p className="text-xs text-muted-foreground">{renderStatusMessage()}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}