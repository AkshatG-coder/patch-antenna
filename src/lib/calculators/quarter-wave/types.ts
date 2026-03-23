// src/lib/calculators/quarter-wave/types.ts

// Defines the possible shapes for the antenna
export type Shape = 'rectangle' | 'circle'; // Keep 'rectangle' as the shape for your current visualization

// Defines the possible units for frequency
export type FrequencyUnit = 'GHz' | 'MHz' | 'KHz';

// Defines the possible units for physical dimensions
export type DimensionUnit = 'mm' | 'inch';

// Interface for the user's input values
export interface CalculatorInputs {
  shape: Shape;
  frequency: number;
  freqUnit: FrequencyUnit;
  height: number;
  heightUnit: DimensionUnit;
  epsilonR: number;
}

// Interface for the results of the calculation
export interface CalculationResults {
  length: number | null;
  width: number | null;
  effLength: number | null;
  transformerImpedance: string | number;
  transformerWidth: number | null;
  transformerLength: number | null;
  Rin0: string | number;
  // --- ADD THIS LINE ---
  feedLength: number; // This will hold the calculated length for the feed line
}