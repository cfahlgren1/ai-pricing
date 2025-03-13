import SearchProviders from "@/components/search-providers";
import React from "react";
import { fetchAllRows, extractUniqueProviders } from "@/lib/model-utils";
import { Badge } from "@/components/ui/badge";
import { Rabbit } from "lucide-react";
import { cn } from "@/lib/utils";

export const revalidate = 43200; // 12 hours

export default async function Home() {
  const models = await fetchAllRows();
  const dynamicProviders = extractUniqueProviders(models);

  return (
    <div className="bg-background text-foreground">
      <main className="container mx-auto py-8 px-4 sm:px-6">
        <h1 className="text-2xl tracking-tight font-bold mb-3 sm:mb-4 text-center">
          Inference Directory
        </h1>
        <div className="lg:max-w-xl max-w-xs mx-auto text-center text-muted-foreground text-sm">
          <div className="mb-6 sm:mb-8">
            Search for your favorite models and get the latest pricing
            information. <br></br> Find{" "}
            <Badge 
              className={cn(
                "ml-1 font-mono",
                "bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950/40 dark:to-purple-900/40",
                "text-purple-600 dark:text-purple-300 hover:bg-purple-100 dark:hover:from-purple-950/70 dark:hover:to-purple-900/70",
                "border border-purple-200 dark:border-purple-800/30",
                "shadow-sm inline-flex items-center gap-1"
              )}
            >
              <Rabbit className="size-3 mr-0.5" />
              throughput
            </Badge>{" "}
            and{" "}
            <Badge 
              className={cn(
                "font-mono",
                "bg-gradient-to-r from-blue-50 to-green-100 dark:from-blue-950/40 dark:to-green-900/40",
                "text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:from-blue-950/70 dark:hover:to-green-900/70",
                "border border-blue-200 dark:border-blue-800/30",
                "shadow-sm inline-flex items-center gap-1"
              )}
            >
              <span className="text-green-600 dark:text-green-300 font-bold mr-0.5">$</span>
              pricing
            </Badge>{" "}
            for your favorite models.
          </div>
        </div>
        <div className="max-w-6xl mx-auto">
          <React.Suspense>
            <SearchProviders providers={dynamicProviders} models={models} />
          </React.Suspense>
        </div>
      </main>
    </div>
  );
}
