import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  unit?: string;
  unitOptions?: string[];
  onUnitChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const InputField: React.FC<InputFieldProps> = ({ label, unit, unitOptions, onUnitChange, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
    <div className="flex items-center">
      <input
        {...props}
        className="p-2 border border-gray-300 rounded-l-md w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
      />
      {unit && unitOptions && onUnitChange && (
        <select
          value={unit}
          onChange={onUnitChange}
          className="p-2 border-t border-b border-r border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100 focus:outline-none"
        >
          {unitOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      )}
    </div>
  </div>
);