// src/components/AntennaVisualizer.tsx

import React from 'react';
import { CalculationResults, Shape } from '@/lib/calculators/quarter-wave/types';

interface AntennaVisualizerProps {
  shape: Shape;
  results: CalculationResults;
}

export const AntennaVisualizer: React.FC<AntennaVisualizerProps> = ({ shape, results }) => {
  // Destructure all relevant results, including transformerLength which will be used for the feed line
  const { length, width, transformerLength } = results;

  // We are only handling a rectangle shape with width and length for the patch itself.
  const isValidVisualization = shape === 'rectangle' && width && length;

  if (!isValidVisualization) {
    return null; // Return null if the required data for the main patch isn't present
  }

  // Define SVG coordinates for the rectangular patch
  const rectX = 50;
  const rectY = 35;
  const rectWidth = 100;
  const rectHeight = 80;

  // Define SVG coordinates for the FIXED-LENGTH HORIZONTAL FEED LINE
  // We want it connected to the right side of the patch, extending horizontally.
  const feedLineXStart = rectX + rectWidth; // Right edge of the patch
  const feedLineY = rectY + rectHeight / 2; // Vertical center of the patch
  const fixedFeedLineVisualLength = 30; // A fixed visual length for the feed line in SVG units
  const feedLineXEnd = feedLineXStart + fixedFeedLineVisualLength;

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-3">Antenna Diagram</h3>
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex justify-center items-center h-64">
        <svg viewBox="0 0 200 150" className="h-full w-full">
          <defs>
            {/* Arrow marker definition for dimension lines - only one defs block is needed */}
            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#4f46e5" />
            </marker>
          </defs>

          {/* Background plate for context/ground plane */}
          <rect x="20" y="20" width="160" height="110" fill="#e0e7ff" stroke="#c7d2fe" rx="5" />
          
          {/* The main rectangular patch antenna element */}
          <rect 
            x={rectX} 
            y={rectY} 
            width={rectWidth} 
            height={rectHeight} 
            fill="#6366f1" 
          />
          
          {/* Fixed-length horizontal feed line connected to the right of the rectangle */}
          <line 
            x1={feedLineXStart} 
            y1={feedLineY} 
            x2={feedLineXEnd} 
            y2={feedLineY} 
            stroke="#6366f1" 
            strokeWidth="2" 
            strokeLinecap="round" 
          />

          {/* Dimension line for Width (W) */}
          <line x1={rectX} y1={rectY - 10} x2={rectX + rectWidth} y2={rectY - 10} stroke="#4f46e5" strokeWidth="1" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
          <text x={rectX + rectWidth / 2} y={rectY - 17} textAnchor="middle" fontSize="10" fill="#312e81" className="font-sans font-semibold">W: {width!.toFixed(2)} mm</text>
          
          {/* Dimension line for Length (L) */}
          <line x1={rectX - 10} y1={rectY} x2={rectX - 10} y2={rectY + rectHeight} stroke="#4f46e5" strokeWidth="1" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
          <text x={rectX - 15} y={rectY + rectHeight / 2} textAnchor="end" dominantBaseline="middle" fontSize="10" fill="#312e81" className="font-sans font-semibold">L: {length!.toFixed(2)} mm</text>

          {/* Dimension line and Text for the Transformer Length (Feed Line) */}
          {/* Show only if transformerLength is a number (not null or 'N/A') */}
          {typeof transformerLength === 'number' && transformerLength !== null && (
            <>
              {/* Dimension line for the feed line */}
              <line 
                x1={feedLineXStart+2} // Start 10 units to the left of the feed line start
                y1={feedLineY - 10} // Position above the feed line
                x2={feedLineXEnd-2} 
                y2={feedLineY - 10} // Position above the feed line
                stroke="#4f46e5" 
                strokeWidth="1" 
                markerStart="url(#arrow)" 
                markerEnd="url(#arrow)" 
              />
              <text 
                x={feedLineXStart + fixedFeedLineVisualLength / 2} // Centered above the feed line
                y={feedLineY - 17} // Slightly above the dimension line
                textAnchor="middle" 
                fontSize="6" 
                fill="#312e81" 
                className="font-sans font-semibold"
              >
                 {transformerLength.toFixed(2)} mm {/* Display the actual calculated length */}
              </text>
            </>
          )}
        </svg>
      </div>
    </div>
  );
};