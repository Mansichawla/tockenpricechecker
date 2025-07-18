export default function PriceHistory({ history }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Price History</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-700">Date</th>
              <th className="px-4 py-3 text-right font-medium text-gray-700">Price</th>
              <th className="px-4 py-3 text-right font-medium text-gray-700">Volume</th>
              <th className="px-4 py-3 text-right font-medium text-gray-700">Change</th>
            </tr>
          </thead>
          <tbody>
            {history?.map((day, index) => {
              const prevPrice = index > 0 ? history[index - 1].price : day.price;
              const change = ((day.price - prevPrice) / prevPrice * 100).toFixed(2);
              const isPositive = change >= 0;
              
              return (
                <tr key={day.date} className="border-t border-gray-200">
                  <td className="px-4 py-3 font-medium">{day.date}</td>
                  <td className="px-4 py-3 text-right font-bold">${day.price.toFixed(3)}</td>
                  <td className="px-4 py-3 text-right text-gray-600">
                    ${day.volume.toLocaleString()}
                  </td>
                  <td className={`px-4 py-3 text-right font-medium ${
                    isPositive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {isPositive ? '+' : ''}{change}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}