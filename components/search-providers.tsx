"use client";

import SearchInput from "@/components/search-input";
import ProviderTabs from "@/components/provider-tabs";
import type { Provider } from "@/components/provider-tabs";
import { useQueryState, parseAsArrayOf, parseAsString } from "nuqs";
import { ModelGrid } from "./model-grid";
import { ModelRow } from "@/types/huggingface";
import { useMemo, useCallback, useState, useEffect, useRef } from "react";

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

  const modelsByProvider = useMemo(() => {
    const index = new Map<string, Set<number>>();

    models.forEach((model, idx) => {
      for (const provider of model.providers) {
        const providerName = provider.name.toLowerCase();
        if (!index.has(providerName)) {
          index.set(providerName, new Set());
        }
        index.get(providerName)?.add(idx);
      }
    });

    return index;
  }, [models]);

  const modelSearchData = useMemo(() => {
    const data = models.map((model) => ({
      index: models.indexOf(model),
      nameLower: model.name.toLowerCase(),
      authorLower: model.author ? model.author.toLowerCase() : "",
      providerNamesLower: model.providers.map((p) => p.name.toLowerCase()),
    }));
    return data;
  }, [models]);

  useEffect(() => {
    setInputValue(searchQuery || "");
  }, [searchQuery]);

  const handleSearchChange = useCallback(
    (value: string) => {
      setInputValue(value);

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        if (value.trim() === "") {
          setSearchQuery(null);
        } else {
          setSearchQuery(value);
        }
      }, 300);
    },
    [setSearchQuery],
  );

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const filteredProviders = useMemo(() => {
    if (!inputValue) return providers;
    const query = inputValue.toLowerCase();
    return providers.filter((provider) =>
      provider.name.toLowerCase().includes(query),
    );
  }, [providers, inputValue]);

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
    if (!inputValue && !selectedProvidersSet) {
      return models
        .slice()
        .sort((a, b) => b.providers.length - a.providers.length);
    }

    let result: ModelRow[] = [];

    if (selectedProvidersSet && selectedProvidersSet.size > 0) {
      const matchingIndices = new Set<number>();

      for (const providerName of selectedProvidersSet) {
        const modelsForProvider = modelsByProvider.get(providerName);
        if (modelsForProvider) {
          for (const idx of modelsForProvider) {
            matchingIndices.add(idx);
          }
        }
      }

      if (!inputValue) {
        result = Array.from(matchingIndices)
          .map((idx) => models[idx])
          .sort((a, b) => b.providers.length - a.providers.length);
        return result;
      }

      const query = inputValue.toLowerCase();
      result = Array.from(matchingIndices)
        .filter((idx) => {
          const data = modelSearchData[idx];
          return (
            data.nameLower.includes(query) ||
            (data.authorLower && data.authorLower.includes(query)) ||
            data.providerNamesLower.some((name) => name.includes(query))
          );
        })
        .map((idx) => models[idx])
        .sort((a, b) => b.providers.length - a.providers.length);
    } else if (inputValue) {
      const query = inputValue.toLowerCase();
      result = modelSearchData
        .filter(
          (data) =>
            data.nameLower.includes(query) ||
            (data.authorLower && data.authorLower.includes(query)) ||
            data.providerNamesLower.some((name) => name.includes(query)),
        )
        .map((data) => models[data.index])
        .sort((a, b) => b.providers.length - a.providers.length);
    } else {
      result = models
        .slice()
        .sort((a, b) => b.providers.length - a.providers.length);
    }

    return result;
  }, [
    models,
    inputValue,
    selectedProvidersSet,
    modelsByProvider,
    modelSearchData,
  ]);

  const modelGridTitle = useMemo(() => {
    if (
      inputValue &&
      localSelectedProviders &&
      localSelectedProviders.length > 0
    ) {
      if (localSelectedProviders.length === 1) {
        const providerId = localSelectedProviders[0];
        const providerName =
          providerNameMap.get(providerId) ||
          providers.find((p) => p.id === providerId)?.name ||
          providerId;
        return `${filteredModels.length} models by ${providerName.charAt(0).toUpperCase() + providerName.slice(1)} for "${inputValue}"`;
      } else {
        return `${filteredModels.length} models from ${localSelectedProviders.length} providers for "${inputValue}"`;
      }
    } else if (localSelectedProviders && localSelectedProviders.length > 0) {
      if (localSelectedProviders.length === 1) {
        const providerId = localSelectedProviders[0];
        const providerName =
          providerNameMap.get(providerId) ||
          providers.find((p) => p.id === providerId)?.name ||
          providerId;
        return `${filteredModels.length} models by ${providerName.charAt(0).toUpperCase() + providerName.slice(1)}`;
      } else {
        return `${filteredModels.length} models from ${localSelectedProviders.length} providers`;
      }
    } else if (inputValue) {
      return `${filteredModels.length} models for "${inputValue}"`;
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
      return (
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">
            No providers found matching your search.
          </p>
        </div>
      );
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
