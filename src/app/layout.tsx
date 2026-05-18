import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { CommandMenu } from '@/components/ui/CommandMenu';
import { Analytics } from '@/components/layout/Analytics';

// ── SEO Metadata ──────────────────────────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://arshkhan.dev'),
  title: {
    default: 'Arsh Khan — Full Stack Developer',
    template: '%s | Arsh Khan',
  },
  description:
    'Full Stack Developer specializing in MERN stack, React, Next.js, and modern web applications. Building performant, production-ready products with clean architecture.',
  keywords: [
    'Arsh Khan',
    'Full Stack Developer',
    'React Developer',
    'Next.js',
    'MERN Stack',
    'JavaScript',
    'TypeScript',
    'Node.js',
    'Portfolio',
  ],
  authors: [{ name: 'Arsh Khan', url: 'https://github.com/Arshkhandev' }],
  creator: 'Arsh Khan',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://arshkhan.dev',
    title: 'Arsh Khan — Full Stack Developer',
    description:
      'Full Stack Developer specializing in MERN stack, React, Next.js, and modern web applications.',
    siteName: 'Arsh Khan Portfolio',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Arsh Khan — Full Stack Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Arsh Khan — Full Stack Developer',
    description:
      'Full Stack Developer specializing in MERN stack, React, Next.js, and modern web applications.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
  width: 'device-width',
  initialScale: 1,
};

// ── Layout ────────────────────────────────────────────────────────
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
          <CommandMenu />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
