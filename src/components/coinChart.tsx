import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
  Tooltip,
} from "chart.js";
import { TrendingUp, TrendingDown, BarChart3 } from "lucide-react";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Filler, Tooltip);

interface CoinChartProps {
  coinId: string;
}

interface CoinPrice {
  time: number;
  price: number;
}

interface MarketChartResponse {
  prices: [number, number][];
}

const CoinChart: React.FC<CoinChartProps> = ({ coinId }) => {
  const [prices, setPrices] = useState<CoinPrice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setLoading(true);
        setError(false);
        const response = await axios.get<MarketChartResponse>(
          `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart`,
          {
            params: { vs_currency: "usd", days: 7 },
          }
        );
        setPrices(
          response.data.prices.map((p: [number, number]) => ({
            time: p[0],
            price: p[1],
          }))
        );
      } catch (error) {
        console.error("Error fetching coin prices:", error);
        setError(true);
        setPrices([]);
      } finally {
        setLoading(false);
      }
    };

    void fetchPrices();
  }, [coinId]);

  // Calculate trend
  const isPositiveTrend = prices.length > 1 
    ? prices[prices.length - 1].price > prices[0].price 
    : true;

  if (loading) {
    return (
      <div className="w-32 h-16 flex items-center justify-center">
        <div className="flex space-x-1">
          <div className="w-2 h-8 bg-blue-400 rounded animate-pulse"></div>
          <div className="w-2 h-6 bg-blue-400 rounded animate-pulse animation-delay-100"></div>
          <div className="w-2 h-10 bg-blue-400 rounded animate-pulse animation-delay-200"></div>
          <div className="w-2 h-4 bg-blue-400 rounded animate-pulse animation-delay-300"></div>
          <div className="w-2 h-8 bg-blue-400 rounded animate-pulse animation-delay-400"></div>
        </div>
      </div>
    );
  }

  if (error || prices.length === 0) {
    return (
      <div className="w-32 h-16 flex items-center justify-center">
        <div className="text-gray-500 text-xs text-center">
          <BarChart3 className="w-6 h-6 mx-auto mb-1 opacity-50" />
          <div>No data</div>
        </div>
      </div>
    );
  }

  const chartData = {
    labels: prices.map((p) => new Date(p.time).toLocaleDateString()),
    datasets: [
      {
        label: "Price (USD)",
        data: prices.map((p) => p.price),
        borderColor: isPositiveTrend ? "#10B981" : "#EF4444",
        backgroundColor: isPositiveTrend 
          ? "rgba(16, 185, 129, 0.1)" 
          : "rgba(239, 68, 68, 0.1)",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBorderWidth: 2,
        pointHoverBorderColor: isPositiveTrend ? "#10B981" : "#EF4444",
        pointHoverBackgroundColor: "white",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        mode: "index" as const,
        intersect: false,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "white",
        bodyColor: "white",
        borderColor: isPositiveTrend ? "#10B981" : "#EF4444",
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: function(context: any) {
            return new Date(prices[context[0].dataIndex].time).toLocaleDateString();
          },
          label: function(context: any) {
            return `$${context.parsed.y.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      x: {
        display: false,
        grid: {
          display: false,
        },
      },
      y: {
        display: false,
        grid: {
          display: false,
        },
      },
    },
    elements: {
      point: {
        radius: 0,
      },
    },
    interaction: {
      intersect: false,
      mode: "index" as const,
    },
  };

  return (
    <div className="relative group">
      <div className="w-32 h-16 relative overflow-hidden rounded-lg bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-white/10 hover:border-white/20 transition-all duration-300">
        <Line data={chartData} options={chartOptions} />
        
        {/* Trend Indicator */}
        <div className={`absolute top-2 right-2 p-1 rounded ${
          isPositiveTrend 
            ? "bg-green-500/20 text-green-400" 
            : "bg-red-500/20 text-red-400"
        }`}>
          {isPositiveTrend ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
        </div>

        {/* Hover Effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
    </div>
  );
};

export default CoinChart;