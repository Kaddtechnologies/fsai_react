import type { Metadata } from 'next';
import React, { Suspense } from 'react';
import { roboto, robotoMono } from '@/lib/fonts';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import AppClientLayout from '@/components/layout/app-client-layout';

export const metadata: Metadata = {
  title: 'FlowserveAI',
  description: 'Unified AI-powered workspace for documents, products, and chat.',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    viewportFit: 'cover',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {  
  return (
    <html lang="en" className="dark overflow-visible md:overflow-hidden" suppressHydrationWarning >
      <body className={`${roboto.variable} ${robotoMono.variable} font-sans antialiased`} suppressHydrationWarning >
        <Suspense fallback={
          <div className="flex h-screen w-screen items-center justify-center bg-background text-foreground">
            {/* Simple text loader to avoid complex imports in root layout for this fix */}
            Loading... 
          </div>
        }>
          <AppClientLayout>{children}</AppClientLayout>
        </Suspense>
        <Toaster />
      </body>
    </html>
  );
}