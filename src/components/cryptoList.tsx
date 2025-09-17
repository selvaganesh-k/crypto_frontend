import React, { useEffect, useState } from "react";
import axios from "axios";
import SearchBar from "./searchBar";
import CoinChart from "./coinChart";
import { Star, TrendingUp, TrendingDown, Heart, Sparkles } from "lucide-react";

interface Coin {
  id: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  symbol?: string;
}

const CryptoList: React.FC = () => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState<Coin[]>(() => {
    try {
      const stored = localStorage.getItem("favorites");
      return stored ? JSON.parse(stored) as Coin[] : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchcoins = async () => {
      try {
        setLoading(true);
        const response = await axios.get<Coin[]>("http://localhost:5000/api/coins");
        setCoins(response.data);
      } catch (err) {
        console.error("Error fetching coin prices:", err);
        setCoins([]);
      } finally {
        setLoading(false);
      }
    };

    void fetchcoins();
  }, []);

  const toggleFavorite = (coin: Coin) => {
    let updated: Coin[];
    if (favorites.find((f) => f.id === coin.id)) {
      updated = favorites.filter((f) => f.id !== coin.id);
    } else {
      updated = [...favorites, coin];
    }
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  const filteredCoins = coins.filter((coin) =>
    coin.name.toLowerCase().includes(search.toLowerCase()) ||
    (coin.symbol && coin.symbol.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-blue-400 border-b-transparent rounded-full animate-spin animation-delay-150"></div>
            </div>
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
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Crypto Tracker
            </h1>
          </div>
          <p className="text-gray-300 text-lg">Track your favorite cryptocurrencies in real-time</p>
        </div>

        <SearchBar search={search} setSearch={setSearch} />

        {/* Favorites Section */}
        {favorites.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Heart className="w-6 h-6 text-red-400" />
              <h2 className="text-2xl font-bold text-white">Favorites</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
              {favorites.map((coin) => (
                <div
                  key={coin.id}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <div className="flex items-center gap-3">
                    <img src={coin.image} alt={coin.name} className="w-10 h-10 rounded-full" />
                    <div>
                      <h3 className="font-semibold text-white">{coin.name}</h3>
                      <p className="text-sm text-gray-300">${coin.current_price.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Crypto Table */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-white/10 border-b border-white/20">
                  <th className="text-left p-6 text-white font-semibold">Cryptocurrency</th>
                  <th className="text-right p-6 text-white font-semibold">Price</th>
                  <th className="text-right p-6 text-white font-semibold">24h Change</th>
                  <th className="text-center p-6 text-white font-semibold">Favorite</th>
                  <th className="text-center p-6 text-white font-semibold">Chart</th>
                </tr>
              </thead>
              <tbody>
                {filteredCoins.map((coin, index) => (
                  <tr
                    key={coin.id}
                    className="border-b border-white/10 hover:bg-white/5 transition-all duration-300 group"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <img 
                          src={coin.image} 
                          alt={coin.name} 
                          className="w-12 h-12 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300" 
                        />
                        <div>
                          <h3 className="font-semibold text-white text-lg">{coin.name}</h3>
                          <p className="text-gray-400 text-sm uppercase">{coin.symbol || coin.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6 text-right">
                      <span className="text-white font-bold text-xl">
                        ${coin.current_price.toLocaleString()}
                      </span>
                    </td>
                    <td className="p-6 text-right">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${
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
                    </td>
                    <td className="p-6 text-center">
                      <button
                        onClick={() => toggleFavorite(coin)}
                        className={`p-3 rounded-full transition-all duration-300 hover:scale-110 ${
                          favorites.find((f) => f.id === coin.id)
                            ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                            : "bg-gray-500/20 text-gray-400 hover:bg-gray-500/30"
                        }`}
                      >
                        <Star
                          className={`w-5 h-5 ${
                            favorites.find((f) => f.id === coin.id) ? "fill-current" : ""
                          }`}
                        />
                      </button>
                    </td>
                    <td className="p-6 text-center">
                      <div className="flex justify-center">
                        <CoinChart coinId={coin.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredCoins.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-xl mb-4">No cryptocurrencies found</div>
            <p className="text-gray-500">Try adjusting your search terms</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CryptoList;