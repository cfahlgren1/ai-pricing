"use client";
import React, { useState, useEffect } from "react";
import { ModelRow } from "@/types/huggingface";
import { Button } from "@/components/ui/button";
import { ChevronDown, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  formatPrice,
  formatThroughput,
  formatContextWindow,
  getCostStateClass,
  getThroughputStateClass,
} from "@/lib/model-utils";

type SortField = "input" | "output" | "context" | "throughput" | null;
type SortDirection = "asc" | "desc";

interface ProviderSheetProps {
  model: ModelRow;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  providersText: string;
  sheetOpen: boolean;
}

export function ProviderSheet({ model, open, onOpenChange, providersText, sheetOpen }: ProviderSheetProps) {
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [filteredProviders, setFilteredProviders] = useState(model.providers || []);

  // Update filtered providers when model changes
  useEffect(() => {
    if (!model.providers) return;
    
    setFilteredProviders(model.providers);
  }, [model.providers]);

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

  const getSortedProviders = () => {
    if (!sortField || !filteredProviders) return filteredProviders;

    return [...filteredProviders].sort((a, b) => {
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

  const getSortIcon = (field: SortField) => {
    if (sortField !== field)
      return <ArrowUpDown className="ml-0.5 size-2.5 opacity-50" />;
    return sortDirection === "asc" ? (
      <ArrowUp className="ml-0.5 size-2.5" />
    ) : (
      <ArrowDown className="ml-0.5 size-2.5" />
    );
  };

  const getSortStateText = () => {
    if (!sortField) return providersText;

    const fieldDisplayNames = {
      input: "Input Cost",
      output: "Output Cost",
      context: "Context Window",
      throughput: "Throughput",
    };

    const directionText =
      sortField === "input" || sortField === "output"
        ? sortDirection === "asc"
          ? "cheapest first"
          : "most expensive first"
        : sortDirection === "asc"
          ? "best first"
          : "worst first";

    return `Sorted by ${fieldDisplayNames[sortField]} (${directionText})`;
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild className="w-full">
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-muted-foreground hover:text-foreground w-full justify-between group transition-all duration-200"
        >
          <span className="flex items-center gap-1.5">
            {sheetOpen ? getSortStateText() : providersText}
          </span>
          <ChevronDown className="h-3.5 w-3.5 opacity-50 group-hover:opacity-80 transition-all duration-200" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="px-0 h-[85vh] overflow-y-auto custom-scrollbar border-t border-border/40 shadow-lg"
      >
        <SheetTitle className="sr-only">Model Providers</SheetTitle>
        <div className="max-w-2xl w-full mx-auto pt-10">
          <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm">
            {filteredProviders.length > 0 && (
              <div className="relative border-b border-border/40">
                <div className="grid grid-cols-12 bg-background/95 py-4 px-4 gap-x-2 text-xs">
                  <div className="col-span-4 font-medium text-foreground/90 flex items-center">
                    <span className="tracking-wide font-semibold">PROVIDER</span>
                  </div>
                  
                  <div
                    className="col-span-2 group flex flex-col items-center justify-center cursor-pointer relative"
                    onClick={() => handleSort("input")}
                  >
                    <div className="flex items-center justify-center w-full">
                      <span className="font-semibold tracking-wide text-foreground/90 group-hover:text-foreground transition-all duration-200">
                        INPUT
                      </span>
                      <div className="ml-1.5 transition-all duration-200 group-hover:translate-y-[-1px] group-hover:opacity-100 opacity-70">
                        {getSortIcon("input")}
                      </div>
                    </div>
                    {sortField === "input" && (
                      <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-14 h-0.5 bg-foreground/80 rounded-full"></div>
                    )}
                  </div>
                  
                  {/* Output column header */}
                  <div
                    className="col-span-2 group flex flex-col items-center justify-center cursor-pointer relative"
                    onClick={() => handleSort("output")}
                  >
                    <div className="flex items-center justify-center w-full">
                      <span className="font-semibold tracking-wide text-foreground/90 group-hover:text-foreground transition-all duration-200">
                        OUTPUT
                      </span>
                      <div className="ml-1.5 transition-all duration-200 group-hover:translate-y-[-1px] group-hover:opacity-100 opacity-70">
                        {getSortIcon("output")}
                      </div>
                    </div>
                    {sortField === "output" && (
                      <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-14 h-0.5 bg-foreground/80 rounded-full"></div>
                    )}
                  </div>
                  
                  {/* Context column header */}
                  <div
                    className="col-span-2 group flex flex-col items-center justify-center cursor-pointer relative"
                    onClick={() => handleSort("context")}
                  >
                    <div className="flex items-center justify-center w-full">
                      <span className="font-semibold tracking-wide text-foreground/90 group-hover:text-foreground transition-all duration-200">
                        CONTEXT
                      </span>
                      <div className="ml-1.5 transition-all duration-200 group-hover:translate-y-[-1px] group-hover:opacity-100 opacity-70">
                        {getSortIcon("context")}
                      </div>
                    </div>
                    {sortField === "context" && (
                      <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-14 h-0.5 bg-foreground/80 rounded-full"></div>
                    )}
                  </div>
                  
                  {/* Throughput column header */}
                  <div
                    className="col-span-2 group flex flex-col items-center justify-center cursor-pointer relative whitespace-nowrap"
                    onClick={() => handleSort("throughput")}
                  >
                    <div className="flex items-center justify-center w-full">
                      <span className="font-semibold tracking-wide text-foreground/90 group-hover:text-foreground transition-all duration-200">
                        THROUGHPUT
                      </span>
                      <div className="ml-1.5 transition-all duration-200 group-hover:translate-y-[-1px] group-hover:opacity-100 opacity-70">
                        {getSortIcon("throughput")}
                      </div>
                    </div>
                    {sortField === "throughput" && (
                      <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-14 h-0.5 bg-foreground/80 rounded-full"></div>
                    )}
                  </div>
                </div>

                {/* Enhanced shadow for better visual separation */}
                <div className="absolute -bottom-1 left-0 right-0 h-2 bg-gradient-to-b from-black/10 to-transparent"></div>
              </div>
            )}
          </div>

          {/* Content area with better spacing */}
          <div className={filteredProviders.length > 0 ? "pt-3" : "h-[85vh] flex items-center justify-center"}>
            {filteredProviders.length === 0 && (
              <div className="text-center text-muted-foreground p-4">
                <div className="text-lg mb-2">No providers available</div>
                <p className="text-sm">This model doesn&apos;t have any inference providers listed yet.</p>
              </div>
            )}
            
            {filteredProviders.length > 0 && (
              <div>
                {getSortedProviders().map((provider, index) => (
                  <div
                    key={`${provider.name}-${index}`}
                    className="grid grid-cols-12 w-full gap-x-2 text-[13px] py-3 bg-background border border-border/30 hover:border-border hover:bg-accent/5 rounded-xl transition-all duration-150 mb-3 shadow-sm hover:shadow-md"
                  >
                    <div
                      className="col-span-4 font-medium text-foreground truncate pl-3 flex items-center"
                      title={provider.name}
                    >
                      {provider.name}
                    </div>
                    <div
                      className="col-span-2 text-center font-mono font-medium tracking-tight flex items-center justify-center"
                    >
                      <span 
                        className={cn(
                          "px-2 py-1.5 rounded-lg w-[90%] transition-colors duration-200",
                          getCostStateClass(
                            provider.input,
                            model.providers,
                            "input",
                          ),
                        )}
                      >
                        {provider.input != null
                          ? formatPrice(provider.input)
                          : "N/A"}
                      </span>
                    </div>
                    <div
                      className="col-span-2 text-center font-mono font-medium tracking-tight flex items-center justify-center"
                    >
                      <span 
                        className={cn(
                          "px-2 py-1.5 rounded-lg w-[90%] transition-colors duration-200",
                          getCostStateClass(
                            provider.output,
                            model.providers,
                            "output",
                          ),
                        )}
                      >
                        {provider.output != null
                          ? formatPrice(provider.output)
                          : "N/A"}
                      </span>
                    </div>
                    <div
                      className="col-span-2 text-center font-mono font-medium tracking-tight flex items-center justify-center"
                    >
                      <span className="px-2 py-1.5 rounded-lg w-[90%] bg-muted/30">
                        {formatContextWindow(provider.context)}
                      </span>
                    </div>
                    <div
                      className="col-span-2 text-center font-mono font-medium tracking-tight flex items-center justify-center"
                    >
                      <span 
                        className={cn(
                          "px-2 py-1.5 rounded-lg w-[90%] transition-colors duration-200",
                          getThroughputStateClass(
                            provider.throughput,
                            model.providers,
                          ),
                        )}
                      >
                        {provider.throughput != null &&
                        provider.throughput > 0 ? (
                          <>
                            {formatThroughput(provider.throughput)}
                            <span className="opacity-70 text-[10px] ml-0.5">
                              t/s
                            </span>
                          </>
                        ) : (
                          "N/A"
                        )}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
} 
