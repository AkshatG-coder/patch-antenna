import { FrequencyUnit, DimensionUnit } from './types';

/**
 * Converts a frequency value to Hertz (Hz).
 * @param freq The frequency value.
 * @param unit The unit of the frequency ('GHz', 'MHz', 'KHz').
 * @returns The frequency in Hertz.
 */
export const convertFrequencyToHz = (freq: number, unit: FrequencyUnit): number => {
  const multipliers = { "GHz": 1e9, "MHz": 1e6, "KHz": 1e3 };
  return freq * multipliers[unit];
};

/**
 * Converts a height value to meters (m).
 * @param h The height value.
 * @param unit The unit of the height ('mm', 'inch').
 * @returns The height in meters.
 */
export const convertHeightToMeters = (h: number, unit: DimensionUnit): number => {
  const heightInMm = unit === "inch" ? h * 25.4 : h;
  return heightInMm / 1000;
};