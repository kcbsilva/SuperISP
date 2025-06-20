// src/components/header/search-popover.tsx
'use client';

import * as React from 'react';
import Link from 'next/link';
import { Search, User, Box, Cable } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverAnchor,
} from '@/components/ui/popover';
import { useLocale } from '@/contexts/LocaleContext';
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

const debounce = (fn: (...args: any[]) => void, delay = 300) => {
  let timer: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

export function SearchPopover() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
  const [searchResults, setSearchResults] = React.useState<typeof searchResultsPlaceholder | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const popoverRef = React.useRef<HTMLDivElement>(null);
  const { t } = useLocale();

  const smallIconSize = 'h-2.5 w-2.5';

  const debouncedSearch = React.useMemo(() => debounce((term: string) => {
    if (term.length > 1) {
      const filteredClients = searchResultsPlaceholder.clients.filter(client =>
        client.name.toLowerCase().includes(term.toLowerCase())
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
  }, 300), []);

  React.useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm]);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsPopoverOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResultClick = () => {
    setIsPopoverOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="relative flex-grow max-w-sm md:max-w-md">
      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverAnchor asChild>
          <Input
            ref={inputRef}
            type="search"
            placeholder={t('search.placeholder', 'Search clients, equipment, elements...')}
            className={cn('h-8 w-full rounded-full pl-8 text-xs', 'bg-card text-card-foreground dark:bg-muted/80')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => searchTerm.length > 1 && setIsPopoverOpen(true)}
            aria-expanded={isPopoverOpen}
            aria-controls="search-results"
          />
        </PopoverAnchor>
        {searchResults && (
          <PopoverContent
            ref={popoverRef}
            id="search-results"
            className="mt-1 w-[var(--radix-popover-trigger-width)] max-h-80 overflow-y-auto p-1"
            align="start"
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
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
            {(searchResults.clients?.length === 0 &&
              searchResults.equipment?.length === 0 &&
              searchResults.elements?.length === 0) && (
              <div className="p-2 text-center text-xs text-muted-foreground">
                {t('search.no_results_found', 'No results found for "{term}"').replace('{term}', searchTerm)}
              </div>
            )}
          </PopoverContent>
        )}
      </Popover>
    </div>
  );
}
