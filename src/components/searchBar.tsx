import React from "react";
import { Search, X, TrendingUp, BarChart3, Star } from "lucide-react";

interface SearchBarProps {
  search: string;
  setSearch: (value: string) => void;
  totalCoins?: number;
  favoriteCount?: number;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  search, 
  setSearch, 
  totalCoins = 0, 
  favoriteCount = 0 
}) => {
  const clearSearch = () => {
    setSearch("");
  };

  return (
    <div className="relative mb-8 max-w-4xl mx-auto">
      {/* Main Search Container */}
      <div className="relative group">
        {/* Glowing Background Effect */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-focus-within:opacity-100 transition-all duration-500 blur-xl scale-110"></div>
        
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 pl-8 flex items-center pointer-events-none z-10">
          <div className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg group-focus-within:scale-110 transition-transform duration-300">
            <Search className="h-5 w-5 text-white" />
          </div>
        </div>
        
        {/* Input Field */}
        <input
          type="text"
          placeholder="Search Bitcoin, Ethereum, Dogecoin and 1000+ cryptocurrencies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="relative w-full pl-20 pr-16 py-6 bg-gradient-to-r from-slate-800/60 via-slate-800/80 to-slate-800/60 backdrop-blur-xl border-2 border-white/10 rounded-3xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 focus:bg-slate-800/90 transition-all duration-500 shadow-2xl hover:shadow-blue-500/10 hover:border-white/20 text-lg font-medium group-focus-within:scale-[1.02]"
        />
        
        {/* Clear Button */}
        {search && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-8 flex items-center z-10 group/clear"
          >
            <div className="p-2.5 rounded-full bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 transition-all duration-200 group-hover/clear:scale-110 group-hover/clear:bg-red-500/40">
              <X className="h-4 w-4 text-red-400 group-hover/clear:text-red-300 transition-colors duration-200" />
            </div>
          </button>
        )}
      </div>
      
      {/* Stats and Indicators */}
      <div className="flex items-center justify-between mt-6 px-2">
        <div className="flex items-center space-x-8 text-sm">
          <div className="flex items-center gap-3 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-full">
            <div className="relative">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full animate-ping opacity-30"></div>
            </div>
            <span className="text-green-400 font-semibold">Live Prices</span>
          </div>
          
          <div className="flex items-center gap-3 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full">
            <BarChart3 className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 font-semibold">{totalCoins.toLocaleString()} Coins</span>
          </div>
          
          <div className="flex items-center gap-3 px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full">
            <TrendingUp className="w-4 h-4 text-purple-400" />
            <span className="text-purple-400 font-semibold">Real-time Charts</span>
          </div>
        </div>
        
        {/* Favorites Counter */}
        {favoriteCount > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-full">
            <Star className="w-4 h-4 text-red-400 fill-current" />
            <span className="text-red-400 font-semibold">{favoriteCount} Favorites</span>
          </div>
        )}
      </div>
      
      {/* Search Results Counter */}
      {search && (
        <div className="mt-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-sm">
            <Search className="w-4 h-4 text-gray-400" />
            <span className="text-gray-300 text-sm">
              {search.length > 2 ? "Searching..." : "Type more to search"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;