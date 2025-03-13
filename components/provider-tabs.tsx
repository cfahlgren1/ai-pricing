"use client";

import { cn } from "@/lib/utils";
import { HTMLAttributes, useMemo, useCallback, useRef, useState, useEffect } from "react";
import { useQueryState, parseAsString, parseAsArrayOf } from "nuqs";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

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
            <span className="flex items-center justify-center w-5 h-5 text-inherit shrink-0">
              {provider.logo}
            </span>
          )}
          <span className="truncate capitalize">{provider.name}</span>
        </button>
      );
    });
  }, [providers, selectedProviderIds, handleProviderClick]);

  const checkScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1); // -1 for potential rounding
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    checkScroll();
    container.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);

    return () => {
      container.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll]);

  const scroll = useCallback((direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = container.clientWidth * 0.8;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  }, []);

  return (
    <div className={cn("w-full relative", className)} {...props}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 gap-2">
        <h2 className="text-xl font-semibold">{title}</h2>
        {selectedProviderIds.length > 0 && (
          <button
            onClick={handleClearAll}
            className="text-sm text-muted-foreground hover:text-foreground hover:underline transition-colors cursor-pointer"
          >
            Clear all
          </button>
        )}
      </div>
      <div className="relative group">
        {canScrollLeft && (
          <>
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-background to-transparent z-10" />
            <button
              onClick={() => scroll('left')}
              className="absolute -left-4 sm:-left-6 top-1/2 -translate-y-1/2 z-20 bg-background/40 dark:bg-background/20 backdrop-blur-sm p-1.5 rounded-full shadow-sm border border-border/50 hover:bg-accent/60 dark:hover:bg-accent/20 transition-all duration-200 cursor-pointer hover:-translate-x-0.5"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-3.5 w-3.5 text-foreground/70" />
            </button>
          </>
        )}
        {canScrollRight && (
          <>
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background to-transparent z-10" />
            <button
              onClick={() => scroll('right')}
              className="absolute -right-4 sm:-right-6 top-1/2 -translate-y-1/2 z-20 bg-background/40 dark:bg-background/20 backdrop-blur-sm p-1.5 rounded-full shadow-sm border border-border/50 hover:bg-accent/60 dark:hover:bg-accent/20 transition-all duration-200 cursor-pointer hover:translate-x-0.5"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-3.5 w-3.5 text-foreground/70" />
            </button>
          </>
        )}
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto snap-x no-scrollbar scroll-smooth relative"
        >
          <div className="flex gap-2 sm:gap-3 py-1 px-2">{providerButtons}</div>
        </div>
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
