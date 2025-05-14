// src/components/app-header.tsx
'use client';

import * as React from 'react';
import { Search, User, Box, Cable, Info, LogOut, UserCircle, Sun, Moon, Settings, Menu as MenuIcon } from 'lucide-react'; // Added MenuIcon
import Link from 'next/link';
import { useLocale } from '@/contexts/LocaleContext';
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

interface AppHeaderProps {
  onToggleSidebar: () => void; // Callback to toggle mobile sidebar
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
  const iconSize = { width: '0.875rem', height: '0.875rem' };
  const smallIconSize = { width: '0.75rem', height: '0.75rem' };

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

   // Close popover if clicked outside
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
    <header className="sticky-top shadow-sm d-flex align-items-center justify-content-between border-bottom bg-body px-3" style={{ height: '3.5rem', zIndex: 1030 }}>
      <div className="d-flex align-items-center">
         <button className="btn btn-light btn-sm p-1 d-md-none me-2" type="button" onClick={onToggleSidebar} aria-label="Toggle sidebar">
            <MenuIcon style={iconSize} />
         </button>
      </div>

      <div className="flex-grow-1 d-flex justify-content-center align-items-center">
        <div className="position-relative" style={{ minWidth: '300px', maxWidth: '400px' }}>
          <Search className="position-absolute top-50 start-0 translate-middle-y ms-2 text-muted" style={iconSize} />
          <input
            ref={inputRef}
            type="search"
            placeholder={t('search.placeholder')}
            className="form-control form-control-sm ps-4 rounded-pill w-100"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => searchTerm.length > 1 && setIsPopoverOpen(true)}
          />
          {isPopoverOpen && searchResults && (
            <div
              ref={popoverRef}
              className="position-absolute mt-1 start-0 w-100 shadow border rounded bg-body p-2"
              style={{ zIndex: 1060 }} // Ensure it's above other content
            >
              {(searchResults.clients?.length ?? 0) > 0 && (
                <>
                  <div className="mb-1 px-2 py-1 small fw-semibold text-muted">{t('search.clients_label')}</div>
                  {searchResults.clients.map(client => (
                    <Link key={client.id} href={`/subscribers/profile/${client.id}`} passHref legacyBehavior>
                        <a className="btn btn-light text-start w-100 px-2 py-1 small d-flex align-items-center gap-2 text-decoration-none text-dark mb-1" onClick={handleResultClick}>
                            <User style={smallIconSize} className="text-muted" />
                            {client.name}
                        </a>
                    </Link>
                  ))}
                </>
              )}
               {(searchResults.equipment?.length ?? 0) > 0 && (
                <>
                  <div className="mb-1 mt-2 px-2 py-1 small fw-semibold text-muted">{t('search.equipment_label')}</div>
                  {searchResults.equipment.map(item => (
                     <button
                       key={item.id}
                       className="btn btn-light text-start w-100 px-2 py-1 small d-flex align-items-center gap-2 text-decoration-none text-dark mb-1"
                       onClick={handleResultClick}
                     >
                       <Box style={smallIconSize} className="text-muted" />
                       <span>{item.type} ({t('search.serial_prefix')}: {item.serial})</span>
                     </button>
                  ))}
                </>
              )}
               {(searchResults.elements?.length ?? 0) > 0 && (
                 <>
                   <div className="mb-1 mt-2 px-2 py-1 small fw-semibold text-muted">{t('search.elements_label')}</div>
                   {searchResults.elements.map(elem => (
                     <button
                       key={elem.id}
                       className="btn btn-light text-start w-100 px-2 py-1 small d-flex align-items-center gap-2 text-decoration-none text-dark mb-1"
                       onClick={handleResultClick}
                     >
                       <Cable style={smallIconSize} className="text-muted" />
                       <span>{elem.name} ({elem.type})</span>
                      </button>
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
            </div>
          )}
        </div>
      </div>

       <div className="d-flex align-items-center gap-2">
          <button className="btn btn-light p-1" type="button" onClick={toggleTheme} aria-label={t('header.toggle_theme', 'Toggle theme')}>
            {mounted ? (theme === 'light' ? <Moon style={iconSize} /> : <Sun style={iconSize} />) : <Settings style={iconSize} /> }
          </button>

         <div className="dropdown">
            <button className="btn btn-light p-1 dropdown-toggle" type="button" id="changelogDropdown" data-bs-toggle="dropdown" aria-expanded="false" aria-label={t('header.changelog', 'Changelog')}>
               <Info style={iconSize}/>
            </button>
            <ul className="dropdown-menu dropdown-menu-end p-2 shadow border" aria-labelledby="changelogDropdown" style={{minWidth: '250px'}}>
               <li><h6 className="dropdown-header small">{t('header.changelog_label', 'Version 0.1.0')}</h6></li>
               <li><hr className="dropdown-divider"/></li>
               <li className="px-2 py-1 small">
                  <p><strong>{t('header.changelog_new', 'New')}:</strong> {t('header.changelog_new_desc', 'Initial release features.')}</p>
                  <p><strong>{t('header.changelog_fixes', 'Fixes')}:</strong> {t('header.changelog_fixes_desc', 'Various UI adjustments.')}</p>
                  <p><strong>{t('header.changelog_improvements', 'Improvements')}:</strong> {t('header.changelog_improvements_desc', 'Sidebar and dashboard layout.')}</p>
               </li>
            </ul>
         </div>

          <div className="dropdown">
             <button className="btn btn-light p-1 dropdown-toggle" type="button" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false" aria-label={t('header.profile', 'User Profile')}>
               <User style={iconSize}/>
             </button>
             <ul className="dropdown-menu dropdown-menu-end shadow border" aria-labelledby="userDropdown">
               <li><h6 className="dropdown-header small">{t('header.my_account', 'My Account')}</h6></li>
               <li><hr className="dropdown-divider"/></li>
               <li>
                  <button className="dropdown-item d-flex align-items-center gap-2 small" type="button" onClick={handleProfileClick}>
                     <UserCircle style={smallIconSize} />
                     <span>{t('header.profile_menu_item', 'Profile')}</span>
                  </button>
               </li>
               <li>
                  <button className="dropdown-item d-flex align-items-center gap-2 small" type="button" onClick={handleLogoutClick}>
                    <LogOut style={smallIconSize} />
                    <span>{t('header.logout_menu_item', 'Logout')}</span>
                  </button>
               </li>
             </ul>
          </div>
       </div>
    </header>
  );
}

