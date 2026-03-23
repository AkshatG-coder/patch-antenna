// Defines the possible shapes for the antenna
export type Shape = 'rectangle' | 'circle';

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
  radius: number | null;
  effLength: number | null;
  effRadius: number | null;
  Rin0: string | number;
  y0: string | number;
  G1: string | number;
  G12: string | number;
  directivity: string | number;
}