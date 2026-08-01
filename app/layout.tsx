import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SafetyBanner from "@/components/home/SafetyBanner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: "RallyPulse",
  description: "Plataforma web de resultados de rally en tiempo real",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{__html: `
          (function(){
            try {
              const saved = localStorage.getItem('rally-theme');
              if (saved === 'dark') {
                document.documentElement.classList.add('dark');
              } else if (saved === 'light') {
                document.documentElement.classList.remove('dark');
              } else {
                if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                  document.documentElement.classList.add('dark');
                }
              }
            } catch(e) {}
          })()
        `}} />
      </head>
      <body className="min-h-full flex flex-col pb-[calc(2rem+env(safe-area-inset-bottom))]">
        {children}
        <Analytics />
        <div className="fixed bottom-0 left-0 w-full z-50 bg-black pb-[env(safe-area-inset-bottom)]">
          <SafetyBanner />
        </div>
      </body>
    </html>
  );
}
