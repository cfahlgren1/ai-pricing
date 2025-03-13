import React from "react";
import { fetchAllRows } from "@/lib/model-utils";
import { notFound } from "next/navigation";
import { ModelDetailCard } from "@/components/model-detail-card";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export const revalidate = 43200; // 12 hours

export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const models = await fetchAllRows();
    
    return models
      .filter(model => model.open_router_id)
      .map((model) => ({
        slug: model.open_router_id,
      }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export default async function ModelDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const resolvedParams = await Promise.resolve(params);
  const { slug } = resolvedParams;
  const decodedSlug = decodeURIComponent(slug);
  
  try {
    const models = await fetchAllRows();
    const model = models.find((m) => 
      // First try exact match with open_router_id
      m.open_router_id === decodedSlug ||
      // Fall back to checking if it's a name
      (m.open_router_id === undefined && m.name === decodedSlug)
    );
    
    if (!model) {
      notFound();
    }

    return (
      <div className="bg-background text-foreground min-h-screen">
        <main className="container mx-auto py-8 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              <ModelDetailCard model={model} />
            </div>
          </div>
        </main>
      </div>
    );
  } catch (error) {
    console.error(`Error fetching model data for ${decodedSlug}:`, error);
    
    return (
      <div className="bg-background text-foreground min-h-screen">
        <main className="container mx-auto py-8 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl sm:text-3xl font-medium mb-6">
              {decodedSlug}
            </h1>
            
            <Card>
              <CardContent className="py-10">
                <div className="text-center space-y-4">
                  <h2 className="text-xl font-medium text-destructive">Unable to load model data</h2>
                  <p className="text-muted-foreground">
                    We encountered an error while trying to fetch data for this model. 
                    Please try again later or check if the model exists.
                  </p>
                  <div className="pt-2">
                    <Link 
                      href="/"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Return to models list
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }
} 
