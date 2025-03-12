"use client";
import React, { useState } from "react";
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
import { ProviderSheet } from "./provider-sheet";
import { cn } from "@/lib/utils";

interface ModelCardProps {
  model: ModelRow;
}

export function ModelCard({ model }: ModelCardProps) {
  const [sheetOpen, setSheetOpen] = useState(false);

  const medianThroughput = calculateMedianThroughput(model);
  const medianContextWindow = calculateMedianContextWindow(model);

  const providerCount = model.providers?.length || 0;
  const firstProvider = providerCount > 0 ? model.providers[0].name : "";
  const secondProvider = providerCount > 1 ? model.providers[1].name : "";

  let providersText = "";
  if (providerCount === 0) {
    providersText = "No providers";
  } else if (providerCount === 1) {
    providersText = firstProvider;
  } else if (providerCount === 2) {
    providersText = `${firstProvider} and ${secondProvider}`;
  } else {
    providersText = `${firstProvider}, ${secondProvider} and ${providerCount - 2} others`;
  }

  return (
    <Card 
      className={cn(
        "w-full transition-all flex flex-col h-80 xl:h-72",
        "hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700",
        "group relative overflow-hidden"
      )}
    >
      <div className="absolute inset-x-0 -bottom-1 h-[2px] bg-gradient-to-r from-transparent via-slate-300/40 dark:via-slate-600/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <CardHeader className="pb-1 flex-shrink-0 p-2 pt-3">
        <CardTitle
          className="text-lg md:text-base lg:text-sm xl:text-sm font-medium truncate"
          title={model.name}
        >
          {model.name}
        </CardTitle>

        <div className="flex flex-wrap items-center gap-1 mt-1">
          <Button
            variant="default"
            className={cn(
              "text-xs tracking-tighter md:text-[10px] lg:text-[10px] xl:text-[9px] px-2 py-0.5 h-auto font-mono font-bold",
              "bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/40 dark:to-blue-900/40",
              "text-blue-600 dark:text-blue-300 hover:from-blue-100 hover:to-blue-200",
              "dark:hover:from-blue-950/70 dark:hover:to-blue-900/70 border border-blue-200 dark:border-blue-800/30",
              "shadow-sm flex items-center gap-1 transition-colors"
            )}
            size="sm"
            title="Tokens per second throughput"
          >
            <Rabbit className="size-3 lg:size-3 xl:size-2.5" />
            {formatThroughput(medianThroughput)}
            <span className="text-[0.85em] ml-0.5">t/s</span>
          </Button>

          <Button
            variant="default"
            className={cn(
              "text-xs tracking-tighter md:text-[10px] lg:text-[10px] xl:text-[9px] px-2 py-0.5 h-auto font-mono font-bold",
              "bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/40 dark:to-green-900/40",
              "text-green-600 dark:text-green-300 hover:from-green-100 hover:to-green-200",
              "dark:hover:from-green-950/70 dark:hover:to-green-900/70 border border-green-200 dark:border-green-800/30",
              "shadow-sm flex items-center gap-1 transition-colors"
            )}
            size="sm"
            title="Context window size"
          >
            <Ruler className="size-3 lg:size-3 xl:size-2.5" />
            {formatContextWindow(medianContextWindow)}
          </Button>

          {model.open_router_id && (
            <Button
              variant="outline"
              className="text-xs md:text-[10px] p-1 rounded-full h-auto hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              size="sm"
              title="View on OpenRouter"
            >
              <Link
                href={`https://openrouter.ai/${model.open_router_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center"
              >
                <OpenRouterIcon className="size-3.5 lg:size-3.5 xl:size-3 opacity-75 hover:opacity-100 transition-opacity" />
              </Link>
            </Button>
          )}
          {model.hf_id && (
            <Button
              variant="outline"
              className="text-xs md:text-[10px] p-1 rounded-full h-auto hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              size="sm"
              title="View on Hugging Face"
            >
              <Link
                href={`https://huggingface.co/${model.hf_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center"
              >
                <HFIcon className="size-3.5 lg:size-3.5 xl:size-3 opacity-75 hover:opacity-100 transition-opacity" />
              </Link>
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
                "py-4 px-4 rounded-lg bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40",
                "hover:bg-blue-50/80 dark:hover:bg-blue-950/40",
                "min-w-[95px] sm:min-w-[105px]"
              )}>
                <span className="text-xs lg:text-xs xl:text-[11px] font-medium text-blue-600 dark:text-blue-400 tracking-wider mb-1">
                  INPUT
                </span>
                <div className="relative group/price">
                  <div className="font-mono text-3xl lg:text-2xl xl:text-2xl font-bold leading-tight tracking-tight transition-all">
                    {formatPrice(model.median_input_cost)}
                  </div>
                  <div className="absolute -inset-1 bg-blue-500/5 dark:bg-blue-500/10 rounded-xl blur opacity-75 group-hover/price:opacity-100 transition duration-300 -z-10"></div>
                </div>
              </div>

              {/* Output Price Box */}
              <div className={cn(
                "flex flex-col items-center transition-transform duration-300 group-hover:-translate-y-1",
                "py-4 px-4 rounded-lg bg-green-50/50 dark:bg-green-950/30 border border-green-100 dark:border-green-900/40",
                "hover:bg-green-50/80 dark:hover:bg-green-950/40",
                "min-w-[95px] sm:min-w-[105px]"
              )}>
                <span className="text-xs lg:text-xs xl:text-[11px] font-medium text-green-600 dark:text-green-400 tracking-wider mb-1">
                  OUTPUT
                </span>
                <div className="relative group/price">
                  <div className="font-mono text-3xl lg:text-2xl xl:text-2xl font-bold leading-tight tracking-tight transition-all">
                    {formatPrice(model.median_output_cost)}
                  </div>
                  <div className="absolute -inset-1 bg-green-500/5 dark:bg-green-500/10 rounded-xl blur opacity-75 group-hover/price:opacity-100 transition duration-300 -z-10"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-2 pt-0 mt-auto w-full">
        <div className="flex flex-col items-center w-full">
          {providerCount === 0 ? (
            <div className="text-xs text-muted-foreground w-full text-center">
              No provider information available
            </div>
          ) : providerCount === 1 ? (
            <div className="text-xs text-muted-foreground w-full text-center">
              {firstProvider}
            </div>
          ) : (
            <ProviderSheet 
              open={sheetOpen}
              onOpenChange={setSheetOpen}
              model={model}
              providersText={providersText}
              sheetOpen={sheetOpen}
            />
          )}
        </div>
      </CardFooter>
    </Card>
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
