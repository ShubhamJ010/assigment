import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/common';
import { RiskForm } from '../components/risk';
import { useRisks } from '../hooks/useRisks';

const AddRiskPage: React.FC = () => {
  const { addRisk } = useRisks();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Link to="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
          Add New Risk Assessment
        </h1>
        <p className="text-slate-500 mt-2">
          Identify and assess a new risk by providing asset details, threat description,
          and evaluating its likelihood and potential impact.
        </p>
      </div>

      {/* Risk Form */}
      <RiskForm onSubmit={addRisk} />

      {/* Help Section */}
      <div className="max-w-2xl mx-auto bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-sm font-semibold text-blue-800 mb-3">
          Rating Guidelines
        </h3>
        <div className="grid sm:grid-cols-2 gap-4 text-sm text-blue-700">
          <div>
            <p className="font-medium mb-2">Likelihood Scale:</p>
            <ul className="space-y-1 text-blue-600">
              <li><span className="font-medium">1 - Very Low:</span> Rare occurrence</li>
              <li><span className="font-medium">2 - Low:</span> Unlikely</li>
              <li><span className="font-medium">3 - Medium:</span> Possible</li>
              <li><span className="font-medium">4 - High:</span> Likely</li>
              <li><span className="font-medium">5 - Very High:</span> Almost certain</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-2">Impact Scale:</p>
            <ul className="space-y-1 text-blue-600">
              <li><span className="font-medium">1 - Negligible:</span> Minimal effect</li>
              <li><span className="font-medium">2 - Minor:</span> Limited impact</li>
              <li><span className="font-medium">3 - Moderate:</span> Noticeable disruption</li>
              <li><span className="font-medium">4 - Major:</span> Significant damage</li>
              <li><span className="font-medium">5 - Severe:</span> Critical failure</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddRiskPage;
