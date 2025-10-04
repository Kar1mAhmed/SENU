import type { Metadata } from 'next';
import { Alexandria } from 'next/font/google';
import localFont from 'next/font/local';
import './../styles/globals.css';
import { generateMetadata as generatePageMetadata, generateOrganizationSchema } from '@/lib/metadata';

export const metadata: Metadata = generatePageMetadata();

const alexandria = Alexandria({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-alexandria',
  weight: ['400', '600'],
});

const newBlack = localFont({
  src: [
    { path: '../../public/fonts/NewBlackTypeface-UltraLight.otf', weight: '200' },
    { path: '../../public/fonts/NewBlackTypeface-Light.otf', weight: '300' },
    { path: '../../public/fonts/NewBlackTypeface-Regular.otf', weight: '400' },
    { path: '../../public/fonts/NewBlackTypeface-Medium.otf', weight: '500' },
    { path: '../../public/fonts/NewBlackTypeface-SemiBold.otf', weight: '600' },
    { path: '../../public/fonts/NewBlackTypeface-Bold.otf', weight: '700' },
    { path: '../../public/fonts/NewBlackTypeface-ExtraBold.otf', weight: '800' },
  ],
  display: 'swap',
  variable: '--font-new-black',
});

import BackgroundGrid from '../components/main/BackgroundGrid';


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = generateOrganizationSchema();

  return (
    <html lang="en" className={`${newBlack.variable} ${alexandria.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body>
        <BackgroundGrid />
        <div className="">
          <main className="relative z-10">{children}</main>
        </div>
      </body>
    </html>
  );
}
