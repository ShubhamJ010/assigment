import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, Input, Slider, Button } from '../common';
import { useRiskForm } from '../../hooks/useRiskForm';
import type { RiskFormData, RiskLevel } from '../../types/risk';
import { LIKELIHOOD_LABELS, IMPACT_LABELS } from '../../utils/constants';

interface RiskFormProps {
  onSubmit: (data: RiskFormData) => Promise<{ id: number } | null>;
}

const RiskForm: React.FC<RiskFormProps> = ({ onSubmit }) => {
  const navigate = useNavigate();
  const { formData, preview, errors, isValid, handleChange, resetForm } = useRiskForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const getLevelStyles = (level: RiskLevel | string) => {
    const styles: Record<string, string> = {
      Low: 'bg-green-100 text-green-800 border-green-300',
      Medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      High: 'bg-orange-100 text-orange-800 border-orange-300',
      Critical: 'bg-red-100 text-red-800 border-red-300',
    };
    return styles[level] || 'bg-slate-100 text-slate-800';
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValid) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const result = await onSubmit(formData);
      if (result) {
        setSubmitStatus('success');
        setSubmitMessage('Risk assessment created successfully!');
        resetForm();
        // Redirect after short delay
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        setSubmitStatus('error');
        setSubmitMessage('Failed to create risk. Please try again.');
      }
    } catch (err) {
      setSubmitStatus('error');
      setSubmitMessage(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <form onSubmit={handleFormSubmit} className="space-y-6">
        {/* Status Messages */}
        {submitStatus === 'success' && (
          <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg animate-fade-in">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <p className="text-green-800">{submitMessage}</p>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg animate-fade-in">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-800">{submitMessage}</p>
          </div>
        )}

        {/* Asset Input */}
        <Input
          label="Asset Name"
          placeholder="e.g., Customer Database, Payment Gateway, Email Server"
          value={formData.asset}
          onChange={(e) => handleChange('asset', e.target.value)}
          error={errors.asset}
          required
        />

        {/* Threat Input */}
        <Input
          label="Threat Description"
          placeholder="e.g., SQL Injection Attack, Unauthorized Access, Data Breach"
          value={formData.threat}
          onChange={(e) => handleChange('threat', e.target.value)}
          error={errors.threat}
          required
        />

        {/* Likelihood Slider */}
        <Slider
          label="Likelihood"
          value={formData.likelihood}
          onChange={(value) => handleChange('likelihood', value)}
          min={1}
          max={5}
          valueLabels={LIKELIHOOD_LABELS}
          error={errors.likelihood}
        />

        {/* Impact Slider */}
        <Slider
          label="Impact"
          value={formData.impact}
          onChange={(value) => handleChange('impact', value)}
          min={1}
          max={5}
          valueLabels={IMPACT_LABELS}
          error={errors.impact}
        />

        {/* Live Preview */}
        <div className={`p-4 rounded-lg border-2 ${getLevelStyles(preview.level)} transition-all duration-300`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-80">Risk Preview</p>
              <p className="text-2xl font-bold mt-1">Score: {preview.score}</p>
            </div>
            <div className="text-right">
              <span className={`inline-block px-4 py-2 rounded-lg font-bold text-lg ${getLevelStyles(preview.level)}`}>
                {preview.level}
              </span>
            </div>
          </div>
          <div className="mt-3 text-sm opacity-80">
            <p>Calculation: {formData.likelihood} (Likelihood) × {formData.impact} (Impact) = {preview.score}</p>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          isLoading={isSubmitting}
          disabled={!isValid}
          className="w-full"
          size="lg"
          leftIcon={<Send className="w-5 h-5" />}
        >
          Submit Risk Assessment
        </Button>
      </form>
    </Card>
  );
};

export default RiskForm;
