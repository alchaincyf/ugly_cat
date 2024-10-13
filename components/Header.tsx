import React from 'react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-gray-900 bg-opacity-80 backdrop-blur-md sticky top-0 z-10 border-b border-gray-800">
      <div className="container mx-auto flex justify-between items-center h-16">
        <Link href="/" className="text-2xl font-bold font-futuristic gradient-text">丑咪挑战赛</Link>
        <nav>
          <ul className="flex space-x-6">
            <li><Link href="/" className="text-sm hover:text-cyan-400 transition duration-300">首页</Link></li>
            <li><Link href="/about" className="text-sm hover:text-cyan-400 transition duration-300">关于</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
