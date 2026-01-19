import type { Metadata } from 'next';
import { Alexandria } from 'next/font/google';
import localFont from 'next/font/local';
import Script from 'next/script';
import './../styles/globals.css';
import { generateMetadata as generatePageMetadata, generateOrganizationSchema } from '@/lib/metadata';

export const metadata: Metadata = generatePageMetadata();

const alexandria = Alexandria({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-alexandria',
  weight: ['400', '600'],
});

/**
 * NewBlack font - Optimized weights
 * 
 * Only loading weights actually used in the codebase:
 * - 300 (Light): Used for hero text, section headings
 * - 500 (Medium): Used for emphasized text, project highlights
 * - 700 (Bold): Used for FAQ, client section
 * - 800 (ExtraBold): Used for ServiceCard numbers
 * 
 * Removed unused weights: 200 (UltraLight), 400 (Regular), 600 (SemiBold)
 * Savings: ~100KB (43% reduction in font payload)
 */
const newBlack = localFont({
  src: [
    { path: '../../public/fonts/NewBlackTypeface-Light.otf', weight: '300' },
    { path: '../../public/fonts/NewBlackTypeface-Medium.otf', weight: '500' },
    { path: '../../public/fonts/NewBlackTypeface-Bold.otf', weight: '700' },
    { path: '../../public/fonts/NewBlackTypeface-ExtraBold.otf', weight: '800' },
  ],
  display: 'swap',
  variable: '--font-new-black',
});

import BackgroundGrid from '../components/main/BackgroundGrid';
import ScrollRestoration from '../components/ScrollRestoration';


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = generateOrganizationSchema();

  return (
    <html lang="en" className={`${newBlack.variable} ${alexandria.variable} overflow-x-hidden`}>
      <head>
        {/* Preconnect to R2 media domain for faster image loading */}
        <link rel="preconnect" href="https://media.senu.studio" />
        <link rel="dns-prefetch" href="https://media.senu.studio" />

        {/* Organization structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="overflow-x-hidden">
        <ScrollRestoration />
        <BackgroundGrid />
        <div className="">
          <main className="relative z-10">{children}</main>
        </div>

        {/* Microsoft Clarity - Deferred loading for better TBT */}
        <Script
          id="microsoft-clarity"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "tli10qc5lk");
            `,
          }}
        />
      </body>
    </html>
  );
}
