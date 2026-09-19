import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';

export const metadata: Metadata = {
  title: 'Meet Eric • AI Head of Growth (Production Architecture Cockpit)',
  description: 'Production-grade enterprise full-stack cockpit for Meet Eric. Supabase multi-tenant RLS, 8-stage safe AI agent execution loop, Stripe/HubSpot webhooks, and zero customer data leaks.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        {/* Preload primary Söhne & Söhne Mono font cuts for zero layout shift (CLS 0.00) */}
        <link rel="preload" href="/sohne-font-family/TestSohne-Buch-BF663d89cd32e6a.otf" as="font" type="font/otf" crossOrigin="anonymous" />
        <link rel="preload" href="/sohne-font-family/TestSohne-Halbfett-BF663d89cd2d67b.otf" as="font" type="font/otf" crossOrigin="anonymous" />
        <link rel="preload" href="/sohne-font-family/TestSohne-Dreiviertelfett-BF663d89ccc5f66.otf" as="font" type="font/otf" crossOrigin="anonymous" />
        {/* Preload SF Pro Display for clean modern Apple & Stripe SaaS hierarchy */}
        <link rel="preload" href="/sf-pro-display/SFPRODISPLAYREGULAR.OTF" as="font" type="font/otf" crossOrigin="anonymous" />
        <link rel="preload" href="/sf-pro-display/SFPRODISPLAYMEDIUM.OTF" as="font" type="font/otf" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-[var(--color-canvas)] text-[var(--color-text-primary)] antialiased selection:bg-indigo-500/20 selection:text-indigo-700 dark:selection:text-indigo-300">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {children}
        </ThemeProvider>
        {/* Centralized Demo Traffic Tracking Pixel */}
        <img
          src="https://demo-traffic.vercel.app/api/px?p=meet-eric-core"
          alt=""
          width={1}
          height={1}
          style={{ position: 'absolute', width: 1, height: 1, opacity: 0, pointerEvents: 'none' }}
        />
      </body>
    </html>
  );
}
