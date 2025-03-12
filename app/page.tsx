import { providers } from "@/data/providers";
import SearchProviders from "@/components/search-providers";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto py-8">
        <h1 className="text-2xl font-mono font-medium mb-2 text-center">inference.directory</h1>
        <p className="text-center text-muted-foreground text-sm">Search for your favorite models and get the latest pricing information.</p>
        <p className="text-center text-muted-foreground mb-8 text-sm">Find <strong className="text-primary">throughput</strong>, <strong className="text-primary">latency</strong>, and <strong className="text-primary">pricing</strong> for your favorite models.</p>
        
        <SearchProviders providers={providers} />
      </main>
    </div>
  );
}
