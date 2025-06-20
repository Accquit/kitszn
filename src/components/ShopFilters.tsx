
import React from "react";
import { Search, Grid, List } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  searchTerm: string;
  selectedCategory: string;
  sortBy: string;
  viewMode: "grid" | "list";
  categories: string[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onViewModeChange: (mode: "grid" | "list") => void;
};

const ShopFilters: React.FC<Props> = ({
  searchTerm,
  selectedCategory,
  sortBy,
  viewMode,
  categories,
  onSearchChange,
  onCategoryChange,
  onSortChange,
  onViewModeChange,
}) => {
  return (
    <div className="glass-card rounded-xl p-6 mb-8">
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search jerseys..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-input border border-white/10 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="px-4 py-3 bg-input border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            {categories.map((category) => (
              <option key={category} value={category} className="bg-gray-800">
                {category}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="px-4 py-3 bg-input border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="featured" className="bg-gray-800">Featured</option>
            <option value="name" className="bg-gray-800">Name A-Z</option>
            <option value="price-low" className="bg-gray-800">Price: Low to High</option>
            <option value="price-high" className="bg-gray-800">Price: High to Low</option>
          </select>

          {/* View Mode */}
          <div className="flex border border-white/10 rounded-lg overflow-hidden">
            <button
              onClick={() => onViewModeChange("grid")}
              className={cn(
                "p-3 transition-colors",
                viewMode === "grid"
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                  : "bg-input text-gray-300 hover:text-white"
              )}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => onViewModeChange("list")}
              className={cn(
                "p-3 transition-colors",
                viewMode === "list"
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                  : "bg-input text-gray-300 hover:text-white"
              )}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopFilters;
