import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Download, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '../components/common';
import { RiskStats, RiskTable, RiskHeatmap } from '../components/risk';
import { useRisks } from '../hooks/useRisks';
import { exportToCSV, generateCsvFilename } from '../utils/csvExporter';

const HomePage: React.FC = () => {
  const { risks, loading, error, refreshRisks } = useRisks();

  const handleExportCSV = () => {
    if (risks.length === 0) {
      alert('No risks to export. Add some risks first!');
      return;
    }
    exportToCSV(risks, generateCsvFilename());
  };

  const handleRefresh = () => {
    refreshRisks();
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
            Risk Dashboard
          </h1>
          <p className="text-slate-500 mt-1">
            Monitor and manage your organizational risk assessments
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
            leftIcon={<RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />}
          >
            Refresh
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportCSV}
            disabled={risks.length === 0}
            leftIcon={<Download className="w-4 h-4" />}
          >
            Export CSV
          </Button>
          <Link to="/add-risk">
            <Button
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add Risk
            </Button>
          </Link>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg animate-fade-in">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-red-800 font-medium">Error loading risks</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="border-red-300 text-red-700 hover:bg-red-100"
          >
            Retry
          </Button>
        </div>
      )}

      {/* Stats Section */}
      <section>
        <h2 className="text-lg font-semibold text-slate-700 mb-4">Overview</h2>
        <RiskStats risks={risks} loading={loading} />
      </section>

      {/* Heatmap Section */}
      <section>
        <h2 className="text-lg font-semibold text-slate-700 mb-4">Risk Distribution</h2>
        <div className="max-w-lg mx-auto lg:mx-0">
          <RiskHeatmap risks={risks} loading={loading} />
        </div>
      </section>

      {/* Table Section */}
      <section>
        <h2 className="text-lg font-semibold text-slate-700 mb-4">Risk Register</h2>
        <RiskTable risks={risks} loading={loading} />
      </section>
    </div>
  );
};

export default HomePage;
