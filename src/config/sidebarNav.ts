
// src/config/sidebarNav.ts
import {
  LayoutDashboard, ShieldCheck, Settings, Users, ChevronDown, MapPin, TowerControl, Cable, Power, Box, Puzzle, Warehouse, Globe, GitFork,
  Split,
  Code,
  Router as RouterIcon,
  Share2,
  Server as ServerIcon,
  DollarSign,
  BarChart3,
  Plug,
  MessageSquare,
  Text,
  Settings2,
  ListChecks,
  Wifi,
  Tv,
  Smartphone,
  PhoneCall,
  Combine,
  ListFilter,
  Archive,
  Factory,
  Package as PackageIcon,
  Truck,
  FileText as FileTextIcon,
  GitBranch,
  Network as NetworkIcon,
  Sun,
  Moon,
  Info,
  LogOut,
  UserCircle,
  Database,
  Users2,
  UserPlus,
  Bus,
  BriefcaseBusiness,
  FileCode,
  Wrench,
  LayoutDashboard as ServiceDashboardIcon,
  List as ServiceTypesIcon,
  ListTree,
  Menu as MenuIcon,
  Dot,
  BookOpen,
  SlidersHorizontal,
  Briefcase,
  Building,
  Cog,
} from 'lucide-react';
import { SiNextdns } from "react-icons/si";
import { TbDeviceImacStar } from "react-icons/tb";
import { SiReactrouter } from "react-icons/si";
import type { Icon as LucideIcon } from 'lucide-react';
import type { IconType } from 'react-icons';

export interface SidebarNavItem {
  title: string;
  href?: string;
  icon?: LucideIcon | IconType;
  tooltip?: string;
  isSeparator?: boolean;
  children?: SidebarNavItem[];
}

export const sidebarNav: SidebarNavItem[] = [
  {
    title: 'sidebar.dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
    tooltip: 'sidebar.dashboard',
  },
  {
    title: 'sidebar.subscribers',
    href: '/admin/subscribers/list',
    icon: Users,
    tooltip: 'sidebar.subscribers',
  },
  {
    title: 'sidebar.maps',
    icon: MapPin,
    tooltip: 'sidebar.maps',
    children: [
      {
        title: 'sidebar.maps_projects',
        href: '/admin/maps/projects',
        icon: FileCode,
        tooltip: 'sidebar.maps_projects',
      },
      {
        title: 'sidebar.maps_map',
        href: '/admin/maps/map',
        icon: Globe,
        tooltip: 'sidebar.maps_map',
      },
      {
        title: 'sidebar.maps_elements',
        icon: ListTree,
        tooltip: 'sidebar.maps_elements',
        children: [
          {
            title: 'sidebar.maps_elements_polls',
            href: '/admin/maps/elements/polls',
            icon: Power,
            tooltip: 'sidebar.maps_elements_polls',
          },
          {
            title: 'sidebar.maps_elements_fdhs',
            href: '/admin/maps/elements/fdhs',
            icon: Box,
            tooltip: 'sidebar.maps_elements_fdhs',
          },
          {
            title: 'sidebar.maps_elements_foscs',
            href: '/admin/maps/elements/foscs',
            icon: Warehouse,
            tooltip: 'sidebar.maps_elements_foscs',
          },
          {
            title: 'sidebar.maps_elements_peds',
            href: '/admin/maps/elements/peds',
            icon: Box,
            tooltip: 'sidebar.maps_elements_peds',
          },
          {
            title: 'sidebar.maps_elements_accessories',
            href: '/admin/maps/elements/accessories',
            icon: Puzzle,
            tooltip: 'sidebar.maps_elements_accessories',
          },
          {
            title: 'sidebar.maps_elements_splitters',
            href: '/admin/maps/elements/splitters',
            icon: Split,
            tooltip: 'sidebar.maps_elements_splitters',
          },
          {
            title: 'sidebar.maps_elements_towers',
            href: '/admin/maps/elements/towers',
            icon: TowerControl,
            tooltip: 'sidebar.maps_elements_towers',
          },
          {
            title: 'sidebar.maps_elements_cables',
            href: '/admin/maps/elements/cables',
            icon: Cable,
            tooltip: 'sidebar.maps_elements_cables',
          },
        ],
      },
    ],
  },
  {
    title: 'sidebar.finances',
    icon: DollarSign,
    tooltip: 'sidebar.finances',
    children: [
      {
        title: 'sidebar.finances_cash_book',
        href: '/admin/finances/cash-book',
        icon: BookOpen,
        tooltip: 'sidebar.finances_cash_book',
      },
      {
        title: 'sidebar.finances_entry_categories',
        href: '/admin/finances/entry-categories',
        icon: ListFilter,
        tooltip: 'sidebar.finances_entry_categories',
      },
      {
        title: 'sidebar.finances_config',
        href: '/admin/settings/finances/configurations',
        icon: SlidersHorizontal,
        tooltip: 'sidebar.finances_config',
      },
    ],
  },
  {
    title: 'sidebar.noc',
    icon: NetworkIcon,
    tooltip: 'sidebar.noc',
    children: [
      {
        title: 'sidebar.noc_overview',
        href: '/admin/noc/overview',
        icon: LayoutDashboard,
        tooltip: 'sidebar.noc_overview',
      },
      {
        title: 'sidebar.fttx',
        icon: GitBranch,
        tooltip: 'sidebar.fttx',
        children: [
          {
            title: 'sidebar.fttx_dashboard',
            href: '/admin/noc/fttx/dashboard', // Corrected path
            icon: LayoutDashboard,
            tooltip: 'sidebar.fttx_dashboard',
          },
          {
            title: 'sidebar.fttx_olts',
            href: 'admin/noc/fttx/olts', // Corrected path
            icon: NetworkIcon,
            tooltip: 'sidebar.fttx_olts',
          },
          {
            title: 'sidebar.fttx_onx_templates',
            href: '/admin/noc/fttx/onx-templates', // Corrected path
            icon: FileTextIcon,
            tooltip: 'sidebar.fttx_onx_templates',
          },
        ],
      },
      {
        title: 'sidebar.noc_wireless',
        icon: Wifi,
        tooltip: 'sidebar.noc_wireless',
        children: [
          {
            title: 'sidebar.noc_wireless_dashboard',
            href: '/admin/noc/wireless/dashboard',
            icon: LayoutDashboard,
            tooltip: 'sidebar.noc_wireless_dashboard',
          },
          {
            title: 'sidebar.noc_wireless_aps',
            href: '/admin/noc/wireless/access-points',
            icon: RouterIcon,
            tooltip: 'sidebar.noc_wireless_aps',
          },
          {
            title: 'sidebar.noc_wireless_clients',
            href: '/admin/noc/wireless/clients',
            icon: Users2,
            tooltip: 'sidebar.noc_wireless_clients',
          },
        ],
      },
    ],
  },
  {
    title: 'sidebar.inventory',
    icon: Archive,
    tooltip: 'sidebar.inventory',
    children: [
      {
        title: 'sidebar.inventory_categories',
        href: '/admin/inventory/categories',
        icon: ListFilter,
        tooltip: 'sidebar.inventory_categories',
      },
      {
        title: 'sidebar.inventory_manufacturers',
        href: '/admin/inventory/manufacturers',
        icon: Factory,
        tooltip: 'sidebar.inventory_manufacturers',
      },
      {
        title: 'sidebar.inventory_suppliers',
        href: '/admin/inventory/suppliers',
        icon: Truck,
        tooltip: 'sidebar.inventory_suppliers',
      },
      {
        title: 'sidebar.inventory_products',
        href: '/admin/inventory/products',
        icon: PackageIcon,
        tooltip: 'sidebar.inventory_products',
      },
       {
        title: 'sidebar.inventory_warehouses',
        href: '/admin/inventory/warehouses',
        icon: Warehouse,
        tooltip: 'sidebar.inventory_warehouses',
      },
      {
        title: 'sidebar.inventory_vehicles',
        href: '/admin/inventory/vehicles',
        icon: Bus,
        tooltip: 'sidebar.inventory_vehicles',
      },
    ],
  },
   {
    title: 'sidebar.service_calls',
    icon: Wrench,
    tooltip: 'sidebar.service_calls',
    children: [
      {
        title: 'sidebar.service_calls_dashboard',
        href: '/admin/service-calls/dashboard',
        icon: ServiceDashboardIcon,
        tooltip: 'sidebar.service_calls_dashboard',
      },
      {
        title: 'sidebar.service_calls_service_types',
        href: '/admin/service-calls/service-types',
        icon: ServiceTypesIcon,
        tooltip: 'sidebar.service_calls_service_types',
      },
    ],
  },
  {
    title: 'sidebar.reports',
    href: '/admin/reports',
    icon: BarChart3,
    tooltip: 'sidebar.reports',
  },
  {
    title: 'sidebar.hr',
    icon: BriefcaseBusiness,
    tooltip: 'sidebar.hr',
    children: [
      {
        title: 'sidebar.hr_employees',
        href: '/admin/hr/employees',
        icon: Users,
        tooltip: 'sidebar.hr_employees',
      },
    ],
  },
  {
    title: 'sidebar.settings',
    icon: Settings,
    tooltip: 'sidebar.settings',
    children: [
      {
        title: 'sidebar.settings_global',
        href: '/admin/settings/global',
        icon: Cog,
        tooltip: 'sidebar.settings_global',
      },
      {
        title: 'sidebar.settings_business',
        icon: Briefcase,
        tooltip: 'sidebar.settings_business',
        children: [
          {
            title: 'sidebar.settings_business_pops',
            href: '/admin/settings/business/pops',
            icon: Building,
            tooltip: 'sidebar.settings_business_pops',
          },
        ],
      },
      {
        title: 'sidebar.settings_plans',
        icon: ListChecks,
        tooltip: 'sidebar.settings_plans',
        children: [
          {
            title: 'sidebar.settings_plans_internet',
            href: '/admin/settings/plans/internet',
            icon: Wifi,
            tooltip: 'sidebar.settings_plans_internet',
          },
          {
            title: 'sidebar.settings_plans_tv',
            href: '/admin/settings/plans/tv',
            icon: Tv,
            tooltip: 'sidebar.settings_plans_tv',
          },
          {
            title: 'sidebar.settings_plans_mobile',
            href: '/admin/settings/plans/mobile',
            icon: Smartphone,
            tooltip: 'sidebar.settings_plans_mobile',
          },
          {
            title: 'sidebar.settings_plans_landline',
            href: '/admin/settings/plans/landline',
            icon: PhoneCall,
            tooltip: 'sidebar.settings_plans_landline',
          },
          {
            title: 'sidebar.settings_plans_combos',
            href: '/admin/settings/plans/combos',
            icon: Combine,
            tooltip: 'sidebar.settings_plans_combos',
          },
        ],
      },
      {
        title: 'sidebar.network',
        icon: NetworkIcon,
        tooltip: 'sidebar.network',
        children: [
          {
            title: 'sidebar.network_ip',
            href: '/admin/settings/network/ip',
            icon: Code,
            tooltip: 'sidebar.network_ip',
          },
          {
            title: 'sidebar.network_devices',
            href: '/admin/settings/network/devices',
            icon: RouterIcon,
            tooltip: 'sidebar.network_devices',
          },
          {
            title: 'sidebar.network_cgnat',
            href: '/admin/settings/network/cgnat',
            icon: Share2,
            tooltip: 'sidebar.network_cgnat',
          },
          {
            title: 'sidebar.network_radius',
            href: '/admin/settings/network/radius',
            icon: ServerIcon,
            tooltip: 'sidebar.network_radius',
          },
          {
            title: 'sidebar.network_vlan',
            href: '/admin/settings/network/vlan',
            icon: Split,
            tooltip: 'sidebar.network_vlan',
          },
        ],
      },
      {
        title: 'sidebar.security',
        href: '/admin/settings/security',
        icon: ShieldCheck,
        tooltip: 'sidebar.security',
      },
      {
        title: 'sidebar.settings_system_monitor',
        href: '/admin/settings/system-monitor',
        icon: RouterIcon,
        tooltip: 'sidebar.settings_system_monitor',
      },
      {
        title: 'sidebar.settings_integrations',
        icon: Plug,
        tooltip: 'sidebar.settings_integrations',
        children: [
          {
            title: 'sidebar.settings_integrations_whatsapp',
            href: '/admin/settings/integrations/whatsapp',
            icon: MessageSquare,
            tooltip: 'sidebar.settings_integrations_whatsapp',
          },
          {
            title: 'sidebar.settings_integrations_telegram',
            href: '/admin/settings/integrations/telegram',
            icon: MessageSquare,
            tooltip: 'sidebar.settings_integrations_telegram',
          },
          {
            title: 'sidebar.settings_integrations_meta',
            href: '/admin/settings/integrations/meta',
            icon: MessageSquare,
            tooltip: 'sidebar.settings_integrations_meta',
          },
          {
            title: 'sidebar.settings_integrations_sms',
            href: '/admin/settings/integrations/sms',
            icon: Text,
            tooltip: 'sidebar.settings_integrations_sms',
          },
        ],
      },
      {
        title: 'sidebar.settings_users',
        href: '/admin/settings/users',
        icon: Users,
        tooltip: 'sidebar.settings_users',
      },
      {
        title: 'sidebar.mysql',
        icon: Database,
        tooltip: 'sidebar.mysql',
        children: [
          {
            title: 'sidebar.mysql_databases',
            href: '/admin/mysql/databases',
            icon: Database,
            tooltip: 'sidebar.mysql_databases',
          },
          {
            title: 'sidebar.mysql_cli',
            href: '/admin/mysql/cli',
            icon: Code,
            tooltip: 'sidebar.mysql_cli',
          },
        ],
      },
    ],
  },
  { title: 'tools-separator', isSeparator: true }, // Unique title for the separator
  {
    title: 'sidebar.pilotview',
    href: '/admin/pilotview',
    icon: TbDeviceImacStar,
    tooltip: 'sidebar.pilotview',
  },
  {
    title: 'sidebar.transitos',
    href: '/admin/transitos',
    icon: SiReactrouter,
    tooltip: 'sidebar.transitos',
  },
  {
    title: 'sidebar.zones',
    href: '/admin/zones',
    icon: SiNextdns,
    tooltip: 'sidebar.zones',
  },
];
