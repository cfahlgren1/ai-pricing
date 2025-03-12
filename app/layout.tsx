import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { ThemeToggle } from "@/components/theme-toggle";
import { TailwindIndicator } from "@/components/tailwind-indicator";

import "./globals.css";

export const metadata: Metadata = {
  title: "inference.directory",
  description:
    "The fastest way to find the best AI inference models and pricing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        `${GeistSans.variable} ${GeistMono.variable}`,
        "whitespace-pre-line antialiased",
      )}
    >
      <body>
        <NuqsAdapter>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <nav className="container mx-auto py-4 px-4 sm:px-6 flex justify-end items-center">
              <ThemeToggle />
            </nav>
            {children}
            <TailwindIndicator />
          </ThemeProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
