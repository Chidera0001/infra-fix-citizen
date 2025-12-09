import type { Metadata, Viewport } from 'next';
import './globals.css';
import Providers from './providers';

export const metadata: Metadata = {
  title: 'Citizn - Report an issue, and be part of the solution',
  description:
    'Empowering citizens to build better communities through infrastructure issue reporting and management and empowering authorities with actionable insights and data to make informed decisions.',
  authors: [{ name: 'Citizn' }],
  openGraph: {
    title: 'Citizn - Report an issue, and be part of the solution',
    description:
      'Empowering citizens to build better communities through infrastructure issue reporting and management and empowering authorities with actionable insights and data to make informed decisions.',
    type: 'website',
    images: ['/Assets/logo/Citizn-full-logo.png'],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@citizn_ng',
    images: ['/Assets/logo/Citizn-full-logo.png'],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Citizn',
  },
  manifest: '/manifest.webmanifest',
  icons: {
    icon: '/Assets/logo/Trademark.png',
    apple: '/Assets/logo/Trademark.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#10b981',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <link
          rel='stylesheet'
          href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
          integrity='sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY='
          crossOrigin=''
        />
      </head>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
