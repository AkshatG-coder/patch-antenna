import Link from 'next/link';
import React from 'react';

// A reusable Icon component for demonstration
const CalculatorIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="8" y1="3" x2="8" y2="21"></line>
    <line x1="16" y1="3" x2="16" y2="21"></line>
    <line x1="3" y1="8" x2="21" y2="8"></line>
    <line x1="3" y1="16" x2="21" y2="16"></line>
  </svg>
);


// Interface for the props of our CalculatorCard component
interface CalculatorCardProps {
  title: string;
  description: string;
  href: string;
}

/**
 * A reusable, clickable card component to navigate to a calculator.
 */
const CalculatorCard: React.FC<CalculatorCardProps> = ({ title, description, href }) => {
  return (
    <Link
      href={href}
      className="group block p-8 bg-white rounded-xl shadow-md border border-gray-200 hover:border-indigo-500 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
    >
      <div className="flex items-center gap-4">
        <div className="bg-indigo-100 p-3 rounded-lg text-indigo-600 group-hover:bg-indigo-200 transition-colors">
            <CalculatorIcon />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">
          {title}
        </h2>
      </div>
      <p className="mt-3 text-gray-600">
        {description}
      </p>
      <div className="mt-5 text-indigo-600 font-semibold group-hover:underline">
        Open Calculator →
      </div>
    </Link>
  );
};

// The main page component
export default function MainPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">
            Antenna Designer
          </h1>
          <p className="mt-4 text-lg text-gray-500">
            A collection of powerful, easy-to-use calculators for antenna design.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
          {/* Card 1: Coaxial Feed Calculator */}
          <CalculatorCard
            href="/calculators/coaxial-feed"
            title="Microstrip Coaxial Feed Patch Antenna"
            description="Design and analyze rectangular or circular microstrip patch antennas with coaxial feed."
          />

          {/* Card 2: Placeholder for your next calculator */}
          <CalculatorCard
            href="/calculators/inset-feed"
            title="Microstrip Inset Feed Antenna"
            description="Design and analyze rectangular or circular microstrip patch antennas with inset feed."
          />

          {/* Card 3: Placeholder for your third calculator */}
          <CalculatorCard
            href="/calculators/quarter-wave"
            title="Microstrip Quarter Feed Antenna"
            description="Design and analyze rectangular or circular microstrip patch antennas with quarter feed."
          />
        </div>
      </div>
    </main>
  );
}