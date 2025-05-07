// src/components/app-header.tsx
'use client';

import * as React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger, PopoverAnchor } from '@/components/ui/popover'; // Import Popover components
import { Search, User, Box, Cable, Info, LogOut, UserCircle, Sun, Moon, Settings } from 'lucide-react'; // Import icons, added Info, LogOut, UserCircle, Sun, Moon icons
import { Button } from '@/components/ui/button'; // Import Button
import Link from 'next/link'; // Import Link
import { useLocale } from '@/contexts/LocaleContext'; // Import useLocale
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Import DropdownMenu components
import { useToast } from '@/hooks/use-toast'; // Import useToast
import { useTheme } from 'next-themes'; // Import useTheme

// Placeholder data for search results
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

export function AppHeader() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
  const [searchResults, setSearchResults] = React.useState<typeof searchResultsPlaceholder | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const { t } = useLocale(); // Get translation function
  const { toast } = useToast(); // Get toast function
  const { theme, setTheme } = useTheme(); // Get theme state and setter
  const [mounted, setMounted] = React.useState(false);

  // Effect to set mounted state
  React.useEffect(() => setMounted(true), []);


  // Simulate search logic
  React.useEffect(() => {
    if (searchTerm.length > 1) {
      // Simulate fetching search results
      console.log(`Simulating search for: ${searchTerm}`);
      // Filter placeholder data (basic example)
      const filteredClients = searchResultsPlaceholder.clients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      // Add filtering for equipment and elements if needed
      setSearchResults({
        clients: filteredClients,
        equipment: searchResultsPlaceholder.equipment, // Keep others for demo
        elements: searchResultsPlaceholder.elements,
      });
      setIsPopoverOpen(true);
    } else {
      setIsPopoverOpen(false);
      setSearchResults(null);
    }
  }, [searchTerm]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Close popover when clicking outside or on an item
  const handleResultClick = () => {
    setIsPopoverOpen(false);
    // Optionally clear search term: setSearchTerm('');
  };

   // Placeholder functions for profile/logout actions
   const handleProfileClick = () => {
     console.log("Profile option clicked");
     // TODO: Navigate to profile page or open profile modal
     toast({
        title: t('header.profile_action_title', 'Profile'),
        description: t('header.profile_action_desc', 'Navigate to profile page (Not Implemented)'),
     });
   };

   const handleLogoutClick = () => {
     console.log("Logout clicked");
     // TODO: Implement logout logic
      toast({
        title: t('header.logout_action_title', 'Logout'),
        description: t('header.logout_action_desc', 'Logout process initiated (Not Implemented)'),
     });
   };

   const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
   };


  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background px-4 md:px-6">
      {/* Sidebar Trigger for mobile/collapsible */}
      <div className="flex items-center"> {/* Wrapper for trigger */}
         <SidebarTrigger className="md:hidden mr-2" /> {/* Added margin */}
      </div>


      {/* Search Bar - Centered */}
      <div className="flex-1 flex justify-center items-center"> {/* Center the search bar container */}
        <div className="relative"> {/* Removed grow properties */}
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverAnchor asChild>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  ref={inputRef}
                  type="search"
                  placeholder={t('search.placeholder')} // Use translation
                  className="w-full rounded-lg bg-muted pl-8 md:w-[300px] lg:w-[400px]" // Adjusted width
                  value={searchTerm}
                  onChange={handleInputChange}
                  onFocus={() => searchTerm.length > 1 && setIsPopoverOpen(true)} // Re-open if focused and has term
                />
              </div>
            </PopoverAnchor>
            {isPopoverOpen && searchResults && (
              <PopoverContent
                className="w-[--radix-popover-trigger-width] mt-1 max-h-[400px] overflow-y-auto p-2" // Adjust width and add scroll
                side="bottom"
                align="center" // Align popover to center
                onOpenAutoFocus={(e) => e.preventDefault()} // Prevent popover from stealing focus
              >
                {/* Client Results */}
                {(searchResults.clients?.length ?? 0) > 0 && (
                  <>
                    <div className="mb-1 px-2 py-1 text-xs font-semibold text-muted-foreground">{t('search.clients_label')}</div>
                    {searchResults.clients.map(client => (
                      <Button
                        key={client.id}
                        variant="ghost"
                        className="w-full justify-start h-auto px-2 py-1.5 text-sm"
                        asChild
                        onClick={handleResultClick}
                      >
                        <Link href={`/subscribers/profile/${client.id}`} className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          {client.name}
                        </Link>
                      </Button>
                    ))}
                  </>
                )}

                {/* Equipment Results (Placeholder) */}
                {(searchResults.equipment?.length ?? 0) > 0 && (
                  <>
                    <div className="mb-1 mt-2 px-2 py-1 text-xs font-semibold text-muted-foreground">{t('search.equipment_label')}</div>
                    {searchResults.equipment.map(item => (
                       <Button
                         key={item.id}
                         variant="ghost"
                         className="w-full justify-start h-auto px-2 py-1.5 text-sm"
                         onClick={handleResultClick} // Add onClick handler
                         // asChild // Remove if not using Link yet
                       >
                         <div className="flex items-center gap-2"> {/* Wrap in div */}
                           <Box className="h-4 w-4 text-muted-foreground" />
                           <span>{item.type} ({t('search.serial_prefix')}: {item.serial})</span>
                           {/* Link href={`/inventory/${item.id}`} */}
                         </div>
                       </Button>
                    ))}
                  </>
                )}

                 {/* Elements Results (Placeholder) */}
                 {(searchResults.elements?.length ?? 0) > 0 && (
                   <>
                     <div className="mb-1 mt-2 px-2 py-1 text-xs font-semibold text-muted-foreground">{t('search.elements_label')}</div>
                     {searchResults.elements.map(elem => (
                       <Button
                         key={elem.id}
                         variant="ghost"
                         className="w-full justify-start h-auto px-2 py-1.5 text-sm"
                         onClick={handleResultClick} // Add onClick handler
                         // asChild // Remove if not using Link yet
                       >
                         <div className="flex items-center gap-2"> {/* Wrap in div */}
                           <Cable className="h-4 w-4 text-muted-foreground" />
                           <span>{elem.name} ({elem.type})</span>
                           {/* Link href={`/maps/elements/view/${elem.id}`} */}
                          </div>
                       </Button>
                     ))}
                   </>
                 )}


                {/* No Results Message */}
                {searchResults.clients?.length === 0 &&
                 searchResults.equipment?.length === 0 &&
                 searchResults.elements?.length === 0 && (
                  <div className="p-2 text-center text-sm text-muted-foreground">
                    {t('search.no_results_found', 'No results found for "{term}"').replace('{term}', searchTerm)}
                  </div>
                )}
              </PopoverContent>
            )}
          </Popover>
        </div>
      </div>


      {/* Right-side icons - Now Dropdowns */}
       <div className="flex items-center gap-2">
         {/* Theme Toggle Button */}
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {mounted ? (theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />) : <Settings className="h-5 w-5" /> } {/* Show generic icon until mounted */}
            <span className="sr-only">{t('header.toggle_theme', 'Toggle theme')}</span>
          </Button>

         {/* Changelog Dropdown */}
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                 <Info className="h-5 w-5" />
                 <span className="sr-only">{t('header.changelog', 'Changelog')}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
               <DropdownMenuLabel>{t('header.changelog_label', 'Version 0.1.0')}</DropdownMenuLabel>
               <DropdownMenuSeparator />
               <div className="px-2 py-1 text-sm">
                  <p><strong>{t('header.changelog_new', 'New')}:</strong> {t('header.changelog_new_desc', 'Initial release features.')}</p>
                  <p><strong>{t('header.changelog_fixes', 'Fixes')}:</strong> {t('header.changelog_fixes_desc', 'Various UI adjustments.')}</p>
                  <p><strong>{t('header.changelog_improvements', 'Improvements')}:</strong> {t('header.changelog_improvements_desc', 'Sidebar and dashboard layout.')}</p>
               </div>
            </DropdownMenuContent>
         </DropdownMenu>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <Button variant="ghost" size="icon">
                 <User className="h-5 w-5" />
                 <span className="sr-only">{t('header.profile', 'User Profile')}</span>
               </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
               <DropdownMenuLabel>{t('header.my_account', 'My Account')}</DropdownMenuLabel>
               <DropdownMenuSeparator />
               <DropdownMenuItem onClick={handleProfileClick} className="cursor-pointer">
                   <UserCircle className="mr-2 h-4 w-4" />
                   <span>{t('header.profile_menu_item', 'Profile')}</span>
               </DropdownMenuItem>
               <DropdownMenuItem onClick={handleLogoutClick} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t('header.logout_menu_item', 'Logout')}</span>
               </DropdownMenuItem>
            </DropdownMenuContent>
         </DropdownMenu>

       </div>
    </header>
  );
}
