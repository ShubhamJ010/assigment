import type { RiskLevel } from '../types/risk';
import { RISK_THRESHOLDS } from './constants';

/**
 * Calculate the risk score by multiplying likelihood and impact
 */
export const calculateRiskScore = (likelihood: number, impact: number): number => {
  return likelihood * impact;
};

/**
 * Determine the risk level based on the score
 */
export const getRiskLevel = (score: number): RiskLevel => {
  if (score <= RISK_THRESHOLDS.LOW_MAX) return 'Low';
  if (score <= RISK_THRESHOLDS.MEDIUM_MAX) return 'Medium';
  if (score <= RISK_THRESHOLDS.HIGH_MAX) return 'High';
  return 'Critical';
};

/**
 * Get risk calculation result including both score and level
 */
export const calculateRisk = (
  likelihood: number,
  impact: number
): { score: number; level: RiskLevel } => {
  const score = calculateRiskScore(likelihood, impact);
  const level = getRiskLevel(score);
  return { score, level };
};

/**
 * Get CSS color for a risk level
 */
export const getRiskColor = (level: RiskLevel): string => {
  const colors: Record<RiskLevel, string> = {
    Low: '#22c55e', // Green
    Medium: '#eab308', // Yellow
    High: '#f97316', // Orange
    Critical: '#ef4444', // Red
  };
  return colors[level];
};

/**
 * Get background color for a risk level (lighter version for badges)
 */
export const getRiskBgColor = (level: RiskLevel): string => {
  const colors: Record<RiskLevel, string> = {
    Low: '#dcfce7', // Green-100
    Medium: '#fef9c3', // Yellow-100
    High: '#ffedd5', // Orange-100
    Critical: '#fee2e2', // Red-100
  };
  return colors[level];
};

/**
 * Get text color for a risk level
 */
export const getRiskTextColor = (level: RiskLevel): string => {
  const colors: Record<RiskLevel, string> = {
    Low: '#166534', // Green-800
    Medium: '#854d0e', // Yellow-800
    High: '#9a3412', // Orange-800
    Critical: '#991b1b', // Red-800
  };
  return colors[level];
};
