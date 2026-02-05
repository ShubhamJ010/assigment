import { useState, useEffect, useCallback } from 'react';
import type { Risk, RiskFormData, RiskLevel } from '../types/risk';
import { getRisks, createRisk } from '../api/riskApi';

interface UseRisksReturn {
  risks: Risk[];
  loading: boolean;
  error: string | null;
  fetchRisks: (level?: RiskLevel) => Promise<void>;
  addRisk: (riskData: RiskFormData) => Promise<Risk | null>;
  refreshRisks: () => Promise<void>;
}

export const useRisks = (): UseRisksReturn => {
  const [risks, setRisks] = useState<Risk[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRisks = useCallback(async (level?: RiskLevel) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRisks(level);
      setRisks(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch risks';
      setError(message);
      setRisks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const addRisk = useCallback(async (riskData: RiskFormData): Promise<Risk | null> => {
    setError(null);
    try {
      const newRisk = await createRisk(riskData);
      // Optimistically add to local state
      setRisks((prev) => [...prev, newRisk]);
      return newRisk;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create risk';
      setError(message);
      return null;
    }
  }, []);

  const refreshRisks = useCallback(async () => {
    await fetchRisks();
  }, [fetchRisks]);

  // Initial fetch on mount
  useEffect(() => {
    fetchRisks();
  }, [fetchRisks]);

  return {
    risks,
    loading,
    error,
    fetchRisks,
    addRisk,
    refreshRisks,
  };
};

export default useRisks;
