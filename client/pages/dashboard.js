import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import TokenInfo from '../components/dashboard/TokenInfo';
import PriceData from '../components/dashboard/PriceData';
import PriceHistory from '../components/dashboard/PriceHistory';

export default function Dashboard() {
  const router = useRouter();
  const [tokenData, setTokenData] = useState(null);
  const [priceData, setPriceData] = useState(null);
  const [loading, setLoading] = useState(true);


   useEffect(() => {
    const data = localStorage.getItem('tokenData');
    if (!data) {
      router.push('/');
      return;
    }

    const parsedData = JSON.parse(data);
    setTokenData(parsedData);

    // Fetch price data based on request type
    fetchPriceData(parsedData);
  }, [router]);

  const fetchPriceData = async (data) => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (data.requestType === 'single') {
        setPriceData({
          tokenAddress: data.tokenAddress,
          network: data.network,
          timestamp: data.timestamp,
          exactPrice: 1.234,
          interpolated: false,
          date: new Date(parseInt(data.timestamp) * 1000).toUTCString(),
          marketData: {
            volume24h: 1250000,
            marketCap: 45000000,
            priceChange24h: 5.67
          }
        });
      } else {
        setPriceData({
          tokenAddress: data.tokenAddress,
          network: data.network,
          isFullHistory: true,
          history: [
            { date: '2024-03-01', price: 1.10, volume: 850000 },
            { date: '2024-03-02', price: 1.15, volume: 920000 },
            { date: '2024-03-03', price: 1.08, volume: 780000 },
            { date: '2024-03-04', price: 1.12, volume: 890000 },
            { date: '2024-03-05', price: 1.18, volume: 1100000 },
            { date: '2024-03-06', price: 1.22, volume: 1300000 },
            { date: '2024-03-07', price: 1.19, volume: 1150000 },
            { date: '2024-03-08', price: 1.25, volume: 1400000 },
            { date: '2024-03-09', price: 1.21, volume: 1200000 },
            { date: '2024-03-10', price: 1.23, volume: 1250000 }
          ]
        });
      }
      } catch (error) {
      console.error('Error fetching price data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToForm = () => {
    localStorage.removeItem('tokenData');
    router.push('/');
  };
  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading price data...</p>
          </div>
        </div>
      </Layout>
    );
  }
  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        <DashboardHeader onBackToForm={handleBackToForm} />
        
        <TokenInfo 
          tokenAddress={priceData?.tokenAddress} 
          network={priceData?.network}
          date={priceData?.date}
          isFullHistory={priceData?.isFullHistory}
        />
        
        {priceData?.isFullHistory ? (
          <PriceHistory history={priceData.history} />
        ) : (
          <PriceData 
            exactPrice={priceData?.exactPrice}
            interpolated={priceData?.interpolated}
            marketData={priceData?.marketData}
          />
        )}
      </div>
    </Layout>
  );
}