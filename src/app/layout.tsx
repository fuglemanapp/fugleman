import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { InstallAppPrompt } from "@/components/pwa/install-app-prompt";
import { PwaRegistration } from "@/components/pwa/pwa-registration";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://whatspent.com"),
  title: {
    default: "WhatSpent | Finanças e organização em família",
    template: "%s | WhatSpent",
  },
  description:
    "Organize finanças, agenda, tarefas e conversas privadas com o WhatSpent.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/brand/whatspent-icon.png",
    apple: "/brand/whatspent-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                var theme = localStorage.getItem('whatspent-theme');
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                }
              } catch(e) {}
            })();
          `
        }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <PwaRegistration />
        <InstallAppPrompt />
      </body>
    </html>
  );
}
