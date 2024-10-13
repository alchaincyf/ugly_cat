'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ResultCard from '../../components/ResultCard';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

function ResultContent() {
  const searchParams = useSearchParams();
  const score = searchParams.get('score');
  const description = searchParams.get('description');

  const result = {
    score: score ? parseFloat(score) : 0,
    description: description || '无法获取描述',
  };

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">评分结果</h1>
      <ResultCard result={result} />
      <div className="mt-8 text-center">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4">
          分享结果
        </button>
        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={() => window.location.href = '/'}>
          再来一次
        </button>
      </div>
    </main>
  );
}

export default function Result() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <Header />
      <Suspense fallback={<div className="flex-grow container mx-auto px-4 py-8 text-center">加载中...</div>}>
        <ResultContent />
      </Suspense>
      <Footer />
    </div>
  );
}
