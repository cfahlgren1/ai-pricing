"use client";
import React, { useState } from "react";
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
            <span>Back to models</span>
          </Link>
        </Button>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="border-b border-border/40 pb-4">
          <CardTitle className="flex justify-between items-center">
            <span className="text-xl font-semibold">{model.name}</span>
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
          {model.author && (
            <CardDescription className="text-sm text-muted-foreground">
              Created by {model.author}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Model Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="text-xs text-muted-foreground mb-1">Context Window</div>
                  <div className="font-mono text-xl font-semibold flex items-center gap-1">
                    <Ruler className="h-4 w-4 text-muted-foreground" />
                    {formatContextWindow(medianContextWindow)}
                  </div>
                </div>

                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="text-xs text-muted-foreground mb-1">Throughput</div>
                  <div className="font-mono text-xl font-semibold flex items-center gap-1">
                    <Rabbit className="h-4 w-4 text-muted-foreground" />
                    {formatThroughput(medianThroughput)}
                    <span className="text-sm ml-0.5">t/s</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Median Pricing</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 rounded-lg">
                  <div className="text-xs text-blue-600 dark:text-blue-400 mb-1">Input Price</div>
                  <div className="font-mono text-xl font-semibold">
                    {formatPrice(model.median_input_cost)}
                  </div>
                </div>

                <div className="p-4 bg-green-50/50 dark:bg-green-950/30 border border-green-100 dark:border-green-900/40 rounded-lg">
                  <div className="text-xs text-green-600 dark:text-green-400 mb-1">Output Price</div>
                  <div className="font-mono text-xl font-semibold">
                    {formatPrice(model.median_output_cost)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Providers</h3>
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
