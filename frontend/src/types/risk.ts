// Risk level type
export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';

// Main Risk interface matching backend response
export interface Risk {
  id: number;
  asset: string;
  threat: string;
  likelihood: number; // 1-5
  impact: number; // 1-5
  score: number; // likelihood × impact (1-25)
  level: RiskLevel;
}

// Form data for creating a new risk
export interface RiskFormData {
  asset: string;
  threat: string;
  likelihood: number;
  impact: number;
}

// Heatmap cell data structure
export interface HeatmapCell {
  likelihood: number;
  impact: number;
  count: number;
  assets: string[];
  score: number;
  level: RiskLevel;
}

// API response wrapper (if needed)
export interface ApiResponse<T> {
  data: T;
  error?: string;
}

// Filter parameters for risk queries
export interface RiskFilterParams {
  level?: RiskLevel;
}

// Sort configuration for table
export interface SortConfig {
  column: keyof Risk | null;
  direction: 'asc' | 'desc';
}
