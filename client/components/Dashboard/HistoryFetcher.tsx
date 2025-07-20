'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HistoryFetcher: React.FC = () => {
  const [token, setToken] = useState('');
  const [network, setNetwork] = useState('eth-mainnet');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    if (!jobId) return;

    const interval = setInterval(async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/progress/${jobId}`);
        setProgress(data.progress);
        setStatus(`Status: ${data.status}`);
        if (data.status === 'completed' || data.status === 'failed') {
          clearInterval(interval);
        }
      } catch (error) {
        setStatus('❌ Failed to get progress');
        clearInterval(interval);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [jobId]);

  const handleFetchHistory = async () => {
    if (!token || !network) {
      setStatus('Please enter both token and network.');
      return;
    }

    setLoading(true);
    setStatus(null);
    setProgress(0);
    setJobId(null);

    try {
      const response = await axios.post('http://localhost:5000/schedule', { token, network });
      setStatus(response.data.message || 'History fetch initiated.');
      setJobId(response.data.jobId);
    } catch (err: any) {
      setStatus(`❌ ${err.response?.data?.error || 'Failed to fetch history.'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-xl mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">Fetch Full Price History</h2>

      <input
        type="text"
        placeholder="Token Address"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mb-3"
      />

      <select
        value={network}
        onChange={(e) => setNetwork(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mb-3"
      >
        <option value="eth-mainnet">Ethereum</option>
        <option value="polygon-mainnet">Polygon</option>
        <option value="arbitrum-mainnet">Arbitrum</option>
      </select>

      <button
        onClick={handleFetchHistory}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Fetching...' : 'Schedule Full History'}
      </button>

      {status && <p className="mt-4 text-sm text-gray-700">{status}</p>}

      {jobId && (
        <div className="mt-4">
          <div className="h-4 bg-gray-200 rounded">
            <div
              className="h-4 bg-blue-500 rounded transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-1">{progress}%</p>
        </div>
      )}
    </div>
  );
};

export default HistoryFetcher;
