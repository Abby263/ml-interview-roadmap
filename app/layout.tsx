import type { Metadata } from "next";

import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { siteName, siteTagline } from "@/lib/site-data";

import "./globals.css";

const themeInitScript = `
  (() => {
    try {
      const stored = localStorage.getItem("ml-roadmap-theme");
      const theme = stored || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      document.documentElement.dataset.theme = theme;
    } catch (error) {
      document.documentElement.dataset.theme = "light";
    }
  })();
`;

export const metadata: Metadata = {
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteTagline,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <div className="relative min-h-screen overflow-x-hidden">
          <SiteHeader />
          <main className="page-shell py-8 md:py-12">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
