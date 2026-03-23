import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`bg-white p-6 rounded-lg shadow-md border border-gray-200 ${className}`}>
    {children}
  </div>
);