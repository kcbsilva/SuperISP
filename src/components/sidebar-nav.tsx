
// src/components/sidebar-nav.tsx
'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import type { Icon as LucideIcon } from 'lucide-react';
import type { IconType } from 'react-icons';

import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubTrigger,
  SidebarMenuSubContent,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { useLocale } from '@/contexts/LocaleContext';
import type { SidebarNavItem } from '@/config/sidebarNav';

interface SidebarNavProps {
  items: SidebarNavItem[];
  isSubMenu?: boolean;
}

const iconSize = "h-3 w-3";

const SidebarNav: React.FC<SidebarNavProps> = ({ items, isSubMenu = false }) => {
  const pathname = usePathname();
  const { t } = useLocale();

  // Checks if the current path is an exact match or a sub-path of the given href
  const isLinkActive = (currentPath: string, href?: string): boolean => {
    if (!href) return false;
    const cleanHref = href.split('?')[0];
    const cleanPathname = currentPath.split('?')[0];

    if (cleanHref === '/') return cleanPathname === '/';
    // Exact match or sub-path (e.g., /admin/settings is active for /admin/settings/global)
    return cleanPathname === cleanHref || cleanPathname.startsWith(cleanHref + '/');
  };

  // Checks if the item or any of its children are active
  const isBranchActive = (item: SidebarNavItem): boolean => {
    if (item.href && isLinkActive(pathname, item.href)) {
      return true;
    }
    if (item.children) {
      return item.children.some(child => isBranchActive(child));
    }
    return false;
  };


  const renderItem = (item: SidebarNavItem, index: number) => {
    // Use a more unique key, e.g., combining title and index, or a dedicated id if available
    const key = item.title ? `${t(item.title)}-${index}` : `sep-${index}`;


    if (item.isSeparator) {
      return <SidebarSeparator key={key} />;
    }

    const IconComponent = item.icon as LucideIcon | IconType | undefined;
    const icon = IconComponent ? <IconComponent className={`${iconSize} ${isSubMenu ? 'text-muted-foreground' : ''}`} /> : null;

    if (item.children && item.children.length > 0) {
      const branchIsActive = isBranchActive(item);

      return (
        <SidebarMenuItem key={key}>
          <SidebarMenuSub defaultOpen={branchIsActive}>
            <SidebarMenuSubTrigger tooltip={t(item.tooltip || item.title)} isActive={branchIsActive} size={isSubMenu ? 'sm' : 'default'}>
              {icon}
              <span className="truncate">{t(item.title)}</span>
              <ChevronDown className={`ml-auto ${iconSize} transition-transform group-data-[state=open]:rotate-180`} />
            </SidebarMenuSubTrigger>
            <SidebarMenuSubContent>
              <SidebarNav items={item.children} isSubMenu={true} />
            </SidebarMenuSubContent>
          </SidebarMenuSub>
        </SidebarMenuItem>
      );
    }

    return (
      <SidebarMenuItem key={key}>
        <SidebarMenuButton href={item.href || '#'} isActive={isLinkActive(pathname, item.href)} tooltip={t(item.tooltip || item.title)} size={isSubMenu ? 'sm' : 'default'}>
          {icon}
          <span className="truncate">{t(item.title)}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <>
      {items.map((item, index) => renderItem(item, index))}
    </>
  );
};

export default SidebarNav;
