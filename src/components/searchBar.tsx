import React from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  search: string;
  setSearch: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ search, setSearch }) => {
  const clearSearch = () => {
    setSearch("");
  };

  return (
    <div className="relative mb-8 max-w-2xl mx-auto">
      <div className="relative group">
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none z-10">
          <Search className="h-6 w-6 text-gray-400 group-focus-within:text-blue-400 transition-colors duration-300" />
        </div>
        
        {/* Input Field */}
        <input
          type="text"
          placeholder="Search cryptocurrencies by name or symbol..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-16 pr-16 py-5 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300 shadow-lg hover:shadow-xl hover:bg-white/15 text-lg font-medium"
        />
        
        {/* Clear Button */}
        {search && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-6 flex items-center z-10 group/clear"
          >
            <div className="p-2 rounded-full bg-gray-500/20 hover:bg-gray-500/30 transition-all duration-200 group-hover/clear:scale-110">
              <X className="h-4 w-4 text-gray-400 hover:text-white transition-colors duration-200" />
            </div>
          </button>
        )}
        
        {/* Animated Border */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-focus-within:opacity-20 transition-opacity duration-300 -z-10 blur-xl"></div>
      </div>
      
      {/* Search Suggestions/Stats */}
      <div className="flex items-center justify-center mt-4 space-x-6 text-sm text-gray-400">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>Live Prices</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse animation-delay-300"></div>
          <span>Real-time Data</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse animation-delay-700"></div>
          <span>Market Trends</span>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;