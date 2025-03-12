import { ModelRow, HuggingFaceDatasetResponse } from "@/types/huggingface";
import { Provider as UIProvider } from "@/components/provider-tabs";
import { providers } from "@/data/providers";

/**
 * Formats a numeric price to a dollar string with appropriate precision
 */
export function formatPrice(price: number): string {
  return "$" + price.toFixed(6).replace(/\.?0+$/, "");
}

/**
 * Calculates the median throughput from a model's providers
 */
export function calculateMedianThroughput(model: ModelRow): number {
  if (!model.providers || model.providers.length === 0) {
    return 0;
  }

  const throughputs = model.providers
    .filter(
      (provider) => provider.throughput != null && provider.throughput > 0,
    )
    .map((provider) => provider.throughput)
    .sort((a, b) => a - b);

  if (throughputs.length === 0) {
    return 0;
  }

  const midpoint = Math.floor(throughputs.length / 2);

  if (throughputs.length % 2 === 0) {
    return (throughputs[midpoint - 1] + throughputs[midpoint]) / 2;
  } else {
    return throughputs[midpoint];
  }
}

/**
 * Formats a throughput value to a readable string
 */
export function formatThroughput(throughput: number): string {
  if (throughput === 0) {
    return "N/A";
  }

  if (throughput >= 1000) {
    return `${(throughput / 1000).toFixed(1)}K tok/s`;
  }

  return `${throughput.toFixed(1)} tok/s`;
}

/**
 * Fetches all model rows from the Hugging Face dataset
 */
export async function fetchAllRows(): Promise<ModelRow[]> {
  const baseUrl =
    "https://datasets-server.huggingface.co/rows?dataset=cfahlgren1%2Fopen-inference-pricing&config=default&split=train";
  const rowsPerPage = 100;
  let offset = 0;

  const allRows: HuggingFaceDatasetResponse = {
    features: [],
    rows: [],
    num_rows_total: 0,
    num_rows_per_page: 0,
    partial: false,
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

  return allRows.rows.map((row) => row.row);
}

/**
 * Extracts unique providers from a list of models
 */
export function extractUniqueProviders(models: ModelRow[]): UIProvider[] {
  const uniqueProviderNames = new Set<string>();

  for (const model of models) {
    for (const provider of model.providers) {
      uniqueProviderNames.add(provider.name.toLowerCase());
    }
  }

  const providersWithIcons: UIProvider[] = [];
  const processedProviderNames = new Set<string>();

  for (const staticProvider of providers) {
    const matchingProviderName = [...uniqueProviderNames].find(
      (name) =>
        name === staticProvider.id.toLowerCase() ||
        name === staticProvider.name.toLowerCase(),
    );

    if (matchingProviderName) {
      providersWithIcons.push(staticProvider);
      processedProviderNames.add(matchingProviderName);
    }
  }

  for (const providerName of uniqueProviderNames) {
    if (processedProviderNames.has(providerName)) {
      continue;
    }

    providersWithIcons.push({
      id: providerName,
      name: providerName.charAt(0).toUpperCase() + providerName.slice(1),
    });
  }

  return providersWithIcons;
}
