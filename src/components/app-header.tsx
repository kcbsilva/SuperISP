'use client';

import * as React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger, PopoverAnchor } from '@/components/ui/popover'; // Import Popover components
import { Search, User, Box, Cable } from 'lucide-react'; // Import icons
import { Button } from '@/components/ui/button'; // Import Button
import Link from 'next/link'; // Import Link

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

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 md:px-6">
      {/* Sidebar Trigger for mobile/collapsible */}
      <SidebarTrigger className="md:hidden" />

      {/* Search Bar */}
      <div className="relative flex-1 md:grow-0">
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverAnchor asChild>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                ref={inputRef}
                type="search"
                placeholder="Search clients, equipment, elements..."
                className="w-full rounded-lg bg-muted pl-8 md:w-[200px] lg:w-[336px]"
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
              align="start"
              onOpenAutoFocus={(e) => e.preventDefault()} // Prevent popover from stealing focus
            >
              {/* Client Results */}
              {(searchResults.clients?.length ?? 0) > 0 && (
                <>
                  <div className="mb-1 px-2 py-1 text-xs font-semibold text-muted-foreground">Clients</div>
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
                  <div className="mb-1 mt-2 px-2 py-1 text-xs font-semibold text-muted-foreground">Equipment</div>
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
                         <span>{item.type} (S/N: {item.serial})</span>
                         {/* Link href={`/inventory/${item.id}`} */}
                       </div>
                     </Button>
                  ))}
                </>
              )}

               {/* Elements Results (Placeholder) */}
               {(searchResults.elements?.length ?? 0) > 0 && (
                 <>
                   <div className="mb-1 mt-2 px-2 py-1 text-xs font-semibold text-muted-foreground">Elements</div>
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
                  No results found for "{searchTerm}"
                </div>
              )}
            </PopoverContent>
          )}
        </Popover>
      </div>


      {/* Spacer */}
      <div className="flex-1"></div>

      {/* Optional: User menu, notifications, etc. can go here */}
    </header>
  );
}
