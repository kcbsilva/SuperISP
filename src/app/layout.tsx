import * as React from 'react';
import { Inter as FontSans, Roboto_Mono as FontMono } from 'next/font/google';
import './globals.css';
import { AppProviders } from '@/components/app-providers';
import { Toaster } from '@/components/ui/toaster';
import Sidebar, { SidebarProvider } from '@/components/sidebar-nav'; // Default export

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

const fontMono = FontMono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata = {
  title: 'SuperISP',
  description: 'ISP Management Software',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`antialiased font-sans ${fontSans.variable} ${fontMono.variable} bg-background text-foreground`}
      >
        <AppProviders>
          <SidebarProvider>
            <div className="flex min-h-screen w-full">
              <Sidebar />
              <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto" role="main">
                {children}
              </main>
            </div>
          </SidebarProvider>
        </AppProviders>
        <Toaster />
      </body>
    </html>
  );
}