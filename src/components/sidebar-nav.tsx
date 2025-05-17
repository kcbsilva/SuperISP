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

  const isActive = (href: string) => {
    const cleanHref = href.split('?')[0];
    const cleanPathname = pathname.split('?')[0];
    if (cleanHref === '/') return cleanPathname === '/';
    return cleanPathname.startsWith(cleanHref);
  };

  const renderItem = (item: SidebarNavItem) => {
    if (item.isSeparator) {
      return <SidebarSeparator key={item.title} />;
    }

    const IconComponent = item.icon as LucideIcon | IconType | undefined;
    const icon = IconComponent ? <IconComponent className={`${iconSize} ${isSubMenu ? 'text-muted-foreground' : ''}`} /> : null;

    if (item.children && item.children.length > 0) {
      const defaultOpen = item.children.some(child =>
        child.href ? isActive(child.href) : child.children?.some(grandchild => grandchild.href ? isActive(grandchild.href) : false)
      );

      return (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuSub defaultOpen={defaultOpen}>
            <SidebarMenuSubTrigger tooltip={t(item.tooltip || item.title)} isActive={isActive(item.href || '')} size={isSubMenu ? 'sm' : 'default'}>
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
      <SidebarMenuItem key={item.title}>
        <SidebarMenuButton href={item.href || '#'} isActive={isActive(item.href || '')} tooltip={t(item.tooltip || item.title)} size={isSubMenu ? 'sm' : 'default'}>
          {icon}
          <span className="truncate">{t(item.title)}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <>
      {items.map(item => renderItem(item))}
    </>
  );
};

export default SidebarNav;
