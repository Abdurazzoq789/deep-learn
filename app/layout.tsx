import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '../providers';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#1890ff',
};

export const metadata: Metadata = {
  title: 'AI Projects Showcase',
  description: 'Showcase of cutting-edge AI projects and solutions',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'AI Projects Showcase',
    description: 'Showcase of cutting-edge AI projects and solutions',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Projects Showcase',
    description: 'Showcase of cutting-edge AI projects and solutions',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
