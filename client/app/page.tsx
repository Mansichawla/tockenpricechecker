"use client";

import { useTokenStore } from "./store/tokenStore";
import { useState } from "react";
import ProgressBar from '../components/ProgressBar';
import {scheduleFetch} from '../app/utils/api'

export default function Home() {
  const { tokenAddress, network, timestamp, price, source, setData } =
    useTokenStore();
  const [loading, setLoading] = useState(false);
  const [scheduleLoading, setScheduleLoading] = useState(false);

  const fetchPrice = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/price?token=${tokenAddress}&network=${network}&timestamp=${timestamp}`
      );
      const data = await res.json();
      setData({ price: data.price, source: data.source });
    } catch (err) {
      alert("Error fetching price");
    }
    setLoading(false);
  };

  const scheduleHistory = async () => {
    setScheduleLoading(true);
    scheduleFetch({token:tokenAddress,network});
    setScheduleLoading(false);
  };

  return (
    <main className="min-h-screen bg-black p-6 flex flex-col items-center">
      <h1 className="text-3xl text-white font-bold mb-6">
        🧮 Token Price Fetcher
      </h1>

      <div className="space-y-4 max-w-xl">
        <input
          type="text"
          placeholder="Token Address"
          value={tokenAddress}
          onChange={(e) => setData({ tokenAddress: e.target.value })}
          className="w-full p-2 border rounded text-white border-gray-300"
        />
        <select
          value={network}
          onChange={(e) => setData({ network: e.target.value })}
          className="w-full p-2 border rounded text-white border-gray-300 bg-[#1B1B1B]"
        >
          <option value="">Select Network</option>
          <option value="ethereum">Ethereum</option>
          <option value="polygon">Polygon</option>
        </select>
        <input
          type="date"
          value={
            timestamp
              ? new Date(parseInt(String(timestamp)) * 1000)
                  .toISOString()
                  .split("T")[0]
              : new Date().toISOString().split("T")[0]
          }
          className="w-full p-2 border rounded text-white border-gray-300 bg-[#1B1B1B] custom-date-picker"
          onChange={(e) => {
            const selectedDate = new Date(e.target.value);
            const unixTimestamp = Math.floor(selectedDate.getTime() / 1000);
            setData({ timestamp: unixTimestamp }); // update timestamp state
            console.log(unixTimestamp); // optional: shows the correct value
          }}
        />

        <button
          onClick={fetchPrice}
          className="bg-blue-300 text-black px-4 py-2 rounded hover:bg-blue-700 hover:text-white mr-6"
        >
          {loading ? "Fetching..." : "Get Price"}
        </button>

        <button
          onClick={scheduleHistory}
          className="bg-green-500 text-black px-4 py-2 rounded hover:bg-green-700 hover:text-white"
          disabled={scheduleLoading}
        >
          {scheduleLoading ? "Scheduling..." : "Schedule Full History"}
        </button>

        {price && (
          <div className="mt-4 bg-white p-4 rounded shadow">
            <p>
              <strong>Price:</strong> {price}
            </p>
            <p>
              <strong>Source:</strong> {source}
            </p>
          </div>
        )}
        
      </div>
       <ProgressBar />
    </main>
  );
}
