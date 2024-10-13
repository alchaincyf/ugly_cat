
import React from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function About() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16">
        <div className="mb-12"></div> {/* 添加一个空的div来增加上方间距 */}
        <h1 className="text-5xl font-bold text-center mb-12 font-futuristic gradient-text">关于丑咪挑战赛</h1>
        <div className="max-w-2xl mx-auto bg-gray-800 rounded-xl p-8 shadow-lg">
          <p className="mb-6 text-lg text-gray-300">
            欢迎来到丑咪挑战赛！这是一个充满乐趣的平台，专门为猫咪爱好者打造。我们用幽默和创意的方式来欣赏每一只猫咪的独特之处。
          </p>
          <p className="mb-6 text-lg text-gray-300">
            我们的AI系统会分析你上传的猫咪照片，给出一个幽默的颜值评分和有趣的评价。记住，这只是一个娱乐性质的应用，每只猫咪都是独一无二的，无论评分如何，它们都是最棒的！
          </p>
          <p className="mb-8 text-lg text-gray-300">
            每天你有5次免费的分析机会。想要更多乐趣？别忘了分享你的结果！
          </p>
          <div className="bg-gray-700 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-cyan-300">更多精彩等你发现</h2>
            <p className="text-gray-300 mb-4">
              丑咪挑战赛是由 img2046.com 推出的众多有趣工具之一。想要探索更多AI驱动的创意工具？
            </p>
            <Link href="https://www.img2046.com/" target="_blank" rel="noopener noreferrer" className="btn-primary inline-block">
              访问 img2046.com
            </Link>
          </div>
          <p className="text-center text-gray-400">
            记住，在猫咪的世界里，丑也是一种独特的美！
          </p>
        </div>
      </main>
      <div className="mb-8"></div> {/* 添加一个空的div来增加底部间距 */}
      <Footer />
    </div>
  );
}
