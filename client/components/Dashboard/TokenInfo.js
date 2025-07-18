export default function TokenInfo({ tokenAddress, network, date, isFullHistory }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Token Information</h2>
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium capitalize">
          {network}
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600">Token Address</p>
          <p className="font-mono text-sm bg-gray-50 p-2 rounded">
            {tokenAddress}
          </p>
        </div>
        {!isFullHistory && (
          <div>
            <p className="text-sm text-gray-600">Query Time</p>
            <p className="font-medium">{date}</p>
          </div>
        )}
      </div>
    </div>
  );
}