"use client";

import SearchInput from "@/components/search-input";
import ProviderTabs from "@/components/provider-tabs";
import type { Provider } from "@/components/provider-tabs";
import { useQueryState } from "nuqs";
import { ModelGrid } from "./model-grid";
import { ModelRow } from "@/types/huggingface";
import { useMemo, useCallback, useState, useEffect } from "react";

interface SearchProvidersProps {
  providers: Provider[];
  models: ModelRow[];
}

export default function SearchProviders({
  providers,
  models,
}: SearchProvidersProps) {
  const [searchQuery, setSearchQuery] = useQueryState("q");
  const [selectedProvider] = useQueryState("provider");
  const [inputValue, setInputValue] = useState(searchQuery || "");

  useEffect(() => {
    setInputValue(searchQuery || "");
  }, [searchQuery]);

  const handleSearchChange = useCallback((value: string) => {
    setInputValue(value);
    
    if (value.trim() === "") {
      const timer = setTimeout(() => setSearchQuery(null), 100);
      return () => clearTimeout(timer);
    }
    
    setSearchQuery(value);
  }, [setSearchQuery]);

  const filteredProviders = useMemo(() => {
    if (!inputValue) return providers;
    const query = inputValue.toLowerCase();
    return providers.filter((provider) =>
      provider.name.toLowerCase().includes(query)
    );
  }, [providers, inputValue]);

  const filteredModels = useMemo(() => {
    let result = models;
    
    if (inputValue) {
      const query = inputValue.toLowerCase();
      result = result.filter((model) =>
        model.name.toLowerCase().includes(query) ||
        (model.author && model.author.toLowerCase().includes(query))
      );
    }
    
    if (selectedProvider) {
      result = result.filter((model) => 
        model.providers.some((provider) => 
          provider.name.toLowerCase() === selectedProvider.toLowerCase()
        )
      );
    }
    
    return result;
  }, [models, inputValue, selectedProvider]);

  const modelGridTitle = useMemo(() => {
    if (inputValue && selectedProvider) {
      const providerName = providers.find(p => p.id === selectedProvider)?.name || selectedProvider;
      return `${filteredModels.length} ${providerName} models for "${inputValue}"`;
    } else if (selectedProvider) {
      const providerName = providers.find(p => p.id === selectedProvider)?.name || selectedProvider;
      return `${filteredModels.length} ${providerName} models`;
    } else if (inputValue) {
      return `${filteredModels.length} models for "${inputValue}"`;
    } else {
      return "Models";
    }
  }, [filteredModels.length, inputValue, selectedProvider, providers]);

  return (
    <>
      <div className="w-full max-w-md mx-auto px-2 sm:px-0">
        <SearchInput
          placeholder="Search for your favorite models or providers..."
          onChange={handleSearchChange}
          value={inputValue}
        />
      </div>

      <div className="mt-4 w-full">
        {filteredProviders.length > 0 ? (
          <ProviderTabs
            providers={filteredProviders}
            title="Providers"
            showViewAll={true}
          />
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm">
              No providers found matching your search.
            </p>
          </div>
        )}
        <ModelGrid 
          models={filteredModels} 
          title={modelGridTitle} 
        />
      </div>
    </>
  );
}
