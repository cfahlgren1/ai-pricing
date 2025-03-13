import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "sonner";
import { Github } from "lucide-react";
import OpenRouterIcon from "@/components/icons/OpenRouterIcon";
import HFIcon from "@/components/icons/HFIcon";

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
            <footer className="container mx-auto py-6 px-4 sm:px-6 border-t border-border mt-8">
              <div className="text-center text-sm text-muted-foreground">
                <p className="mb-4">
                  Made by <a href="https://x.com/calebfahlgren" target="_blank" rel="noopener noreferrer" className="text-black dark:text-white hover:underline">calebfahlgren</a> using data from{" "}
                  <a
                    href="https://huggingface.co"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-black dark:text-white hover:underline"
                  >
                    <span>Hugging Face</span>
                    <span className="inline-flex items-center rounded border border-border bg-background px-1.5 py-0.5">
                      <HFIcon className="h-3 w-3" />
                    </span>
                  </a>{" "}
                  and{" "}
                  <a
                    href="https://openrouter.ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-black dark:text-white hover:underline"
                  >
                    <span>OpenRouter</span>
                    <span className="inline-flex items-center rounded border border-border bg-background px-1.5 py-0.5">
                      <OpenRouterIcon className="h-3 w-3" />
                    </span>
                  </a>.
                </p>
                <div className="flex justify-center text-xs font-mono">
                  <a href="https://github.com/cfahlgren1/ai-pricing" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-black dark:text-white hover:underline" aria-label="GitHub repository">
                    <Github className="h-4 w-4 mr-1" />
                    <span className="font-bold">Contribute</span>
                  </a>
                </div>
              </div>
            </footer>
            <TailwindIndicator />
          </ThemeProvider>
        </NuqsAdapter>
        <Toaster />
      </body>
    </html>
  );
}
