
import type { Metadata } from 'next';
import { roboto, robotoMono } from '@/lib/fonts';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import AppClientLayout from '@/components/layout/app-client-layout';

export const metadata: Metadata = {
  title: 'FlowserveAI',
  description: 'Unified AI-powered workspace for documents, products, and chat.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${roboto.variable} ${robotoMono.variable} font-sans antialiased`}>
        <AppClientLayout>{children}</AppClientLayout>
        <Toaster />
      </body>
    </html>
  );
}

    