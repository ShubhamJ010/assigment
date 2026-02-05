import { useState, useCallback, useMemo } from 'react';
import type { RiskFormData } from '../types/risk';
import { calculateRisk } from '../utils/riskCalculator';

interface UseRiskFormReturn {
  formData: RiskFormData;
  preview: { score: number; level: string };
  errors: Record<string, string>;
  isValid: boolean;
  handleChange: (field: keyof RiskFormData, value: string | number) => void;
  handleSubmit: (onSubmit: (data: RiskFormData) => Promise<void>) => Promise<boolean>;
  resetForm: () => void;
}

const initialFormData: RiskFormData = {
  asset: '',
  threat: '',
  likelihood: 3,
  impact: 3,
};

export const useRiskForm = (): UseRiskFormReturn => {
  const [formData, setFormData] = useState<RiskFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Calculate preview based on current form values
  const preview = useMemo(() => {
    return calculateRisk(formData.likelihood, formData.impact);
  }, [formData.likelihood, formData.impact]);

  // Validate form
  const validate = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.asset.trim()) {
      newErrors.asset = 'Asset name is required';
    } else if (formData.asset.length < 2) {
      newErrors.asset = 'Asset name must be at least 2 characters';
    }

    if (!formData.threat.trim()) {
      newErrors.threat = 'Threat description is required';
    } else if (formData.threat.length < 5) {
      newErrors.threat = 'Threat description must be at least 5 characters';
    }

    if (formData.likelihood < 1 || formData.likelihood > 5) {
      newErrors.likelihood = 'Likelihood must be between 1 and 5';
    }

    if (formData.impact < 1 || formData.impact > 5) {
      newErrors.impact = 'Impact must be between 1 and 5';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const isValid = useMemo(() => {
    return (
      formData.asset.trim().length >= 2 &&
      formData.threat.trim().length >= 5 &&
      formData.likelihood >= 1 &&
      formData.likelihood <= 5 &&
      formData.impact >= 1 &&
      formData.impact <= 5
    );
  }, [formData]);

  const handleChange = useCallback((field: keyof RiskFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    setErrors((prev) => {
      const { [field]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  const handleSubmit = useCallback(
    async (onSubmit: (data: RiskFormData) => Promise<void>): Promise<boolean> => {
      if (!validate()) {
        return false;
      }

      try {
        await onSubmit(formData);
        return true;
      } catch {
        return false;
      }
    },
    [formData, validate]
  );

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setErrors({});
  }, []);

  return {
    formData,
    preview,
    errors,
    isValid,
    handleChange,
    handleSubmit,
    resetForm,
  };
};

export default useRiskForm;
