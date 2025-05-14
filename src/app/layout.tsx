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
  Menu as MenuIcon,
} from 'lucide-react';
import { SiNextdns } from "react-icons/si";
import { TbDeviceImacStar } from "react-icons/tb";
import { SiReactrouter } from "react-icons/si";


import './globals.css';
import { Toaster } from '@/components/ui/toaster';

import { AppHeader } from '@/components/app-header';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Progress } from '@/components/ui/progress';
import { LocaleProvider, useLocale } from '@/contexts/LocaleContext';
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes';
import { useIsMobile } from '@/hooks/use-mobile';


const queryClient = new QueryClient();

const BootstrapSidebar: React.FC<{ children: ReactNode, isMobile: boolean, isOpen: boolean, toggle: () => void, logoFillColor: string, t: Function, isActive: Function }> =
 ({ children, isMobile, isOpen, toggle, logoFillColor, t, isActive }) => {
  const iconSize = { width: '0.875rem', height: '0.875rem' };
  const subIconSize = { width: '0.75rem', height: '0.75rem' };

  return (
    <>
      {isMobile && isOpen && <div className="offcanvas-backdrop fade show" onClick={toggle}></div>}
      <nav
        id="nethubSidebar"
        className={`
          d-flex flex-column flex-shrink-0 p-3 bg-light text-dark
          ${isMobile ? `offcanvas offcanvas-start${isOpen ? ' show' : ''}` : 'sticky-top vh-100'}
        `}
        style={{ width: isMobile ? '280px' : '220px', transition: 'transform .3s ease-in-out' }}
        tabIndex={isMobile ? -1 : undefined}
        aria-labelledby={isMobile ? "nethubSidebarLabel" : undefined}
      >
        <div className="d-flex align-items-center justify-content-between mb-3">
           <Link
              href="/"
              className="d-flex align-items-center text-dark text-decoration-none"
              style={{ width: '131px', height: '32px' }} // Fixed dimensions for the logo
              onClick={() => isMobile && toggle()}
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
          {isMobile && <button type="button" className="btn-close" onClick={toggle} aria-label="Close"></button>}
        </div>
        <hr className="my-2" />
        <ul className="nav nav-pills flex-column mb-auto overflow-auto">
          {children}
        </ul>
        <hr className="my-2" />
      </nav>
    </>
  );
};


function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { t, locale } = useLocale();
  const { theme } = useTheme();
  const [logoFillColor, setLogoFillColor] = useState<string>('hsl(var(--primary))');

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  const toggleMobileSidebar = () => setIsMobileSidebarOpen(!isMobileSidebarOpen);


  useEffect(() => {
    if (!isMobile && isMobileSidebarOpen) {
      setIsMobileSidebarOpen(false);
    }
  }, [isMobile, isMobileSidebarOpen]);


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
  const iconSize = { width: '0.875rem', height: '0.875rem' };
  const subIconSize = { width: '0.75rem', height: '0.75rem' };

  useEffect(() => {
    if (typeof window !== 'undefined' && theme) {
      const newFillColor = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
        ? 'hsl(var(--accent))'
        : 'hsl(222.2, 47.4%, 11.2%)';
      setLogoFillColor(newFillColor);
    }
  }, [theme]);

  const navLinkClass = (path: string) => `nav-link text-dark d-flex align-items-center gap-2 ${isActive(path) ? 'active' : ''}`;
  const subNavLinkClass = (path: string) => `nav-link text-dark d-flex align-items-center gap-2 ps-4 ${isActive(path) ? 'active' : ''}`;

  const mainContentMargin = isMobile ? '0' : '220px';
  const mainContentPadding = isMapPage ? 'p-0' : 'p-3 p-md-4';


  return (
    <TooltipProvider>
        <div className="d-flex">
          <BootstrapSidebar
            isMobile={isMobile}
            isOpen={isMobileSidebarOpen}
            toggle={toggleMobileSidebar}
            logoFillColor={logoFillColor}
            t={t}
            isActive={isActive}
          >
            {/* Dashboard */}
            <li className="nav-item">
              <Link href="/" className={navLinkClass('/')} onClick={() => isMobile && toggleMobileSidebar()}>
                <LayoutDashboard style={iconSize} />
                <span>{t('sidebar.dashboard')}</span>
              </Link>
            </li>

            {/* Subscribers */}
             <li className="nav-item">
                <Link href="/subscribers/list" className={navLinkClass('/subscribers/list')} onClick={() => isMobile && toggleMobileSidebar()}>
                    <Users style={iconSize} />
                    <span className="truncate">{t('sidebar.subscribers')}</span>
                </Link>
            </li>


            {/* Maps Accordion */}
            <li className="nav-item">
              <a className={`${navLinkClass('/maps')} collapsed`} href="#maps-collapse" data-bs-toggle="collapse" aria-expanded={isActive('/maps') ? "true" : "false"}>
                <MapPin style={iconSize} />
                <span className="truncate">{t('sidebar.maps')}</span>
                <ChevronDown className="ms-auto transition-transform" style={{ transform: isActive('/maps') ? 'rotate(180deg)' : 'rotate(0deg)' }} />
              </a>
              <div className={`collapse${isActive('/maps') ? ' show' : ''}`} id="maps-collapse">
                <ul className="nav nav-pills flex-column ps-3">
                  <li className="nav-item"><Link href="/maps/map" className={subNavLinkClass('/maps/map')} onClick={() => isMobile && toggleMobileSidebar()}><Globe style={subIconSize} className="text-muted" /><span>{t('sidebar.maps_map')}</span></Link></li>
                  <li className="nav-item"><Link href="/maps/projects" className={subNavLinkClass('/maps/projects')} onClick={() => isMobile && toggleMobileSidebar()}><FileCode style={subIconSize} className="text-muted" /><span>{t('sidebar.maps_projects')}</span></Link></li>
                  <li className="nav-item">
                    <a className={`${subNavLinkClass('/maps/elements')} collapsed`} href="#maps-elements-collapse" data-bs-toggle="collapse" aria-expanded={isActive('/maps/elements') ? "true" : "false"}>
                      <GitFork style={subIconSize} className="text-muted" />
                      <span className="truncate">{t('sidebar.maps_elements')}</span>
                      <ChevronDown className="ms-auto transition-transform" style={{ transform: isActive('/maps/elements') ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                    </a>
                    <div className={`collapse${isActive('/maps/elements') ? ' show' : ''}`} id="maps-elements-collapse">
                      <ul className="nav nav-pills flex-column ps-3">
                        <li><Link href="/maps/elements/polls" className={subNavLinkClass('/maps/elements/polls')} onClick={() => isMobile && toggleMobileSidebar()}><Power style={subIconSize} className="text-muted" /><span>{t('sidebar.maps_elements_polls')}</span></Link></li>
                        <li><Link href="/maps/elements/fdhs" className={subNavLinkClass('/maps/elements/fdhs')} onClick={() => isMobile && toggleMobileSidebar()}><Box style={subIconSize} className="text-muted" /><span>{t('sidebar.maps_elements_fdhs')}</span></Link></li>
                        <li><Link href="/maps/elements/foscs" className={subNavLinkClass('/maps/elements/foscs')} onClick={() => isMobile && toggleMobileSidebar()}><Warehouse style={subIconSize} className="text-muted" /><span>{t('sidebar.maps_elements_foscs')}</span></Link></li>
                        <li><Link href="/maps/elements/peds" className={subNavLinkClass('/maps/elements/peds')} onClick={() => isMobile && toggleMobileSidebar()}><Box style={subIconSize} className="text-muted" /><span>{t('sidebar.maps_elements_peds')}</span></Link></li>
                        <li><Link href="/maps/elements/accessories" className={subNavLinkClass('/maps/elements/accessories')} onClick={() => isMobile && toggleMobileSidebar()}><Puzzle style={subIconSize} className="text-muted" /><span>{t('sidebar.maps_elements_accessories')}</span></Link></li>
                        <li><Link href="/maps/elements/splitters" className={subNavLinkClass('/maps/elements/splitters')} onClick={() => isMobile && toggleMobileSidebar()}><Split style={subIconSize} className="text-muted" /><span>{t('sidebar.maps_elements_splitters')}</span></Link></li>
                        <li><Link href="/maps/elements/towers" className={subNavLinkClass('/maps/elements/towers')} onClick={() => isMobile && toggleMobileSidebar()}><TowerControl style={subIconSize} className="text-muted" /><span>{t('sidebar.maps_elements_towers')}</span></Link></li>
                        <li><Link href="/maps/elements/cables" className={subNavLinkClass('/maps/elements/cables')} onClick={() => isMobile && toggleMobileSidebar()}><Cable style={subIconSize} className="text-muted" /><span>{t('sidebar.maps_elements_cables')}</span></Link></li>
                      </ul>
                    </div>
                  </li>
                </ul>
              </div>
            </li>

            {/* FTTx Accordion */}
            <li className="nav-item">
              <a className={`${navLinkClass('/fttx')} collapsed`} href="#fttx-collapse" data-bs-toggle="collapse" aria-expanded={isActive('/fttx') ? "true" : "false"}>
                <GitBranch style={iconSize}/>
                <span className="truncate">{t('sidebar.fttx')}</span>
                <ChevronDown className="ms-auto transition-transform" style={{ transform: isActive('/fttx') ? 'rotate(180deg)' : 'rotate(0deg)' }} />
              </a>
              <div className={`collapse${isActive('/fttx') ? ' show' : ''}`} id="fttx-collapse">
                <ul className="nav nav-pills flex-column ps-3">
                    <li><Link href="/fttx/dashboard" className={subNavLinkClass('/fttx/dashboard')} onClick={() => isMobile && toggleMobileSidebar()}><LayoutDashboard style={subIconSize} className="text-muted" /><span>{t('sidebar.fttx_dashboard')}</span></Link></li>
                    <li><Link href="/fttx/olts" className={subNavLinkClass('/fttx/olts')} onClick={() => isMobile && toggleMobileSidebar()}><Network style={subIconSize} className="text-muted" /><span>{t('sidebar.fttx_olts')}</span></Link></li>
                    <li><Link href="/fttx/onx-templates" className={subNavLinkClass('/fttx/onx-templates')} onClick={() => isMobile && toggleMobileSidebar()}><FileTextIcon style={subIconSize} className="text-muted" /><span>{t('sidebar.fttx_onx_templates')}</span></Link></li>
                </ul>
              </div>
            </li>

            {/* Finances Accordion */}
            <li className="nav-item">
              <a className={`${navLinkClass('/finances')} collapsed`} href="#finances-collapse" data-bs-toggle="collapse" aria-expanded={isActive('/finances') ? "true" : "false"}>
                <DollarSign style={iconSize}/>
                <span className="truncate">{t('sidebar.finances')}</span>
                <ChevronDown className="ms-auto transition-transform" style={{ transform: isActive('/finances') ? 'rotate(180deg)' : 'rotate(0deg)' }} />
              </a>
              <div className={`collapse${isActive('/finances') ? ' show' : ''}`} id="finances-collapse">
                 <ul className="nav nav-pills flex-column ps-3">
                    <li><Link href="/finances/cash-book" className={subNavLinkClass('/finances/cash-book')} onClick={() => isMobile && toggleMobileSidebar()}><BookOpen style={subIconSize} className="text-muted" /><span>{t('sidebar.finances_cash_book')}</span></Link></li>
                    <li><Link href="/finances/entry-categories" className={subNavLinkClass('/finances/entry-categories')} onClick={() => isMobile && toggleMobileSidebar()}><ListFilter style={subIconSize} className="text-muted" /><span>{t('sidebar.finances_entry_categories')}</span></Link></li>
                    <li><Link href="/settings/finances/configurations" className={subNavLinkClass('/settings/finances/configurations')} onClick={() => isMobile && toggleMobileSidebar()}><SlidersHorizontal style={subIconSize} className="text-muted" /><span>{t('sidebar.finances_config')}</span></Link></li>
                 </ul>
              </div>
            </li>

             {/* Inventory Accordion */}
            <li className="nav-item">
              <a className={`${navLinkClass('/inventory')} collapsed`} href="#inventory-collapse" data-bs-toggle="collapse" aria-expanded={isActive('/inventory') ? "true" : "false"}>
                <Archive style={iconSize}/>
                <span className="truncate">{t('sidebar.inventory')}</span>
                <ChevronDown className="ms-auto transition-transform" style={{ transform: isActive('/inventory') ? 'rotate(180deg)' : 'rotate(0deg)' }} />
              </a>
              <div className={`collapse${isActive('/inventory') ? ' show' : ''}`} id="inventory-collapse">
                 <ul className="nav nav-pills flex-column ps-3">
                    <li><Link href="/inventory/categories" className={subNavLinkClass('/inventory/categories')} onClick={() => isMobile && toggleMobileSidebar()}><ListFilter style={subIconSize} className="text-muted" /><span>{t('sidebar.inventory_categories')}</span></Link></li>
                    <li><Link href="/inventory/manufacturers" className={subNavLinkClass('/inventory/manufacturers')} onClick={() => isMobile && toggleMobileSidebar()}><Factory style={subIconSize} className="text-muted" /><span>{t('sidebar.inventory_manufacturers')}</span></Link></li>
                    <li><Link href="/inventory/suppliers" className={subNavLinkClass('/inventory/suppliers')} onClick={() => isMobile && toggleMobileSidebar()}><Truck style={subIconSize} className="text-muted" /><span>{t('sidebar.inventory_suppliers')}</span></Link></li>
                    <li><Link href="/inventory/products" className={subNavLinkClass('/inventory/products')} onClick={() => isMobile && toggleMobileSidebar()}><PackageIcon style={subIconSize} className="text-muted" /><span>{t('sidebar.inventory_products')}</span></Link></li>
                    <li><Link href="/inventory/warehouses" className={subNavLinkClass('/inventory/warehouses')} onClick={() => isMobile && toggleMobileSidebar()}><Warehouse style={subIconSize} className="text-muted" /><span>{t('sidebar.inventory_warehouses')}</span></Link></li>
                    <li><Link href="/inventory/vehicles" className={subNavLinkClass('/inventory/vehicles')} onClick={() => isMobile && toggleMobileSidebar()}><Bus style={subIconSize} className="text-muted" /><span>{t('sidebar.inventory_vehicles')}</span></Link></li>
                 </ul>
              </div>
            </li>

            {/* Service Calls Accordion */}
            <li className="nav-item">
                <a className={`${navLinkClass('/service-calls')} collapsed`} href="#service-calls-collapse" data-bs-toggle="collapse" aria-expanded={isActive('/service-calls') ? "true" : "false"}>
                    <Wrench style={iconSize}/>
                    <span className="truncate">{t('sidebar.service_calls')}</span>
                    <ChevronDown className="ms-auto transition-transform" style={{ transform: isActive('/service-calls') ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                </a>
                <div className={`collapse${isActive('/service-calls') ? ' show' : ''}`} id="service-calls-collapse">
                    <ul className="nav nav-pills flex-column ps-3">
                        <li><Link href="/service-calls/dashboard" className={subNavLinkClass('/service-calls/dashboard')} onClick={() => isMobile && toggleMobileSidebar()}><ServiceDashboardIcon style={subIconSize} className="text-muted" /><span>{t('sidebar.service_calls_dashboard')}</span></Link></li>
                        <li><Link href="/service-calls/service-types" className={subNavLinkClass('/service-calls/service-types')} onClick={() => isMobile && toggleMobileSidebar()}><ServiceTypesIcon style={subIconSize} className="text-muted" /><span>{t('sidebar.service_calls_service_types')}</span></Link></li>
                    </ul>
                </div>
            </li>

            {/* Reports */}
            <li className="nav-item">
              <Link href="/reports" className={navLinkClass('/reports')} onClick={() => isMobile && toggleMobileSidebar()}>
                <BarChart3 style={iconSize}/>
                <span>{t('sidebar.reports')}</span>
              </Link>
            </li>

            {/* HR Accordion */}
            <li className="nav-item">
              <a className={`${navLinkClass('/hr')} collapsed`} href="#hr-collapse" data-bs-toggle="collapse" aria-expanded={isActive('/hr') ? "true" : "false"}>
                <BriefcaseBusiness style={iconSize}/>
                <span className="truncate">{t('sidebar.hr')}</span>
                <ChevronDown className="ms-auto transition-transform" style={{ transform: isActive('/hr') ? 'rotate(180deg)' : 'rotate(0deg)' }} />
              </a>
              <div className={`collapse${isActive('/hr') ? ' show' : ''}`} id="hr-collapse">
                 <ul className="nav nav-pills flex-column ps-3">
                    <li><Link href="/hr/employees" className={subNavLinkClass('/hr/employees')} onClick={() => isMobile && toggleMobileSidebar()}><Users style={subIconSize} className="text-muted" /><span>{t('sidebar.hr_employees')}</span></Link></li>
                 </ul>
              </div>
            </li>


            {/* Settings Accordion */}
            <li className="nav-item">
              <a className={`${navLinkClass('/settings')} collapsed`} href="#settings-collapse" data-bs-toggle="collapse" aria-expanded={isActive('/settings') ? "true" : "false"}>
                <Settings style={iconSize} />
                <span className="truncate">{t('sidebar.settings')}</span>
                <ChevronDown className="ms-auto transition-transform" style={{ transform: isActive('/settings') ? 'rotate(180deg)' : 'rotate(0deg)' }} />
              </a>
              <div className={`collapse${isActive('/settings') ? ' show' : ''}`} id="settings-collapse">
                <ul className="nav nav-pills flex-column ps-3">
                    <li><Link href="/settings/global" className={subNavLinkClass('/settings/global')} onClick={() => isMobile && toggleMobileSidebar()}><Cog style={subIconSize} className="text-muted" /><span>{t('sidebar.settings_global')}</span></Link></li>
                     {/* Business Sub-Accordion */}
                    <li className="nav-item">
                        <a className={`${subNavLinkClass('/settings/business')} collapsed`} href="#settings-business-collapse" data-bs-toggle="collapse" aria-expanded={isActive('/settings/business') ? "true" : "false"}>
                            <Briefcase style={subIconSize} className="text-muted" />
                            <span className="truncate">{t('sidebar.settings_business')}</span>
                            <ChevronDown className="ms-auto transition-transform" style={{ transform: isActive('/settings/business') ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                        </a>
                        <div className={`collapse${isActive('/settings/business') ? ' show' : ''}`} id="settings-business-collapse">
                             <ul className="nav nav-pills flex-column ps-3">
                                <li><Link href="/settings/business/pops" className={subNavLinkClass('/settings/business/pops')} onClick={() => isMobile && toggleMobileSidebar()}><Building style={subIconSize} className="text-muted" /><span>{t('sidebar.settings_business_pops')}</span></Link></li>
                             </ul>
                        </div>
                    </li>
                    {/* Plans Sub-Accordion */}
                    <li className="nav-item">
                        <a className={`${subNavLinkClass('/settings/plans')} collapsed`} href="#settings-plans-collapse" data-bs-toggle="collapse" aria-expanded={isActive('/settings/plans') ? "true" : "false"}>
                            <ListChecks style={subIconSize} className="text-muted" />
                            <span className="truncate">{t('sidebar.settings_plans')}</span>
                            <ChevronDown className="ms-auto transition-transform" style={{ transform: isActive('/settings/plans') ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                        </a>
                        <div className={`collapse${isActive('/settings/plans') ? ' show' : ''}`} id="settings-plans-collapse">
                            <ul className="nav nav-pills flex-column ps-3">
                                <li><Link href="/settings/plans/internet" className={subNavLinkClass('/settings/plans/internet')} onClick={() => isMobile && toggleMobileSidebar()}><Wifi style={subIconSize} className="text-muted" /><span>{t('sidebar.settings_plans_internet')}</span></Link></li>
                                <li><Link href="/settings/plans/tv" className={subNavLinkClass('/settings/plans/tv')} onClick={() => isMobile && toggleMobileSidebar()}><Tv style={subIconSize} className="text-muted" /><span>{t('sidebar.settings_plans_tv')}</span></Link></li>
                                <li><Link href="/settings/plans/mobile" className={subNavLinkClass('/settings/plans/mobile')} onClick={() => isMobile && toggleMobileSidebar()}><Smartphone style={subIconSize} className="text-muted" /><span>{t('sidebar.settings_plans_mobile')}</span></Link></li>
                                <li><Link href="/settings/plans/landline" className={subNavLinkClass('/settings/plans/landline')} onClick={() => isMobile && toggleMobileSidebar()}><Phone style={subIconSize} className="text-muted" /><span>{t('sidebar.settings_plans_landline')}</span></Link></li>
                                <li><Link href="/settings/plans/combos" className={subNavLinkClass('/settings/plans/combos')} onClick={() => isMobile && toggleMobileSidebar()}><Combine style={subIconSize} className="text-muted" /><span>{t('sidebar.settings_plans_combos')}</span></Link></li>
                            </ul>
                        </div>
                    </li>
                     {/* Network Sub-Accordion */}
                    <li className="nav-item">
                        <a className={`${subNavLinkClass('/settings/network')} collapsed`} href="#settings-network-collapse" data-bs-toggle="collapse" aria-expanded={isActive('/settings/network') ? "true" : "false"}>
                            <Network style={subIconSize} className="text-muted" />
                            <span className="truncate">{t('sidebar.network')}</span>
                            <ChevronDown className="ms-auto transition-transform" style={{ transform: isActive('/settings/network') ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                        </a>
                        <div className={`collapse${isActive('/settings/network') ? ' show' : ''}`} id="settings-network-collapse">
                            <ul className="nav nav-pills flex-column ps-3">
                                <li><Link href="/settings/network/ip" className={subNavLinkClass('/settings/network/ip')} onClick={() => isMobile && toggleMobileSidebar()}><Code style={subIconSize} className="text-muted" /><span>{t('sidebar.network_ip')}</span></Link></li>
                                <li><Link href="/settings/network/devices" className={subNavLinkClass('/settings/network/devices')} onClick={() => isMobile && toggleMobileSidebar()}><RouterIcon style={subIconSize} className="text-muted" /><span>{t('sidebar.network_devices')}</span></Link></li>
                                <li><Link href="/settings/network/cgnat" className={subNavLinkClass('/settings/network/cgnat')} onClick={() => isMobile && toggleMobileSidebar()}><Share2 style={subIconSize} className="text-muted" /><span>{t('sidebar.network_cgnat')}</span></Link></li>
                                <li><Link href="/settings/network/radius" className={subNavLinkClass('/settings/network/radius')} onClick={() => isMobile && toggleMobileSidebar()}><ServerIcon style={subIconSize} className="text-muted" /><span>{t('sidebar.network_radius')}</span></Link></li>
                                <li><Link href="/settings/network/vlan" className={subNavLinkClass('/settings/network/vlan')} onClick={() => isMobile && toggleMobileSidebar()}><Split style={subIconSize} className="text-muted" /><span>{t('sidebar.network_vlan')}</span></Link></li>
                            </ul>
                        </div>
                    </li>
                    <li><Link href="/settings/finances/configurations" className={subNavLinkClass('/settings/finances/configurations')} onClick={() => isMobile && toggleMobileSidebar()}><SlidersHorizontal style={subIconSize} className="text-muted" /><span>{t('sidebar.finances_config')}</span></Link></li>
                    <li><Link href="/settings/security" className={subNavLinkClass('/settings/security')} onClick={() => isMobile && toggleMobileSidebar()}><ShieldCheck style={subIconSize} className="text-muted" /><span>{t('sidebar.security')}</span></Link></li>
                    <li><Link href="/settings/system-monitor" className={subNavLinkClass('/settings/system-monitor')} onClick={() => isMobile && toggleMobileSidebar()}><RouterIcon style={subIconSize} className="text-muted" /><span>{t('sidebar.settings_system_monitor')}</span></Link></li>
                    {/* Integrations Sub-Accordion */}
                    <li className="nav-item">
                        <a className={`${subNavLinkClass('/settings/integrations')} collapsed`} href="#settings-integrations-collapse" data-bs-toggle="collapse" aria-expanded={isActive('/settings/integrations') ? "true" : "false"}>
                            <Plug style={subIconSize} className="text-muted" />
                            <span className="truncate">{t('sidebar.settings_integrations')}</span>
                            <ChevronDown className="ms-auto transition-transform" style={{ transform: isActive('/settings/integrations') ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                        </a>
                        <div className={`collapse${isActive('/settings/integrations') ? ' show' : ''}`} id="settings-integrations-collapse">
                             <ul className="nav nav-pills flex-column ps-3">
                                <li><Link href="/settings/integrations/whatsapp" className={subNavLinkClass('/settings/integrations/whatsapp')} onClick={() => isMobile && toggleMobileSidebar()}><MessageSquare style={subIconSize} className="text-muted" /><span>{t('sidebar.settings_integrations_whatsapp')}</span></Link></li>
                                <li><Link href="/settings/integrations/telegram" className={subNavLinkClass('/settings/integrations/telegram')} onClick={() => isMobile && toggleMobileSidebar()}><MessageSquare style={subIconSize} className="text-muted" /><span>{t('sidebar.settings_integrations_telegram')}</span></Link></li>
                                <li><Link href="/settings/integrations/meta" className={subNavLinkClass('/settings/integrations/meta')} onClick={() => isMobile && toggleMobileSidebar()}><MessageSquare style={subIconSize} className="text-muted" /><span>{t('sidebar.settings_integrations_meta')}</span></Link></li>
                                <li><Link href="/settings/integrations/sms" className={subNavLinkClass('/settings/integrations/sms')} onClick={() => isMobile && toggleMobileSidebar()}><Text style={subIconSize} className="text-muted" /><span>{t('sidebar.settings_integrations_sms')}</span></Link></li>
                             </ul>
                        </div>
                    </li>
                    <li><Link href="/settings/users" className={subNavLinkClass('/settings/users')} onClick={() => isMobile && toggleMobileSidebar()}><Users style={subIconSize} className="text-muted" /><span>{t('sidebar.settings_users')}</span></Link></li>
                     {/* MySQL Sub-Accordion */}
                    <li className="nav-item">
                        <a className={`${subNavLinkClass('/settings/mysql')} collapsed`} href="#settings-mysql-collapse" data-bs-toggle="collapse" aria-expanded={isActive('/settings/mysql') ? "true" : "false"}>
                            <Database style={subIconSize} className="text-muted" />
                            <span className="truncate">{t('sidebar.mysql')}</span>
                            <ChevronDown className="ms-auto transition-transform" style={{ transform: isActive('/settings/mysql') ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                        </a>
                        <div className={`collapse${isActive('/settings/mysql') ? ' show' : ''}`} id="settings-mysql-collapse">
                            <ul className="nav nav-pills flex-column ps-3">
                                <li><Link href="/mysql/databases" className={subNavLinkClass('/mysql/databases')} onClick={() => isMobile && toggleMobileSidebar()}><Database style={subIconSize} className="text-muted" /><span>{t('sidebar.mysql_databases')}</span></Link></li>
                                <li><Link href="/mysql/cli" className={subNavLinkClass('/mysql/cli')} onClick={() => isMobile && toggleMobileSidebar()}><Code style={subIconSize} className="text-muted" /><span>{t('sidebar.mysql_cli')}</span></Link></li>
                            </ul>
                        </div>
                    </li>
                </ul>
              </div>
            </li>
             {/* Separator */}
             <li className="nav-item"><hr className="my-2" /></li>

            {/* PilotView */}
            <li className="nav-item">
              <Link href="/pilotview" className={navLinkClass('/pilotview')} onClick={() => isMobile && toggleMobileSidebar()}>
                <TbDeviceImacStar style={iconSize} />
                <span>{t('sidebar.pilotview')}</span>
              </Link>
            </li>

            {/* TransitOS */}
            <li className="nav-item">
              <Link href="/transitos" className={navLinkClass('/transitos')} onClick={() => isMobile && toggleMobileSidebar()}>
                <SiReactrouter style={iconSize} />
                <span>{t('sidebar.transitos')}</span>
              </Link>
            </li>

            {/* Zones (DNS) */}
            <li className="nav-item">
              <Link href="/zones" className={navLinkClass('/zones')} onClick={() => isMobile && toggleMobileSidebar()}>
                <SiNextdns style={iconSize} />
                <span>{t('sidebar.zones')}</span>
              </Link>
            </li>
          </BootstrapSidebar>

           <div className={`flex-grow-1 ${mainContentPadding}`} style={{ marginLeft: mainContentMargin }}> {/* Use template literal for class */}
            <div className="position-fixed top-0 start-0 w-100 z-index-toast" style={{ height: '0.25rem' }}>
              {isLoading && <Progress value={progress} className="w-100 h-100 rounded-0 bg-transparent progress" style={{ height: '0.25rem' }}><div className="progress-bar bg-warning" role="progressbar" style={{ width: `${progress}%` }} aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}></div></Progress>}
            </div>
            {!isMapPage && <AppHeader onToggleSidebar={toggleMobileSidebar} />}
            <div className={isMapPage ? 'p-0' : 'mt-3'}>
                {children}
             </div>
             <Toaster />
          </div>
        </div>
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
      <head>
         <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
      </head>
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
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" async></script>
      </body>
    </html>
  );
}
