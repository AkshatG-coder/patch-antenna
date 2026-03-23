import { besselJ0 } from '@/lib/math';
import { convertFrequencyToHz, convertHeightToMeters } from './utils';
import { CalculatorInputs, CalculationResults } from './types';

const SPEED_OF_LIGHT = 299792458; // m/s

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
        n++; // Ensure n is even for Simpson's rule
    }
    const h = (b - a) / n;
    let sum = f(a) + f(b);

    for (let i = 1; i < n; i += 2) {
        sum += 4 * f(a + i * h);
    }

    for (let i = 2; i < n; i += 2) {
        sum += 2 * f(a + i * h);
    }

    return (h / 3) * sum;
}


export function performCalculation(inputs: CalculatorInputs): CalculationResults {
    const { shape, frequency, freqUnit, height, heightUnit, epsilonR } = inputs;

    const fr = convertFrequencyToHz(frequency, freqUnit);
    const h_m = convertHeightToMeters(height, heightUnit);
    const lambda0 = SPEED_OF_LIGHT / fr;
    const k0 = 2 * Math.PI / lambda0;

    if (shape === "rectangle") {
        const w = (SPEED_OF_LIGHT / (2 * fr)) * Math.sqrt(2 / (epsilonR + 1)); // Eq. (14-6)
        const effEpsilon = ((epsilonR + 1) / 2) + (((epsilonR - 1) / 2) * (1 / Math.sqrt(1 + 12 * h_m / w))); // Eq. (14-1)
        const deltaL_num = (effEpsilon + 0.3) * (w / h_m + 0.264);
        const deltaL_den = (effEpsilon - 0.258) * (w / h_m + 0.8);
        const deltaL = 0.412 * h_m * (deltaL_num / deltaL_den); // Eq. (14-2)
        const effLength = SPEED_OF_LIGHT / (2 * fr * Math.sqrt(effEpsilon));
        const L = effLength - (2 * deltaL); // Eq. (14-7)

        const G1 = (1 / 90) * Math.pow(w / lambda0, 2); // Approximate conductance G1, Eq. (14-13)

        // --- CORRECTED G12 CALCULATION ---
        // This is the integrand of equation (14-18a) from the book.
        const integrandG12 = (theta: number): number => {
            if (theta === 0 || theta === Math.PI) {
                 return 0; // The sin(theta)^3 term makes the result 0 at the limits.
            }
            // Handle the case where cos(theta) is close to zero to avoid division by zero
            // The limit of sin(x)/x as x->0 is 1.
            const cosTheta = Math.cos(theta);
            let term1;
            if (Math.abs(cosTheta) < 1e-9) {
                term1 = (k0 * w / 2);
            } else {
                term1 = Math.sin(k0 * w / 2 * cosTheta) / cosTheta;
            }

            const term2 = besselJ0(k0 * L * Math.sin(theta));
            const term3 = Math.pow(Math.sin(theta), 3);

            return Math.pow(term1, 2) * term2 * term3;
        };
        
        // Perform numerical integration from 0 to PI for G12 integral
        const integralG12 = numericalIntegration(integrandG12, 0, Math.PI, 100); // 100 steps for integration
        
        // Final G12 calculation based on Eq. (14-18a)
        const G12 = (1 / (120 * Math.PI * Math.PI)) * integralG12;
        // --- END OF CORRECTION ---

        const Rin0 = 1 / (2 * (G1 + G12)); // Edge resistance, Eq. (14-17)

        let y0: number | string = 'N/A';
        const desiredRin = 50;

        if (!isNaN(Rin0) && Rin0 >= desiredRin) {
            y0 = (L / Math.PI) * Math.acos(Math.sqrt(desiredRin / Rin0)); // Inset feed location, Eq. (14-20a)
        } else {
            y0 = 'Not Matchable';
        }

        const D_approx = (4 * Math.PI * w * (L + 2 * deltaL)) / (lambda0 * lambda0); // Approximate directivity

        return {
            triangleLength: null, // Not applicable for rectangle
            // For rectangular patch
            length: L * 1000,
            width: w * 1000,
            radius: null,
            effLength: (L + 2 * deltaL) * 100,
            effRadius: null,
            Rin0: isNaN(Rin0) ? 'N/A' : Rin0.toFixed(2),
            y0: typeof y0 === "number" ? (y0 * 1000).toFixed(2) : y0,
            G1: G1.toExponential(3),
            G12: isNaN(G12) ? 'N/A' : G12.toExponential(3),
            directivity: isNaN(D_approx) ? 'N/A' : (10 * Math.log10(D_approx)).toFixed(2),
        };
    } else if (shape === "triangle") {
        // For equilateral triangular patch
        const a = (2 * SPEED_OF_LIGHT) / (3 * fr * Math.sqrt(epsilonR));
        const h_lambda0 = h_m / lambda0;
        const effEpsilon_tri = ((epsilonR + 1) / 2) + (((epsilonR - 1) / 4) * Math.pow(1 + 12 * h_lambda0 * (lambda0 / a), -0.5));
        const a_eff = (2 * SPEED_OF_LIGHT) / (3 * fr * Math.sqrt(effEpsilon_tri));
        
        // The resonant frequency for the fundamental TM10 mode is given by:
        // fr = (2 * c) / (3 * a_eff * sqrt(epsilon_eff))
        // We rearrange this to solve for the physical side length 'a'
        const physical_a = (2 * SPEED_OF_LIGHT) / (3 * fr * Math.sqrt(epsilonR));

        return {
            length: null, // Length is not applicable for triangular patch
            triangleLength: physical_a * 1000, // Returning side length 'a' as 'triangleLength'
            width: null,
            radius: null,
            effLength: null, // Returning effective side length
            effRadius: null,
            Rin0: 'N/A', // Specific calculation for Rin is complex for triangular patch
            y0: 'N/A',
            G1: 'N/A',
            G12: 'N/A',
            directivity: 'N/A', // Directivity calculation is also complex
        };
    } else {
        // For circular patch (unchanged)
        const F = (8.791 * Math.pow(10, 9)) / (fr * Math.sqrt(epsilonR));
        const term_in_sqrt = 1 + (2 * h_m / (Math.PI * epsilonR * F)) * (Math.log(Math.PI * F / (2*h_m)) + 1.7726);
        const a = F / Math.sqrt(term_in_sqrt);
        const a_eff = a * Math.sqrt(term_in_sqrt);

        return {
            triangleLength: null, // Not applicable for circular patch
            // For circular patch   
            length: null,
            width: null,
            radius: a * 1000,
            effRadius: a_eff * 100,
            effLength: null,
            Rin0: 'N/A',
            y0: 'N/A',
            G1: 'N/A',
            G12: 'N/A',
            directivity: 'N/A',
        };
    }
}