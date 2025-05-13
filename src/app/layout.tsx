// src/app/layout.tsx
'use client'; 

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, type ReactNode } from 'react';
import {
  LayoutDashboard, ShieldCheck, Settings, Users, ChevronDown, Dot, MapPin, TowerControl, Cable, Power, Box, Puzzle, Warehouse, Globe, GitFork,
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
  BookOpen, 
  SlidersHorizontal, 
  Briefcase, 
  Building, 
  Cog, 
  ListChecks, 
  Wifi, 
  Tv, 
  Smartphone, 
  Phone, 
  Combine, 
  ListFilter, 
  Archive, 
  Factory, 
  Package as PackageIcon, 
  Truck, 
  FileText as FileTextIcon, 
  GitBranch, 
  Network, 
  Sun, 
  Moon, 
  Info, 
  LogOut, 
  UserCircle, 
  Database, 
  Bus, 
  BriefcaseBusiness, 
  FileCode, 
  Wrench, 
  LayoutDashboard as ServiceDashboardIcon, 
  List as ServiceTypesIcon,
  ChevronRight,
  PanelLeft
} from 'lucide-react';
import { SiNextdns } from "react-icons/si";
import { TbDeviceImacStar } from "react-icons/tb";
import { SiReactrouter } from "react-icons/si";


import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarMenuSub, 
  SidebarMenuSubTrigger,
  SidebarMenuSubContent,
  SidebarSeparator, 
} from '@/components/ui/sidebar';

import { AppHeader } from '@/components/app-header';
import { TooltipProvider } from '@/components/ui/tooltip'; 
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Progress } from '@/components/ui/progress';
import { LocaleProvider, useLocale, type Locale as AppLocale } from '@/contexts/LocaleContext';
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes';


const queryClient = new QueryClient();

function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); 
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { t } = useLocale(); 
  const { theme } = useTheme();
  const [logoFillColor, setLogoFillColor] = useState<string>('hsl(var(--primary))');


  useEffect(() => {
    if (pathname) {
      setIsLoading(true);
      setProgress(10); 

      const timer = setTimeout(() => {
        setProgress(90); 
      }, 100); 

      const finishTimer = setTimeout(() => {
        setProgress(100); 
        const hideTimer = setTimeout(() => {
          setIsLoading(false);
          setProgress(0); 
        }, 300); 
        return () => clearTimeout(hideTimer);
      }, 500); 

      return () => {
        clearTimeout(timer);
        clearTimeout(finishTimer);
      };
    }
  }, [pathname]); 

  const isActive = (href: string) => {
    const cleanHref = href.split('?')[0]; 
    const cleanPathname = pathname.split('?')[0];
    return cleanPathname === href || (cleanHref !== '/' && cleanPathname.startsWith(cleanHref));
  };


  const isMapPage = pathname === '/maps/map';

  const iconSize = "h-3 w-3";
  const subIconSize = "h-2.5 w-2.5";

  useEffect(() => {
    if (typeof window !== 'undefined' && theme) {
      const newFillColor = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
        ? 'hsl(var(--accent))' 
        : 'hsl(var(--primary))';
      setLogoFillColor(newFillColor);
    }
  }, [theme]);


  return (
    <TooltipProvider>
      <SidebarProvider side="left" collapsible='none'>
        <div className="d-flex"> {/* Bootstrap flex container */}
          <Sidebar>
            <SidebarHeader>
              <Link
                href="/"
                className="d-flex align-items-center justify-content-center p-2" // Bootstrap classes
                style={{ width: '131px', height: '32px' }}
              >
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 131 32"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ fill: logoFillColor }}
                >
                  <path d="M21.0938 18.375H18.2188V27H15.25V18.375H12.375V15.875H15.25V11.6562C15.25 9.5625 16.3438 8.03125 18.5312 8.03125L21.25 8.0625V10.625H19.5C18.8125 10.625 18.2188 10.9688 18.2188 11.8438V15.875H21.2188L21.0938 18.375Z" />
                  <path d="M33.2812 20.0625C33.1875 20.0938 33.0938 20.0938 33 20.125C31.6562 20.7812 30.0938 21.125 28.3438 21.125C24.5312 21.125 22.1562 18.5312 22.1562 14.5312C22.1562 10.5312 24.5312 7.9375 28.3438 7.9375C30.0938 7.9375 31.6562 8.28125 33 8.9375C33.0938 8.96875 33.1875 8.96875 33.2812 9V11.4375C33.1875 11.4062 33.0938 11.4062 33 11.375C32.0312 10.9062 30.8438 10.5 29.5312 10.5C27.2812 10.5 26.0312 12.0312 26.0312 14.5312C26.0312 17.0312 27.2812 18.5625 29.5312 18.5625C30.8438 18.5625 32.0312 18.1562 33 17.6875C33.0938 17.6562 33.1875 17.6562 33.2812 17.625V20.0625Z" />
                  <path d="M42.2188 18.8125L38.9375 8.09375H35.5938L32.3125 18.8125L32.2188 21H34.5938L35.2188 18.9062H39.4062L40.0312 21H42.4062L42.2188 18.8125ZM37.3125 12.5938L38.3125 16.4062H36.3125L37.3125 12.5938Z" />
                  <path d="M51.2812 20.0625C51.1875 20.0938 51.0938 20.0938 51 20.125C49.6562 20.7812 48.0938 21.125 46.3438 21.125C42.5312 21.125 40.1562 18.5312 40.1562 14.5312C40.1562 10.5312 42.5312 7.9375 46.3438 7.9375C48.0938 7.9375 49.6562 8.28125 51 8.9375C51.0938 8.96875 51.1875 8.96875 51.2812 9V11.4375C51.1875 11.4062 51.0938 11.4062 51 11.375C50.0312 10.9062 48.8438 10.5 47.5312 10.5C45.2812 10.5 44.0312 12.0312 44.0312 14.5312C44.0312 17.0312 45.2812 18.5625 47.5312 18.5625C48.8438 18.5625 50.0312 18.1562 51 17.6875C51.0938 17.6562 51.1875 17.6562 51.2812 17.625V20.0625Z" />
                  <path d="M58.4062 18.375H55.5312V27H52.5625V18.375H49.6875V15.875H52.5625V11.6562C52.5625 9.5625 53.6562 8.03125 55.8438 8.03125L58.5625 8.0625V10.625H56.8125C56.125 10.625 55.5312 10.9688 55.5312 11.8438V15.875H58.5312L58.4062 18.375Z" />
                  <path d="M66.8125 21H63.7812V8.09375H66.8125V21Z" />
                  <path d="M79.6875 21H76.6562V8.09375H79.6875V21Z" />
                  <path d="M93.625 21H80.7812V18.4375H90.5938V8.09375H93.625V21Z" />
                  <path d="M102.375 21H96.5625C93.9062 21 92.0312 19.125 92.0312 16.5312V10.5625C92.0312 7.96875 93.9062 6.09375 96.5625 6.09375H102.375V8.65625H96.875C95.75 8.65625 95.0625 9.34375 95.0625 10.5312V16.5625C95.0625 17.75 95.75 18.4375 96.875 18.4375H102.375V21Z" />
                  <path d="M109.656 18.8125L106.375 8.09375H103.031L99.75 18.8125L99.6562 21H102.031L102.656 18.9062H106.844L107.469 21H109.844L109.656 18.8125ZM104.75 12.5938L105.75 16.4062H103.75L104.75 12.5938Z" />
                  <path d="M120.594 21H111.031V18.4375H114.594V13.5312H111.031V10.9688H114.594V8.09375H120.594V10.9688H117.156V13.5312H120.594V15.875H117.156V18.4375H120.594V21Z" />
                  <path d="M126.031 18.375H123.156V27H120.188V18.375H117.312V15.875H120.188V11.6562C120.188 9.5625 121.281 8.03125 123.469 8.03125L126.188 8.0625V10.625H124.438C123.75 10.625 123.156 10.9688 123.156 11.8438V15.875H126.156L126.031 18.375Z" />
                  <path d="M0.5 0.5H4.5V4.5H0.5V0.5Z" />
                  <path d="M0.5 8.5H4.5V12.5H0.5V8.5Z" />
                  <path d="M0.5 16.5H4.5V20.5H0.5V16.5Z" />
                  <path d="M0.5 24.5H4.5V28.5H0.5V24.5Z" />
                  <path d="M8.5 0.5H12.5V4.5H8.5V0.5Z" />
                  <path d="M8.5 8.5H12.5V12.5H8.5V8.5Z" />
                </svg>
              </Link>
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive('/')} tooltip={t('sidebar.dashboard')}>
                    <Link href="/" className="d-flex align-items-center gap-2">
                      <LayoutDashboard className={iconSize} />
                      <span>{t('sidebar.dashboard')}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                {/* Subscribers Menu - Direct Links */}
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive('/subscribers/list')} tooltip={t('sidebar.subscribers')}>
                    <Link href="/subscribers/list" className="d-flex align-items-center gap-2">
                      <Users className={iconSize} />
                      <span className="text-truncate">{t('sidebar.subscribers')}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                {/* Maps Menu */}
                <SidebarMenuItem>
                  <SidebarMenuSub>
                      <SidebarMenuSubTrigger tooltip={t('sidebar.maps')}>
                        <div className="d-flex align-items-center gap-2 cursor-pointer">
                          <MapPin className={iconSize} />
                          <span className="text-truncate">{t('sidebar.maps')}</span>
                          <ChevronDown className="ms-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                        </div>
                      </SidebarMenuSubTrigger>
                    <SidebarMenuSubContent>
                       <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={isActive('/maps/map')} size="sm" tooltip={t('sidebar.maps_map')}>
                          <Link href="/maps/map" className="d-flex align-items-center gap-2">
                            <Globe className={`${subIconSize} text-muted`} />
                            <span>{t('sidebar.maps_map')}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={isActive('/maps/projects')} size="sm" tooltip={t('sidebar.maps_projects', 'Projects')}>
                          <Link href="/maps/projects" className="d-flex align-items-center gap-2">
                            <FileCode className={`${subIconSize} text-muted`} />
                            <span>{t('sidebar.maps_projects', 'Projects')}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuSub>
                            <SidebarMenuSubTrigger
                              size="sm"
                              className="ps-3 pe-2 py-1.5" // Bootstrap padding classes
                              tooltip={t('sidebar.maps_elements')}
                            >
                              <div className="d-flex align-items-center gap-2 cursor-pointer w-100">
                                <GitFork className={`${subIconSize} text-muted`} />
                                <span className="text-truncate">{t('sidebar.maps_elements')}</span>
                                <ChevronDown className="ms-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                              </div>
                            </SidebarMenuSubTrigger>
                          <SidebarMenuSubContent>
                             <SidebarMenuItem>
                              <SidebarMenuButton asChild isActive={isActive('/maps/elements/polls')} size="sm" tooltip={t('sidebar.maps_elements_polls')}>
                                <Link href="/maps/elements/polls" className="d-flex align-items-center gap-2">
                                  <Power className={`${subIconSize} text-muted`} />
                                  <span>{t('sidebar.maps_elements_polls')}</span>
                                </Link>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                             <SidebarMenuItem>
                              <SidebarMenuButton asChild isActive={isActive('/maps/elements/fdhs')} size="sm" tooltip={t('sidebar.maps_elements_fdhs')}>
                                <Link href="/maps/elements/fdhs" className="d-flex align-items-center gap-2">
                                  <Box className={`${subIconSize} text-muted`} />
                                  <span>{t('sidebar.maps_elements_fdhs')}</span>
                                </Link>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                             <SidebarMenuItem>
                              <SidebarMenuButton asChild isActive={isActive('/maps/elements/foscs')} size="sm" tooltip={t('sidebar.maps_elements_foscs')}>
                                <Link href="/maps/elements/foscs" className="d-flex align-items-center gap-2">
                                  <Warehouse className={`${subIconSize} text-muted`} />
                                  <span>{t('sidebar.maps_elements_foscs')}</span>
                                </Link>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                             <SidebarMenuItem>
                              <SidebarMenuButton asChild isActive={isActive('/maps/elements/peds')} size="sm" tooltip={t('sidebar.maps_elements_peds')}>
                                <Link href="/maps/elements/peds" className="d-flex align-items-center gap-2">
                                  <Box className={`${subIconSize} text-muted`} />
                                  <span>{t('sidebar.maps_elements_peds')}</span>
                                </Link>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                             <SidebarMenuItem>
                              <SidebarMenuButton asChild isActive={isActive('/maps/elements/accessories')} size="sm" tooltip={t('sidebar.maps_elements_accessories')}>
                                <Link href="/maps/elements/accessories" className="d-flex align-items-center gap-2">
                                  <Puzzle className={`${subIconSize} text-muted`} />
                                  <span>{t('sidebar.maps_elements_accessories')}</span>
                                </Link>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                              <SidebarMenuButton asChild isActive={isActive('/maps/elements/splitters')} size="sm" tooltip={t('sidebar.maps_elements_splitters', 'Splitters')}>
                                <Link href="/maps/elements/splitters" className="d-flex align-items-center gap-2">
                                  <Split className={`${subIconSize} text-muted`} />
                                  <span>{t('sidebar.maps_elements_splitters', 'Splitters')}</span>
                                </Link>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                             <SidebarMenuItem>
                              <SidebarMenuButton asChild isActive={isActive('/maps/elements/towers')} size="sm" tooltip={t('sidebar.maps_elements_towers')}>
                                <Link href="/maps/elements/towers" className="d-flex align-items-center gap-2">
                                  <TowerControl className={`${subIconSize} text-muted`} />
                                  <span>{t('sidebar.maps_elements_towers')}</span>
                                </Link>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                             <SidebarMenuItem>
                              <SidebarMenuButton asChild isActive={isActive('/maps/elements/cables')} size="sm" tooltip={t('sidebar.maps_elements_cables')}>
                                <Link href="/maps/elements/cables" className="d-flex align-items-center gap-2">
                                  <Cable className={`${subIconSize} text-muted`} />
                                  <span>{t('sidebar.maps_elements_cables')}</span>
                                </Link>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          </SidebarMenuSubContent>
                        </SidebarMenuSub>
                      </SidebarMenuItem>
                    </SidebarMenuSubContent>
                  </SidebarMenuSub>
                </SidebarMenuItem>

                {/* FTTx Menu */}
                <SidebarMenuItem>
                  <SidebarMenuSub>
                      <SidebarMenuSubTrigger tooltip={t('sidebar.fttx', 'FTTx')}>
                        <div className="d-flex align-items-center gap-2 cursor-pointer">
                          <GitBranch className={iconSize}/>
                          <span className="text-truncate">{t('sidebar.fttx', 'FTTx')}</span>
                          <ChevronDown className="ms-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                        </div>
                      </SidebarMenuSubTrigger>
                    <SidebarMenuSubContent>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={isActive('/fttx/dashboard')} size="sm" tooltip={t('sidebar.fttx_dashboard', 'Dashboard')}>
                          <Link href="/fttx/dashboard" className="d-flex align-items-center gap-2">
                            <LayoutDashboard className={`${subIconSize} text-muted`} />
                            <span>{t('sidebar.fttx_dashboard', 'Dashboard')}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={isActive('/fttx/olts')} size="sm" tooltip={t('sidebar.fttx_olts', 'OLTs & ONXs')}>
                          <Link href="/fttx/olts" className="d-flex align-items-center gap-2">
                            <Network className={`${subIconSize} text-muted`} />
                            <span>{t('sidebar.fttx_olts', 'OLTs & ONXs')}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={isActive('/fttx/onx-templates')} size="sm" tooltip={t('sidebar.fttx_onx_templates', 'ONx Templates')}>
                          <Link href="/fttx/onx-templates" className="d-flex align-items-center gap-2">
                            <FileTextIcon className={`${subIconSize} text-muted`} />
                            <span>{t('sidebar.fttx_onx_templates', 'ONx Templates')}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenuSubContent>
                  </SidebarMenuSub>
                </SidebarMenuItem>


                {/* Finances Menu */}
                <SidebarMenuItem>
                  <SidebarMenuSub>
                      <SidebarMenuSubTrigger tooltip={t('sidebar.finances')}>
                        <div className="d-flex align-items-center gap-2 cursor-pointer">
                          <DollarSign className={iconSize}/>
                          <span className="text-truncate">{t('sidebar.finances')}</span>
                          <ChevronDown className="ms-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                        </div>
                      </SidebarMenuSubTrigger>
                    <SidebarMenuSubContent>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={isActive('/finances/cash-book')} size="sm" tooltip={t('sidebar.finances_cash_book')}>
                          <Link href="/finances/cash-book" className="d-flex align-items-center gap-2">
                            <BookOpen className={`${subIconSize} text-muted`} />
                            <span>{t('sidebar.finances_cash_book')}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={isActive('/finances/entry-categories')} size="sm" tooltip={t('sidebar.finances_entry_categories')}>
                          <Link href="/finances/entry-categories" className="d-flex align-items-center gap-2">
                            <ListFilter className={`${subIconSize} text-muted`} />
                            <span>{t('sidebar.finances_entry_categories')}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                       <SidebarMenuItem>
                         <SidebarMenuButton asChild isActive={isActive('/settings/finances/configurations')} size="sm" tooltip={t('sidebar.finances_config')}>
                           <Link href="/settings/finances/configurations" className="d-flex align-items-center gap-2">
                             <SlidersHorizontal className={`${subIconSize} text-muted`} />
                             <span>{t('sidebar.finances_config')}</span>
                           </Link>
                         </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenuSubContent>
                  </SidebarMenuSub>
                </SidebarMenuItem>

                 {/* Inventory Menu */}
                 <SidebarMenuItem>
                  <SidebarMenuSub>
                      <SidebarMenuSubTrigger tooltip={t('sidebar.inventory', 'Inventory')}>
                        <div className="d-flex align-items-center gap-2 cursor-pointer">
                          <Archive className={iconSize}/>
                          <span className="text-truncate">{t('sidebar.inventory', 'Inventory')}</span>
                          <ChevronDown className="ms-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                        </div>
                      </SidebarMenuSubTrigger>
                    <SidebarMenuSubContent>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={isActive('/inventory/categories')} size="sm" tooltip={t('sidebar.inventory_categories', 'Categories')}>
                          <Link href="#" className="d-flex align-items-center gap-2">
                            <ListFilter className={`${subIconSize} text-muted`} />
                            <span>{t('sidebar.inventory_categories', 'Categories')}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                       <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={isActive('/inventory/manufacturers')} size="sm" tooltip={t('sidebar.inventory_manufacturers', 'Manufacturers')}>
                          <Link href="#" className="d-flex align-items-center gap-2">
                            <Factory className={`${subIconSize} text-muted`} />
                            <span>{t('sidebar.inventory_manufacturers', 'Manufacturers')}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={isActive('/inventory/suppliers')} size="sm" tooltip={t('sidebar.inventory_suppliers', 'Suppliers')}>
                          <Link href="#" className="d-flex align-items-center gap-2">
                            <Truck className={`${subIconSize} text-muted`} />
                            <span>{t('sidebar.inventory_suppliers', 'Suppliers')}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={isActive('/inventory/products')} size="sm" tooltip={t('sidebar.inventory_products', 'Products')}>
                          <Link href="#" className="d-flex align-items-center gap-2">
                            <PackageIcon className={`${subIconSize} text-muted`} />
                            <span>{t('sidebar.inventory_products', 'Products')}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={isActive('/inventory/warehouses')} size="sm" tooltip={t('sidebar.inventory_warehouses', 'Warehouses')}>
                          <Link href="/inventory/warehouses" className="d-flex align-items-center gap-2">
                            <Warehouse className={`${subIconSize} text-muted`} />
                            <span>{t('sidebar.inventory_warehouses', 'Warehouses')}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                       <SidebarMenuItem>
                          <SidebarMenuButton asChild isActive={isActive('/inventory/vehicles')} size="sm" tooltip={t('sidebar.inventory_vehicles', 'Vehicles')}>
                            <Link href="#" className="d-flex align-items-center gap-2">
                              <Bus className={`${subIconSize} text-muted`} />
                              <span>{t('sidebar.inventory_vehicles', 'Vehicles')}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenuSubContent>
                  </SidebarMenuSub>
                </SidebarMenuItem>

                {/* Service Calls Menu Item */}
                <SidebarMenuItem>
                  <SidebarMenuSub>
                      <SidebarMenuSubTrigger tooltip={t('sidebar.service_calls', 'Service Calls')}>
                        <div className="d-flex align-items-center gap-2 cursor-pointer">
                          <Wrench className={iconSize}/>
                          <span className="text-truncate">{t('sidebar.service_calls', 'Service Calls')}</span>
                          <ChevronDown className="ms-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                        </div>
                      </SidebarMenuSubTrigger>
                    <SidebarMenuSubContent>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={isActive('/service-calls/dashboard')} size="sm" tooltip={t('sidebar.service_calls_dashboard', 'Dashboard')}>
                          <Link href="/service-calls/dashboard" className="d-flex align-items-center gap-2">
                            <ServiceDashboardIcon className={`${subIconSize} text-muted`} />
                            <span>{t('sidebar.service_calls_dashboard', 'Dashboard')}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={isActive('/service-calls/service-types')} size="sm" tooltip={t('sidebar.service_calls_service_types', 'Service Types')}>
                          <Link href="/service-calls/service-types" className="d-flex align-items-center gap-2">
                            <ServiceTypesIcon className={`${subIconSize} text-muted`} />
                            <span>{t('sidebar.service_calls_service_types', 'Service Types')}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenuSubContent>
                  </SidebarMenuSub>
                </SidebarMenuItem>


                {/* Reports Menu */}
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive('/reports')} tooltip={t('sidebar.reports')}>
                    <Link href="#" className="d-flex align-items-center gap-2">
                      <BarChart3 className={iconSize}/>
                      <span>{t('sidebar.reports')}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                  {/* HR Menu */}
                  <SidebarMenuItem>
                  <SidebarMenuSub>
                      <SidebarMenuSubTrigger tooltip={t('sidebar.hr', 'HR')}>
                        <div className="d-flex align-items-center gap-2 cursor-pointer">
                          <BriefcaseBusiness className={iconSize}/>
                          <span className="text-truncate">{t('sidebar.hr', 'HR')}</span>
                          <ChevronDown className="ms-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                        </div>
                      </SidebarMenuSubTrigger>
                    <SidebarMenuSubContent>
                       <SidebarMenuItem>
                          <SidebarMenuButton asChild isActive={isActive('/hr/employees')} size="sm" tooltip={t('sidebar.hr_employees', 'Employees')}>
                             <Link href="#" className="d-flex align-items-center gap-2">
                               <Users className={`${subIconSize} text-muted`} />
                               <span>{t('sidebar.hr_employees', 'Employees')}</span>
                             </Link>
                          </SidebarMenuButton>
                       </SidebarMenuItem>
                    </SidebarMenuSubContent>
                  </SidebarMenuSub>
                </SidebarMenuItem>


                {/* Settings Menu */}
                <SidebarMenuItem>
                  <SidebarMenuSub>
                      <SidebarMenuSubTrigger tooltip={t('sidebar.settings')}>
                        <div className="d-flex align-items-center gap-2 cursor-pointer">
                          <Settings className={iconSize} />
                          <span className="text-truncate">{t('sidebar.settings')}</span>
                          <ChevronDown className="ms-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                        </div>
                      </SidebarMenuSubTrigger>
                    <SidebarMenuSubContent>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={isActive('/settings/global')} size="sm" tooltip={t('sidebar.settings_global')}>
                          <Link href="/settings/global" className="d-flex align-items-center gap-2">
                            <Cog className={`${subIconSize} text-muted`} />
                            <span>{t('sidebar.settings_global')}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>

                      <SidebarMenuItem>
                        <SidebarMenuSub>
                            <SidebarMenuSubTrigger
                              size="sm"
                              className="ps-3 pe-2 py-1.5"
                              tooltip={t('sidebar.settings_business')}
                            >
                              <div className="d-flex align-items-center gap-2 cursor-pointer w-100">
                                <Briefcase className={`${subIconSize} text-muted`} />
                                <span className="text-truncate">{t('sidebar.settings_business')}</span>
                                <ChevronDown className="ms-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                              </div>
                            </SidebarMenuSubTrigger>
                          <SidebarMenuSubContent>
                            <SidebarMenuItem>
                              <SidebarMenuButton asChild isActive={isActive('/settings/business/pops')} size="sm" tooltip={t('sidebar.settings_business_pops')}>
                                <Link href="/settings/business/pops" className="d-flex align-items-center gap-2">
                                  <Building className={`${subIconSize} text-muted`} />
                                  <span>{t('sidebar.settings_business_pops')}</span>
                                </Link>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          </SidebarMenuSubContent>
                        </SidebarMenuSub>
                      </SidebarMenuItem>

                       {/* Plans Menu Item - Moved under Settings */}
                       <SidebarMenuItem>
                        <SidebarMenuSub>
                            <SidebarMenuSubTrigger
                              size="sm"
                              className="ps-3 pe-2 py-1.5"
                              tooltip={t('sidebar.settings_plans', 'Plans')}
                            >
                              <div className="d-flex align-items-center gap-2 cursor-pointer w-100">
                                <ListChecks className={`${subIconSize} text-muted`} />
                                <span className="text-truncate">{t('sidebar.settings_plans', 'Plans')}</span>
                                <ChevronDown className="ms-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                              </div>
                            </SidebarMenuSubTrigger>
                          <SidebarMenuSubContent>
                            <SidebarMenuItem>
                              <SidebarMenuButton asChild isActive={isActive('/settings/plans/internet')} size="sm" tooltip={t('sidebar.settings_plans_internet', 'Internet Plans')}>
                                <Link href="/settings/plans/internet" className="d-flex align-items-center gap-2">
                                  <Wifi className={`${subIconSize} text-muted`} />
                                  <span>{t('sidebar.settings_plans_internet', 'Internet')}</span>
                                </Link>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                              <SidebarMenuButton asChild isActive={isActive('/settings/plans/tv')} size="sm" tooltip={t('sidebar.settings_plans_tv', 'TV')}>
                                <Link href="/settings/plans/tv" className="d-flex align-items-center gap-2">
                                  <Tv className={`${subIconSize} text-muted`} />
                                  <span>{t('sidebar.settings_plans_tv', 'TV')}</span>
                                </Link>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                              <SidebarMenuButton asChild isActive={isActive('/settings/plans/mobile')} size="sm" tooltip={t('sidebar.settings_plans_mobile', 'Mobile')}>
                                <Link href="/settings/plans/mobile" className="d-flex align-items-center gap-2">
                                  <Smartphone className={`${subIconSize} text-muted`} />
                                  <span>{t('sidebar.settings_plans_mobile', 'Mobile')}</span>
                                </Link>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                              <SidebarMenuButton asChild isActive={isActive('/settings/plans/landline')} size="sm" tooltip={t('sidebar.settings_plans_landline', 'Landline')}>
                                <Link href="/settings/plans/landline" className="d-flex align-items-center gap-2">
                                  <Phone className={`${subIconSize} text-muted`} />
                                  <span>{t('sidebar.settings_plans_landline', 'Landline')}</span>
                                </Link>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                              <SidebarMenuButton asChild isActive={isActive('/settings/plans/combos')} size="sm" tooltip={t('sidebar.settings_plans_combos', 'Combos')}>
                                <Link href="/settings/plans/combos" className="d-flex align-items-center gap-2">
                                  <Combine className={`${subIconSize} text-muted`} />
                                  <span>{t('sidebar.settings_plans_combos', 'Combos')}</span>
                                </Link>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          </SidebarMenuSubContent>
                        </SidebarMenuSub>
                      </SidebarMenuItem>


                      {/* Network Menu moved here */}
                      <SidebarMenuItem>
                        <SidebarMenuSub>
                            <SidebarMenuSubTrigger
                              size="sm"
                              className="ps-3 pe-2 py-1.5"
                              tooltip={t('sidebar.network')}
                            >
                              <div className="d-flex align-items-center gap-2 cursor-pointer w-100">
                                <Network className={`${subIconSize} text-muted`} />
                                <span className="text-truncate">{t('sidebar.network')}</span>
                                <ChevronDown className="ms-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                              </div>
                            </SidebarMenuSubTrigger>
                          <SidebarMenuSubContent>
                            <SidebarMenuItem>
                              <SidebarMenuButton asChild isActive={isActive('/settings/network/ip')} size="sm" tooltip={t('sidebar.network_ip')}>
                                <Link href="#" className="d-flex align-items-center gap-2">
                                  <Code className={`${subIconSize} text-muted`} />
                                  <span>{t('sidebar.network_ip')}</span>
                                </Link>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                              <SidebarMenuButton asChild isActive={isActive('/settings/network/devices')} size="sm" tooltip={t('sidebar.network_devices')}>
                                <Link href="#" className="d-flex align-items-center gap-2">
                                  <RouterIcon className={`${subIconSize} text-muted`} />
                                  <span>{t('sidebar.network_devices')}</span>
                                </Link>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                              <SidebarMenuButton asChild isActive={isActive('/settings/network/cgnat')} size="sm" tooltip={t('sidebar.network_cgnat')}>
                                <Link href="/settings/network/cgnat" className="d-flex align-items-center gap-2">
                                  <Share2 className={`${subIconSize} text-muted`} />
                                  <span>{t('sidebar.network_cgnat')}</span>
                                </Link>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                              <SidebarMenuButton asChild isActive={isActive('/settings/network/radius')} size="sm" tooltip={t('sidebar.network_radius')}>
                                <Link href="#" className="d-flex align-items-center gap-2">
                                  <ServerIcon className={`${subIconSize} text-muted`} />
                                  <span>{t('sidebar.network_radius')}</span>
                                </Link>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                              <SidebarMenuButton asChild isActive={isActive('/settings/network/vlan')} size="sm" tooltip={t('sidebar.network_vlan')}>
                                <Link href="/settings/network/vlan" className="d-flex align-items-center gap-2">
                                  <Split className={`${subIconSize} text-muted`} />
                                  <span>{t('sidebar.network_vlan')}</span>
                                </Link>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          </SidebarMenuSubContent>
                        </SidebarMenuSub>
                      </SidebarMenuItem>

                      {/* Financial Configurations moved here */}
                      <SidebarMenuItem>
                         <SidebarMenuButton asChild isActive={isActive('/settings/finances/configurations')} size="sm" tooltip={t('sidebar.finances_config')}>
                           <Link href="/settings/finances/configurations" className="d-flex align-items-center gap-2">
                             <SlidersHorizontal className={`${subIconSize} text-muted`} />
                             <span>{t('sidebar.finances_config')}</span>
                           </Link>
                         </SidebarMenuButton>
                      </SidebarMenuItem>

                      {/* Security Menu Item moved here */}
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={isActive('/settings/security')} size="sm" tooltip={t('sidebar.security')}>
                          <Link href="#" className="d-flex align-items-center gap-2">
                            <ShieldCheck className={`${subIconSize} text-muted`} />
                            <span>{t('sidebar.security')}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>

                      <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={isActive('/settings/system-monitor')} size="sm" tooltip={t('sidebar.settings_system_monitor', 'System Monitor')}>
                          <Link href="/settings/system-monitor" className="d-flex align-items-center gap-2">
                            <RouterIcon className={`${subIconSize} text-muted`} />
                            <span>{t('sidebar.settings_system_monitor', 'System Monitor')}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>

                      <SidebarMenuItem>
                        <SidebarMenuSub>
                            <SidebarMenuSubTrigger
                              size="sm"
                              className="ps-3 pe-2 py-1.5"
                              tooltip={t('sidebar.settings_integrations')}
                            >
                              <div className="d-flex align-items-center gap-2 cursor-pointer w-100">
                                <Plug className={`${subIconSize} text-muted`} />
                                <span className="text-truncate">{t('sidebar.settings_integrations')}</span>
                                <ChevronDown className="ms-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                              </div>
                            </SidebarMenuSubTrigger>
                          <SidebarMenuSubContent>
                            <SidebarMenuItem>
                              <SidebarMenuButton asChild isActive={isActive('/settings/integrations/whatsapp')} size="sm" tooltip={t('sidebar.settings_integrations_whatsapp')}>
                                <Link href="#" className="d-flex align-items-center gap-2">
                                  <MessageSquare className={`${subIconSize} text-muted`} />
                                  <span>{t('sidebar.settings_integrations_whatsapp')}</span>
                                </Link>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                              <SidebarMenuButton asChild isActive={isActive('/settings/integrations/telegram')} size="sm" tooltip={t('sidebar.settings_integrations_telegram')}>
                                <Link href="#" className="d-flex align-items-center gap-2">
                                  <MessageSquare className={`${subIconSize} text-muted`} />
                                  <span>{t('sidebar.settings_integrations_telegram')}</span>
                                </Link>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                              <SidebarMenuButton asChild isActive={isActive('/settings/integrations/meta')} size="sm" tooltip={t('sidebar.settings_integrations_meta')}>
                                <Link href="#" className="d-flex align-items-center gap-2">
                                  <MessageSquare className={`${subIconSize} text-muted`} />
                                  <span>{t('sidebar.settings_integrations_meta')}</span>
                                </Link>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                              <SidebarMenuButton asChild isActive={isActive('/settings/integrations/sms')} size="sm" tooltip={t('sidebar.settings_integrations_sms')}>
                                <Link href="#" className="d-flex align-items-center gap-2">
                                  <Text className={`${subIconSize} text-muted`} />
                                  <span>{t('sidebar.settings_integrations_sms')}</span>
                                </Link>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          </SidebarMenuSubContent>
                        </SidebarMenuSub>
                      </SidebarMenuItem>

                      <SidebarMenuItem>
                          <SidebarMenuButton asChild isActive={isActive('/settings/users')} size="sm" tooltip={t('sidebar.settings_users', 'Users')}>
                             <Link href="/settings/users" className="d-flex align-items-center gap-2">
                               <Users className={`${subIconSize} text-muted`} />
                               <span>{t('sidebar.settings_users', 'Users')}</span>
                             </Link>
                          </SidebarMenuButton>
                       </SidebarMenuItem>
                      {/* MySQL Menu */}
                      <SidebarMenuItem>
                        <SidebarMenuSub>
                            <SidebarMenuSubTrigger
                              size="sm"
                              className="ps-3 pe-2 py-1.5"
                              tooltip={t('sidebar.mysql')}
                            >
                              <div className="d-flex align-items-center gap-2 cursor-pointer w-100">
                                <Database className={`${subIconSize} text-muted`} />
                                <span className="text-truncate">{t('sidebar.mysql')}</span>
                                <ChevronDown className="ms-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                              </div>
                            </SidebarMenuSubTrigger>
                          <SidebarMenuSubContent>
                            <SidebarMenuItem>
                              <SidebarMenuButton asChild isActive={isActive('/mysql/databases')} size="sm" tooltip={t('sidebar.mysql_databases')}>
                                <Link href="/mysql/databases" className="d-flex align-items-center gap-2">
                                  <Database className={`${subIconSize} text-muted`} />
                                  <span>{t('sidebar.mysql_databases')}</span>
                                </Link>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                              <SidebarMenuButton asChild isActive={isActive('/mysql/tables')} size="sm" tooltip={t('sidebar.mysql_tables')}>
                                <Link href="#" className="d-flex align-items-center gap-2">
                                  <ListChecks className={`${subIconSize} text-muted`} /> 
                                  <span>{t('sidebar.mysql_tables')}</span>
                                </Link>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                              <SidebarMenuButton asChild isActive={isActive('/mysql/cli')} size="sm" tooltip={t('sidebar.mysql_cli')}>
                                <Link href="/mysql/cli" className="d-flex align-items-center gap-2">
                                  <Code className={`${subIconSize} text-muted`} /> 
                                  <span>{t('sidebar.mysql_cli')}</span>
                                </Link>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          </SidebarMenuSubContent>
                        </SidebarMenuSub>
                      </SidebarMenuItem>
                    </SidebarMenuSubContent>
                  </SidebarMenuSub>
                </SidebarMenuItem>

                {/* Separator */}
                <SidebarSeparator className="my-2" />

                {/* PilotView Menu Item */}
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive('/pilotview')} tooltip={t('sidebar.pilotview', 'PilotView')}>
                    <Link href="#" className="d-flex align-items-center gap-2">
                      <TbDeviceImacStar className={iconSize} />
                      <span>{t('sidebar.pilotview', 'PilotView')}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                {/* TransitOS Menu Item */}
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive('/transitos')} tooltip={t('sidebar.transitos', 'TransitOS')}>
                    <Link href="#" className="d-flex align-items-center gap-2">
                      <SiReactrouter className={iconSize} />
                      <span>{t('sidebar.transitos', 'TransitOS')}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                {/* Zones (DNS) Menu */}
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive('/zones')} tooltip={t('sidebar.zones', 'Zones')}>
                    <Link href="#" className="d-flex align-items-center gap-2">
                      <SiNextdns className={iconSize} />
                      <span>{t('sidebar.zones', 'Zones')}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

              </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
            </SidebarFooter>
          </Sidebar>

          <SidebarInset noMargin={isMapPage}>
            <div className="position-fixed top-0 start-0 w-100 z-index-toast h-1"> {/* Bootstrap classes */}
              {isLoading && <Progress value={progress} className="w-100 h-1 rounded-0 bg-transparent" indicatorClassName="bg-warning" />} {/* Use Bootstrap warning for accent */}
            </div>
            {!isMapPage && <AppHeader />}
            <div className={isMapPage ? 'p-0' : 'p-3 p-md-4 ps-md-3'}> {/* Bootstrap padding */}
                {children}
             </div>
             <Toaster />
         </SidebarInset>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`antialiased`}
        suppressHydrationWarning
      >
        <NextThemesProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryClientProvider client={queryClient}>
            <LocaleProvider>
                <AppLayout>{children}</AppLayout>
            </LocaleProvider>
          </QueryClientProvider>
        </NextThemesProvider>
      </body>
    </html>
  );
}
