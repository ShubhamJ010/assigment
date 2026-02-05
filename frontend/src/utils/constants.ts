import type { RiskLevel } from '../types/risk';

// Mitigation hints based on risk level
export const MITIGATION_HINTS: Record<RiskLevel, string> = {
  Low: 'Accept / Monitor',
  Medium: 'Plan mitigation within 6 months',
  High: 'Prioritize action + compensating controls (NIST PR.AC)',
  Critical: 'Immediate mitigation required + executive reporting',
};

// API base URL (override with VITE_API_BASE_URL if needed)
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api';

// Risk level color configurations
export const RISK_LEVEL_COLORS: Record<RiskLevel, { bg: string; text: string; heatmap: string }> = {
  Low: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    heatmap: '#22c55e',
  },
  Medium: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    heatmap: '#eab308',
  },
  High: {
    bg: 'bg-orange-100',
    text: 'text-orange-800',
    heatmap: '#f97316',
  },
  Critical: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    heatmap: '#ef4444',
  },
};

// Risk level thresholds
export const RISK_THRESHOLDS = {
  LOW_MAX: 5,
  MEDIUM_MAX: 12,
  HIGH_MAX: 18,
  // Above 18 = Critical
};

// Likelihood and Impact labels
export const LIKELIHOOD_LABELS = ['Very Low', 'Low', 'Medium', 'High', 'Very High'];
export const IMPACT_LABELS = ['Negligible', 'Minor', 'Moderate', 'Major', 'Severe'];

// Filter options for the risk table
export const FILTER_OPTIONS: Array<{ value: RiskLevel | 'All'; label: string }> = [
  { value: 'All', label: 'All Levels' },
  { value: 'Low', label: 'Low' },
  { value: 'Medium', label: 'Medium' },
  { value: 'High', label: 'High' },
  { value: 'Critical', label: 'Critical' },
];
