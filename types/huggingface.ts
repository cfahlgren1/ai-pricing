export interface Provider {
  name: string;
  context: number;
  max_output: number;
  input: number;
  output: number;
  latency: number;
  throughput: number;
}

export interface ModelRow {
  name: string;
  hf_id: string;
  open_router_id: string;
  author: string;
  providers: Provider[];
  median_input_cost: number;
  median_output_cost: number;
  low_input_cost: number;
  low_output_cost: number;
  high_input_cost: number;
  high_output_cost: number;
  is_open_weights: boolean;
}

interface ValueType {
  dtype: string;
  _type: string;
}

interface ProviderSchema {
  name: ValueType;
  context: ValueType;
  max_output: ValueType;
  input: ValueType;
  output: ValueType;
  latency: ValueType;
  throughput: ValueType;
}

export interface Feature {
  feature_idx: number;
  name: string;
  type: ValueType | ProviderSchema[] | Record<string, unknown>;
}

export interface HuggingFaceDatasetResponse {
  features: Feature[];
  rows: { row_idx: number; row: ModelRow }[];
  num_rows_total: number;
  num_rows_per_page: number;
  partial: boolean;
}
