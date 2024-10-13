import React from 'react';

interface ResultCardProps {
  result: {
    score: number;
    description: string;
  };
}

export default function ResultCard({ result }: ResultCardProps) {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-md mx-auto">
      <div className="text-center mb-4">
        <span className="text-6xl font-bold text-blue-500">{result.score.toFixed(1)}</span>
        <span className="text-2xl">/10</span>
      </div>
      <p className="text-gray-700 text-center">{result.description}</p>
    </div>
  );
}
