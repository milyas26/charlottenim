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
                  if (p.darkMode) {
                    document.documentElement.classList.add('dark');
                  }
                  var fs = { small: '15px', medium: '17px', large: '19px' };
                  var lh = { tight: '1.75', normal: '2.1', relaxed: '2.5' };
                  var ff = {
                    lora: 'var(--font-lora)',
                    georgia: "Georgia, 'Times New Roman', serif",
                    sans: 'var(--font-geist-sans)'
                  };
                  if (p.fontSize && fs[p.fontSize]) {
                    document.documentElement.style.setProperty('--r-fs', fs[p.fontSize]);
                  }
                  if (p.lineSpacing && lh[p.lineSpacing]) {
                    document.documentElement.style.setProperty('--r-lh', lh[p.lineSpacing]);
                  }
                  if (p.fontFamily && ff[p.fontFamily]) {
                    document.documentElement.style.setProperty('--r-ff', ff[p.fontFamily]);
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
