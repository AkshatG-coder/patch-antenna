/**
 * Calculates the Bessel function of the first kind, order zero (J0).
 * Uses a Taylor series expansion for approximation.
 * @param x The input value for the Bessel function.
 * @returns The approximated value of J0(x).
 */
export const besselJ0 = (x: number): number => {
  let sum = 0;
  let term = 1;
  // Iterate 20 times for a good balance of accuracy and performance
  for (let i = 0; i < 20; i++) {
    sum += term;
    // Calculate the next term in the series
    term *= -1 * x * x / (4 * (i + 1) * (i + 1));
  }
  return sum;
};