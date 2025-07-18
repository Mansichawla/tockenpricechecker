'use client';

import { useTokenStore } from './store/tokenStore';
import { useState } from 'react';

export default function Home() {
  const { tokenAddress, network, timestamp, price, source, setData } = useTokenStore();
  const [loading, setLoading] = useState(false);
  const [scheduleLoading, setScheduleLoading] = useState(false);

  const fetchPrice = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/price?token=${tokenAddress}&network=${network}&timestamp=${timestamp}`);
      const data = await res.json();
      setData({ price: data.price, source: data.source });
    } catch (err) {
      alert('Error fetching price');
    }
    setLoading(false);
  };

  const scheduleHistory = async () => {
    setScheduleLoading(true);
    try {
      const res =await fetch('http://localhost:5000/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: tokenAddress, network }),
      });
      const data = await res.json();
      alert('Scheduled full history fetch!');
    } catch (err) {
      alert('Error scheduling');
    }
    setScheduleLoading(false);
  };

  return (
    <main className="min-h-screen bg-black p-6 flex flex-col items-center">
      <h1 className="text-3xl text-white font-bold mb-6">🧮 Token Price Fetcher</h1>

      <div className="space-y-4 max-w-xl">
        <input
          type="text"
          placeholder="Token Address"
          value={tokenAddress}
          onChange={(e) => setData({ tokenAddress: e.target.value })}
          className="w-full p-2 border rounded text-white border-gray-300"
        />
        <input
          type="text"
          placeholder="Network (e.g. ethereum)"
          value={network}
          onChange={(e) => setData({ network: e.target.value })}
          className="w-full p-2 border rounded  text-white border-gray-300"
        />
        <input
          type="text"
          placeholder="Timestamp (e.g. 1710000000)"
          value={timestamp}
          onChange={(e) => setData({ timestamp: e.target.value })}
          className="w-full p-2 border rounded  text-white border-gray-300"
        />
        <button
          onClick={fetchPrice}
          className="bg-blue-300 text-black px-4 py-2 rounded hover:bg-blue-700 hover:text-white mr-6"
        >
          {loading ? 'Fetching...' : 'Get Price'}
        </button>

        <button
          onClick={scheduleHistory}
          className="bg-green-500 text-black px-4 py-2 rounded hover:bg-green-700 hover:text-white"
        disabled={scheduleLoading}
        >
          {scheduleLoading ? 'Scheduling...' : 'Schedule Full History'}
        </button>

        {price && (
          <div className="mt-4 bg-white p-4 rounded shadow">
            <p><strong>Price:</strong> {price}</p>
            <p><strong>Source:</strong> {source}</p>
          </div>
        )}
      </div>
    </main>
  );
}
