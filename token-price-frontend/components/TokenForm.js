import { useState } from 'react';
import { BarChart3, Clock, Calendar } from 'lucide-react';

export default function TokenForm({ onGetPrice, onScheduleHistory, loading, error }) {
  const [formData, setFormData] = useState({
    tokenAddress: '',
    network: 'ethereum',
    timestamp: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.tokenAddress.trim()) {
      return 'Token address is required';
    }
    if (!formData.timestamp.trim()) {
      return 'Timestamp is required';
    }
    if (!/^\d{10}$/.test(formData.timestamp)) {
      return 'Please enter a valid 10-digit timestamp';
    }
    return null;
  };

  const handleGetPrice = () => {
    const validationError = validateForm();
    if (validationError) {
      return;
    }
    onGetPrice(formData);
  };

  const handleScheduleHistory = () => {
    if (!formData.tokenAddress.trim()) {
      return;
    }
    onScheduleHistory(formData);
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Token Price Fetcher</h1>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Token Address
            </label>
            <input
              type="text"
              name="tokenAddress"
              value={formData.tokenAddress}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0x..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Network
            </label>
            <select
              name="network"
              value={formData.network}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ethereum">Ethereum</option>
              <option value="polygon">Polygon</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timestamp
            </label>
            <input
              type="text"
              name="timestamp"
              value={formData.timestamp}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="1710000000"
            />
            <p className="text-xs text-gray-500 mt-1">Unix timestamp (10 digits)</p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleGetPrice}
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Loading...
                </>
              ) : (
                <>
                  <Clock className="w-4 h-4" />
                  Get Price
                </>
              )}
            </button>

            <button
              onClick={handleScheduleHistory}
              disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Loading...
                </>
              ) : (
                <>
                  <Calendar className="w-4 h-4" />
                  Schedule Full History
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}