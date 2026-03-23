import React from 'react';
// Make sure the Shape type includes 'triangle'
// e.g., export type Shape = 'rectangle' | 'circle' | 'triangle';
import { CalculationResults, Shape } from '@/lib/calculators/coaxial/types';

interface AntennaVisualizerProps {
  shape: Shape;
  results: CalculationResults;
}

export const AntennaVisualizer: React.FC<AntennaVisualizerProps> = ({ shape, results }) => {
  const { length, width, radius ,triangleLength} = results;
  const hasRectResults = shape === 'rectangle' && width && length;
  const hasCircResults = shape === 'circle' && radius;
  // 1. Add a condition to check for valid triangular antenna results
  const hasTriResults = shape === 'triangle' && triangleLength;

  // 2. Update the guard clause to prevent rendering an empty diagram
  if (!hasRectResults && !hasCircResults && !hasTriResults) return null;

  // --- SVG coordinates for the equilateral triangle ---
  // We calculate the points to draw a centered equilateral triangle.
  const svgSide = 100;
  const svgHeight = svgSide * (Math.sqrt(3) / 2);
  const centerX = 100;
  const centerY = 75;
  const triPoints = [
    `${centerX},${centerY - svgHeight / 2}`, // Top vertex
    `${centerX - svgSide / 2},${centerY + svgHeight / 2}`, // Bottom-left vertex
    `${centerX + svgSide / 2},${centerY + svgHeight / 2}` // Bottom-right vertex
  ].join(' ');
  // --- End of triangle coordinates ---

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
          {/* Substrate */}
          <rect x="20" y="20" width="160" height="110" fill="#e0e7ff" stroke="#c7d2fe" rx="5" />
          
          {/* Rectangle Visualization */}
          {hasRectResults && (
            <>
              <rect x="50" y="35" width="100" height="80" fill="#6366f1" />
              <line x1="50" y1="25" x2="150" y2="25" stroke="#4f46e5" strokeWidth="1" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
              <text x="100" y="18" textAnchor="middle" fontSize="10" fill="#312e81" className="font-sans font-semibold">W: {width.toFixed(2)} mm</text>
              <line x1="40" y1="35" x2="40" y2="115" stroke="#4f46e5" strokeWidth="1" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
              <text x="35" y="75" textAnchor="end" dominantBaseline="middle" fontSize="10" fill="#312e81" className="font-sans font-semibold">L: {length.toFixed(2)} mm</text>
            </>
          )}

          {/* Circle Visualization */}
          {hasCircResults && (
            <>
              <circle cx="100" cy="75" r="50" fill="#6366f1" />
              <line x1="100" y1="75" x2="150" y2="75" stroke="#4f46e5" strokeWidth="1" markerEnd="url(#arrow)" />
              <text x="125" y="70" textAnchor="middle" fontSize="10" fill="#312e81" className="font-sans font-semibold">a: {radius.toFixed(2)} mm</text>
            </>
          )}
          
          {/* 3. Add the SVG visualization for the triangle */}
          {hasTriResults && (
            <>
              {/* Equilateral triangle patch */}
              <polygon points={triPoints} fill="#6366f1" />
              {/* Dimension line for side 'a' */}
              <line 
                x1={centerX - svgSide / 2} y1={centerY + svgHeight / 2 + 10} 
                x2={centerX + svgSide / 2} y2={centerY + svgHeight / 2 + 10} 
                stroke="#4f46e5" strokeWidth="1" markerStart="url(#arrow)" markerEnd="url(#arrow)" 
              />
              {/* Text label for side 'a' */}
              <text 
                x={centerX} y={centerY + svgHeight / 2 + 20} 
                textAnchor="middle" fontSize="10" fill="#312e81" className="font-sans font-semibold"
              >
                a: {triangleLength.toFixed(2)} mm
              </text>
            </>
          )}
        </svg>
      </div>
    </div>
  );
};