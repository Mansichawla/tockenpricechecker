// pages/index.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import TokenForm from '../components/TokenForm';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGetPrice = async (formData) => {
    setError('');
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Store form data in localStorage or pass via router
      localStorage.setItem('tokenData', JSON.stringify({
        ...formData,
        requestType: 'single'
      }));
      
      router.push('/dashboard');
    } catch (err) {
      setError('Failed to fetch price data');
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleHistory = async (formData) => {
    setError('');
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      localStorage.setItem('tokenData', JSON.stringify({
        ...formData,
        requestType: 'history'
      }));
      
      router.push('/dashboard');
    } catch (err) {
      setError('Failed to schedule price history');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <TokenForm
        onGetPrice={handleGetPrice}
        onScheduleHistory={handleScheduleHistory}
        loading={loading}
        error={error}
      />
    </Layout>
  );
}