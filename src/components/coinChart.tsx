import React, { useEffect, useState } from "react";
import axios from "axios";
import { TrendingUp, TrendingDown, Activity, AlertCircle } from "lucide-react";

interface CoinChartProps {
  coinId: string;
  height?: number;
  showMiniStats?: boolean;
}

interface PricePoint {
  time: number;
  price: number;
}

interface MarketChartResponse {
  prices: [number, number][];
}

const CoinChart: React.FC<CoinChartProps> = ({ 
  coinId, 
  height = 80, 
  showMiniStats = true 
}) => {
  const [prices, setPrices] = useState<PricePoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setLoading(true);
        setError(false);
        
        // // Simulated data for demo - replace with your actual API call
        // const mockPrices: [number, number][] = Array.from({ length: 20 }, (_, i) => [
        //   Date.now() - (19 - i) * 3600000, // hourly data for last 20 hours
        //   Math.random() * 1000 + 30000 + Math.sin(i * 0.5) * 5000
        // ]);
        
        // setPrices(
        //   mockPrices.map((p: [number, number]) => ({
        //     time: p[0],
        //     price: p[1],
        //   }))
        // );
        
        const response = await axios.get<MarketChartResponse>(
          `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart`,
          {
            params: { vs_currency: "usd", days: 1 },
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

  // Calculate trend and statistics
  const isPositiveTrend = prices.length > 1 
    ? prices[prices.length - 1].price > prices[0].price 
    : true;
    
  const priceChange = prices.length > 1 
    ? ((prices[prices.length - 1].price - prices[0].price) / prices[0].price) * 100 
    : 0;

  const maxPrice = Math.max(...prices.map(p => p.price));
  const minPrice = Math.min(...prices.map(p => p.price));

  // Generate SVG path for the chart line
  const generatePath = () => {
    if (prices.length < 2) return "";
    
    const width = 160;
    const chartHeight = height;
    const padding = 8;
    
    const xStep = (width - padding * 2) / (prices.length - 1);
    const yRange = maxPrice - minPrice || 1;
    
    let path = "";
    
    prices.forEach((point, index) => {
      const x = padding + index * xStep;
      const y = chartHeight - padding - ((point.price - minPrice) / yRange) * (chartHeight - padding * 2);
      
      if (index === 0) {
        path += `M ${x} ${y}`;
      } else {
        path += ` L ${x} ${y}`;
      }
    });
    
    return path;
  };

  // Generate area path for gradient fill
  const generateAreaPath = () => {
    const linePath = generatePath();
    if (!linePath) return "";
    
    const width = 160;
    const chartHeight = height;
    const padding = 8;
    
    return `${linePath} L ${width - padding} ${chartHeight - padding} L ${padding} ${chartHeight - padding} Z`;
  };

  if (loading) {
    return (
      <div 
        className="relative flex items-center justify-center bg-gradient-to-br from-slate-800/40 to-slate-900/60 rounded-xl border border-white/10 overflow-hidden group"
        style={{ width: 160, height }}
      >
        {/* Animated Loading Bars */}
        <div className="flex items-end space-x-1">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-blue-400 rounded-sm animate-pulse"
              style={{
                width: 3,
                height: Math.random() * 30 + 10,
                animationDelay: `${i * 100}ms`,
                animationDuration: '1.5s'
              }}
            />
          ))}
        </div>
        
        {/* Loading Indicator */}
        <div className="absolute top-2 right-2">
          <Activity className="w-4 h-4 text-blue-400 animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || prices.length === 0) {
    return (
      <div 
        className="relative flex flex-col items-center justify-center bg-gradient-to-br from-slate-800/40 to-slate-900/60 rounded-xl border border-red-500/20 overflow-hidden group"
        style={{ width: 160, height }}
      >
        <AlertCircle className="w-6 h-6 text-red-400 mb-1" />
        <div className="text-red-400 text-xs font-medium">Chart Error</div>
      </div>
    );
  }

  const pathD = generatePath();
  const areaPath = generateAreaPath();

  return (
    <div className="relative group">
      <div 
        className="relative bg-gradient-to-br from-slate-800/40 to-slate-900/60 rounded-xl border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
        style={{ width: 160, height }}
      >
        {/* SVG Chart */}
        <svg
          width="160"
          height={height}
          className="absolute inset-0 w-full h-full"
          viewBox={`0 0 160 ${height}`}
        >
          {/* Gradient Definitions */}
          <defs>
            <linearGradient 
              id={`gradient-${coinId}`} 
              x1="0%" 
              y1="0%" 
              x2="0%" 
              y2="100%"
            >
              <stop 
                offset="0%" 
                stopColor={isPositiveTrend ? "#10B981" : "#EF4444"} 
                stopOpacity="0.6" 
              />
              <stop 
                offset="100%" 
                stopColor={isPositiveTrend ? "#10B981" : "#EF4444"} 
                stopOpacity="0.1" 
              />
            </linearGradient>
            
            <linearGradient 
              id={`line-gradient-${coinId}`} 
              x1="0%" 
              y1="0%" 
              x2="100%" 
              y2="0%"
            >
              <stop 
                offset="0%" 
                stopColor={isPositiveTrend ? "#10B981" : "#EF4444"} 
              />
              <stop 
                offset="100%" 
                stopColor={isPositiveTrend ? "#06D6A0" : "#FF6B6B"} 
              />
            </linearGradient>
          </defs>

          {/* Area Fill */}
          <path
            d={areaPath}
            fill={`url(#gradient-${coinId})`}
            className="opacity-60"
          />

          {/* Chart Line */}
          <path
            d={pathD}
            fill="none"
            stroke={`url(#line-gradient-${coinId})`}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow-sm"
          />

          {/* Data Points */}
          {prices.map((point, index) => {
            const x = 8 + index * ((160 - 16) / (prices.length - 1));
            const y = height - 8 - ((point.price - minPrice) / (maxPrice - minPrice || 1)) * (height - 16);
            
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="2"
                fill={isPositiveTrend ? "#10B981" : "#EF4444"}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
            );
          })}
        </svg>

        {/* Trend Indicator */}
        <div className={`absolute top-2 right-2 p-1.5 rounded-lg backdrop-blur-sm ${
          isPositiveTrend 
            ? "bg-green-500/20 border border-green-500/30" 
            : "bg-red-500/20 border border-red-500/30"
        }`}>
          {isPositiveTrend ? (
            <TrendingUp className="w-3.5 h-3.5 text-green-400" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5 text-red-400" />
          )}
        </div>

        {/* Mini Stats */}
        {showMiniStats && (
          <div className="absolute bottom-2 left-2 text-xs">
            <div className={`font-semibold ${
              isPositiveTrend ? "text-green-400" : "text-red-400"
            }`}>
              {priceChange >= 0 ? "+" : ""}{priceChange.toFixed(1)}%
            </div>
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>

      {/* Tooltip on Hover */}
      <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-black/90 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-lg border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-10">
        <div className="font-semibold">24h Performance</div>
        <div className={`${isPositiveTrend ? "text-green-400" : "text-red-400"}`}>
          {priceChange >= 0 ? "+" : ""}{priceChange.toFixed(2)}%
        </div>
      </div>
    </div>
  );
};

export default CoinChart;