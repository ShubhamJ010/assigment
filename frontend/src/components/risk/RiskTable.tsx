import React, { useState, useMemo } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, Filter, Info } from 'lucide-react';
import { Card, Select } from '../common';
import type { Risk, RiskLevel, SortConfig } from '../../types/risk';
import { FILTER_OPTIONS, MITIGATION_HINTS, RISK_LEVEL_COLORS } from '../../utils/constants';

interface RiskTableProps {
  risks: Risk[];
  loading?: boolean;
}

const RiskTable: React.FC<RiskTableProps> = ({ risks, loading = false }) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ column: 'id', direction: 'desc' });
  const [filterLevel, setFilterLevel] = useState<string>('All');

  // Filter risks
  const filteredRisks = useMemo(() => {
    if (filterLevel === 'All') return risks;
    return risks.filter((risk) => risk.level === filterLevel);
  }, [risks, filterLevel]);

  // Sort risks
  const sortedRisks = useMemo(() => {
    if (!sortConfig.column) return filteredRisks;

    return [...filteredRisks].sort((a, b) => {
      const aValue = a[sortConfig.column!];
      const bValue = b[sortConfig.column!];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
  }, [filteredRisks, sortConfig]);

  const handleSort = (column: keyof Risk) => {
    setSortConfig((prev) => ({
      column,
      direction: prev.column === column && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const getSortIcon = (column: keyof Risk) => {
    if (sortConfig.column !== column) {
      return <ArrowUpDown className="w-4 h-4 text-slate-400" />;
    }
    return sortConfig.direction === 'asc' 
      ? <ArrowUp className="w-4 h-4 text-blue-600" />
      : <ArrowDown className="w-4 h-4 text-blue-600" />;
  };

  const getLevelBadge = (level: RiskLevel) => {
    const colors = RISK_LEVEL_COLORS[level];
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${colors.bg} ${colors.text}`}>
        {level}
      </span>
    );
  };

  const columns: Array<{ key: keyof Risk; label: string; sortable: boolean; className?: string }> = [
    { key: 'id', label: 'ID', sortable: true, className: 'w-16' },
    { key: 'asset', label: 'Asset', sortable: true },
    { key: 'threat', label: 'Threat', sortable: true },
    { key: 'likelihood', label: 'L', sortable: true, className: 'w-12 text-center' },
    { key: 'impact', label: 'I', sortable: true, className: 'w-12 text-center' },
    { key: 'score', label: 'Score', sortable: true, className: 'w-16 text-center' },
    { key: 'level', label: 'Level', sortable: true, className: 'w-24' },
  ];

  if (loading) {
    return (
      <Card padding="none">
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-slate-200 rounded w-1/4"></div>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 bg-slate-100 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card padding="none" className="overflow-hidden">
      {/* Header with filter */}
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-slate-500" />
          <span className="text-sm text-slate-600">Filter by Level:</span>
        </div>
        <Select
          options={FILTER_OPTIONS.map((opt) => ({ value: opt.value, label: opt.label }))}
          value={filterLevel}
          onChange={setFilterLevel}
          className="w-full sm:w-44"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider ${col.className || ''}`}
                >
                  {col.sortable ? (
                    <button
                      onClick={() => handleSort(col.key)}
                      className="flex items-center gap-1.5 hover:text-blue-600 transition-colors"
                    >
                      {col.label}
                      {getSortIcon(col.key)}
                    </button>
                  ) : (
                    col.label
                  )}
                </th>
              ))}
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Mitigation Hint
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedRisks.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center">
                  <div className="flex flex-col items-center gap-3 text-slate-500">
                    <Info className="w-12 h-12 text-slate-300" />
                    <p className="text-lg font-medium">No risks found</p>
                    <p className="text-sm">
                      {filterLevel !== 'All' 
                        ? `No ${filterLevel} level risks. Try a different filter.`
                        : 'Add your first risk assessment to get started!'}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              sortedRisks.map((risk, index) => (
                <tr
                  key={risk.id}
                  className={`table-row-hover transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}
                >
                  <td className="px-4 py-3.5 text-sm font-medium text-slate-700">
                    #{risk.id}
                  </td>
                  <td className="px-4 py-3.5 text-sm text-slate-800 font-medium max-w-48 truncate">
                    {risk.asset}
                  </td>
                  <td className="px-4 py-3.5 text-sm text-slate-600 max-w-64 truncate">
                    {risk.threat}
                  </td>
                  <td className="px-4 py-3.5 text-sm text-slate-700 text-center font-medium">
                    {risk.likelihood}
                  </td>
                  <td className="px-4 py-3.5 text-sm text-slate-700 text-center font-medium">
                    {risk.impact}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-sm font-bold text-slate-700">
                      {risk.score}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    {getLevelBadge(risk.level)}
                  </td>
                  <td className="px-4 py-3.5 text-sm text-slate-600 max-w-56">
                    <span className="text-xs">
                      {MITIGATION_HINTS[risk.level]}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer with count */}
      {sortedRisks.length > 0 && (
        <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 text-sm text-slate-600">
          Showing {sortedRisks.length} of {risks.length} risks
        </div>
      )}
    </Card>
  );
};

export default RiskTable;
