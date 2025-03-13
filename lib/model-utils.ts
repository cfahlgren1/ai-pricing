import {
  ModelRow,
  HuggingFaceDatasetResponse,
  Provider,
} from "@/types/huggingface";
import { Provider as UIProvider } from "@/components/provider-tabs";
import { providers } from "@/data/providers";

export enum ComparisonState {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  NEUTRAL = "NEUTRAL",
}

/**
 * Formats a numeric price to a dollar string with appropriate precision
 */
export function formatPrice(price: number): string {
  return "$" + price.toFixed(6).replace(/\.?0+$/, "");
}

/**
 * Calculates the median context window size from a model's providers
 */
export function calculateMedianContextWindow(model: ModelRow): number {
  if (!model.providers || model.providers.length === 0) {
    return 0;
  }

  const contextWindows = model.providers
    .filter((provider) => provider.context != null && provider.context > 0)
    .map((provider) => provider.context)
    .sort((a, b) => a - b);

  if (contextWindows.length === 0) {
    return 0;
  }

  const midpoint = Math.floor(contextWindows.length / 2);

  if (contextWindows.length % 2 === 0) {
    return (contextWindows[midpoint - 1] + contextWindows[midpoint]) / 2;
  } else {
    return contextWindows[midpoint];
  }
}

/**
 * Formats a context window size to a readable string
 */
export function formatContextWindow(contextWindow: number): string {
  if (
    contextWindow === null ||
    contextWindow === undefined ||
    contextWindow === 0
  ) {
    return "N/A";
  }

  if (contextWindow >= 1000) {
    return `${(contextWindow / 1000).toFixed(0)}K`;
  }

  return `${contextWindow.toFixed(0)}`;
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
  if (throughput === null || throughput === undefined || throughput === 0) {
    return "N/A";
  }

  if (throughput >= 1000) {
    return `${(throughput / 1000).toFixed(1)}K`;
  }

  return `${throughput.toFixed(1)}`;
}

/**
 * Calculates the median of an array of numbers
 */
export function calculateMedian(values: number[]): number {
  if (values.length === 0) return 0;

  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  } else {
    return sorted[middle];
  }
}

/**
 * Determines if the data has a wide distribution that needs special handling
 */
export function hasWideDistribution(values: number[]): boolean {
  if (values.length <= 3) return false;
  
  const sortedValues = [...values].sort((a, b) => a - b);
  
  // Calculate the ratio between the max and min values
  const min = sortedValues[0];
  const max = sortedValues[sortedValues.length - 1];
  
  // If the max is more than 5x the min, we consider it a wide distribution
  // This threshold can be adjusted based on your specific needs
  return max / min > 5;
}

/**
 * Calculates thresholds for comparison states based on the data distribution
 */
export function calculateAdaptiveThresholds(values: number[]): { lowThreshold: number, highThreshold: number } {
  // Default values if we can't calculate
  if (values.length <= 3) {
    return { lowThreshold: 0.9, highThreshold: 1.1 };
  }
  
  const sortedValues = [...values].sort((a, b) => a - b);
  const median = calculateMedian(values);
  
  if (hasWideDistribution(values)) {
    // For wide distributions, use quartiles to determine thresholds
    const q1Index = Math.floor(sortedValues.length / 4);
    const q3Index = Math.floor(sortedValues.length * 3 / 4);
    
    const q1 = sortedValues[q1Index];
    const q3 = sortedValues[q3Index];
    
    // Use the quartiles to determine the thresholds relative to median
    const lowThreshold = q1 / median;
    const highThreshold = q3 / median;
    
    return { lowThreshold, highThreshold };
  } else {
    // For more normal distributions, stick with percentages
    return { lowThreshold: 0.9, highThreshold: 1.1 };
  }
}

/**
 * Evaluates whether the values in an array have low deviation from the median
 */
export function hasLowDeviation(values: number[], threshold = 0.05): boolean {
  if (values.length <= 3) return false;

  const median = calculateMedian(values);
  const maxDeviation = Math.max(...values.map((val) => Math.abs(val - median)));

  return maxDeviation < median * threshold;
}

/**
 * Determines the comparison state for a cost value (lower is better)
 */
export function getCostComparisonState(
  value: number | null | undefined,
  validValues: number[],
): ComparisonState {
  if (value == null || validValues.length <= 3) {
    return ComparisonState.NEUTRAL;
  }

  const median = calculateMedian(validValues);

  if (hasLowDeviation(validValues)) {
    return ComparisonState.MEDIUM;
  }
  
  const { lowThreshold, highThreshold } = calculateAdaptiveThresholds(validValues);

  if (value < median * lowThreshold) {
    return ComparisonState.LOW;
  }

  if (value < median * highThreshold) {
    return ComparisonState.MEDIUM;
  }

  return ComparisonState.HIGH;
}

/**
 * Determines the comparison state for a performance value (higher is better)
 */
export function getPerformanceComparisonState(
  value: number | null | undefined,
  validValues: number[],
): ComparisonState {
  if (value == null || value <= 0 || validValues.length <= 3) {
    return ComparisonState.NEUTRAL;
  }

  const median = calculateMedian(validValues);

  if (hasLowDeviation(validValues)) {
    return ComparisonState.MEDIUM;
  }
  
  const { lowThreshold, highThreshold } = calculateAdaptiveThresholds(validValues);

  if (value > median * highThreshold) {
    return ComparisonState.HIGH;
  }

  if (value > median * lowThreshold) {
    return ComparisonState.MEDIUM;
  }

  return ComparisonState.LOW;
}

/**
 * Gets the CSS class for a given comparison state
 * @param state The comparison state
 * @param isPerformance Whether this is a performance metric (higher is better)
 */
export function getComparisonStateClass(
  state: ComparisonState,
  isPerformance = false,
): string {
  // For performance metrics (higher is better), invert the styling
  if (isPerformance) {
    switch (state) {
      case ComparisonState.HIGH:
        return "bg-green-50 dark:bg-green-950/30 text-green-800 dark:text-green-300";
      case ComparisonState.MEDIUM:
        return "bg-yellow-50 dark:bg-yellow-950/30 text-yellow-800 dark:text-yellow-300";
      case ComparisonState.LOW:
        return "bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-300";
      case ComparisonState.NEUTRAL:
      default:
        return "";
    }
  }

  // For cost metrics (lower is better), use original styling
  switch (state) {
    case ComparisonState.LOW:
      return "bg-green-50 dark:bg-green-950/30 text-green-800 dark:text-green-300";
    case ComparisonState.MEDIUM:
      return "bg-yellow-50 dark:bg-yellow-950/30 text-yellow-800 dark:text-yellow-300";
    case ComparisonState.HIGH:
      return "bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-300";
    case ComparisonState.NEUTRAL:
    default:
      return "";
  }
}

/**
 * Gets the CSS class for cost values (input/output costs)
 */
export function getCostStateClass(
  value: number | null | undefined,
  providers: Provider[],
  field: "input" | "output",
): string {
  const validValues = providers
    .map((p) => p[field])
    .filter((cost): cost is number => cost != null && cost > 0);

  const state = getCostComparisonState(value, validValues);
  return getComparisonStateClass(state);
}

/**
 * Gets the CSS class for throughput values
 */
export function getThroughputStateClass(
  value: number | null | undefined,
  providers: Provider[],
): string {
  const validValues = providers
    .map((p) => p.throughput)
    .filter(
      (throughput): throughput is number =>
        throughput != null && throughput > 0,
    );

  const state = getPerformanceComparisonState(value, validValues);
  return getComparisonStateClass(state, true);
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

  try {
    while (true) {
      const url = `${baseUrl}&offset=${offset}&length=${rowsPerPage}`;
      
      try {
        const response = await fetch(url);
        
        if (!response.ok) {
          console.error(`API responded with status: ${response.status}`);
          break;
        }
        
        const data: HuggingFaceDatasetResponse = await response.json();
        
        // Check if data has the expected structure
        if (!data || !data.rows) {
          console.error("Invalid API response format:", data);
          break;
        }
        
        if (data.rows.length === 0) {
          break;
        }
        
        allRows.rows.push(...data.rows);
        offset += data.rows.length;
        
        // Check if we have all rows or if we need to continue pagination
        if (data.num_rows_total && offset >= data.num_rows_total) {
          break;
        }
        
        // Safety check to prevent infinite loops if num_rows_total is missing
        if (!data.num_rows_total && data.rows.length < rowsPerPage) {
          break;
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        break;
      }
    }
  } catch (error) {
    console.error("Fatal error in fetchAllRows:", error);
  }

  return allRows.rows.map((row) => row?.row).filter(Boolean);
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
