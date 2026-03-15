import { RootProvider } from 'fumadocs-ui/provider/next';
import './global.css';
import { Outfit, IBM_Plex_Mono } from 'next/font/google';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-ibm-plex-mono',
});

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${ibmPlexMono.variable}`}
      style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
      suppressHydrationWarning
    >
      <body className="flex flex-col min-h-screen">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
