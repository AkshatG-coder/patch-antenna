import React from 'react';
import { CalculationResults, Shape } from '@/lib/calculators/inset/types';

interface AntennaVisualizerProps {
  shape: Shape;
  results: CalculationResults;
}

export const AntennaVisualizer: React.FC<AntennaVisualizerProps> = ({ shape, results }) => {
  const { length, width, radius } = results;
  const hasRectResults = shape === 'rectangle' && width && length;
  const hasCircResults = shape === 'circle' && radius;

  if (!hasRectResults && !hasCircResults) return null;

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-3">Antenna Diagram</h3>
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex justify-center items-center h-64">
        <svg viewBox="0 0 200 150" className="h-full w-full">
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#4f46e5" />
            </marker>
          </defs>
          <rect x="20" y="20" width="160" height="110" fill="#e0e7ff" stroke="#c7d2fe" rx="5" />
          {hasRectResults && (
            <>
              <rect x="50" y="35" width="100" height="80" fill="#6366f1" />
              <line x1="50" y1="25" x2="150" y2="25" stroke="#4f46e5" strokeWidth="1" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
              <text x="100" y="18" textAnchor="middle" fontSize="10" fill="#312e81" className="font-sans font-semibold">W: {width.toFixed(2)} mm</text>
              <line x1="40" y1="35" x2="40" y2="115" stroke="#4f46e5" strokeWidth="1" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
              <text x="35" y="75" textAnchor="end" dominantBaseline="middle" fontSize="10" fill="#312e81" className="font-sans font-semibold">L: {length.toFixed(2)} mm</text>
            </>
          )}
          {hasCircResults && (
            <>
              <circle cx="100" cy="75" r="50" fill="#6366f1" />
              <line x1="100" y1="75" x2="150" y2="75" stroke="#4f46e5" strokeWidth="1" markerEnd="url(#arrow)" />
              <text x="125" y="70" textAnchor="middle" fontSize="10" fill="#312e81" className="font-sans font-semibold">a: {radius.toFixed(2)} mm</text>
            </>
          )}
        </svg>
      </div>
    </div>
  );
};