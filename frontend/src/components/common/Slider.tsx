import React from 'react';

interface SliderProps {
  label?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  showValue?: boolean;
  valueLabels?: string[];
  error?: string;
  className?: string;
}

const Slider: React.FC<SliderProps> = ({
  label,
  value,
  onChange,
  min = 1,
  max = 5,
  step = 1,
  showValue = true,
  valueLabels,
  error,
  className = '',
}) => {
  const percentage = ((value - min) / (max - min)) * 100;

  // Get color based on value
  const getTrackColor = () => {
    if (value <= 2) return '#22c55e'; // Green
    if (value === 3) return '#eab308'; // Yellow
    if (value === 4) return '#f97316'; // Orange
    return '#ef4444'; // Red
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-slate-700">{label}</label>
          {showValue && (
            <span
              className="text-sm font-semibold px-2.5 py-0.5 rounded-full"
              style={{
                backgroundColor: `${getTrackColor()}20`,
                color: getTrackColor(),
              }}
            >
              {valueLabels?.[value - 1] || value}
            </span>
          )}
        </div>
      )}
      <div className="relative">
        <input
          type="range"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          min={min}
          max={max}
          step={step}
          className="w-full h-2 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, ${getTrackColor()} 0%, ${getTrackColor()} ${percentage}%, #e2e8f0 ${percentage}%, #e2e8f0 100%)`,
          }}
        />
        {/* Step markers */}
        <div className="flex justify-between mt-1 px-0.5">
          {Array.from({ length: max - min + 1 }, (_, i) => (
            <span
              key={i + min}
              className={`text-xs ${
                value === i + min ? 'text-slate-700 font-semibold' : 'text-slate-400'
              }`}
            >
              {i + min}
            </span>
          ))}
        </div>
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Slider;
