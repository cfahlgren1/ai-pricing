"use client";

import SearchInput from "@/components/search-input";
import ProviderTabs from "@/components/provider-tabs";
import type { Provider } from "@/components/provider-tabs";
import { useQueryState, parseAsArrayOf, parseAsString } from "nuqs";
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
  const [selectedProviders] = useQueryState("providers", parseAsArrayOf(parseAsString));
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
      result = result.filter((model) => {
        // Check if model name matches
        const nameMatches = model.name.toLowerCase().includes(query);
        
        // Check if author matches (if author exists)
        const authorMatches = model.author ? 
          model.author.toLowerCase().includes(query) : 
          false;
        
        // Check if any provider matches
        const providerMatches = model.providers.some((provider) => 
          provider.name.toLowerCase().includes(query)
        );
        
        return nameMatches || authorMatches || providerMatches;
      });
    }
    
    // Filter by selected providers
    if (selectedProviders && selectedProviders.length > 0) {
      result = result.filter((model) => 
        model.providers.some((provider) => 
          selectedProviders.some(selectedProviderId => 
            provider.name.toLowerCase() === selectedProviderId.toLowerCase()
          )
        )
      );
    }
    
    return result;
  }, [models, inputValue, selectedProviders]);

  const modelGridTitle = useMemo(() => {
    if (inputValue && selectedProviders && selectedProviders.length > 0) {
      if (selectedProviders.length === 1) {
        const providerName = providers.find(p => p.id === selectedProviders[0])?.name || selectedProviders[0];
        return `${filteredModels.length} ${providerName} models for "${inputValue}"`;
      } else {
        return `${filteredModels.length} models from ${selectedProviders.length} providers for "${inputValue}"`;
      }
    } else if (selectedProviders && selectedProviders.length > 0) {
      if (selectedProviders.length === 1) {
        const providerName = providers.find(p => p.id === selectedProviders[0])?.name || selectedProviders[0];
        return `${filteredModels.length} ${providerName} models`;
      } else {
        return `${filteredModels.length} models from ${selectedProviders.length} providers`;
      }
    } else if (inputValue) {
      return `${filteredModels.length} models for "${inputValue}"`;
    } else {
      return "Models";
    }
  }, [filteredModels.length, inputValue, selectedProviders, providers]);

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
