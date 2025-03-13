"use client";

import SearchInput from "@/components/search-input";
import ProviderTabs from "@/components/provider-tabs";
import type { Provider } from "@/components/provider-tabs";
import { useQueryState, parseAsArrayOf, parseAsString } from "nuqs";
import { ModelGrid } from "./model-grid";
import { ModelRow } from "@/types/huggingface";
import { useMemo, useCallback, useState, useEffect, useRef } from "react";
import Fuse from 'fuse.js';
import type { FuseResult } from 'fuse.js';
import { cn } from "@/lib/utils";

interface SearchProvidersProps {
  providers: Provider[];
  models: ModelRow[];
}

export default function SearchProviders({
  providers,
  models,
}: SearchProvidersProps) {
  const [searchQuery, setSearchQuery] = useQueryState("q");
  const [selectedProviders] = useQueryState(
    "providers",
    parseAsArrayOf(parseAsString),
  );
  const [inputValue, setInputValue] = useState(searchQuery || "");
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const localSelectedProviders = useMemo(
    () => selectedProviders || [],
    [selectedProviders],
  );

  // Pre-sort models once
  const sortedModels = useMemo(() => 
    models.slice().sort((a, b) => b.providers.length - a.providers.length),
    [models]
  );

  const providersFuse = useMemo(() => new Fuse(providers, {
    keys: ['name'],
    threshold: 0.2,
    distance: 100,
    minMatchCharLength: 1,
  }), [providers]);

  const modelsFuse = useMemo(() => new Fuse(sortedModels, {
    keys: [
      { name: 'name', weight: 0.5 },
      { name: 'author', weight: 0.3 },
      { name: 'providers.name', weight: 0.2 },
    ],
    threshold: 0.2,
    distance: 100,
    minMatchCharLength: 1,
  }), [sortedModels]);

  const modelsByProvider = useMemo(() => {
    const index = new Map<string, Set<number>>();

    for (const [idx, model] of sortedModels.entries()) {
      for (const provider of model.providers) {
        const providerName = provider.name.toLowerCase();
        if (!index.has(providerName)) {
          index.set(providerName, new Set());
        }
        index.get(providerName)?.add(idx);
      }
    }

    return index;
  }, [sortedModels]);

  useEffect(() => {
    setInputValue(searchQuery || "");
  }, [searchQuery]);

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      if (inputValue.trim() === "") {
        setSearchQuery(null);
      } else {
        setSearchQuery(inputValue);
      }
    }, 300);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [inputValue, setSearchQuery]);

  const handleSearchChange = useCallback(
    (value: string) => {
      setInputValue(value);
    },
    [],
  );

  const filteredProviders = useMemo(() => {
    const query = inputValue?.trim();
    if (!query) return providers;

    const searchResults = providersFuse.search(query).map((result: FuseResult<Provider>) => result.item);
    
    if (localSelectedProviders && localSelectedProviders.length > 0) {
      const selectedProviderSet = new Set(localSelectedProviders);
      const missingSelectedProviders = providers.filter(
        provider => selectedProviderSet.has(provider.id) && 
        !searchResults.some(result => result.id === provider.id)
      );
      return [...searchResults, ...missingSelectedProviders];
    }

    return searchResults;
  }, [providers, inputValue, providersFuse, localSelectedProviders]);

  const providerNameMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const provider of providers) {
      map.set(provider.id, provider.name.toLowerCase());
    }
    return map;
  }, [providers]);

  const selectedProvidersSet = useMemo(() => {
    if (!localSelectedProviders || localSelectedProviders.length === 0)
      return null;
    return new Set(localSelectedProviders.map((p) => p.toLowerCase()));
  }, [localSelectedProviders]);

  const filteredModels = useMemo(() => {
    const query = inputValue?.trim();

    // If only provider filter is active
    if (selectedProvidersSet?.size && !query) {
      const matchingIndices = new Set<number>();
      for (const providerName of selectedProvidersSet) {
        const modelsForProvider = modelsByProvider.get(providerName);
        if (modelsForProvider) {
          for (const idx of modelsForProvider) {
            matchingIndices.add(idx);
          }
        }
      }
      return Array.from(matchingIndices).map((idx) => sortedModels[idx]);
    }

    // If only search is active
    if (!selectedProvidersSet?.size && query) {
      return modelsFuse.search(query).map((result: FuseResult<ModelRow>) => result.item);
    }

    // If both filters are active
    if (selectedProvidersSet?.size && query) {
      const matchingIndices = new Set<number>();
      for (const providerName of selectedProvidersSet) {
        const modelsForProvider = modelsByProvider.get(providerName);
        if (modelsForProvider) {
          for (const idx of modelsForProvider) {
            matchingIndices.add(idx);
          }
        }
      }
      const candidateModels = Array.from(matchingIndices).map((idx) => sortedModels[idx]);

      return modelsFuse.search(query).map((result: FuseResult<ModelRow>) => result.item)
        .filter(model => candidateModels.includes(model));
    }

    // No filters active
    return sortedModels;
  }, [
    sortedModels,
    inputValue,
    selectedProvidersSet,
    modelsByProvider,
    modelsFuse,
  ]);

  const modelGridTitle = useMemo((): React.ReactNode => {
    const totalModels = `${filteredModels.length} ${filteredModels.length === 1 ? 'model' : 'models'}`;
    
    if (inputValue && localSelectedProviders?.length > 0) {
      if (localSelectedProviders.length === 1) {
        const providerId = localSelectedProviders[0];
        const providerName = providerNameMap.get(providerId) ||
          providers.find((p) => p.id === providerId)?.name ||
          providerId;
        const formattedProvider = providerName.charAt(0).toUpperCase() + providerName.slice(1);
        return (
          <div className="flex items-center gap-2">
            <span>{totalModels}</span>
            <span className="text-muted-foreground">by</span>
            <span className={cn(
              "px-2 py-0.5 text-sm rounded-md",
              "bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950/40 dark:to-purple-900/40",
              "text-purple-600 dark:text-purple-300",
              "border border-purple-200/80 dark:border-purple-800/30"
            )}>{formattedProvider}</span>
            {inputValue && (
              <>
                <span className="text-muted-foreground">for</span>
                <span className={cn(
                  "px-2 py-0.5 text-sm rounded-md font-mono",
                  "bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/40 dark:to-blue-900/40",
                  "text-blue-600 dark:text-blue-300",
                  "border border-blue-200/80 dark:border-blue-800/30"
                )}>&ldquo;{inputValue}&rdquo;</span>
              </>
            )}
          </div>
        );
      } else {
        return (
          <div className="flex items-center gap-2">
            <span>{totalModels}</span>
            <span className="text-muted-foreground">from</span>
            <span className={cn(
              "px-2 py-0.5 text-sm rounded-md",
              "bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950/40 dark:to-purple-900/40",
              "text-purple-600 dark:text-purple-300",
              "border border-purple-200/80 dark:border-purple-800/30"
            )}>{localSelectedProviders.length} providers</span>
            {inputValue && (
              <>
                <span className="text-muted-foreground">for</span>
                <span className={cn(
                  "px-2 py-0.5 text-sm rounded-md font-mono",
                  "bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/40 dark:to-blue-900/40",
                  "text-blue-600 dark:text-blue-300",
                  "border border-blue-200/80 dark:border-blue-800/30"
                )}>&ldquo;{inputValue}&rdquo;</span>
              </>
            )}
          </div>
        );
      }
    } else if (localSelectedProviders?.length > 0) {
      if (localSelectedProviders.length === 1) {
        const providerId = localSelectedProviders[0];
        const providerName = providerNameMap.get(providerId) ||
          providers.find((p) => p.id === providerId)?.name ||
          providerId;
        const formattedProvider = providerName.charAt(0).toUpperCase() + providerName.slice(1);
        return (
          <div className="flex items-center gap-2">
            <span>{totalModels}</span>
            <span className="text-muted-foreground">by</span>
            <span className={cn(
              "px-2 py-0.5 text-sm rounded-md",
              "bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950/40 dark:to-purple-900/40",
              "text-purple-600 dark:text-purple-300",
              "border border-purple-200/80 dark:border-purple-800/30"
            )}>{formattedProvider}</span>
          </div>
        );
      } else {
        return (
          <div className="flex items-center gap-2">
            <span>{totalModels}</span>
            <span className="text-muted-foreground">from</span>
            <span className={cn(
              "px-2 py-0.5 text-sm rounded-md",
              "bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950/40 dark:to-purple-900/40",
              "text-purple-600 dark:text-purple-300",
              "border border-purple-200/80 dark:border-purple-800/30"
            )}>{localSelectedProviders.length} providers</span>
          </div>
        );
      }
    } else if (inputValue) {
      return (
        <div className="flex items-center gap-2">
          <span>{totalModels}</span>
          <span className="text-muted-foreground">for</span>
          <span className={cn(
            "px-2 py-0.5 text-sm rounded-md font-mono",
            "bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/40 dark:to-blue-900/40",
            "text-blue-600 dark:text-blue-300",
            "border border-blue-200/80 dark:border-blue-800/30"
          )}>&ldquo;{inputValue}&rdquo;</span>
        </div>
      );
    } else {
      return "Models";
    }
  }, [
    filteredModels.length,
    inputValue,
    localSelectedProviders,
    providers,
    providerNameMap,
  ]);

  const searchInputSection = useMemo(
    () => (
      <div className="w-full max-w-md mx-auto px-2 sm:px-0">
        <SearchInput
          placeholder="Search for your favorite models or providers..."
          onChange={handleSearchChange}
          value={inputValue}
        />
      </div>
    ),
    [handleSearchChange, inputValue],
  );

  const providersSection = useMemo(() => {
    if (filteredProviders.length === 0) {
      return null;
    }

    return <ProviderTabs providers={filteredProviders} title="Providers" />;
  }, [filteredProviders]);

  const modelsSection = useMemo(
    () => <ModelGrid models={filteredModels} title={modelGridTitle} />,
    [filteredModels, modelGridTitle],
  );

  return (
    <>
      {searchInputSection}
      <div className="mt-4 w-full">
        {providersSection}
        {modelsSection}
      </div>
    </>
  );
}
