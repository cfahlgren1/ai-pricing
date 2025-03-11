"use client"

import { useState } from "react";
import SearchInput from "@/components/search-input";
import ProviderTabs from "@/components/provider-tabs";
import { providers } from "@/data/providers";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredProviders = searchQuery
    ? providers.filter(provider => 
        provider.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : providers;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto py-8">
        <h1 className="text-2xl font-mono font-medium mb-2 text-center">inference.directory</h1>
        <p className="text-center text-muted-foreground text-sm">Search for your favorite models and get the latest pricing information.</p>
        <p className="text-center text-muted-foreground mb-8 text-sm">Find <strong className="text-primary">throughput</strong>, <strong className="text-primary">latency</strong>, and <strong className="text-primary">pricing</strong> for your favorite models.</p>
        <div className="max-w-md mx-auto">
          <SearchInput 
            placeholder="Search for your favorite models or providers..." 
            onChange={setSearchQuery}
          />
        </div>
        
        <div className="mt-4 max-w-5xl mx-auto">
          <ProviderTabs 
            providers={filteredProviders} 
            title="Providers" 
            showViewAll={true}
          />
        </div>
      </main>
    </div>
  );
}
