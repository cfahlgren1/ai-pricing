"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { HTMLAttributes } from "react";
import { useQueryState, parseAsString, parseAsArrayOf } from "nuqs";

export interface Provider {
  id: string;
  name: string;
  logo?: React.ReactNode;
}

interface ProviderTabsProps extends HTMLAttributes<HTMLDivElement> {
  providers: Provider[];
  title?: string;
  showViewAll?: boolean;
  viewAllHref?: string;
}

export default function ProviderTabs({
  providers,
  title = "Providers",
  showViewAll = false,
  viewAllHref = "/providers",
  className,
  ...props
}: ProviderTabsProps) {
  const [selectedProviders, setSelectedProviders] = useQueryState(
    "providers",
    parseAsArrayOf(parseAsString)
  );

  const handleProviderClick = (providerId: string) => {
    const currentProviders = selectedProviders || [];
    
    if (currentProviders.includes(providerId)) {
      setSelectedProviders(currentProviders.filter(id => id !== providerId));
    } else {
      setSelectedProviders([...currentProviders, providerId]);
    }
  };

  return (
    <div className={cn("w-full", className)} {...props}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 gap-2">
        <h2 className="text-lg sm:text-xl font-medium">{title}</h2>
        {showViewAll && (
          <Link
            href={viewAllHref}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            View all →
          </Link>
        )}
      </div>
      <div className="flex overflow-x-auto pb-2 -mb-2 snap-x no-scrollbar">
        <div className="flex gap-2 sm:gap-3 py-2">
          {providers.map((provider) => {
            const isSelected = selectedProviders?.includes(provider.id) || false;
              
            return (
              <button
                key={provider.id}
                onClick={() => handleProviderClick(provider.id)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2.5 border rounded-full text-sm font-medium min-w-16 touch-manipulation snap-start shrink-0",
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
          })}
        </div>
      </div>

      <style jsx global>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }

        /* Hide scrollbar for IE, Edge and Firefox */
        .no-scrollbar {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
      `}</style>
    </div>
  );
}
