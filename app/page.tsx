import SearchProviders from "@/components/search-providers";
import React from "react";
import { fetchAllRows, extractUniqueProviders } from "@/lib/model-utils";

export default async function Home() {
  const models = await fetchAllRows();
  const dynamicProviders = extractUniqueProviders(models);

  return (
    <div className="bg-background text-foreground">
      <main className="container mx-auto py-8 px-4 sm:px-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-mono font-medium mb-3 sm:mb-4 text-center">
          inference.directory
        </h1>
        <div className="lg:max-w-xl max-w-xs mx-auto text-center text-muted-foreground text-sm sm:text-base">
          <p className="mb-6 sm:mb-8">
            Search for your favorite models and get the latest pricing
            information. Find{" "}
            <strong className="text-primary">throughput</strong>,{" "}
            <strong className="text-primary">latency</strong>, and{" "}
            <strong className="text-primary">pricing</strong> for your favorite
            models.
          </p>
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
