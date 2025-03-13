import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "sonner";
import { Github } from "lucide-react";

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
                <p>
                  Made by <a href="https://x.com/calebfahlgren" target="_blank" rel="noopener noreferrer" className="text-black dark:text-white hover:underline">calebfahlgren</a> using data from <a href="https://huggingface.co" target="_blank" rel="noopener noreferrer" className="text-black dark:text-white hover:underline">Hugging Face</a> and <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer" className="text-black dark:text-white hover:underline">OpenRouter</a>.
                </p>
                <div className="mt-2 flex justify-center text-xs font-mono">
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
