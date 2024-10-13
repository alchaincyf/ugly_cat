'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (response.ok) {
      router.push('/admin');
    } else {
      alert('密码错误');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">管理员登录</h1>
      <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="请输入密码"
          className="w-full p-2 mb-4 border rounded"
        />
        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
          登录
        </button>
      </form>
    </div>
  );
}
