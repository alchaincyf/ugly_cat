'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

export default function AppreciationSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    const appreciationSection = document.getElementById('appreciation');
    if (appreciationSection) observer.observe(appreciationSection);

    return () => {
      if (appreciationSection) observer.unobserve(appreciationSection);
    };
  }, []);

  const copyWechat = () => {
    navigator.clipboard.writeText('alchain').then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <section id="appreciation" className={`mt-24 text-center transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <h2 className="text-3xl font-bold mb-6 gradient-text">支持创作者</h2>
      <p className="text-xl text-gray-300 mb-8">
        如果您喜欢我们的内容，欢迎赞赏支持我们继续创作！
      </p>
      <div className="mb-8">
        <Image 
          src="/qr-code.jpg" 
          alt="赞赏二维码" 
          width={200} 
          height={200} 
          className="mx-auto rounded-lg shadow-lg"
          loading="lazy"
        />
      </div>
      <p className="text-sm text-gray-400">
        created by AI进化论-花生（
        <a href="https://www.youtube.com/channel/UCzbSuf_A_D8dARJ33HzoDew" 
           target="_blank" 
           rel="noopener noreferrer"
           className="text-blue-400 hover:text-blue-300">
          @AI进化论-花生
        </a>
        ）
      </p>
      <p className="text-sm text-gray-400 mt-2">
        如有反馈，请联系微信：
        <button 
          onClick={copyWechat}
          className="ml-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          {copied ? '已复制' : '复制微信号'}
        </button>
      </p>
    </section>
  );
}
