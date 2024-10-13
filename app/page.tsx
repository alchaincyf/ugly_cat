import React from 'react';
import dynamic from 'next/dynamic';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ImageUpload = dynamic(() => import('../components/ImageUpload'), { ssr: false });

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-24">
        <h1 className="text-6xl font-bold text-center mb-8 font-futuristic gradient-text mt-16">丑咪挑战赛</h1>
        <p className="text-xl text-center mb-12 text-gray-300">
          上传你家的毛球，让我们见证它的"特别"之处。每只猫都独一无二，有美有丑。来看看你的主子能否创造新的丑猫传说！
        </p>
        <ImageUpload />
      </main>
      <Footer />
    </div>
  );
}
