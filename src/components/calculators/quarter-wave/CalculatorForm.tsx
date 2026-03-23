import React from 'react';
import { Card } from '@/components/ui/Card';
import { InputField } from '@/components/ui/InputField';
import { CalculatorInputs, Shape } from '@/lib/calculators/coaxial/types';

interface CalculatorFormProps {
  inputs: CalculatorInputs;
  setInputs: React.Dispatch<React.SetStateAction<CalculatorInputs>>;
  handleCalculate: () => void;
  handleReset: () => void;
  isCalculating: boolean;
  error: string;
}

export const CalculatorForm: React.FC<CalculatorFormProps> = ({
  inputs, setInputs, handleCalculate, handleReset, isCalculating, error
}) => {
  const handleInputChange = (field: keyof CalculatorInputs, value: string | number) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };
  
  const handleShapeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleReset();
    setInputs(prev => ({...prev, shape: e.target.value as Shape}));
  };

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Configuration</h2>
        <label className="block text-sm font-medium text-gray-600 mb-1">Antenna Shape</label>
        <select
          className="p-2 border border-gray-300 w-full rounded-md focus:ring-2 focus:ring-indigo-500"
          value={inputs.shape}
          onChange={handleShapeChange}
        >
          <option value="rectangle">Rectangle</option>
          <option value="circle">Circle</option>
        </select>
      </Card>
      
      <Card>
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Parameters</h2>
        <div className="space-y-4">
          <InputField
            label="Resonant Frequency"
            type="number"
            value={inputs.frequency}
            onChange={(e) => handleInputChange('frequency', parseFloat(e.target.value))}
            unit={inputs.freqUnit}
            unitOptions={["GHz", "MHz", "KHz"]}
            onUnitChange={(e) => handleInputChange('freqUnit', e.target.value)}
            min="0.1" step="0.1"
          />
          <InputField
            label="Substrate Height (h)"
            type="number"
            value={inputs.height}
            onChange={(e) => handleInputChange('height', parseFloat(e.target.value))}
            unit={inputs.heightUnit}
            unitOptions={["mm", "inch"]}
            onUnitChange={(e) => handleInputChange('heightUnit', e.target.value)}
            min="0.1" step="0.1"
          />
          <InputField
            label="Dielectric Constant (εr)"
            type="number"
            value={inputs.epsilonR}
            onChange={(e) => handleInputChange('epsilonR', parseFloat(e.target.value))}
            min="1.01" step="0.1"
          />
        </div>
      </Card>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <button onClick={handleCalculate} disabled={isCalculating} className="w-full bg-indigo-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105">
          {isCalculating ? "Calculating..." : "Calculate"}
        </button>
        <button onClick={handleReset} className="w-full sm:w-auto bg-gray-200 text-gray-800 px-6 py-3 rounded-md font-semibold hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition">
          Reset
        </button>
      </div>
    </div>
  );
};