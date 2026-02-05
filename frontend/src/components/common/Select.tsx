import React from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'value' | 'onChange'> {
  label?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
}

const Select: React.FC<SelectProps> = ({
  label,
  options,
  value,
  onChange,
  error,
  placeholder,
  id,
  className = '',
  ...props
}) => {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-slate-700 mb-1.5"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`
            w-full px-4 py-2.5 pr-10 rounded-lg border appearance-none
            text-slate-800 bg-white cursor-pointer
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            ${error 
              ? 'border-red-400 focus:ring-red-500' 
              : 'border-slate-300 hover:border-slate-400'
            }
            ${className}
          `}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <ChevronDown className="w-5 h-5 text-slate-400" />
        </div>
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Select;
