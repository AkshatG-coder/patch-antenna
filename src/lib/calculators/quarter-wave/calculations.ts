import { convertFrequencyToHz, convertHeightToMeters } from './utlis';
import { CalculatorInputs, CalculationResults } from './types';
import { besselJ0 } from '@/lib/math'; // IMPORTANT: Ensure this path and function are correct

const SPEED_OF_LIGHT = 299792458; // m/s
const Z0 = 50; // Characteristic impedance of the feed line in ohms

/**
 * Performs numerical integration using Simpson's 1/3 rule.
 * @param f The function to integrate, takes a single number argument.
 * @param a The lower limit of integration.
 * @param b The upper limit of integration.
 * @param n The number of steps (must be an even number).
 * @returns The approximate value of the integral.
 */
function numericalIntegration(f: (x: number) => number, a: number, b: number, n: number): number {
    if (n % 2 !== 0) {
        n++; // Ensure n is even for Simpson's rule. Added this for robustness.
    }
    const h = (b - a) / n;
    let sum = f(a) + f(b); // First and last terms

    for (let i = 1; i < n; i += 2) {
        sum += 4 * f(a + i * h); // Odd terms (multiplied by 4)
    }

    for (let i = 2; i < n; i += 2) {
        sum += 2 * f(a + i * h); // Even terms (multiplied by 2)
    }

    return (h / 3) * sum;
}

/**
 * Calculates the dimensions and parameters for a quarter-wave fed
 * rectangular microstrip patch antenna.
 *
 * @param inputs The user-provided parameters for the antenna.
 * @returns The calculated dimensions and electrical properties of the antenna.
 */
export function performCalculation(inputs: CalculatorInputs): CalculationResults {
    const { frequency, freqUnit, height, heightUnit, epsilonR } = inputs;

    // Convert inputs to standard units (Hz and meters)
    const fr = convertFrequencyToHz(frequency, freqUnit);
    const h_m = convertHeightToMeters(height, heightUnit);

    // Basic parameters
    const lambda0 = SPEED_OF_LIGHT / fr;
    const k0 = 2 * Math.PI / lambda0; // Wave number in free space

    // --- Patch Dimension Calculations ---

    // 1. Calculate Patch Width (W) - Eq. (14-6) or similar widely used formula
    const W = (SPEED_OF_LIGHT / (2 * fr)) * Math.sqrt(2 / (epsilonR + 1));

    // 2. Calculate Effective Dielectric Constant for the patch (ε_eff) - Eq. (14-1)
    const effEpsilon = ((epsilonR + 1) / 2) + (((epsilonR - 1) / 2) * (1 / Math.sqrt(1 + 12 * h_m / W)));

    // 3. Calculate the extension of the length (ΔL) - Eq. (14-2)
    const deltaL_num = (effEpsilon + 0.3) * (W / h_m + 0.264);
    const deltaL_den = (effEpsilon - 0.258) * (W / h_m + 0.8);
    const deltaL = 0.412 * h_m * (deltaL_num / deltaL_den);

    // 4. Calculate effective and physical Patch Length (L) - Eq. (14-7)
    const effLength = SPEED_OF_LIGHT / (2 * fr * Math.sqrt(effEpsilon));
    const L = effLength - (2 * deltaL);

    // --- Radiation Conductance and Input Resistance Calculations ---

    // 5. Calculate Edge Conductance (G1) - Eq. (14-13) (Approximate for a single radiating slot)
    const G1 = (1 / 90) * Math.pow(W / lambda0, 2);

    // 6. Calculate Mutual Conductance (G12) - Based on Eq. (14-18a)
    // This is the integrand for the integral in G12.
    const integrandG12 = (theta: number): number => {
        // Handle limits to avoid division by zero or numerical instability at theta = 0, PI
        // The term sin(k0 * W / 2 * cos(theta)) / cos(theta) has a limit of (k0 * W / 2) as cos(theta) -> 0
        const cosTheta = Math.cos(theta);
        let term1;
        if (Math.abs(cosTheta) < 1e-9) { // Check if cos(theta) is very close to zero
            term1 = (k0 * W / 2);
        } else {
            term1 = Math.sin(k0 * W / 2 * cosTheta) / cosTheta;
        }

        const term2 = besselJ0(k0 * L * Math.sin(theta)); // Bessel function of the first kind, order zero
        const term3 = Math.pow(Math.sin(theta), 3); // sin^3(theta)

        // The overall integrand is zero at theta = 0 and theta = PI due to sin^3(theta)
        if (theta === 0 || theta === Math.PI) {
            return 0;
        }

        return Math.pow(term1, 2) * term2 * term3;
    };

    // Perform numerical integration from 0 to PI for G12 integral
    // Using 1000 steps for potentially better accuracy for the integral.
    const integralG12 = numericalIntegration(integrandG12, 0, Math.PI, 1000);

    // Final G12 calculation based on Eq. (14-18a)
    const G12 = (1 / (120 * Math.PI * Math.PI)) * integralG12;

    // 7. Calculate Edge Input Resistance (R_in) - Eq. (14-17)
    // This is the resistance at the edge of the patch.
    const Rin = 1 / (2 * (G1 + G12));


    // --- Quarter-Wave Transformer Calculations ---

    // 8. Calculate Quarter-Wave Transformer Impedance (Z1) - Eq. (5) in your original document
    const Z1 = Math.sqrt(Rin * Z0);

    // 9. Synthesize the transformer width (Wq) from its impedance Z1
    // This involves inverting the characteristic impedance formula for microstrip lines.
    // Formulas depend on whether W/h is narrow (W/h <= 2) or wide (W/h > 2).
    const A = (Z1 / 60) * Math.sqrt((epsilonR + 1) / 2) + ((epsilonR - 1) / (epsilonR + 1)) * (0.23 + 0.11 / epsilonR);
    const B = (377 * Math.PI) / (2 * Z1 * Math.sqrt(epsilonR));

    let W_over_h_q: number;
    if (A > 1.52) { // Corresponds to W/h < 2 (narrow line)
         W_over_h_q = (8 * Math.exp(A)) / (Math.exp(2 * A) - 2);
    } else { // Corresponds to W/h > 2 (wide line)
         W_over_h_q = (2 / Math.PI) * (B - 1 - Math.log(2 * B - 1) + ((epsilonR - 1) / (2 * epsilonR)) * (Math.log(B - 1) + 0.39 - 0.61 / epsilonR));
    }
    const Wq = W_over_h_q * h_m;

    // 10. Calculate the length of the transformer (Lq)
    // It is a quarter of the guided wavelength (λg) in the transformer line.
    const effEpsilon_q = ((epsilonR + 1) / 2) + (((epsilonR - 1) / 2) * (1 / Math.sqrt(1 + 12 * h_m / Wq)));
    const lambda_g_q = lambda0 / Math.sqrt(effEpsilon_q);
    const Lq = lambda_g_q / 4;


    // --- Return Results ---
    // Convert meters to millimeters for display, except where specified.
    return {
        length: L * 1000,
        width: W * 1000,
        effLength: effLength * 1000, // Note: The previous file returned (L + 2*deltaL)*100, assuming cm. This returns effLength * 1000 for mm. Be consistent.
        Rin0: Rin.toFixed(2), // Renamed from Rin to Rin0 for consistency with the second snippet's output
        transformerImpedance: Z1.toFixed(2),
        transformerWidth: Wq * 1000,
        transformerLength: Lq * 1000,
    };
}