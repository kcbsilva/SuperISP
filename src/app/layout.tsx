// src/app/layout.tsx
import * as React from 'react';
import { Inter as FontSans, Roboto_Mono as FontMono } from 'next/font/google';
import './globals.css';
import { AppProviders } from '@/components/app-providers';
import LayoutRenderer from './layout-renderer'; // Use LayoutRenderer
import { Toaster } from '@/components/ui/toaster';
import type { Metadata } from 'next';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

const fontMono = FontMono({
  subsets: ['latin'],
  variable: '--font-mono',
});

// It's good practice to define a base URL for metadata, especially for production.
// You can use an environment variable for this.
const siteBaseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteBaseUrl), // Recommended for resolving relative paths
  title: 'Prolter - Gerenciador mais completo di Mercado.',
  description: 'Gerenciador mais completo di Mercado.',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

export default function RootLayout({
  children: pageContent, // pageContent is the specific page component being rendered
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`antialiased font-sans ${fontSans.variable} ${fontMono.variable} bg-background text-foreground`}
        suppressHydrationWarning
      >
        <AppProviders>
          {/* LayoutRenderer will handle specific layouts like AdminLayout, ClientLayout, etc. */}
          <LayoutRenderer>{pageContent}</LayoutRenderer>
        </AppProviders>
        <Toaster />
      </body>
    </html>
  );
}
