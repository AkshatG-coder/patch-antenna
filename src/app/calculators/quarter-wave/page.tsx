import { AntennaIcon } from '@/components/ui/Icons';
import { QuarterFeedCalculator } from '@/components/calculators/quarter-wave/QuarterFeedCalculator';  
export default function QuarterFeedPage() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-800 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex justify-center items-center gap-4">
            <AntennaIcon className="text-indigo-600" />
            <h1 className="text-4xl font-bold text-gray-800">
              Microstrip Patch Antenna Calculator
            </h1>
          </div>
          <p className="text-2xl text-gray-700 mt-2">
            Inset Feeding
          </p>
          <p className="text-lg text-gray-500 mt-2">
            Design your rectangular or circular patch antennas with ease.
          </p>

        </header>

        <QuarterFeedCalculator />

      </div>
    </main>
  );
}