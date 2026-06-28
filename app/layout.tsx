import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Playfair_Display, Lora } from "next/font/google";
import { Providers } from "@/contexts";
import { Toaster } from "sonner";
import { SerwistProvider } from "@serwist/turbopack/react";
import "./globals.css";

export const dynamic = "force-dynamic";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const APP_NAME = "Charlottenimmm";
const APP_DESCRIPTION = "Baca novel & AU karya Charlottenimmm";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: APP_NAME,
  description: APP_DESCRIPTION,
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_NAME,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: APP_NAME,
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: APP_NAME,
    description: APP_DESCRIPTION,
  },
};

export const viewport: Viewport = {};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} ${lora.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var s = localStorage.getItem('reader-settings');
                  if (!s) return;
                  var p = JSON.parse(s);
                  var fs = { small: '15px', medium: '17px', large: '19px' };
                  var lh = { tight: '1.75', normal: '2.1', relaxed: '2.5' };
                  var ff = {
                    lora: 'var(--font-lora)',
                    georgia: "Georgia, 'Times New Roman', serif",
                    sans: 'var(--font-geist-sans)'
                  };
                  var modes = {
                    white:  { bg:'#FFFFFF', fg:'#1A1A1A', sf:'#F5F5F5', bd:'#E0E0E0', mu:'#6B7280', ac:'#B87B5C', hb:'rgba(255,255,255,0.85)' },
                    cream:  { bg:'#F9F5EF', fg:'#2C241A', sf:'#F3ECE1', bd:'#E0D5C5', mu:'#8C7B6E', ac:'#B87B5C', hb:'rgba(249,245,239,0.85)' },
                    black:  { bg:'#1B1614', fg:'#E8DDD0', sf:'#241E1A', bd:'#3D342C', mu:'#8C8074', ac:'#D4A574', hb:'rgba(27,22,20,0.85)' }
                  };
                  var m = modes[p.readingMode] || modes.cream;
                  if (p.darkMode && !p.readingMode) m = modes.black;
                  var r = document.documentElement.style;
                  r.setProperty('--rm-bg', m.bg);
                  r.setProperty('--rm-fg', m.fg);
                  r.setProperty('--rm-surface', m.sf);
                  r.setProperty('--rm-border', m.bd);
                  r.setProperty('--rm-muted', m.mu);
                  r.setProperty('--rm-accent', m.ac);
                  r.setProperty('--rm-header-bg', m.hb);
                  if (p.fontSize && fs[p.fontSize]) {
                    r.setProperty('--r-fs', fs[p.fontSize]);
                  }
                  if (p.lineSpacing && lh[p.lineSpacing]) {
                    r.setProperty('--r-lh', lh[p.lineSpacing]);
                  }
                  if (p.fontFamily && ff[p.fontFamily]) {
                    r.setProperty('--r-ff', ff[p.fontFamily]);
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <SerwistProvider swUrl="/serwist/sw.js">
          <Providers>
            {children}
            <Toaster position="top-center" richColors />
          </Providers>
        </SerwistProvider>
      </body>
    </html>
  );
}
