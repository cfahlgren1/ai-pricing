"use client";
import React from "react";
import { ModelRow } from "@/types/huggingface";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import HFIcon from "@/components/icons/HFIcon";
import Link from "next/link";
import {
  formatPrice,
  calculateMedianThroughput,
  formatThroughput,
  calculateMedianContextWindow,
  formatContextWindow,
} from "@/lib/model-utils";
import OpenRouterIcon from "./icons/OpenRouterIcon";
import { Rabbit, Ruler } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { authors } from "@/data/authors";

interface ModelCardProps {
  model: ModelRow;
}

export function ModelCard({ model }: ModelCardProps) {
  const searchParams = useSearchParams();
  const selectedProvider = searchParams.get("providers");
  
  const selectedProviderData = selectedProvider && model.providers?.find(
    p => p.name.toLowerCase() === selectedProvider.toLowerCase()
  );
  
  const {
    input: providerInput,
    output: providerOutput,
    throughput: providerThroughput,
    context: providerContext
  } = selectedProviderData || {};
  
  const inputCost = providerInput ?? model.median_input_cost;
  const outputCost = providerOutput ?? model.median_output_cost;
  const throughput = providerThroughput ?? calculateMedianThroughput(model);
  const contextWindow = providerContext ?? calculateMedianContextWindow(model);

  const authorData = model.author ? authors.find(a => 
    model.author.toLowerCase().includes(a.id)
  ) : null;

  let providersText = "";
  if (selectedProviderData) {
    providersText = `Showing specs for ${selectedProviderData.name}`;
  } else {
    const providerCount = model.providers?.length || 0;
    if (providerCount <= 0) {
      providersText = "No providers";
    } else if (providerCount === 1) {
      providersText = model.providers[0].name;
    } else if (providerCount === 2) {
      providersText = `${model.providers[0].name} and ${model.providers[1].name}`;
    } else {
      providersText = `${model.providers[0].name}, ${model.providers[1].name} and ${providerCount - 2} others`;
    }
  }

  const cardHref = model.open_router_id ? `/model/${encodeURIComponent(model.open_router_id)}` : "#";
  
  // Only allow navigation if we have a valid open_router_id
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!model.open_router_id) {
      e.preventDefault();
    }
  };

  return (
    <Link 
      href={cardHref}
      className="no-underline block"
      draggable={false}
      onClick={handleClick}
    >
      <Card 
        className={cn(
          "w-full transition-all flex flex-col h-80 xl:h-72",
          "hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700",
          "group relative overflow-hidden",
          "cursor-pointer"
        )}
      >
        <div className="absolute inset-x-0 -bottom-1 h-[2px] bg-gradient-to-r from-transparent via-slate-300/40 dark:via-slate-600/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <CardHeader className="pb-1 flex-shrink-0 p-2 pt-3">
          <div className="flex items-center gap-2">
            {authorData && (
              <span className="inline-flex items-center justify-center rounded-md border border-border bg-background/80 w-7 h-7 relative overflow-hidden shadow-[0_2px_4px_rgba(0,0,0,0.02),inset_0_1px_1px_rgba(255,255,255,0.4)] dark:shadow-[0_2px_4px_rgba(0,0,0,0.1),inset_0_1px_1px_rgba(255,255,255,0.05)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.4)] dark:hover:shadow-[0_4px_8px_rgba(0,0,0,0.15),inset_0_1px_1px_rgba(255,255,255,0.05)] transition-shadow group/icon">
                <div className="absolute inset-0 bg-[radial-gradient(#00000005_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:3px_3px] opacity-40"></div>
                <div className="h-4 w-4 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full relative opacity-90 group-hover/icon:opacity-100 transition-opacity">
                  {authorData.logo}
                </div>
              </span>
            )}
            <CardTitle
              className="text-lg md:text-base lg:text-sm xl:text-sm font-medium truncate"
              title={model.name}
            >
              {model.name}
            </CardTitle>
          </div>

          <div className="flex flex-wrap items-center gap-1 mt-1">
            <Button
              variant="default"
              className={cn(
                "text-xs tracking-tighter md:text-[10px] lg:text-[10px] xl:text-[9px] px-2 py-0.5 h-auto font-mono font-bold",
                "bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950/40 dark:to-purple-900/40",
                "text-purple-600 dark:text-purple-300 hover:from-purple-100 hover:to-purple-200",
                "dark:hover:from-purple-950/70 dark:hover:to-purple-900/70 border border-purple-200 dark:border-purple-800/30",
                "shadow-sm flex items-center gap-1 transition-colors"
              )}
              size="sm"
              title="Tokens per second throughput"
              onClick={(e) => e.stopPropagation()}
            >
              <Rabbit className="size-3 lg:size-3 xl:size-2.5" />
              {formatThroughput(throughput)}
              <span className="text-[0.85em] ml-0.5">t/s</span>
            </Button>

            <Button
              variant="default"
              className={cn(
                "text-xs tracking-tighter md:text-[10px] lg:text-[10px] xl:text-[9px] px-2 py-0.5 h-auto font-mono font-bold",
                "bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-950/40 dark:to-amber-900/40",
                "text-amber-600 dark:text-amber-300 hover:from-amber-100 hover:to-amber-200",
                "dark:hover:from-amber-950/70 dark:hover:to-amber-900/70 border border-amber-200 dark:border-amber-800/30",
                "shadow-sm flex items-center gap-1 transition-colors"
              )}
              size="sm"
              title="Context window size"
              onClick={(e) => e.stopPropagation()}
            >
              <Ruler className="size-3 lg:size-3 xl:size-2.5" />
              {formatContextWindow(contextWindow)}
            </Button>

            {model.open_router_id && (
              <Button
                variant="outline"
                className="text-xs md:text-[10px] p-1 rounded-full h-auto hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                size="sm"
                title="View on OpenRouter"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.open(`https://openrouter.ai/${model.open_router_id}`, '_blank', 'noopener,noreferrer');
                }}
              >
                <span className="flex items-center justify-center">
                  <OpenRouterIcon className="size-3.5 lg:size-3.5 xl:size-3 opacity-75 hover:opacity-100 transition-opacity" />
                </span>
              </Button>
            )}
            {model.hf_id && (
              <Button
                variant="outline"
                className="text-xs md:text-[10px] p-1 rounded-full h-auto hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                size="sm"
                title="View on Hugging Face"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.open(`https://huggingface.co/${model.hf_id}`, '_blank', 'noopener,noreferrer');
                }}
              >
                <span className="flex items-center justify-center">
                  <HFIcon className="size-3.5 lg:size-3.5 xl:size-3 opacity-75 hover:opacity-100 transition-opacity" />
                </span>
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-2 flex-grow flex items-center justify-center">
          <div className={cn(
            "w-full h-full rounded-lg relative overflow-hidden px-5 sm:px-6 md:px-8",
            "bg-gradient-to-br from-[#f5f7f9] to-[#e9edf1] dark:from-[#242426] dark:to-[#1e1e20]",
            "group-hover:from-[#f1f5f9] to-[#e5ebf0] dark:group-hover:from-[#28282a] dark:group-hover:to-[#222224]",
            "transition-colors duration-300"
          )}>
            <div className="absolute inset-0 [background-image:linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] dark:[background-image:linear-gradient(to_right,rgba(75,85,99,0.2)_1px,transparent_1px),linear-gradient(to_bottom,rgba(75,85,99,0.2)_1px,transparent_1px)] [background-size:14px_14px] opacity-[0.05]"></div>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10/12 flex flex-row items-center justify-center gap-5 sm:gap-6 z-10">
                {/* Input Price Box */}
                <div className={cn(
                  "flex flex-col items-center transition-transform duration-300 group-hover:-translate-y-1",
                  "py-4 px-4 rounded-lg",
                  "bg-gradient-to-br from-blue-50/90 to-blue-100/90 dark:from-blue-950/40 dark:to-blue-900/40",
                  "border border-blue-200/80 dark:border-blue-800/30",
                  "shadow-sm hover:shadow-md transition-all",
                  "hover:bg-gradient-to-br hover:from-blue-50 hover:to-blue-100/80 dark:hover:from-blue-950/70 dark:hover:to-blue-900/70",
                  "min-w-[95px] sm:min-w-[105px]"
                )}>
                  <span className="text-xs lg:text-xs xl:text-[11px] font-medium text-blue-700 dark:text-blue-400 tracking-wider mb-1">
                    INPUT
                  </span>
                  <div className="relative group/price">
                    <div className="font-mono text-3xl lg:text-2xl xl:text-2xl font-bold leading-tight tracking-tight transition-all text-blue-800 dark:text-blue-300">
                      {formatPrice(inputCost)}
                    </div>
                    <div className="absolute -inset-1 bg-blue-500/5 dark:bg-blue-500/10 rounded-xl blur opacity-75 group-hover/price:opacity-100 transition duration-300 -z-10"></div>
                  </div>
                </div>

                {/* Output Price Box */}
                <div className={cn(
                  "flex flex-col items-center transition-transform duration-300 group-hover:-translate-y-1",
                  "py-4 px-4 rounded-lg",
                  "bg-gradient-to-br from-green-50/90 to-green-100/90 dark:from-green-950/40 dark:to-green-900/40",
                  "border border-green-200/80 dark:border-green-800/30",
                  "shadow-sm hover:shadow-md transition-all",
                  "hover:bg-gradient-to-br hover:from-green-50 hover:to-green-100/80 dark:hover:from-green-950/70 dark:hover:to-green-900/70",
                  "min-w-[95px] sm:min-w-[105px]"
                )}>
                  <span className="text-xs lg:text-xs xl:text-[11px] font-medium text-green-700 dark:text-green-400 tracking-wider mb-1">
                    OUTPUT
                  </span>
                  <div className="relative group/price">
                    <div className="font-mono text-3xl lg:text-2xl xl:text-2xl font-bold leading-tight tracking-tight transition-all text-green-800 dark:text-green-300">
                      {formatPrice(outputCost)}
                    </div>
                    <div className="absolute -inset-1 bg-green-500/5 dark:bg-green-500/10 rounded-xl blur opacity-75 group-hover/price:opacity-100 transition duration-300 -z-10"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="py-2 pt-0 mt-auto w-full">
          <div className="flex flex-col items-center w-full">
            <div className="text-[10px] text-muted-foreground/80 w-full text-center">
              {providersText}
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}

export function ScrollbarStyles() {
  if (typeof window === "undefined" || document.getElementById("custom-scrollbar-style")) {
    return null;
  }
  
  const style = document.createElement("style");
  style.id = "custom-scrollbar-style";
  style.textContent = `
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-track {
      background: transparent;
    }
    
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background-color: rgba(156, 163, 175, 0.3);
      border-radius: 8px;
      transition: background-color 0.2s ease;
    }
    
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background-color: rgba(156, 163, 175, 0.5);
    }

    .dark .custom-scrollbar::-webkit-scrollbar-thumb {
      background-color: rgba(75, 85, 99, 0.5);
    }
    
    .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background-color: rgba(75, 85, 99, 0.7);
    }
  `;
  
  document.head.appendChild(style);
  return null;
}

if (typeof window !== "undefined") {
  ScrollbarStyles();
}
