import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function About() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">关于丑咪挑战赛</h1>
        <div className="max-w-2xl mx-auto">
          <p className="mb-4">
            欢迎来到丑咪挑战赛！这是一个充满乐趣的平台，专门为猫咪爱好者打造。
          </p>
          <p className="mb-4">
            我们的AI系统会分析你上传的猫咪照片，给出一个幽默的颜值评分和有趣的评价。
            不要太认真哦，这只是一个娱乐性质的应用！
          </p>
          <p className="mb-4">
            每天你有5次免费的分析机会。想要更多次数？分享你的结果就能获得额外的尝试机会！
          </p>
          <p>
            记住，每只猫咪都是独一无二的，无论评分如何，它们都是最棒的！
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
