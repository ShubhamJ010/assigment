import type { Risk } from '../types/risk';

/**
 * Export risks data to a CSV file and trigger download
 */
export const exportToCSV = (risks: Risk[], filename: string = 'risk-assessment-report.csv'): void => {
  if (risks.length === 0) {
    console.warn('No risks to export');
    return;
  }

  // Define CSV headers
  const headers = ['ID', 'Asset', 'Threat', 'Likelihood', 'Impact', 'Score', 'Level'];

  // Convert risks to CSV rows
  const rows = risks.map((risk) => {
    // Escape values that might contain commas or quotes
    const escapeCsvValue = (value: string | number): string => {
      const stringValue = String(value);
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    };

    return [
      risk.id,
      escapeCsvValue(risk.asset),
      escapeCsvValue(risk.threat),
      risk.likelihood,
      risk.impact,
      risk.score,
      risk.level,
    ].join(',');
  });

  // Combine headers and rows
  const csvContent = [headers.join(','), ...rows].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  
  // Create temporary link and trigger download
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  
  // Cleanup
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * Generate a timestamped filename for CSV export
 */
export const generateCsvFilename = (): string => {
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-');
  return `risk-assessment-${dateStr}_${timeStr}.csv`;
};
