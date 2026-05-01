import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";

import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { clerkClientEnabled } from "@/lib/feature-flags";
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
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
  },
};

function Shell({ children }: { children: React.ReactNode }) {
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Wrap with ClerkProvider only when keys are configured. ClerkProvider
  // itself is safe to render in either case, but skipping it when there's
  // no key avoids a noisy console warning during local dev without auth.
  if (!clerkClientEnabled) {
    return <Shell>{children}</Shell>;
  }
  return (
    <ClerkProvider>
      <Shell>{children}</Shell>
    </ClerkProvider>
  );
}
