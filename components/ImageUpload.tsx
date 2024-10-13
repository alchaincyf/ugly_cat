'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import html2canvas from 'html2canvas';
import imageCompression from 'browser-image-compression';

const DAILY_LIMIT = 5;

export default function ImageUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<{
    isCat: boolean;
    score?: string;
    comment?: string;
    description?: string;
  } | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const [html2canvasModule, setHtml2canvasModule] = useState<typeof html2canvas | null>(null);
  const [usageCount, setUsageCount] = useState(0);

  useEffect(() => {
    import('html2canvas').then(module => {
      setHtml2canvasModule(() => module.default);
    });
  }, []);

  useEffect(() => {
    const today = new Date().toDateString();
    const storedDate = localStorage.getItem('lastUsageDate');
    const storedCount = localStorage.getItem('usageCount');

    if (storedDate !== today) {
      localStorage.setItem('lastUsageDate', today);
      localStorage.setItem('usageCount', '0');
      setUsageCount(0);
    } else if (storedCount) {
      setUsageCount(parseInt(storedCount, 10));
    }
  }, []);

  const compressImage = async (file: File) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true
    };
    
    try {
      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (error) {
      console.error("Error compressing image:", error);
      return file; // 如果压缩失败，返回原始文件
    }
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (usageCount >= DAILY_LIMIT) {
      alert('您今天的使用次数已达上限，请明天再来！');
      return;
    }

    const file = event.target.files?.[0];
    if (!file) {
      alert('请选择一个文件');
      return;
    }

    setIsUploading(true);
    setImagePreview(URL.createObjectURL(file));
    setAnalysisResult(null);

    try {
      const compressedFile = await compressImage(file);
      const formData = new FormData();
      formData.append('file', compressedFile);

      setIsAnalyzing(true);
      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      console.log("Received raw data from server:", JSON.stringify(data, null, 2));

      if (data.error) {
        throw new Error(data.error);
      }

      // 验证接收到的数据
      if (typeof data.isCat !== 'boolean' || (data.isCat && (typeof data.score !== 'string' || typeof data.comment !== 'string' || typeof data.description !== 'string'))) {
        console.error("Received invalid data structure:", data);
        throw new Error('Received invalid data structure from server');
      }

      setAnalysisResult(data);
      console.log("Set analysis result:", JSON.stringify(data, null, 2));

      if (!data.isCat) {
        alert(data.comment || '这不是一张猫咪的照片。');
      }

      // 更新使用次数
      const newCount = usageCount + 1;
      setUsageCount(newCount);
      localStorage.setItem('usageCount', newCount.toString());
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('分析图片时出现错误，请重试。');
    } finally {
      setIsUploading(false);
      setIsAnalyzing(false);
    }
  };

  const resetUpload = () => {
    setImagePreview(null);
    setAnalysisResult(null);
  };

  const isMobile = () => {
    if (typeof window !== 'undefined') {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    return false;
  };

  const saveImage = async () => {
    if (resultRef.current && html2canvasModule) {
      const canvas = await html2canvasModule(resultRef.current, {
        backgroundColor: null,
        scale: 2, // 提高导出图片的清晰度
      });
      const image = canvas.toDataURL("image/png");

      if (isMobile()) {
        // 对于移动设备，我们创建一个临时的 <a> 元素来触发下载
        const link = document.createElement('a');
        link.href = image;
        link.download = 'my-cat-score.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // 提示用户保存到相册
        alert('图片已生成，请长按图片并选择"添加到相册"以保存。');
      } else {
        // 对于桌面设备，保持原有的下载方式
        const link = document.createElement('a');
        link.download = 'my-cat-score.png';
        link.href = image;
        link.click();
      }
    }
  };

  return (
    <div className="text-center">
      {!imagePreview ? (
        <label className="btn-primary inline-block mb-8 cursor-pointer text-2xl py-16 px-32 relative overflow-hidden group">
          {isUploading ? '上传中...' : '上传猫咪照片'}
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleUpload}
            disabled={isUploading}
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z" clipRule="evenodd" />
            </svg>
          </div>
        </label>
      ) : (
        <div className="mt-8 mb-8 max-w-md mx-auto">
          <div ref={resultRef} className="card p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 opacity-20"></div>
            <Image 
              src={imagePreview} 
              alt="Uploaded cat" 
              width={300} 
              height={300} 
              objectFit="cover"
              className="rounded-2xl shadow-lg mx-auto mb-6 relative z-10"
            />
            {isAnalyzing && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
                <div className="paw-loader">
                  <div className="paw"></div>
                  <div className="paw"></div>
                  <div className="paw"></div>
                  <div className="paw"></div>
                </div>
              </div>
            )}
            {analysisResult && analysisResult.isCat && (
              <div className="relative z-10">
                <div className="bg-gray-800 rounded-xl p-4 mb-4 shadow-inner score-container">
                  <h2 className="text-4xl font-bold mb-2 font-futuristic gradient-text">颜值评分：{analysisResult.score}/10</h2>
                  <p className="text-lg text-cyan-300">{analysisResult.description}</p>
                </div>
                <div className="mt-4 p-3 bg-gray-700 bg-opacity-50 rounded-lg comment-container">
                  <h3 className="text-xl font-semibold mb-2 text-fuchsia-300">AI 毒舌点评</h3>
                  <p className="text-gray-300 italic">{analysisResult.comment}</p>
                </div>
              </div>
            )}
            <div className="mt-6 text-sm text-gray-400 relative z-10">
              由cat.img2046.com创造 - 猫咪颜值评分专家
            </div>
          </div>
          <div className="mt-6 flex justify-center space-x-4">
            <button 
              onClick={resetUpload}
              className="btn-secondary"
            >
              重新上传
            </button>
            <button 
              onClick={saveImage}
              className="btn-primary"
            >
              {isMobile() ? '生成图片' : '保存结果'}
            </button>
          </div>
          <p className="mt-4 text-sm text-gray-400">今日剩余使用次数：{DAILY_LIMIT - usageCount}</p>
        </div>
      )}
    </div>
  );
}
