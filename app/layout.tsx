import type { Metadata, Viewport } from 'next';
import { Poppins, Open_Sans } from 'next/font/google';
import './globals.css';

const poppins = Poppins({
  subsets:  ['latin'],
  weight:   ['500', '600', '700', '800'],
  variable: '--next-font-poppins',
  display:  'swap',
});

const openSans = Open_Sans({
  subsets:  ['latin'],
  weight:   ['400', '500', '600'],
  variable: '--next-font-open-sans',
  display:  'swap',
});

// ─── Metadata ─────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: {
    default:  'Shopa — Handmade & Vintage Marketplace',
    template: '%s | Shopa',
  },
  description:
    'Discover unique handmade and vintage items from independent sellers. ' +
    'Personalised gifts, home décor, jewellery, fashion, and more.',
  keywords:  ['handmade', 'vintage', 'marketplace', 'gifts', 'jewellery', 'etsy'],
  authors:   [{ name: 'Shopa Team' }],
  robots:    { index: true, follow: true },
  openGraph: {
    type:        'website',
    locale:      'en_GB',
    siteName:    'Shopa',
    title:       'Shopa — Handmade & Vintage Marketplace',
    description: 'Discover unique handmade and vintage items from independent sellers.',
  },
};

export const viewport: Viewport = {
  width:        'device-width',
  initialScale: 1,
  themeColor:   '#7C3AED',
};

// ─── Layout component ─────────────────────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${openSans.variable}`}
    >
      <head>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[--bg] text-[--text] antialiased">

        {/* ── Temporary minimal shell (remove once providers are ready) ── */}
        <div id="app-root">


          <main id="main-content">
            {children}
          </main>
        </div>

        {/*
         * Skip-to-content link for keyboard / screen-reader accessibility.
         * Hidden visually until focused.
         */}
        <a href="#main-content" className="skip-to-content">
  Skip to main content
</a>
      </body>
    </html>
  );
}