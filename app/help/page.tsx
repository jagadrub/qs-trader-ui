"use client";
import { useEffect, useState } from "react";

interface Endpoint {
  path: string;
  method: string;
  description: string;
}

interface Doc {
  url: string;
  description: string;
}

interface Example {
  method: string;
  url: string;
}

interface HelpData {
  info: string;
  docs: Doc[];
  endpoints: Endpoint[];
  examples: {
    list_strategies: Example;
    run_sma: Example;
    list_tickers: Example;
    list_risk_profiles: Example;
  };
  note: string;
}

export default function HelpPage() {
  const [help, setHelp] = useState<HelpData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:8000/help")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch help info");
        return res.json();
      })
      .then((data) => {
        setHelp(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-lg">Loading API documentation...</p>
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

  if (!help) return null;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {help.info}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Interactive API documentation and usage guide
          </p>
        </div>

        {/* Documentation Links */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            📚 Documentation
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {help.docs.map((doc, index) => (
              <a
                key={index}
                href={`http://localhost:8000${doc.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              >
                <h3 className="font-medium text-blue-600 dark:text-blue-400">
                  {doc.url}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  {doc.description}
                </p>
              </a>
            ))}
          </div>
        </div>

        {/* API Endpoints */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            🔌 API Endpoints
          </h2>
          <div className="space-y-4">
            {help.endpoints.map((endpoint, index) => (
              <div
                key={index}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    endpoint.method === 'GET' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                  }`}>
                    {endpoint.method}
                  </span>
                  <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                    {endpoint.path}
                  </code>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  {endpoint.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Examples */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            💡 Example Requests
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {Object.entries(help.examples).map(([key, example]) => (
              <div
                key={key}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
              >
                <h3 className="font-medium text-gray-900 dark:text-white mb-2 capitalize">
                  {key.replace(/_/g, ' ')}
                </h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">
                    {example.method}
                  </span>
                </div>
                <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded block break-all">
                  {example.url}
                </code>
              </div>
            ))}
          </div>
        </div>

        {/* Note */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-blue-800 dark:text-blue-200">
            <strong>Note:</strong> {help.note}
          </p>
        </div>
      </div>
    </main>
  );
} 