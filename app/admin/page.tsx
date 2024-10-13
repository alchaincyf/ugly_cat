'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const [stats, setStats] = useState({ totalRequests: 0 });
  const router = useRouter();

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => setStats(data));
  }, []);

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">管理统计</h1>
      <p className="text-xl mb-4">总请求次数：{stats.totalRequests}</p>
      <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">
        登出
      </button>
    </div>
  );
}
