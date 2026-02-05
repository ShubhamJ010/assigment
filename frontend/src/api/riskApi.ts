import axios, { AxiosError } from 'axios';
import type { Risk, RiskFormData, RiskLevel } from '../types/risk';
import { API_BASE_URL } from '../utils/constants';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Error handler helper
const handleApiError = (error: unknown): never => {
  if (error instanceof AxiosError) {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.detail || error.response.data?.message || 'Server error occurred';
      throw new Error(message);
    } else if (error.request) {
      // Request made but no response
      throw new Error('Connection failed. Please check if the server is running.');
    }
  }
  throw new Error('An unexpected error occurred');
};

/**
 * Fetch all risks, optionally filtered by level
 */
export const getRisks = async (level?: RiskLevel): Promise<Risk[]> => {
  try {
    const params = level ? { level } : {};
    const response = await apiClient.get<Risk[]>('/risks', { params });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * Create a new risk assessment
 */
export const createRisk = async (riskData: RiskFormData): Promise<Risk> => {
  try {
    const response = await apiClient.post<Risk>('/assess-risk', riskData);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Export the API object for convenience
export const riskApi = {
  getRisks,
  createRisk,
};

export default riskApi;
