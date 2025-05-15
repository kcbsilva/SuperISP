// src/components/app-header.tsx
'use client';

import * as React from 'react';
import { Search, User, Box, Cable, Info, LogOut, UserCircle, Sun, Moon, Settings, Menu as MenuIcon } from 'lucide-react';
import Link from 'next/link';
import { useLocale } from '@/contexts/LocaleContext';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
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

export function AppHeader({ onToggleSidebar }: AppHeaderProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
  const [searchResults, setSearchResults] = React.useState<typeof searchResultsPlaceholder | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const popoverRef = React.useRef<HTMLDivElement>(null);
  const { t } = useLocale();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const iconSize = "h-4 w-4"; 
  const smallIconSize = "h-3 w-3";

  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    if (searchTerm.length > 1) {
      const filteredClients = searchResultsPlaceholder.clients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults({
        clients: filteredClients,
        equipment: searchResultsPlaceholder.equipment,
        elements: searchResultsPlaceholder.elements,
      });
      setIsPopoverOpen(true);
    } else {
      setIsPopoverOpen(false);
      setSearchResults(null);
    }
  }, [searchTerm]);

  const handleResultClick = () => {
    setIsPopoverOpen(false);
    setSearchTerm('');
  };

   const handleProfileClick = () => {
     toast({
        title: t('header.profile_action_title', 'Profile'),
        description: t('header.profile_action_desc', 'Navigate to profile page (Not Implemented)'),
     });
   };

   const handleLogoutClick = () => {
      toast({
        title: t('header.logout_action_title', 'Logout'),
        description: t('header.logout_action_desc', 'Logout process initiated (Not Implemented)'),
     });
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
      className="sticky top-0 z-30 flex h-14 items-center justify-between px-4 text-white shadow-sm md:px-6"
      style={{ backgroundColor: '#1A237E' }} // Specific dark blue for header
    >
      <div className="flex items-center">
        {/* ProlterLogo component was removed, ensure it's re-added or replaced if needed */}
        {/* <ProlterLogo /> */}
        <span className="sr-only">Prolter Home</span>
        <Button variant="ghost" size="icon" className="md:hidden text-white hover:bg-white/10" onClick={onToggleSidebar} aria-label={t('sidebar.toggle_mobile_sidebar', 'Toggle sidebar')}>
            <MenuIcon className={`${iconSize}`} />
        </Button>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div className="relative w-full max-w-sm md:max-w-md">
          <Search className={`absolute left-2.5 top-1/2 -translate-y-1/2 ${iconSize} text-muted-foreground`} />
           <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverAnchor asChild>
                <Input
                    ref={inputRef}
                    type="search"
                    placeholder={t('search.placeholder', 'Search clients, equipment, elements...')}
                    className="h-8 w-full rounded-full bg-background pl-8 text-xs text-foreground" // Ensure text color is visible
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
                onOpenAutoFocus={(e) => e.preventDefault()} 
                >
                {(searchResults.clients?.length ?? 0) > 0 && (
                    <>
                    <div className="mb-1 px-2 py-1 text-xs font-semibold text-muted-foreground">{t('search.clients_label')}</div>
                    {searchResults.clients.map(client => (
                        <Button key={client.id} variant="ghost" asChild className="h-auto w-full justify-start px-2 py-1.5 text-xs font-normal" onClick={handleResultClick}>
                            <Link href={`/subscribers/profile/${client.id}`} className="flex items-center gap-2">
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
      </div>

       <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label={t('header.toggle_theme', 'Toggle theme')} className="text-white hover:bg-white/10">
            {mounted ? (theme === 'light' ? <Moon className={iconSize} /> : <Sun className={iconSize} />) : <Settings className={iconSize} /> }
          </Button>

         <DropdownMenu>
           <DropdownMenuTrigger asChild>
             <Button variant="ghost" size="icon" aria-label={t('header.changelog', 'Changelog')} className="text-white hover:bg-white/10">
                <Info className={`${iconSize}`}/>
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
               <Button variant="ghost" size="icon" aria-label={t('header.profile', 'User Profile')} className="text-white hover:bg-white/10">
                <User className={`${iconSize}`}/>
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
