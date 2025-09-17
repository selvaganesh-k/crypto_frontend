import React, { useEffect, useState } from "react";
import axios from "axios";
import SearchBar from "./searchBar";
import CoinChart from "./coinChart";
import { 
  Star, 
  TrendingUp, 
  TrendingDown, 
  Heart, 
  Sparkles, 
  Crown,
  Eye,
  ArrowUpDown,
  Zap,
  DollarSign,
  BarChart3,
  Globe,
  Shield,
  Search
} from "lucide-react";

interface Coin {
  id: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  symbol: string;
  market_cap?: number;
  total_volume?: number;
  market_cap_rank?: number;
  price_change_percentage_7d?: number;
  high_24h?: number;
  low_24h?: number;
  circulating_supply?: number;
  total_supply?: number;
}

const CryptoTable: React.FC = () => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'rank' | 'price' | 'change' | 'volume'>('rank');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        setLoading(true);
        // Mock data for demonstration - replace with your actual API call
        // const mockCoins: Coin[] = [
        //   {
        //     id: "bitcoin",
        //     name: "Bitcoin",
        //     symbol: "BTC",
        //     image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
        //     current_price: 45230.50,
        //     price_change_percentage_24h: 2.45,
        //     market_cap: 885000000000,
        //     total_volume: 28000000000,
        //     market_cap_rank: 1,
        //     price_change_percentage_7d: 8.2,
        //     high_24h: 46500,
        //     low_24h: 44100,
        //     circulating_supply: 19500000,
        //     total_supply: 21000000
        //   },
        //   {
        //     id: "ethereum",
        //     name: "Ethereum",
        //     symbol: "ETH",
        //     image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
        //     current_price: 2845.75,
        //     price_change_percentage_24h: -1.23,
        //     market_cap: 342000000000,
        //     total_volume: 15000000000,
        //     market_cap_rank: 2,
        //     price_change_percentage_7d: 5.1,
        //     high_24h: 2890,
        //     low_24h: 2820,
        //     circulating_supply: 120000000,
        //     total_supply: undefined
        //   },
        //   {
        //     id: "cardano",
        //     name: "Cardano",
        //     symbol: "ADA",
        //     image: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
        //     current_price: 0.52,
        //     price_change_percentage_24h: 4.67,
        //     market_cap: 18500000000,
        //     total_volume: 850000000,
        //     market_cap_rank: 8,
        //     price_change_percentage_7d: -2.3,
        //     high_24h: 0.54,
        //     low_24h: 0.49,
        //     circulating_supply: 35000000000,
        //     total_supply: 45000000000
        //   }
        // ];
        
        // setCoins(mockCoins);
      
        const response = await axios.get<Coin[]>("http://localhost:5000/api/coins");
        setCoins(response.data);
      } catch (err) {
        console.error("Error fetching coin prices:", err);
        setCoins([]);
      } finally {
        setLoading(false);
      }
    };

    void fetchCoins();
  }, []);

  const toggleFavorite = (coin: Coin) => {
    let updated: Coin[];
    if (favorites.find((f) => f.id === coin.id)) {
      updated = favorites.filter((f) => f.id !== coin.id);
    } else {
      updated = [...favorites, coin];
    }
    setFavorites(updated);
  };

  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const sortedCoins = [...coins].sort((a, b) => {
    let aValue: number, bValue: number;
    
    switch (sortBy) {
      case 'rank':
        aValue = a.market_cap_rank || 999;
        bValue = b.market_cap_rank || 999;
        break;
      case 'price':
        aValue = a.current_price;
        bValue = b.current_price;
        break;
      case 'change':
        aValue = a.price_change_percentage_24h;
        bValue = b.price_change_percentage_24h;
        break;
      case 'volume':
        aValue = a.total_volume || 0;
        bValue = b.total_volume || 0;
        break;
      default:
        return 0;
    }
    
    return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
  });

  const filteredCoins = sortedCoins.filter((coin) => {
    const matchesSearch = coin.name.toLowerCase().includes(search.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(search.toLowerCase());
    const matchesFavorites = showFavoritesOnly ? favorites.find(f => f.id === coin.id) : true;
    return matchesSearch && matchesFavorites;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-6 py-8">
          {/* Loading Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl animate-pulse"></div>
              <div className="w-64 h-10 bg-white/10 rounded-xl animate-pulse"></div>
            </div>
            <div className="w-96 h-6 bg-white/5 rounded-lg mx-auto animate-pulse"></div>
          </div>
          
          {/* Loading Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="h-16 bg-white/10 rounded-2xl animate-pulse"></div>
          </div>
          
          {/* Loading Table */}
          <div className="bg-white/5 rounded-2xl p-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between py-4 border-b border-white/10 last:border-0">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-full animate-pulse"></div>
                  <div>
                    <div className="w-24 h-4 bg-white/10 rounded animate-pulse mb-2"></div>
                    <div className="w-16 h-3 bg-white/10 rounded animate-pulse"></div>
                  </div>
                </div>
                <div className="w-32 h-16 bg-white/10 rounded-lg animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="relative p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-2xl">
              <Sparkles className="w-10 h-10 text-white" />
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                <Crown className="w-3 h-3 text-yellow-900" />
              </div>
            </div>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                CryptoVault Pro
              </h1>
              <div className="flex items-center justify-center gap-2 mt-2">
                <Shield className="w-4 h-4 text-green-400" />
                <span className="text-green-400 text-sm font-semibold">Secure & Real-time</span>
              </div>
            </div>
          </div>
          <p className="text-gray-300 text-xl max-w-2xl mx-auto leading-relaxed">
            Your premium cryptocurrency portfolio tracker with advanced analytics, 
            real-time charts, and comprehensive market insights
          </p>
        </div>

        <SearchBar 
          search={search} 
          setSearch={setSearch} 
          totalCoins={coins.length}
          favoriteCount={favorites.length}
        />

        {/* Quick Actions & Filters */}
        <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                showFavoritesOnly
                  ? "bg-red-500/20 text-red-400 border-2 border-red-500/30 shadow-lg shadow-red-500/20"
                  : "bg-white/10 text-gray-300 border-2 border-white/20 hover:bg-white/20"
              }`}
            >
              <Heart className={`w-5 h-5 ${showFavoritesOnly ? "fill-current" : ""}`} />
              {showFavoritesOnly ? "Show All" : "Favorites Only"}
            </button>
            
            <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl">
              <Globe className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-300">Market Cap: $2.1T</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Last Updated: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>

        {/* Favorites Grid */}
        {favorites.length > 0 && !showFavoritesOnly && (
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg">
                <Heart className="w-6 h-6 text-white fill-current" />
              </div>
              <h2 className="text-3xl font-bold text-white">Your Favorites</h2>
              <div className="px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full">
                <span className="text-red-400 text-sm font-semibold">{favorites.length}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
              {favorites.map((coin) => (
                <div
                  key={coin.id}
                  className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-gradient-to-br hover:from-white/20 hover:to-white/10 transition-all duration-500 shadow-xl hover:shadow-2xl hover:scale-105 hover:border-white/30"
                >
                  {/* Favorite Badge */}
                  <div className="absolute -top-2 -right-2 p-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-full shadow-lg">
                    <Star className="w-4 h-4 text-white fill-current" />
                  </div>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative">
                      <img 
                        src={coin.image} 
                        alt={coin.name} 
                        className="w-16 h-16 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300" 
                      />
                      {coin.market_cap_rank && coin.market_cap_rank <= 3 && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                          <Crown className="w-3 h-3 text-yellow-900" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-white text-lg">{coin.name}</h3>
                      <p className="text-gray-300 text-sm uppercase font-semibold">{coin.symbol}</p>
                      {coin.market_cap_rank && (
                        <p className="text-xs text-gray-400">Rank #{coin.market_cap_rank}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <span className="text-white font-bold text-2xl">
                        ${coin.current_price.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-semibold ${
                      coin.price_change_percentage_24h > 0
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : "bg-red-500/20 text-red-400 border border-red-500/30"
                    }`}>
                      {coin.price_change_percentage_24h > 0 ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                    </div>
                    
                    {coin.market_cap && (
                      <div className="text-xs text-gray-400">
                        Market Cap: ${(coin.market_cap / 1e9).toFixed(1)}B
                      </div>
                    )}
                  </div>
                  
                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Crypto Table */}
        <div className="bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
          {/* Table Header */}
          <div className="bg-gradient-to-r from-slate-800/80 to-slate-900/80 px-6 py-4 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-6 h-6 text-blue-400" />
                <h3 className="text-xl font-bold text-white">
                  {showFavoritesOnly ? "Favorite Cryptocurrencies" : "All Cryptocurrencies"}
                </h3>
                <div className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full">
                  <span className="text-blue-400 text-sm font-semibold">{filteredCoins.length}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span>Live Data</span>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-slate-800/60 to-slate-900/60 border-b border-white/10">
                  <th className="text-left p-6 text-white font-semibold">
                    <button
                      onClick={() => handleSort('rank')}
                      className="flex items-center gap-2 hover:text-blue-400 transition-colors duration-300"
                    >
                      <span>#</span>
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </th>
                  <th className="text-left p-6 text-white font-semibold">Cryptocurrency</th>
                  <th className="text-right p-6 text-white font-semibold">
                    <button
                      onClick={() => handleSort('price')}
                      className="flex items-center gap-2 ml-auto hover:text-blue-400 transition-colors duration-300"
                    >
                      <DollarSign className="w-4 h-4" />
                      <span>Price</span>
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </th>
                  <th className="text-right p-6 text-white font-semibold">
                    <button
                      onClick={() => handleSort('change')}
                      className="flex items-center gap-2 ml-auto hover:text-blue-400 transition-colors duration-300"
                    >
                      <span>24h Change</span>
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </th>
                  <th className="text-right p-6 text-white font-semibold">
                    <button
                      onClick={() => handleSort('volume')}
                      className="flex items-center gap-2 ml-auto hover:text-blue-400 transition-colors duration-300"
                    >
                      <span>Volume</span>
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </th>
                  <th className="text-center p-6 text-white font-semibold">Market Cap</th>
                  <th className="text-center p-6 text-white font-semibold">
                    <Eye className="w-5 h-5 mx-auto" />
                  </th>
                  <th className="text-center p-6 text-white font-semibold">Chart (7d)</th>
                </tr>
              </thead>
              <tbody>
                {filteredCoins.map((coin, index) => (
                  <tr
                    key={coin.id}
                    className="border-b border-white/5 hover:bg-gradient-to-r hover:from-white/5 hover:to-transparent transition-all duration-300 group"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Rank */}
                    <td className="p-6">
                      <div className="flex items-center">
                        {coin.market_cap_rank && (
                          <>
                            <span className="text-gray-400 font-bold text-lg min-w-[3rem]">
                              {coin.market_cap_rank}
                            </span>
                            {coin.market_cap_rank <= 3 && (
                              <Crown className="w-5 h-5 text-yellow-400 ml-2" />
                            )}
                          </>
                        )}
                      </div>
                    </td>
                    
                    {/* Cryptocurrency Info */}
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img 
                            src={coin.image} 
                            alt={coin.name} 
                            className="w-14 h-14 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300" 
                          />
                          {favorites.find(f => f.id === coin.id) && (
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                              <Heart className="w-3 h-3 text-white fill-current" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-white text-lg group-hover:text-blue-400 transition-colors duration-300">
                            {coin.name}
                          </h3>
                          <p className="text-gray-400 text-sm uppercase font-semibold">
                            {coin.symbol}
                          </p>
                        </div>
                      </div>
                    </td>
                    
                    {/* Price */}
                    <td className="p-6 text-right">
                      <div className="space-y-1">
                        <span className="text-white font-bold text-xl">
                          ${coin.current_price.toLocaleString()}
                        </span>
                        {coin.high_24h && coin.low_24h && (
                          <div className="text-xs text-gray-400">
                            H: ${coin.high_24h.toLocaleString()} / L: ${coin.low_24h.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </td>
                    
                    {/* 24h Change */}
                    <td className="p-6 text-right">
                      <div className="space-y-2">
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${
                          coin.price_change_percentage_24h > 0
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : "bg-red-500/20 text-red-400 border border-red-500/30"
                        }`}>
                          {coin.price_change_percentage_24h > 0 ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                          {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                        </div>
                        {coin.price_change_percentage_7d && (
                          <div className={`text-xs ${
                            coin.price_change_percentage_7d > 0 ? "text-green-400" : "text-red-400"
                          }`}>
                            7d: {coin.price_change_percentage_7d > 0 ? "+" : ""}{coin.price_change_percentage_7d.toFixed(1)}%
                          </div>
                        )}
                      </div>
                    </td>
                    
                    {/* Volume */}
                    <td className="p-6 text-right">
                      <div className="text-white font-semibold">
                        {coin.total_volume ? `${(coin.total_volume / 1e9).toFixed(2)}B` : "N/A"}
                      </div>
                    </td>
                    
                    {/* Market Cap */}
                    <td className="p-6 text-center">
                      <div className="space-y-1">
                        <div className="text-white font-semibold">
                          {coin.market_cap ? `${(coin.market_cap / 1e9).toFixed(1)}B` : "N/A"}
                        </div>
                        {coin.circulating_supply && (
                          <div className="text-xs text-gray-400">
                            Supply: {(coin.circulating_supply / 1e6).toFixed(0)}M
                          </div>
                        )}
                      </div>
                    </td>
                    
                    {/* Favorite Button */}
                    <td className="p-6 text-center">
                      <button
                        onClick={() => toggleFavorite(coin)}
                        className={`group/fav p-3 rounded-full transition-all duration-300 hover:scale-110 ${
                          favorites.find((f) => f.id === coin.id)
                            ? "bg-red-500/20 text-red-400 hover:bg-red-500/30 border-2 border-red-500/30"
                            : "bg-gray-500/20 text-gray-400 hover:bg-gray-500/30 border-2 border-gray-500/30 hover:text-white hover:border-white/30"
                        }`}
                      >
                        <Star
                          className={`w-5 h-5 transition-all duration-300 ${
                            favorites.find((f) => f.id === coin.id) 
                              ? "fill-current" 
                              : "group-hover/fav:fill-current"
                          }`}
                        />
                      </button>
                    </td>
                    
                    {/* Chart */}
                    <td className="p-6 text-center">
                      <div className="flex justify-center">
                        <CoinChart coinId={coin.id} height={64} showMiniStats={false} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {filteredCoins.length === 0 && !loading && (
          <div className="text-center py-20">
            <div className="mb-8">
              <div className="w-24 h-24 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full mx-auto flex items-center justify-center mb-6">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">No cryptocurrencies found</h3>
              <p className="text-gray-400 text-lg max-w-md mx-auto">
                {search 
                  ? `No results for "${search}". Try adjusting your search terms.`
                  : showFavoritesOnly 
                    ? "You haven't added any favorites yet. Star some coins to see them here!"
                    : "No cryptocurrencies available at the moment."
                }
              </p>
            </div>
            
            {(search || showFavoritesOnly) && (
              <button
                onClick={() => {
                  setSearch("");
                  setShowFavoritesOnly(false);
                }}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
        
        {/* Footer Stats */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-8 px-8 py-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-400" />
              <span className="text-white font-semibold">Global Market</span>
            </div>
            <div className="w-px h-6 bg-white/20"></div>
            <div className="text-gray-300">
              Tracking <span className="text-white font-bold">{coins.length.toLocaleString()}</span> cryptocurrencies
            </div>
            <div className="w-px h-6 bg-white/20"></div>
            <div className="text-gray-300">
              <span className="text-green-400 font-bold">{favorites.length}</span> in watchlist
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoTable;