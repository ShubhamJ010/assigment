import React, { useState } from 'react';
import { Card } from '../common';
import { useHeatmapData } from '../../hooks/useHeatmapData';
import type { Risk, HeatmapCell, RiskLevel } from '../../types/risk';
import { getRiskColor, getRiskBgColor, getRiskTextColor } from '../../utils/riskCalculator';
import { IMPACT_LABELS, LIKELIHOOD_LABELS } from '../../utils/constants';

interface RiskHeatmapProps {
  risks: Risk[];
  loading?: boolean;
}

const RiskHeatmap: React.FC<RiskHeatmapProps> = ({ risks, loading = false }) => {
  const heatmapData = useHeatmapData(risks);
  const [hoveredCell, setHoveredCell] = useState<HeatmapCell | null>(null);

  // Get cell at specific likelihood and impact
  const getCell = (likelihood: number, impact: number): HeatmapCell | undefined => {
    return heatmapData.find(
      (cell) => cell.likelihood === likelihood && cell.impact === impact
    );
  };

  // Get cell opacity based on count (more risks = more opaque)
  const getCellOpacity = (count: number): number => {
    if (count === 0) return 0.15;
    if (count === 1) return 0.5;
    if (count <= 3) return 0.7;
    return 1;
  };

  // Get cell background style
  const getCellStyle = (cell: HeatmapCell): React.CSSProperties => {
    const baseColor = getRiskColor(cell.level);
    return {
      backgroundColor: baseColor,
      opacity: getCellOpacity(cell.count),
    };
  };

  if (loading) {
    return (
      <Card>
        <div className="space-y-4">
          <div className="h-6 bg-slate-200 rounded w-32 skeleton"></div>
          <div className="aspect-square max-w-md mx-auto">
            <div className="grid grid-cols-5 gap-2 h-full">
              {Array.from({ length: 25 }).map((_, i) => (
                <div key={i} className="rounded-lg skeleton h-full"></div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-800">Risk Heatmap</h3>
        <p className="text-sm text-slate-500">
          5×5 risk matrix showing likelihood vs impact with risk counts
        </p>

        <div className="relative">
          {/* Heatmap Grid Container */}
          <div className="flex">
            {/* Y-axis label */}
            <div className="flex flex-col justify-center pr-2 w-10">
              <span className="text-xs font-medium text-slate-500 transform -rotate-90 whitespace-nowrap">
                LIKELIHOOD
              </span>
            </div>

            {/* Grid with Y-axis values */}
            <div className="flex-1">
              <div className="flex">
                {/* Y-axis values */}
                <div className="flex flex-col justify-between pr-2 py-1">
                  {[5, 4, 3, 2, 1].map((value) => (
                    <div
                      key={value}
                      className="h-14 sm:h-16 flex items-center justify-center"
                    >
                      <span className="text-xs font-medium text-slate-600 w-4 text-center">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Heatmap Grid */}
                <div className="flex-1">
                  <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                    {/* Render grid from top-left (L=5, I=1) to bottom-right (L=1, I=5) */}
                    {[5, 4, 3, 2, 1].map((likelihood) =>
                      [1, 2, 3, 4, 5].map((impact) => {
                        const cell = getCell(likelihood, impact);
                        if (!cell) return null;

                        return (
                          <div
                            key={`${likelihood}-${impact}`}
                            className="relative aspect-square cursor-pointer transition-all duration-200 hover:scale-105 hover:z-10"
                            onMouseEnter={() => setHoveredCell(cell)}
                            onMouseLeave={() => setHoveredCell(null)}
                          >
                            <div
                              className="absolute inset-0 rounded-lg shadow-sm flex items-center justify-center transition-all"
                              style={getCellStyle(cell)}
                            >
                              <span
                                className="text-lg sm:text-xl font-bold"
                                style={{
                                  color: cell.count > 0 ? 'white' : getRiskTextColor(cell.level),
                                  textShadow: cell.count > 0 ? '0 1px 2px rgba(0,0,0,0.3)' : 'none',
                                }}
                              >
                                {cell.count}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* X-axis values */}
                  <div className="flex justify-between mt-2 px-0.5">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <span
                        key={value}
                        className="text-xs font-medium text-slate-600 w-14 text-center"
                      >
                        {value}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* X-axis label */}
              <div className="text-center mt-2">
                <span className="text-xs font-medium text-slate-500">IMPACT</span>
              </div>
            </div>
          </div>

          {/* Tooltip */}
          {hoveredCell && (
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full bg-slate-800 text-white px-4 py-3 rounded-lg shadow-xl z-20 min-w-64 animate-fade-in">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span
                    className="px-2 py-0.5 rounded text-xs font-semibold"
                    style={{
                      backgroundColor: getRiskBgColor(hoveredCell.level),
                      color: getRiskTextColor(hoveredCell.level),
                    }}
                  >
                    {hoveredCell.level}
                  </span>
                  <span className="text-sm">Score: {hoveredCell.score}</span>
                </div>
                <div className="text-sm">
                  <p className="text-slate-300">
                    Likelihood: {hoveredCell.likelihood} ({LIKELIHOOD_LABELS[hoveredCell.likelihood - 1]})
                  </p>
                  <p className="text-slate-300">
                    Impact: {hoveredCell.impact} ({IMPACT_LABELS[hoveredCell.impact - 1]})
                  </p>
                </div>
                {hoveredCell.count > 0 && (
                  <div className="mt-2 pt-2 border-t border-slate-600">
                    <p className="text-xs text-slate-400 mb-1">Assets ({hoveredCell.count}):</p>
                    <p className="text-sm truncate max-w-56">
                      {hoveredCell.assets.join(', ')}
                    </p>
                  </div>
                )}
              </div>
              {/* Arrow */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-px">
                <div className="border-8 border-transparent border-t-slate-800"></div>
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-4 pt-4 border-t border-slate-100">
          {(['Low', 'Medium', 'High', 'Critical'] as RiskLevel[]).map((level) => (
            <div key={level} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: getRiskColor(level) }}
              />
              <span className="text-sm text-slate-600">{level}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default RiskHeatmap;
