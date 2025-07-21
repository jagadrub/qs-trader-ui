"use client";
import { useEffect, useState } from "react";

interface RiskProfile {
  id: string;
  name: string;
  description: string;
  risk_level?: string;
  allocation?: any;
}

export default function RiskProfilesPage() {
  const [riskProfiles, setRiskProfiles] = useState<RiskProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:8000/risk-profiles")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch risk profiles");
        return res.json();
      })
      .then((data) => {
        setRiskProfiles(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const getRiskLevelColor = (level?: string) => {
    switch (level?.toLowerCase()) {
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  if (loading) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-lg">Loading risk profiles...</p>
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
            Risk Profiles
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Predefined risk profiles for portfolio allocation strategies
          </p>
        </div>

        {/* Risk Profiles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {riskProfiles.map((profile, index) => (
            <div
              key={profile.id || index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {profile.name}
                </h3>
                {profile.risk_level && (
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getRiskLevelColor(profile.risk_level)}`}>
                    {profile.risk_level}
                  </span>
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {profile.description}
              </p>
              
              {profile.allocation && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Allocation:
                  </h4>
                  <div className="space-y-1">
                    {Object.entries(profile.allocation).map(([asset, percentage]) => (
                      <div key={asset} className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-300">{asset}:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Use This Profile
              </button>
            </div>
          ))}
        </div>

        {riskProfiles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No risk profiles available at the moment.
            </p>
          </div>
        )}
      </div>
    </main>
  );
} 