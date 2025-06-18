
// src/components/app-header.tsx
'use client';

import * as React from 'react';
import { Search, User, Box, Cable, Info, LogOut, UserCircle, Sun, Moon, Settings, Menu as MenuIcon } from 'lucide-react';
import Link from 'next/link';
import { useLocale } from '@/contexts/LocaleContext';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { ProlterLogo } from '@/components/prolter-logo'; // Import the consolidated ProlterLogo
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverAnchor,
} from "@/components/ui/popover";
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext'; // Import useAuth

const searchResultsPlaceholder = {
  clients: [
    { id: 'sub-1', name: 'Alice Wonderland' },
    { id: 'sub-2', name: 'Bob The Builder Inc.' },
  ],
  equipment: [
    { id: 'inv-1', serial: 'XYZ123', type: 'Router' },
  ],
  elements: [
    { id: 'elem-1', name: 'FDH-Central', type: 'FDH' },
  ],
};

interface AppHeaderProps {
  onToggleSidebar: () => void;
}

export function Header({ onToggleSidebar }: AppHeaderProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
  const [searchResults, setSearchResults] = React.useState<typeof searchResultsPlaceholder | null>(null);
  const [currentTime, setCurrentTime] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const popoverRef = React.useRef<HTMLDivElement>(null);
  const { t } = useLocale();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const { logout } = useAuth(); // Get logout function from AuthContext
  const iconSize = "h-3 w-3";
  const smallIconSize = "h-2.5 w-2.5";

  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    setCurrentTime(new Date().toLocaleTimeString()); // Set time immediately on mount
    return () => clearInterval(timerId);
  }, []);

  React.useEffect(() => {
    if (searchTerm.length > 1) {
      // Simulate fetching results
      const filteredClients = searchResultsPlaceholder.clients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      // For demo, include other types if clients are found or term is generic
      setSearchResults({
        clients: filteredClients,
        equipment: searchResultsPlaceholder.equipment, // Can be filtered similarly
        elements: searchResultsPlaceholder.elements, // Can be filtered similarly
      });
      setIsPopoverOpen(true);
    } else {
      setIsPopoverOpen(false);
      setSearchResults(null);
    }
  }, [searchTerm]);

  const handleResultClick = () => {
    setIsPopoverOpen(false);
    setSearchTerm(''); // Clear search term after click
  };

  const handleProfileClick = () => {
    toast({
      title: t('header.profile_action_title', 'Profile'),
      description: t('header.profile_action_desc', 'Navigate to profile page (Not Implemented)'),
    });
  };

  const handleLogoutClick = async () => {
    toast({
      title: t('header.logout_action_title', 'Logout'),
      description: t('header.logout_action_desc', 'Logging out...'),
    });
    await logout(); // Call the actual logout function
    // AuthContext's onAuthStateChange will handle redirecting to login page
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node) &&
        inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsPopoverOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popoverRef, inputRef]);
  
  return (
    <header
      className={cn(
        "sticky top-0 z-50 flex h-14 items-center justify-between px-4 md:px-6",
        "bg-background text-foreground border-b-2 border-primary", // Light theme header
        "dark:bg-background dark:text-foreground dark:border-b-2 dark:border-accent" // Dark theme header
      )}
    >
      <div className="flex items-center gap-2">
        {/* Logo and Mobile Menu Toggle */}
        <Link href="/admin/dashboard" className="flex items-center mr-2">
          <ProlterLogo
            width="75" 
            height="18" 
            aria-label="Prolter Logo"
          />
        </Link>
        <Button variant="ghost" size="icon" className="md:hidden text-foreground hover:bg-muted/50" onClick={onToggleSidebar} aria-label={t('sidebar.toggle_mobile_sidebar', 'Toggle sidebar')}>
          <MenuIcon className={iconSize} />
        </Button>
      </div>

      {/* Search Bar and Clock */}
      <div className="flex flex-1 items-center justify-center gap-4 mx-4">
        <div className="relative flex-grow max-w-sm md:max-w-md">
           <Search className={`absolute left-2.5 top-1/2 -translate-y-1/2 ${iconSize} text-muted-foreground`} />
           <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
             <PopoverAnchor asChild>
               <Input
                 ref={inputRef}
                 type="search"
                 placeholder={t('search.placeholder', 'Search clients, equipment, elements...')}
                 className={cn(
                   "h-8 w-full rounded-full pl-8 text-xs",
                   "bg-card text-card-foreground", // Input field background in light theme
                   "dark:bg-muted/80 dark:text-foreground" // Input field background in dark theme
                 )}
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 onFocus={() => searchTerm.length > 1 && setIsPopoverOpen(true)}
               />
             </PopoverAnchor>
             {searchResults && (
               <PopoverContent
                 ref={popoverRef}
                 className="mt-1 w-[var(--radix-popover-trigger-width)] max-h-80 overflow-y-auto p-1"
                 align="start"
                 onOpenAutoFocus={(e) => e.preventDefault()} // Prevent focus steal
               >
                 {/* Search results rendering (clients, equipment, elements) */}
                 {(searchResults.clients?.length ?? 0) > 0 && (
                   <>
                     <div className="mb-1 px-2 py-1 text-xs font-semibold text-muted-foreground">{t('search.clients_label')}</div>
                     {searchResults.clients.map(client => (
                       <Button key={client.id} variant="ghost" asChild className="h-auto w-full justify-start px-2 py-1.5 text-xs font-normal" onClick={handleResultClick}>
                         <Link href={`/admin/subscribers/profile/${client.id}`} className="flex items-center gap-2">
                           <User className={`${smallIconSize} text-muted-foreground`} />
                           {client.name}
                         </Link>
                       </Button>
                     ))}
                   </>
                 )}
                 {(searchResults.equipment?.length ?? 0) > 0 && (
                   <>
                     <div className="mb-1 mt-2 px-2 py-1 text-xs font-semibold text-muted-foreground">{t('search.equipment_label')}</div>
                     {searchResults.equipment.map(item => (
                       <Button key={item.id} variant="ghost" className="h-auto w-full justify-start px-2 py-1.5 text-xs font-normal" onClick={handleResultClick}>
                         <Box className={`${smallIconSize} text-muted-foreground mr-2`} />
                         <span>{item.type} ({t('search.serial_prefix')}: {item.serial})</span>
                       </Button>
                     ))}
                   </>
                 )}
                 {(searchResults.elements?.length ?? 0) > 0 && (
                   <>
                     <div className="mb-1 mt-2 px-2 py-1 text-xs font-semibold text-muted-foreground">{t('search.elements_label')}</div>
                     {searchResults.elements.map(elem => (
                       <Button key={elem.id} variant="ghost" className="h-auto w-full justify-start px-2 py-1.5 text-xs font-normal" onClick={handleResultClick}>
                         <Cable className={`${smallIconSize} text-muted-foreground mr-2`} />
                         <span>{elem.name} ({elem.type})</span>
                       </Button>
                     ))}
                   </>
                 )}
                 {searchResults.clients?.length === 0 &&
                   searchResults.equipment?.length === 0 &&
                   searchResults.elements?.length === 0 && (
                     <div className="p-2 text-center text-xs text-muted-foreground">
                       {t('search.no_results_found', 'No results found for "{term}"').replace('{term}', searchTerm)}
                     </div>
                   )}
               </PopoverContent>
             )}
           </Popover>
        </div>
        <div className="text-[10px] font-mono font-bold text-foreground hidden md:flex items-center whitespace-nowrap">
           {currentTime ? currentTime : <Skeleton className="h-3 w-16 bg-muted" />}
        </div>
      </div>

      {/* Action Icons: Theme Toggle, Changelog, User Profile */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label={t('header.toggle_theme', 'Toggle theme')} className="text-foreground hover:bg-muted/50">
          {mounted ? (theme === 'light' ? <Moon className={iconSize} /> : <Sun className={iconSize} />) : <Settings className={iconSize} />}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label={t('header.changelog', 'Changelog')} className="text-foreground hover:bg-muted/50">
              <Info className={iconSize} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel className="text-xs">{t('header.changelog_label', 'Version 0.1.0')}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="space-y-1 p-2 text-xs">
              <p><strong>{t('header.changelog_new', 'New')}:</strong> {t('header.changelog_new_desc', 'Initial release features.')}</p>
              <p><strong>{t('header.changelog_fixes', 'Fixes')}:</strong> {t('header.changelog_fixes_desc', 'Various UI adjustments.')}</p>
              <p><strong>{t('header.changelog_improvements', 'Improvements')}:</strong> {t('header.changelog_improvements_desc', 'Sidebar and dashboard layout.')}</p>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label={t('header.profile', 'User Profile')} className="text-foreground hover:bg-muted/50">
              <User className={iconSize} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="text-xs">{t('header.my_account', 'My Account')}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={handleProfileClick} className="text-xs">
              <UserCircle className={`${smallIconSize} mr-2`} />
              <span>{t('header.profile_menu_item', 'Profile')}</span>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={handleLogoutClick} className="text-xs">
              <LogOut className={`${smallIconSize} mr-2`} />
              <span>{t('header.logout_menu_item', 'Logout')}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
