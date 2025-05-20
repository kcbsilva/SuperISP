// src/app/layout.tsx
// THIS FILE MUST BE A SERVER COMPONENT (no 'use client' at the top)

import * as React from 'react';
import { Inter as FontSans, Roboto_Mono as FontMono } from 'next/font/google';
import './globals.css'; // Keep global styles
// Toaster is now rendered within AppProviders
import LayoutRenderer from './layout-renderer';
import { AppProviders } from '@/components/app-providers';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

const fontMono = FontMono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata = {
  title: 'NetHub Manager',
  description: 'ISP Management Software',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

export default function RootLayout({
  children: pageContent,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`antialiased font-sans ${fontSans.variable} ${fontMono.variable}`}
        suppressHydrationWarning
      >
        <AppProviders>
          <LayoutRenderer>{pageContent}</LayoutRenderer>
        </AppProviders>
      </body>
    </html>
  );
}
