"use client";
import { useEffect, useState } from "react";

interface Ticker {
  symbol: string;
  name?: string;
  exchange?: string;
}

export default function TickersPage() {
  const [tickers, setTickers] = useState<Ticker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("/api/proxy?endpoint=/tickers")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch tickers");
        return res.json();
      })
      .then((data) => {
        setTickers(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const filteredTickers = tickers.filter(ticker =>
    ticker.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (ticker.name && ticker.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-lg">Loading tickers...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> {error}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Market Tickers
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Available ticker symbols for trading strategies
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search tickers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Tickers Grid */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Available Tickers ({filteredTickers.length})
            </h2>
          </div>
          <div className="max-h-96 overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6">
              {filteredTickers.map((ticker, index) => (
                <div
                  key={ticker.symbol || index}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                  onClick={() => {
                    // Copy ticker to clipboard
                    navigator.clipboard.writeText(ticker.symbol);
                  }}
                >
                  <div className="font-mono font-bold text-lg text-blue-600 dark:text-blue-400">
                    {ticker.symbol}
                  </div>
                  {ticker.name && (
                    <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {ticker.name}
                    </div>
                  )}
                  {ticker.exchange && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {ticker.exchange}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {filteredTickers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm ? "No tickers found matching your search." : "No tickers available at the moment."}
            </p>
          </div>
        )}
      </div>
    </main>
  );
} 