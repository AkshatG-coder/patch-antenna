import { besselJ0 } from '@/lib/math';
import { convertFrequencyToHz, convertHeightToMeters } from './utlis';
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

/**
 * Computes the Sine Integral Si(x) using numerical integration.
 * Si(x) = integral from 0 to x of (sin(t)/t) dt
 * @param x The upper limit of integration.
 * @returns The approximate value of the Sine Integral.
 */
function sineIntegral(x: number): number {
    if (x === 0) {
        return 0;
    }
    // The integrand has a removable singularity at t=0, where the limit is 1.
    const integrand = (t: number): number => {
        if (t === 0) {
            return 1;
        }
        return Math.sin(t) / t;
    };
    // Use a sufficient number of steps for accuracy.
    return numericalIntegration(integrand, 0, x, 1000);
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

        // This is the integrand of equation (14-12a) from the book.
        const integrandG1 = (theta: number): number => {
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

            const term3 = Math.pow(Math.sin(theta), 3);

            return Math.pow(term1, 2) * term3;
        };

        // Perform numerical integration from 0 to PI for I1 integral
        const I1_integral = numericalIntegration(integrandG1, 0, Math.PI, 100); // 100 steps for integration

        // Final G1 calculation based on Eq. (14-12)
        const G1 = I1_integral / (120 * Math.PI * Math.PI);
        
        // --- G12 CALCULATION ---
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
        
        const Rin0 = 1 / (2 * (G1 + G12)); // Edge resistance, Eq. (14-17)

        let y0: number | string = 'N/A';
        const desiredRin = 50;

        if (!isNaN(Rin0) && Rin0 >= desiredRin) {
            y0 = (L / Math.PI) * Math.acos(Math.sqrt(desiredRin / Rin0)); // Inset feed location, Eq. (14-20a)
        } else {
            y0 = 'Not Matchable';
        }

        // --- START OF EXACT DIRECTIVITY CALCULATION ---

        // Calculate directivity for a single slot using Eq. (14-53) and (14-53a)
        const X = k0 * w;
        // Handle X=0 case to avoid division by zero, though physically W > 0
        const sinX_over_X = X === 0 ? 1 : Math.sin(X) / X;
        const I1 = -2 + Math.cos(X) + X * sineIntegral(X) + sinX_over_X;
        const D0 = (4*Math.PI * Math.PI * Math.pow(w / lambda0, 2)) / I1;

        // Calculate directivity for two slots (the patch) using Eq. (14-56)
        const g12 = G12 / G1;
        const DAF = 2 / (1 + g12); // From Eq. (14-56a)
        const D2 = D0 * DAF; // Total Directivity from Eq. (14-56)
         
        // --- END OF EXACT DIRECTIVITY CALCULATION ---

        return {
            length: L * 1000,
            width: w * 1000,
            radius: null,
            effLength: effLength * 100, // effective length in cm
            effRadius: null,
            Rin0: isNaN(Rin0) ? 'N/A' : Rin0.toFixed(2),
            y0: typeof y0 === "number" ? (y0 * 1000).toFixed(2) : y0,
            G1: G1.toExponential(3),
            G12: isNaN(G12) ? 'N/A' : G12.toExponential(3),
            directivity: isNaN(D2) ? 'N/A' : (10*Math.log10(D2)).toFixed(2),
        };
    } else {
        // For circular patch (unchanged)
        const F = (8.791 * Math.pow(10, 9)) / (fr * Math.sqrt(epsilonR));
const h_cm = h_m * 100; // Convert height from meters to cm
const a_eff_num = Math.PI * F * epsilonR;
const ab = Math.PI * F;
const a_eff_den = 2 * h_cm;
const term_in_sqrt = 1 + ((a_eff_den / a_eff_num) * (Math.log(ab / a_eff_den) + 1.7726));
const a = F / Math.sqrt(term_in_sqrt);


        return {
            length: null,
            width: null,
            radius: a * 10,
            effRadius: null,    
            effLength: null,
            Rin0: 'N/A',
            y0: 'N/A',
            G1: 'N/A',
            G12: 'N/A',
            directivity: 'N/A',
        };
    }
}


//value of j02` =7.016 
// and j02 =5.52