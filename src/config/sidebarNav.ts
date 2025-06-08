
// src/config/sidebarNav.ts
import {
  LayoutDashboard, ShieldCheck, Settings, Users, MapPin, TowerControl, Cable, Power, Box, Puzzle, Warehouse, Globe, GitFork,
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
  Database,
  Users2,
  Bus,
  BriefcaseBusiness,
  FileCode,
  Wrench,
  BookOpen,
  SlidersHorizontal,
  Briefcase,
  Building,
  Cog,
  Dot,
  TrendingUp, // Added for Sales
  Target, // Added for Opportunities
  ShoppingCart, // Added for Sales Orders
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
        icon: GitFork,
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
        href: '/admin/noc/dashboard', // Assuming overview is the NOC dashboard
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
            href: '/admin/noc/fttx/dashboard',
            icon: LayoutDashboard,
            tooltip: 'sidebar.fttx_dashboard',
          },
          {
            title: 'sidebar.fttx_olts',
            href: '/admin/noc/fttx/olts',
            icon: NetworkIcon, // Using NetworkIcon as OLTs are network devices
            tooltip: 'sidebar.fttx_olts',
          },
          {
            title: 'sidebar.fttx_onx_templates',
            href: '/admin/noc/fttx/onx-templates',
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
            icon: RouterIcon, // Using RouterIcon for APs
            tooltip: 'sidebar.noc_wireless_aps',
          },
          {
            title: 'sidebar.noc_wireless_clients',
            href: '/admin/noc/wireless/clients',
            icon: Users2, // Using Users2 for client devices
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
        icon: LayoutDashboard, // Using generic dashboard icon
        tooltip: 'sidebar.service_calls_dashboard',
      },
      {
        title: 'sidebar.service_calls_service_types',
        href: '/admin/service-calls/service-types',
        icon: ListChecks, // Using ListChecks for types/configuration
        tooltip: 'sidebar.service_calls_service_types',
      },
    ],
  },
  {
    title: 'sidebar.sales', // New Sales Menu
    icon: TrendingUp,
    tooltip: 'sidebar.sales',
    children: [
      {
        title: 'sidebar.sales_dashboard',
        href: '/admin/sales/dashboard',
        icon: LayoutDashboard,
        tooltip: 'sidebar.sales_dashboard',
      },
      {
        title: 'sidebar.sales_leads',
        href: '/admin/sales/leads',
        icon: Users, // Using Users icon for Leads
        tooltip: 'sidebar.sales_leads',
      },
      {
        title: 'sidebar.sales_opportunities',
        href: '/admin/sales/opportunities',
        icon: Target,
        tooltip: 'sidebar.sales_opportunities',
      },
      {
        title: 'sidebar.sales_proposals',
        href: '/admin/sales/proposals',
        icon: FileTextIcon,
        tooltip: 'sidebar.sales_proposals',
      },
      {
        title: 'sidebar.sales_sales_orders',
        href: '/admin/sales/orders',
        icon: ShoppingCart,
        tooltip: 'sidebar.sales_sales_orders',
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
        title: 'sidebar.hr_dashboard',
        href: '/admin/hr/dashboard',
        icon: LayoutDashboard,
        tooltip: 'sidebar.hr_dashboard',
      },
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
        title: 'sidebar.settings_network', // Renamed from sidebar.network
        icon: NetworkIcon,
        tooltip: 'sidebar.settings_network',
        children: [
          {
            title: 'sidebar.settings_network_ip', // Renamed
            href: '/admin/settings/network/ip',
            icon: Code,
            tooltip: 'sidebar.settings_network_ip',
          },
          {
            title: 'sidebar.settings_network_devices', // Renamed
            href: '/admin/settings/network/devices',
            icon: RouterIcon,
            tooltip: 'sidebar.settings_network_devices',
          },
          {
            title: 'sidebar.settings_network_cgnat', // Renamed
            href: '/admin/settings/network/cgnat',
            icon: Share2,
            tooltip: 'sidebar.settings_network_cgnat',
          },
          {
            title: 'sidebar.settings_network_radius', // Renamed
            href: '/admin/settings/network/radius',
            icon: ServerIcon,
            tooltip: 'sidebar.settings_network_radius',
          },
          {
            title: 'sidebar.settings_network_vlan', // Renamed
            href: '/admin/settings/network/vlan',
            icon: Split,
            tooltip: 'sidebar.settings_network_vlan',
          },
        ],
      },
      {
        title: 'sidebar.settings_security', // Renamed
        href: '/admin/settings/security',
        icon: ShieldCheck,
        tooltip: 'sidebar.settings_security',
      },
      {
        title: 'sidebar.settings_system_monitor',
        href: '/admin/settings/system-monitor',
        icon: RouterIcon, // Using RouterIcon as a generic system/device icon
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
    ],
  },
  { title: 'tools-separator', isSeparator: true },
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

    