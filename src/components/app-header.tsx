// src/components/app-header.tsx
'use client';

import * as React from 'react';
import Link from 'next/link';
import { useLocale } from '@/contexts/LocaleContext';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { ProlterLogo } from '@/components/prolter-logo';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { Menu as MenuIcon } from 'lucide-react';

import { SearchPopover } from './header/search-popover';
import { ThemeToggle } from './header/theme-toggle';
import { UserMenu } from './header/user-menu';
import { ChangelogMenu } from './header/changelog-menu';

interface AppHeaderProps {
  onToggleSidebar: () => void;
}

export function Header({ onToggleSidebar }: AppHeaderProps) {
  const { t } = useLocale();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState<string | null>(null);

  React.useEffect(() => {
    setMounted(true);
    const timerId = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    setCurrentTime(new Date().toLocaleTimeString());
    return () => clearInterval(timerId);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 flex h-14 items-center justify-between px-4 md:px-6',
        'bg-gray-200 text-foreground border-b-2 border-primary',
        'dark:border-accent dark:text-white'
      )}
    >
      <div className="flex items-center gap-2">
        <Link href="/admin/dashboard" className="flex items-center mr-2 h-full">
          <div className="h-8 w-auto">
            <ProlterLogo height="100%" width="auto" aria-label="Prolter Logo" />
          </div>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-foreground hover:bg-muted/50"
          onClick={onToggleSidebar}
          aria-label={t('sidebar.toggle_mobile_sidebar', 'Toggle sidebar')}
        >
          <MenuIcon className="h-3 w-3" />
        </Button>
      </div>

      <div className="flex flex-1 items-center justify-center gap-4 mx-4">
        <SearchPopover />
        <div className="text-[10px] font-mono font-bold text-foreground hidden md:flex items-center whitespace-nowrap">
          {currentTime ? currentTime : <Skeleton className="h-3 w-16 bg-muted" />}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle mounted={mounted} theme={theme} setTheme={setTheme} />
        <ChangelogMenu />
        <UserMenu />
      </div>
    </header>
  );
}
