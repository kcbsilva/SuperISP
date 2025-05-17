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
    href: '/',
    icon: LayoutDashboard,
    tooltip: 'sidebar.dashboard',
  },
  {
    title: 'sidebar.subscribers',
    href: '/subscribers/list',
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
        href: '/maps/projects',
        icon: FileCode,
        tooltip: 'sidebar.maps_projects',
      },
      {
        title: 'sidebar.maps_map',
        href: '/maps/map',
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
            href: '/maps/elements/polls',
            icon: Power,
            tooltip: 'sidebar.maps_elements_polls',
          },
          {
            title: 'sidebar.maps_elements_fdhs',
            href: '/maps/elements/fdhs',
            icon: Box,
            tooltip: 'sidebar.maps_elements_fdhs',
          },
          {
            title: 'sidebar.maps_elements_foscs',
            href: '/maps/elements/foscs',
            icon: Warehouse,
            tooltip: 'sidebar.maps_elements_foscs',
          },
          {
            title: 'sidebar.maps_elements_peds',
            href: '/maps/elements/peds',
            icon: Box,
            tooltip: 'sidebar.maps_elements_peds',
          },
          {
            title: 'sidebar.maps_elements_accessories',
            href: '/maps/elements/accessories',
            icon: Puzzle,
            tooltip: 'sidebar.maps_elements_accessories',
          },
          {
            title: 'sidebar.maps_elements_splitters',
            href: '/maps/elements/splitters',
            icon: Split,
            tooltip: 'sidebar.maps_elements_splitters',
          },
          {
            title: 'sidebar.maps_elements_towers',
            href: '/maps/elements/towers',
            icon: TowerControl,
            tooltip: 'sidebar.maps_elements_towers',
          },
          {
            title: 'sidebar.maps_elements_cables',
            href: '/maps/elements/cables',
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
        href: '/finances/cash-book',
        icon: BookOpen,
        tooltip: 'sidebar.finances_cash_book',
      },
      {
        title: 'sidebar.finances_entry_categories',
        href: '/finances/entry-categories',
        icon: ListFilter,
        tooltip: 'sidebar.finances_entry_categories',
      },
      {
        title: 'sidebar.finances_config',
        href: '/settings/finances/configurations',
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
        href: '/noc/overview',
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
            href: '/noc/fttx/dashboard',
            icon: LayoutDashboard,
            tooltip: 'sidebar.fttx_dashboard',
          },
          {
            title: 'sidebar.fttx_olts',
            href: '/noc/fttx/olts',
            icon: NetworkIcon, // Consider a different icon if NOC uses NetworkIcon
            tooltip: 'sidebar.fttx_olts',
          },
          {
            title: 'sidebar.fttx_onx_templates',
            href: '/noc/fttx/onx-templates',
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
            href: '/noc/wireless/dashboard',
            icon: LayoutDashboard,
            tooltip: 'sidebar.noc_wireless_dashboard',
          },
          {
            title: 'sidebar.noc_wireless_aps',
            href: '/noc/wireless/access-points',
            icon: RouterIcon, // Example Icon
            tooltip: 'sidebar.noc_wireless_aps',
          },
          {
            title: 'sidebar.noc_wireless_clients',
            href: '/noc/wireless/clients',
            icon: Users2, // Example Icon
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
        href: '/inventory/categories',
        icon: ListFilter,
        tooltip: 'sidebar.inventory_categories',
      },
      {
        title: 'sidebar.inventory_manufacturers',
        href: '/inventory/manufacturers',
        icon: Factory,
        tooltip: 'sidebar.inventory_manufacturers',
      },
      {
        title: 'sidebar.inventory_suppliers',
        href: '/inventory/suppliers',
        icon: Truck,
        tooltip: 'sidebar.inventory_suppliers',
      },
      {
        title: 'sidebar.inventory_products',
        href: '/inventory/products',
        icon: PackageIcon,
        tooltip: 'sidebar.inventory_products',
      },
      {
        title: 'sidebar.inventory_warehouses',
        href: '/inventory/warehouses',
        icon: Warehouse,
        tooltip: 'sidebar.inventory_warehouses',
      },
      {
        title: 'sidebar.inventory_vehicles',
        href: '/inventory/vehicles',
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
        href: '/service-calls/dashboard',
        icon: ServiceDashboardIcon,
        tooltip: 'sidebar.service_calls_dashboard',
      },
      {
        title: 'sidebar.service_calls_service_types',
        href: '/service-calls/service-types',
        icon: ServiceTypesIcon,
        tooltip: 'sidebar.service_calls_service_types',
      },
    ],
  },
  {
    title: 'sidebar.reports',
    href: '/reports',
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
        href: '/hr/employees',
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
        href: '/settings/global',
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
            href: '/settings/business/pops',
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
            href: '/settings/plans/internet',
            icon: Wifi,
            tooltip: 'sidebar.settings_plans_internet',
          },
          {
            title: 'sidebar.settings_plans_tv',
            href: '/settings/plans/tv',
            icon: Tv,
            tooltip: 'sidebar.settings_plans_tv',
          },
          {
            title: 'sidebar.settings_plans_mobile',
            href: '/settings/plans/mobile',
            icon: Smartphone,
            tooltip: 'sidebar.settings_plans_mobile',
          },
          {
            title: 'sidebar.settings_plans_landline',
            href: '/settings/plans/landline',
            icon: PhoneCall,
            tooltip: 'sidebar.settings_plans_landline',
          },
          {
            title: 'sidebar.settings_plans_combos',
            href: '/settings/plans/combos',
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
            href: '/settings/network/ip',
            icon: Code,
            tooltip: 'sidebar.network_ip',
          },
          {
            title: 'sidebar.network_devices',
            href: '/settings/network/devices',
            icon: RouterIcon,
            tooltip: 'sidebar.network_devices',
          },
          {
            title: 'sidebar.network_cgnat',
            href: '/settings/network/cgnat',
            icon: Share2,
            tooltip: 'sidebar.network_cgnat',
          },
          {
            title: 'sidebar.network_radius',
            href: '/settings/network/radius',
            icon: ServerIcon,
            tooltip: 'sidebar.network_radius',
          },
          {
            title: 'sidebar.network_vlan',
            href: '/settings/network/vlan',
            icon: Split,
            tooltip: 'sidebar.network_vlan',
          },
        ],
      },
      {
        title: 'sidebar.security',
        href: '/settings/security',
        icon: ShieldCheck,
        tooltip: 'sidebar.security',
      },
      {
        title: 'sidebar.settings_system_monitor',
        href: '/settings/system-monitor',
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
            href: '/settings/integrations/whatsapp',
            icon: MessageSquare,
            tooltip: 'sidebar.settings_integrations_whatsapp',
          },
          {
            title: 'sidebar.settings_integrations_telegram',
            href: '/settings/integrations/telegram',
            icon: MessageSquare,
            tooltip: 'sidebar.settings_integrations_telegram',
          },
          {
            title: 'sidebar.settings_integrations_meta',
            href: '/settings/integrations/meta',
            icon: MessageSquare,
            tooltip: 'sidebar.settings_integrations_meta',
          },
          {
            title: 'sidebar.settings_integrations_sms',
            href: '/settings/integrations/sms',
            icon: Text,
            tooltip: 'sidebar.settings_integrations_sms',
          },
        ],
      },
      {
        title: 'sidebar.settings_users',
        href: '/settings/users',
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
            href: '/mysql/databases',
            icon: Database,
            tooltip: 'sidebar.mysql_databases',
          },
          {
            title: 'sidebar.mysql_cli',
            href: '/mysql/cli',
            icon: Code,
            tooltip: 'sidebar.mysql_cli',
          },
        ],
      },
    ],
  },
  {
    title: 'sidebar.pilotview',
    href: '/pilotview',
    icon: TbDeviceImacStar,
    tooltip: 'sidebar.pilotview',
  },
  {
    title: 'sidebar.transitos',
    href: '/transitos',
    icon: SiReactrouter,
    tooltip: 'sidebar.transitos',
  },
  {
    title: 'sidebar.zones',
    href: '/zones',
    icon: SiNextdns,
    tooltip: 'sidebar.zones',
  },
];
