"use client";

import React, { useState } from 'react';
import { CalculatorForm } from './CalculatorForm';
import { ResultsDisplay } from './ResultsDisplay';
import { CalculatorInputs, CalculationResults } from '@/lib/calculators/quarter-wave/types';
import { performCalculation } from '@/lib/calculators/quarter-wave/calculations';

const INITIAL_INPUTS: CalculatorInputs = {
  shape: 'rectangle',
  frequency: 2.4,
  freqUnit: 'GHz',
  height: 1.6,
  heightUnit: 'mm',
  epsilonR: 4.4,
};

export const QuarterFeedCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<CalculatorInputs>(INITIAL_INPUTS);
  const [results, setResults] = useState<CalculationResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState('');

  const handleReset = () => {
    setInputs(INITIAL_INPUTS);
    setResults(null);
    setError('');
  };

  const handleCalculate = () => {
    if (inputs.frequency <= 0 || inputs.height <= 0 || inputs.epsilonR <= 1) {
      setError("Please ensure all input values are positive and εr > 1.");
      return;
    }
    setError('');
    setIsCalculating(true);
    setResults(null);

    // Use a timeout to simulate a calculation delay and show loading state
    setTimeout(() => {
      try {
        const calculatedResults = performCalculation(inputs);
        setResults(calculatedResults);
      } catch (err) {
        console.error("Calculation error:", err);
        setError("An unexpected error occurred. Please check input values.");
      } finally {
        setIsCalculating(false);
      }
    }, 500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      <div className="lg:col-span-2">
        <CalculatorForm
          inputs={inputs}
          setInputs={setInputs}
          handleCalculate={handleCalculate}
          handleReset={handleReset}
          isCalculating={isCalculating}
          error={error}
        />
      </div>
      <div className="lg:col-span-3">
        <ResultsDisplay
          results={results}
          shape={inputs.shape}
          isCalculating={isCalculating}
        />
      </div>
    </div>
  );
};