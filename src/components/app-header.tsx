// src/components/app-header.tsx
'use client';

import * as React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Input } from '@/components/ui/input'; // Will use Bootstrap styled input
import { Popover, PopoverContent, PopoverTrigger, PopoverAnchor } from '@/components/ui/popover'; // Popover might need Bootstrap styling
import { Search, User, Box, Cable, Info, LogOut, UserCircle, Sun, Moon, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button'; // Will use Bootstrap styled button
import Link from 'next/link';
import { useLocale } from '@/contexts/LocaleContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Dropdown will need Bootstrap styling
import { useToast } from '@/hooks/use-toast';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

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
  const { t } = useLocale();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const iconSize = "h-3 w-3"; 
  const smallIconSize = "h-2.5 w-2.5";


  React.useEffect(() => setMounted(true), []);


  React.useEffect(() => {
    if (searchTerm.length > 1) {
      console.log(`Simulating search for: ${searchTerm}`);
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

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleResultClick = () => {
    setIsPopoverOpen(false);
  };

   const handleProfileClick = () => {
     console.log("Profile option clicked");
     toast({
        title: t('header.profile_action_title', 'Profile'),
        description: t('header.profile_action_desc', 'Navigate to profile page (Not Implemented)'),
     });
   };

   const handleLogoutClick = () => {
     console.log("Logout clicked");
      toast({
        title: t('header.logout_action_title', 'Logout'),
        description: t('header.logout_action_desc', 'Logout process initiated (Not Implemented)'),
     });
   };

   const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
   };


  return (
    // Bootstrap classes for header
    <header className="sticky-top z-index-sticky d-flex align-items-center justify-content-between border-bottom bg-body px-3 px-md-4" style={{ height: '3rem' }}>
      <div className="d-flex align-items-center">
         <SidebarTrigger className="d-md-none me-2 btn btn-light btn-sm p-1" /> {/* Bootstrap button styling */}
      </div>


      <div className="flex-grow-1 d-flex justify-content-center align-items-center">
        <div className="position-relative">
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverAnchor asChild>
              <div className="position-relative">
                <Search className={`position-absolute top-50 start-0 translate-middle-y ms-2 text-muted ${iconSize}`} />
                <Input
                  ref={inputRef}
                  type="search"
                  placeholder={t('search.placeholder')}
                  // Bootstrap form control styling
                  className="form-control form-control-sm ps-4 rounded-pill w-100" // Bootstrap classes with custom width
                  style={{minWidth: '300px', maxWidth: '400px'}}
                  value={searchTerm}
                  onChange={handleInputChange}
                  onFocus={() => searchTerm.length > 1 && setIsPopoverOpen(true)}
                />
              </div>
            </PopoverAnchor>
            {isPopoverOpen && searchResults && (
              <PopoverContent
                className="mt-1 shadow border bg-body p-2" // Bootstrap popover-like styling
                style={{width: inputRef.current?.offsetWidth}} // Match input width
                side="bottom"
                align="center"
                onOpenAutoFocus={(e) => e.preventDefault()}
              >
                {(searchResults.clients?.length ?? 0) > 0 && (
                  <>
                    <div className="mb-1 px-2 py-1 small fw-semibold text-muted">{t('search.clients_label')}</div>
                    {searchResults.clients.map(client => (
                      <Button
                        key={client.id}
                        variant="ghost" // This needs Bootstrap equivalent, e.g., btn-light text-start
                        className="btn btn-light text-start w-100 px-2 py-1 small d-flex align-items-center gap-2" 
                        asChild
                        onClick={handleResultClick}
                      >
                        <Link href={`/subscribers/profile/${client.id}`} className="d-flex align-items-center gap-2 text-decoration-none text-dark">
                          <User className={`${smallIconSize} text-muted`} />
                          {client.name}
                        </Link>
                      </Button>
                    ))}
                  </>
                )}

                {(searchResults.equipment?.length ?? 0) > 0 && (
                  <>
                    <div className="mb-1 mt-2 px-2 py-1 small fw-semibold text-muted">{t('search.equipment_label')}</div>
                    {searchResults.equipment.map(item => (
                       <Button
                         key={item.id}
                         variant="ghost"
                         className="btn btn-light text-start w-100 px-2 py-1 small d-flex align-items-center gap-2"
                         onClick={handleResultClick}
                       >
                         <div className="d-flex align-items-center gap-2">
                           <Box className={`${smallIconSize} text-muted`} />
                           <span>{item.type} ({t('search.serial_prefix')}: {item.serial})</span>
                         </div>
                       </Button>
                    ))}
                  </>
                )}

                 {(searchResults.elements?.length ?? 0) > 0 && (
                   <>
                     <div className="mb-1 mt-2 px-2 py-1 small fw-semibold text-muted">{t('search.elements_label')}</div>
                     {searchResults.elements.map(elem => (
                       <Button
                         key={elem.id}
                         variant="ghost"
                         className="btn btn-light text-start w-100 px-2 py-1 small d-flex align-items-center gap-2"
                         onClick={handleResultClick}
                       >
                         <div className="d-flex align-items-center gap-2">
                           <Cable className={`${smallIconSize} text-muted`} />
                           <span>{elem.name} ({elem.type})</span>
                          </div>
                       </Button>
                     ))}
                   </>
                 )}


                {searchResults.clients?.length === 0 &&
                 searchResults.equipment?.length === 0 &&
                 searchResults.elements?.length === 0 && (
                  <div className="p-2 text-center small text-muted"> 
                    {t('search.no_results_found', 'No results found for "{term}"').replace('{term}', searchTerm)}
                  </div>
                )}
              </PopoverContent>
            )}
          </Popover>
        </div>
      </div>


       <div className="d-flex align-items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="btn btn-light p-1"> {/* Bootstrap button */}
            {mounted ? (theme === 'light' ? <Moon style={{width: '1rem', height: '1rem'}} /> : <Sun style={{width: '1rem', height: '1rem'}} />) : <Settings style={{width: '1rem', height: '1rem'}} /> }
            <span className="visually-hidden">{t('header.toggle_theme', 'Toggle theme')}</span>
          </Button>

         <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="btn btn-light p-1"> {/* Bootstrap button */}
                 <Info style={{width: '1rem', height: '1rem'}} />
                 <span className="visually-hidden">{t('header.changelog', 'Changelog')}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="dropdown-menu"> {/* Bootstrap class */}
               <DropdownMenuLabel className="dropdown-header">{t('header.changelog_label', 'Version 0.1.0')}</DropdownMenuLabel>
               <DropdownMenuSeparator className="dropdown-divider"/>
               <div className="px-2 py-1 small"> 
                  <p><strong>{t('header.changelog_new', 'New')}:</strong> {t('header.changelog_new_desc', 'Initial release features.')}</p>
                  <p><strong>{t('header.changelog_fixes', 'Fixes')}:</strong> {t('header.changelog_fixes_desc', 'Various UI adjustments.')}</p>
                  <p><strong>{t('header.changelog_improvements', 'Improvements')}:</strong> {t('header.changelog_improvements_desc', 'Sidebar and dashboard layout.')}</p>
               </div>
            </DropdownMenuContent>
         </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <Button variant="ghost" size="icon" className="btn btn-light p-1"> {/* Bootstrap button */}
                 <User style={{width: '1rem', height: '1rem'}}/>
                 <span className="visually-hidden">{t('header.profile', 'User Profile')}</span>
               </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="dropdown-menu"> {/* Bootstrap class */}
               <DropdownMenuLabel className="dropdown-header">{t('header.my_account', 'My Account')}</DropdownMenuLabel>
               <DropdownMenuSeparator className="dropdown-divider"/>
               <DropdownMenuItem onClick={handleProfileClick} className="dropdown-item cursor-pointer d-flex align-items-center gap-2">
                   <UserCircle className={smallIconSize} />
                   <span>{t('header.profile_menu_item', 'Profile')}</span>
               </DropdownMenuItem>
               <DropdownMenuItem onClick={handleLogoutClick} className="dropdown-item cursor-pointer d-flex align-items-center gap-2">
                  <LogOut className={smallIconSize} />
                  <span>{t('header.logout_menu_item', 'Logout')}</span>
               </DropdownMenuItem>
            </DropdownMenuContent>
         </DropdownMenu>

       </div>
    </header>
  );
}
