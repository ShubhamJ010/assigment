import { useMemo } from 'react';
import type { Risk, HeatmapCell } from '../types/risk';
import { getRiskLevel } from '../utils/riskCalculator';

/**
 * Transform risks data into a 5x5 heatmap grid
 * Returns 25 cells ordered by likelihood (rows) and impact (columns)
 */
export const useHeatmapData = (risks: Risk[]): HeatmapCell[] => {
  return useMemo(() => {
    const grid: HeatmapCell[] = [];

    // Create 5x5 grid (likelihood 1-5, impact 1-5)
    for (let likelihood = 1; likelihood <= 5; likelihood++) {
      for (let impact = 1; impact <= 5; impact++) {
        // Find all risks that match this cell
        const cellRisks = risks.filter(
          (risk) => risk.likelihood === likelihood && risk.impact === impact
        );

        const score = likelihood * impact;

        grid.push({
          likelihood,
          impact,
          count: cellRisks.length,
          assets: cellRisks.map((risk) => risk.asset),
          score,
          level: getRiskLevel(score),
        });
      }
    }

    return grid;
  }, [risks]);
};

/**
 * Get a specific cell from the heatmap grid
 */
export const getHeatmapCell = (
  grid: HeatmapCell[],
  likelihood: number,
  impact: number
): HeatmapCell | undefined => {
  return grid.find(
    (cell) => cell.likelihood === likelihood && cell.impact === impact
  );
};

export default useHeatmapData;
