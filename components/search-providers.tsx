"use client"

import { useState } from "react";
import SearchInput from "@/components/search-input";
import ProviderTabs from "@/components/provider-tabs";
import type { Provider } from "@/components/provider-tabs";

interface SearchProvidersProps {
  providers: Provider[];
}

export default function SearchProviders({ providers }: SearchProvidersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredProviders = searchQuery
    ? providers.filter(provider => 
        provider.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : providers;

  return (
    <>
      <div className="w-full max-w-md mx-auto px-2 sm:px-0">
        <SearchInput 
          placeholder="Search for your favorite models or providers..." 
          onChange={setSearchQuery}
        />
      </div>
      
      <div className="mt-4 w-full max-w-5xl mx-auto px-2 sm:px-0">
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
      </div>
    </>
  );
} 
