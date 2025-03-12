"use client";

import { cn } from "@/lib/utils";
import { HTMLAttributes, useMemo, useCallback } from "react";
import { useQueryState, parseAsString, parseAsArrayOf } from "nuqs";

export interface Provider {
  id: string;
  name: string;
  logo?: React.ReactNode;
}

interface ProviderTabsProps extends HTMLAttributes<HTMLDivElement> {
  providers: Provider[];
  title?: string;
  onSelectionChange?: (selectedProviders: string[]) => void;
}

export default function ProviderTabs({
  providers,
  title = "Providers",
  className,
  onSelectionChange,
  ...props
}: ProviderTabsProps) {
  const [selectedProviders, setSelectedProviders] = useQueryState(
    "providers",
    parseAsArrayOf(parseAsString),
  );

  const selectedProviderIds = useMemo(
    () => selectedProviders || [],
    [selectedProviders],
  );

  const handleProviderClick = useCallback(
    (providerId: string) => {
      const isCurrentlySelected = selectedProviderIds.includes(providerId);

      if (isCurrentlySelected) {
        const filtered = selectedProviderIds.filter((id) => id !== providerId);
        // Set to null if no providers remain to remove from URL
        const newValue = filtered.length === 0 ? null : filtered;
        setSelectedProviders(newValue);

        if (onSelectionChange) {
          onSelectionChange(filtered);
        }
      } else {
        const newValue = [...selectedProviderIds, providerId];
        setSelectedProviders(newValue);

        if (onSelectionChange) {
          onSelectionChange(newValue);
        }
      }
    },
    [selectedProviderIds, setSelectedProviders, onSelectionChange],
  );

  const handleClearAll = useCallback(() => {
    setSelectedProviders(null);

    if (onSelectionChange) {
      onSelectionChange([]);
    }
  }, [setSelectedProviders, onSelectionChange]);

  const providerButtons = useMemo(() => {
    return providers.map((provider) => {
      const isSelected = selectedProviderIds.includes(provider.id);

      return (
        <button
          key={provider.id}
          onClick={() => handleProviderClick(provider.id)}
          className={cn(
            "flex items-center gap-2 px-3 py-2.5 border rounded-full text-sm font-medium min-w-16 touch-manipulation snap-start shrink-0 cursor-pointer",
            isSelected
              ? "bg-primary border-primary text-primary-foreground"
              : "bg-card border-border hover:border-accent hover:bg-card/80 hover:scale-105 hover:shadow-sm",
          )}
        >
          {provider.logo && (
            <span className="flex items-center justify-center size-5 text-inherit">
              {provider.logo}
            </span>
          )}
          <span className="truncate capitalize">{provider.name}</span>
        </button>
      );
    });
  }, [providers, selectedProviderIds, handleProviderClick]);

  return (
    <div className={cn("w-full", className)} {...props}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 gap-2">
        <h2 className="text-lg sm:text-xl font-medium">{title}</h2>
        {selectedProviderIds.length > 0 && (
          <button
            onClick={handleClearAll}
            className="text-sm text-muted-foreground hover:text-foreground hover:underline transition-colors cursor-pointer"
          >
            Clear all
          </button>
        )}
      </div>
      <div className="flex overflow-x-auto pb-2 -mb-2 snap-x no-scrollbar">
        <div className="flex gap-2 sm:gap-3 py-2">{providerButtons}</div>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }

        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
