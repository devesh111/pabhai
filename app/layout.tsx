/**
 * Root Layout
 * 
 * Provides the base HTML structure and global styling for the application.
 * Includes:
 * - Metadata for SEO
 * - Global styles and fonts
 * - Theme provider for dark mode support
 * - Responsive design setup
 */

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Family Tree - Interactive Genealogy Visualization',
    template: '%s | Family Tree',
  },
  description:
    'Explore your family history with an interactive family tree application. Visualize generations, relationships, and family branches with beautiful, generation-based styling.',
  keywords: [
    'family tree',
    'genealogy',
    'family history',
    'ancestry',
    'family relationships',
  ],
  authors: [{ name: 'Family Tree App' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://familytree.example.com',
    siteName: 'Family Tree',
    title: 'Family Tree - Interactive Genealogy Visualization',
    description:
      'Explore your family history with an interactive family tree application.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Family Tree Application',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Family Tree - Interactive Genealogy Visualization',
    description: 'Explore your family history with an interactive family tree.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
