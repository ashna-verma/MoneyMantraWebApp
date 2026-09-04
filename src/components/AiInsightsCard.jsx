import React, { useEffect, useState } from "react";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndpoints";

const AIInsightsCard = () => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchInsights = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axiosConfig.get(API_ENDPOINTS.AI_INSIGHTS);

      setInsights(response.data);
    } catch (err) {
      console.error("Failed to fetch AI insights:", err);
      setError("Unable to generate insights right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
            <span className="text-xl">✨</span>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              AI Financial Insights
            </h2>

            <p className="text-sm text-gray-500">
              Personalized insights from your spending
            </p>
          </div>
        </div>

        <button
          onClick={fetchInsights}
          disabled={loading}
          className="text-sm text-purple-600 hover:text-purple-700 font-medium disabled:opacity-50"
        >
          {loading ? "Generating..." : "Refresh"}
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="space-y-4">
          <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4" />
          <div className="h-4 bg-gray-100 rounded animate-pulse w-full" />
          <div className="h-4 bg-gray-100 rounded animate-pulse w-5/6" />
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-4">
          <p className="text-sm text-red-600">{error}</p>

          <button
            onClick={fetchInsights}
            className="mt-2 text-sm font-medium text-red-700 hover:underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Insights */}
      {!loading && !error && insights && (
        <div className="space-y-5">

          {/* Summary */}
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              Overall
            </p>

            <p className="text-gray-700 leading-relaxed">
              {insights.summary}
            </p>
          </div>

          {/* Individual insights */}
          {insights.insights?.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-500 mb-3">
                What I noticed
              </p>

              <div className="space-y-3">
                {insights.insights.map((insight, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
                      <span className="text-purple-600 text-xs font-semibold">
                        {index + 1}
                      </span>
                    </div>

                    <p className="text-sm text-gray-700 leading-relaxed">
                      {insight}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendation */}
          {insights.recommendation && (
            <div className="bg-purple-50 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <span className="text-lg">💡</span>

                <div>
                  <p className="text-sm font-semibold text-purple-800">
                    Recommendation
                  </p>

                  <p className="text-sm text-purple-700 mt-1 leading-relaxed">
                    {insights.recommendation}
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default AIInsightsCard;