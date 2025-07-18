import { TrendingUp } from 'lucide-react';

export default function PriceData({ exactPrice, interpolated, marketData }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Price Data</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-green-600">${exactPrice}</div>
          <div className="text-sm text-gray-600 mt-1">
            {interpolated ? 'Interpolated Price' : 'Exact Price'}
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            ${marketData?.volume24h?.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600 mt-1">24h Volume</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            ${marketData?.marketCap?.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600 mt-1">Market Cap</div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-5 h-5 text-green-600" />
          <span className="font-medium">24h Change</span>
        </div>
        <div className="text-2xl font-bold text-green-600">
          +{marketData?.priceChange24h}%
        </div>
      </div>
    </div>
  );
}