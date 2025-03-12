import { providers } from "@/data/providers";
import SearchProviders from "@/components/search-providers";
import { HuggingFaceDatasetResponse, ModelRow } from "@/types/huggingface";

export const revalidate = 6 * 60 * 60; // invalidate every 6 hours

async function fetchAllRows(): Promise<ModelRow[]> {
  const baseUrl = 'https://datasets-server.huggingface.co/rows?dataset=cfahlgren1%2Fopen-inference-pricing&config=default&split=train';
  const rowsPerPage = 100;
  let offset = 0;
  
  const allRows: HuggingFaceDatasetResponse = {
    features: [],
    rows: [],
    num_rows_total: 0,
    num_rows_per_page: 0,
    partial: false
  };
  
  while (true) {
    const url = `${baseUrl}&offset=${offset}&length=${rowsPerPage}`;
    const response = await fetch(url);
    const data: HuggingFaceDatasetResponse = await response.json();
    
    if (data.rows.length === 0) {
      break;
    }
    
    allRows.rows.push(...data.rows);
    offset += data.rows.length;
    
    if (offset >= data.num_rows_total) {
      break;
    }
  }

  return allRows.rows.map(row => row.row);
}

export default async function Home() {
  const models = await fetchAllRows();

  console.log(models);
  return (
    <div className="bg-background text-foreground">
      <main className="container mx-auto py-8 px-4 sm:px-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-mono font-medium mb-3 sm:mb-4 text-center">inference.directory</h1>
        <div className="lg:max-w-xl max-w-xs mx-auto text-center text-muted-foreground text-sm sm:text-base">
          <p className="mb-6 sm:mb-8">Search for your favorite models and get the latest pricing information. Find <strong className="text-primary">throughput</strong>, <strong className="text-primary">latency</strong>, and <strong className="text-primary">pricing</strong> for your favorite models.</p>
        </div>
        <SearchProviders providers={providers} />
      </main>
    </div>
  );
}
