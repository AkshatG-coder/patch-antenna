import React from 'react';
import { Card } from '@/components/ui/Card';
import { CalculationResults, Shape } from '@/lib/calculators/coaxial/types';
import { AntennaVisualizer } from './AntennaVisualizer';

// Component to render a single result item
const ResultItem: React.FC<{ label: string; value: string | number; unit?: string; }> = ({ label, value, unit }) => (
  <div className="bg-purple-50 p-3 rounded-lg">
    <span className="font-semibold text-purple-800">{label}:</span> {value} {unit}
  </div>
);

interface ResultsDisplayProps {
  results: CalculationResults | null;
  shape: Shape;
  isCalculating: boolean;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, shape, isCalculating }) => {
  if (isCalculating) {
    return (
      <Card className="flex items-center justify-center min-h-[500px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Performing calculations...</p>
        </div>
      </Card>
    );
  }

  if (!results) {
    return (
      <Card className="flex items-center justify-center min-h-[500px]">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">No results yet</h3>
          <p className="mt-1 text-sm text-gray-500">Enter parameters and click Calculate.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Results</h2>
      <div className="space-y-6 animate-fade-in">
        <AntennaVisualizer shape={shape} results={results} />
        
        <div>
          <h3 className="text-lg font-semibold text-indigo-700 mb-3">Physical Dimensions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
            {results.width && (
              <div className="bg-indigo-50 p-4 rounded-lg">
                <p className="text-sm text-indigo-800">Width (W)</p>
                <p className="text-2xl font-bold text-indigo-900">{results.width.toFixed(3)} <span className="text-lg">mm</span></p>
              </div>
            )}
            {results.length && (
               <div className="bg-indigo-50 p-4 rounded-lg">
                <p className="text-sm text-indigo-800">Length (L)</p>
                <p className="text-2xl font-bold text-indigo-900">{results.length.toFixed(3)} <span className="text-lg">mm</span></p>
              </div>
            )}
            {results.radius && (
               <div className="bg-indigo-50 p-4 rounded-lg sm:col-span-2">
                <p className="text-sm text-indigo-800">Radius (a)</p>
                <p className="text-2xl font-bold text-indigo-900">{results.radius.toFixed(3)} <span className="text-lg">mm</span></p>
              </div>
            )}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-purple-700 mb-3">Advanced Parameters</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
            {results.effLength && <ResultItem label="Eff. Length" value={results.effLength.toFixed(3)} unit="cm" />}
            {results.effRadius && <ResultItem label="Eff. Radius" value={results.effRadius.toFixed(3)} unit="cm" />}
            {results.Rin0 !== 'N/A' && <ResultItem label="Edge Input Z" value={results.Rin0} unit="Ω" />}
            {results.y0 !== 'N/A' && <ResultItem label="50Ω Feed Inset" value={results.y0} unit="mm" />}
            {results.directivity !== 'N/A' && <ResultItem label="Directivity" value={results.directivity} unit="dBi" />}
            {results.G1 !== 'N/A' && <ResultItem label="G1" value={results.G1} unit="S" />}
            {results.G12 !== 'N/A' && <ResultItem label="G12" value={results.G12} unit="S" />}
          </div>
        </div>
      </div>
      <style jsx>{`.animate-fade-in { animation: fadeIn 0.5s ease-in-out; } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
    </Card>
  );
};