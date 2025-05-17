"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";
import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { SiNextdns } from "react-icons/si";
import { TbDeviceImacStar } from "react-icons/tb";
import { SiReactrouter } from "react-icons/si";

import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  useSidebar,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AppHeader } from "@/components/app-header";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Progress } from "@/components/ui/progress";
import {
  LocaleProvider,
  useLocale,
  type Locale as AppLocale,
} from "@/contexts/LocaleContext";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { useIsMobile } from "@/hooks/use-mobile";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import SidebarNav from "@/components/sidebar-nav"; // Import the new component
import { sidebarNav } from "@/config/sidebarNav"; // Import the sidebar data

const ProlterLogo = () => {
  const { theme } = useTheme();
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Determine fill color based on theme, default for SSR
  const fillColor = !isMounted
    ? "hsl(var(--card-foreground))"
    : theme === "dark"
    ? "hsl(var(--accent))"
    : "hsl(var(--primary))";

  if (!isMounted) {
    // Return a div with fixed size for SSR to prevent layout shift
    return <div style={{ width: "131px", height: "32px" }} />;
  }

  return (
    <div
      style={{ width: "131px", height: "32px" }}
      className="flex items-center justify-center"
    >
      {/* IMPORTANT: Replace the SVG code below with the actual code from your prolter-logo.svg file */}
      {/* Ensure paths/shapes in your SVG use fill="currentColor" to inherit the theme color */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 131 32"
        xmlns="http://www.w3.org/2000/svg"
        fill={fillColor} // Use the dynamic fill color
      >
        {/* Placeholder SVG - REPLACE THIS with your actual SVG code */}
        <text
          x="50%"
          y="50%"
          fontFamily="Arial, sans-serif"
          fontSize="20"
          fontWeight="bold"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          PROLTER
        </text>
      </svg>
    </div>
  );
};

const queryClient = new QueryClient();

function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const { t } = useLocale();
  const { isMobile, isOpenMobile, setIsOpenMobile } = useSidebar();

  const toggleMobileSidebar = () => setIsOpenMobile(!isOpenMobile);

  React.useEffect(() => {
    if (!isMobile && isOpenMobile) {
      setIsOpenMobile(false);
    }
  }, [isMobile, isOpenMobile, setIsOpenMobile]);

  React.useEffect(() => {
    if (pathname) {
      setIsLoading(true);
      setProgress(20);

      const timer = setTimeout(() => {
        setProgress(90);
      }, 30);
      const finishTimer = setTimeout(() => {
        setProgress(100);
        const hideTimer = setTimeout(() => {
          setIsLoading(false);
          setProgress(0);
        }, 150);
        return () => clearTimeout(hideTimer);
      }, 150);

      return () => {
        clearTimeout(timer);
        clearTimeout(finishTimer);
      };
    }
  }, [pathname]);

  const isMapPage = pathname === "/maps/map";

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      {" "}
      {/* Outermost container, ensure full width */}
      <div className="flex flex-1 w-full overflow-hidden">
        {" "}
        {/* Container for Sidebar and the rest, ensure full width */}
        <Sidebar>
          <SidebarHeader>
            <Link
              href="/"
              className="flex items-center justify-center w-full h-full"
              style={{ textDecoration: "none" }}
            >
              <ProlterLogo />
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {/* Render sidebar navigation using the new component */}
              <SidebarNav items={sidebarNav} />
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>{/* Footer content if any */}</SidebarFooter>
        </Sidebar>
        {/* Main content area (Header + Page Content) */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {" "}
          {/* This div takes remaining horizontal space and stacks header/content vertically */}
          {!isMapPage && <AppHeader onToggleSidebar={toggleMobileSidebar} />}
          <SidebarInset noMargin={isMapPage}>
            {" "}
            {/* SidebarInset is now the <main> element */}
            <div className="fixed top-0 left-[var(--sidebar-width)] right-0 h-1 z-[9999]">
              {" "}
              {/* Increased z-index */}
              {isLoading && (
                <Progress
                  value={progress}
                  indicatorClassName="bg-accent"
                  className="w-full h-full rounded-none bg-transparent"
                />
              )}
            </div>
            <div
              className={
                isMapPage
                  ? "p-0 h-full"
                  : "p-2 h-[calc(100%-theme(space.12))] overflow-y-auto"
              }
            >
              {" "}
              {/* Content padding is here */}
              {children}
            </div>
            <Toaster />
          </SidebarInset>
        </div>
      </div>
    </div>
  );
}

// Helper component for client-side redirect if middleware fails for unauthenticated users on protected routes
function RedirectToLogin() {
  const router = useRouter();
  const { t } = useLocale(); // Assuming LocaleProvider is an ancestor from RootLayout
  React.useEffect(() => {
    router.replace("/admin/login");
  }, [router]);
  return (
    <div className="flex justify-center items-center h-screen bg-background">
      <p>{t("auth.redirecting", "Redirecting to login...")}</p>
    </div>
  );
}

// This new component will decide which layout to render
function LayoutRenderer({
  children: pageContent,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { t } = useLocale(); // LocaleProvider is an ancestor from RootLayout

  if (isAuthLoading) {
    // Render nothing during the initial auth loading phase to make it "silent"
    return null;
  }

  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    // For the login page, render its content directly.
    // It will inherit providers like LocaleProvider, QueryClientProvider, etc., from RootLayout.
    return <>{pageContent}</>;
  }

  if (!isAuthenticated) {
    // If not on the login page and not authenticated, redirect.
    // Middleware should primarily handle this, but this is a client-side fallback.
    return <RedirectToLogin />;
  }

  // If authenticated and not on the login page, render the full AppLayout.
  return (
    <SidebarProvider side="left" collapsible="none" className="w-full">
      <AppLayout>{pageContent}</AppLayout>
    </SidebarProvider>
  );
}

export default function RootLayout({
  children: pageContent, // Renamed for clarity
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <NextThemesProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <QueryClientProvider client={queryClient}>
              <LocaleProvider>
                <TooltipProvider delayDuration={0}>
                  <LayoutRenderer>{pageContent}</LayoutRenderer>
                </TooltipProvider>
              </LocaleProvider>
            </QueryClientProvider>
          </AuthProvider>
        </NextThemesProvider>
      </body>
    </html>
  );
}
