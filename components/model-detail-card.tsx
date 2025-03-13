"use client";
import React, { useState, useEffect } from "react";
import { ModelRow } from "@/types/huggingface";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import HFIcon from "@/components/icons/HFIcon";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  formatPrice,
  calculateMedianThroughput,
  formatThroughput,
  calculateMedianContextWindow,
  formatContextWindow,
  getCostStateClass,
  getThroughputStateClass,
} from "@/lib/model-utils";
import OpenRouterIcon from "./icons/OpenRouterIcon";
import { Rabbit, Ruler, ArrowLeft, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { authors } from "@/data/authors";

type SortField = "name" | "input" | "output" | "context" | "throughput" | null;
type SortDirection = "asc" | "desc";

interface ModelDetailCardProps {
  model: ModelRow;
}

export function ModelDetailCard({ model }: ModelDetailCardProps) {
  const medianThroughput = calculateMedianThroughput(model);
  const medianContextWindow = calculateMedianContextWindow(model);
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const router = useRouter();

  const authorData = model.author ? authors.find(a => 
    model.author.toLowerCase().includes(a.id)
  ) : null;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        router.push("/");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [router]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else {
        setSortField(null);
      }
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field)
      return <ArrowUpDown className="ml-1 size-3 opacity-50" />;
    return sortDirection === "asc" ? (
      <ArrowUp className="ml-1 size-3" />
    ) : (
      <ArrowDown className="ml-1 size-3" />
    );
  };

  const getSortedProviders = () => {
    if (!sortField || !model.providers) return model.providers;

    return [...model.providers].sort((a, b) => {
      if (sortField === "name") {
        return sortDirection === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (aValue == null)
        aValue =
          sortField === "input" || sortField === "output"
            ? Number.MAX_VALUE
            : -1;
      if (bValue == null)
        bValue =
          sortField === "input" || sortField === "output"
            ? Number.MAX_VALUE
            : -1;

      if (sortField === "input" || sortField === "output") {
        return sortDirection === "asc"
          ? Number(aValue) - Number(bValue)
          : Number(bValue) - Number(aValue);
      }

      return sortDirection === "asc"
        ? Number(bValue) - Number(aValue)
        : Number(aValue) - Number(bValue);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-4">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
        >
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
            <span className="text-[11px] ml-1.5 bg-blue-100 dark:bg-blue-900/70 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700 px-1.5 rounded font-mono leading-none py-0.5 font-medium">
              ESC
            </span>
          </Link>
        </Button>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="border-b border-border/40 pb-4">
          <CardTitle className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              {authorData && (
                <span className="inline-flex items-center justify-center rounded-md border border-border bg-background/80 w-8 h-8 relative overflow-hidden shadow-[0_2px_4px_rgba(0,0,0,0.02),inset_0_1px_1px_rgba(255,255,255,0.4)] dark:shadow-[0_2px_4px_rgba(0,0,0,0.1),inset_0_1px_1px_rgba(255,255,255,0.05)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.4)] dark:hover:shadow-[0_4px_8px_rgba(0,0,0,0.15),inset_0_1px_1px_rgba(255,255,255,0.05)] transition-shadow group/icon">
                  <div className="absolute inset-0 bg-[radial-gradient(#00000005_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:3px_3px] opacity-40"></div>
                  <div className="h-5 w-5 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full relative opacity-90 group-hover/icon:opacity-100 transition-opacity">
                    {authorData.logo}
                  </div>
                </span>
              )}
              <span className="text-xl font-semibold">{model.name}</span>
            </div>
            <div className="flex items-center gap-2">
              {model.open_router_id && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-xs"
                  asChild
                >
                  <Link
                    href={`https://openrouter.ai/models/${model.open_router_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <OpenRouterIcon className="h-3.5 w-3.5" />
                    OpenRouter
                  </Link>
                </Button>
              )}
              {model.hf_id && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-xs"
                  asChild
                >
                  <Link
                    href={`https://huggingface.co/${model.hf_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <HFIcon className="h-3.5 w-3.5" />
                    Hugging Face
                  </Link>
                </Button>
              )}
            </div>
          </CardTitle>
          {model.author && !authorData && (
            <CardDescription className="text-muted-foreground">
               by {model.author}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-border/40">
                <h3 className="text-sm font-medium">Performance</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gradient-to-br from-amber-50/90 to-amber-50/80 dark:from-amber-950/50 dark:to-amber-950/40 border border-amber-200/70 dark:border-amber-800/50 rounded-lg shadow-sm">
                  <div className="text-xs text-amber-700 dark:text-amber-400 mb-1 font-medium">
                    Context Window
                  </div>
                  <div className="font-mono text-xl font-semibold flex items-center gap-1 text-amber-800 dark:text-amber-300">
                    <Ruler className="h-4 w-4 text-amber-600 dark:text-amber-500" />
                    {formatContextWindow(medianContextWindow)}
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-br from-purple-50/90 to-purple-50/80 dark:from-purple-950/50 dark:to-purple-950/40 border border-purple-200/70 dark:border-purple-800/50 rounded-lg shadow-sm">
                  <div className="text-xs text-purple-700 dark:text-purple-400 mb-1 font-medium">
                    Throughput
                  </div>
                  <div className="font-mono text-xl font-semibold flex items-center gap-1 text-purple-800 dark:text-purple-300">
                    <Rabbit className="h-4 w-4 text-purple-600 dark:text-purple-500" />
                    {formatThroughput(medianThroughput)}
                    <span className="text-sm ml-0.5 text-purple-600 dark:text-purple-400">t/s</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-border/40">
                <h3 className="text-sm font-medium">Pricing</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gradient-to-br from-blue-50/90 to-blue-50/80 dark:from-blue-950/50 dark:to-blue-950/40 border border-blue-200/70 dark:border-blue-800/50 rounded-lg shadow-sm">
                  <div className="text-xs text-blue-700 dark:text-blue-400 mb-1 font-medium">
                    Input Price
                  </div>
                  <div className="font-mono text-xl font-semibold text-blue-800 dark:text-blue-300">
                    {formatPrice(model.median_input_cost)}
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-br from-green-50/90 to-green-50/80 dark:from-green-950/50 dark:to-green-950/40 border border-green-200/70 dark:border-green-800/50 rounded-lg shadow-sm">
                  <div className="text-xs text-green-700 dark:text-green-400 mb-1 font-medium">
                    Output Price
                  </div>
                  <div className="font-mono text-xl font-semibold text-green-800 dark:text-green-300">
                    {formatPrice(model.median_output_cost)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center pb-2 border-b border-border/40">
              <h3 className="text-sm font-medium">Available Providers</h3>
              {model.providers && model.providers.length > 0 && (
                <span className="ml-1.5 text-xs text-muted-foreground">
                  ({model.providers.length})
                </span>
              )}
            </div>
            {model.providers && model.providers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th 
                        className="text-left py-3 px-4 font-medium cursor-pointer"
                        onClick={() => handleSort("name")}
                      >
                        <div className="flex items-center">
                          Provider {getSortIcon("name")}
                        </div>
                      </th>
                      <th 
                        className="text-center py-3 px-4 font-medium cursor-pointer"
                        onClick={() => handleSort("input")}
                      >
                        <div className="flex items-center justify-center">
                          Input {getSortIcon("input")}
                        </div>
                      </th>
                      <th 
                        className="text-center py-3 px-4 font-medium cursor-pointer"
                        onClick={() => handleSort("output")}
                      >
                        <div className="flex items-center justify-center">
                          Output {getSortIcon("output")}
                        </div>
                      </th>
                      <th 
                        className="text-center py-3 px-4 font-medium cursor-pointer"
                        onClick={() => handleSort("context")}
                      >
                        <div className="flex items-center justify-center">
                          Context {getSortIcon("context")}
                        </div>
                      </th>
                      <th 
                        className="text-center py-3 px-4 font-medium cursor-pointer"
                        onClick={() => handleSort("throughput")}
                      >
                        <div className="flex items-center justify-center">
                          Throughput {getSortIcon("throughput")}
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {getSortedProviders()?.map((provider, index) => (
                      <tr key={index} className="border-b border-border/20 hover:bg-muted/40 transition-colors">
                        <td className="py-3 px-4">{provider.name}</td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={cn(
                              "px-2 py-1 rounded font-mono text-xs",
                              getCostStateClass(
                                provider.input,
                                model.providers,
                                "input"
                              )
                            )}
                          >
                            {provider.input != null ? formatPrice(provider.input) : "N/A"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={cn(
                              "px-2 py-1 rounded font-mono text-xs",
                              getCostStateClass(
                                provider.output,
                                model.providers,
                                "output"
                              )
                            )}
                          >
                            {provider.output != null ? formatPrice(provider.output) : "N/A"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center font-mono text-xs">
                          {formatContextWindow(provider.context)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={cn(
                              "px-2 py-1 rounded font-mono text-xs",
                              getThroughputStateClass(
                                provider.throughput,
                                model.providers
                              )
                            )}
                          >
                            {provider.throughput != null ? (
                              <>
                                {formatThroughput(provider.throughput)}
                                <span className="ml-0.5 text-[10px]">t/s</span>
                              </>
                            ) : (
                              "N/A"
                            )}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No provider information available for this model.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
