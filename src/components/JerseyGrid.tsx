
import React from "react";
import { cn } from "@/lib/utils";
import JerseyCard from "@/components/JerseyCard";
import JerseyCardSkeleton from "@/components/JerseyCardSkeleton";
import { Jersey } from "@/types/shop";

type Props = {
  jerseys: Jersey[];
  totalJerseys: number;
  viewMode: "grid" | "list";
  isLoading: boolean;
  onViewJersey: (jersey: Jersey) => void;
  onAddToCart: (jersey: Jersey) => void;
  onCustomizeJersey: (jersey: Jersey) => void;
};

const JerseyGrid: React.FC<Props> = ({
  jerseys,
  totalJerseys,
  viewMode,
  isLoading,
  onViewJersey,
  onAddToCart,
  onCustomizeJersey,
}) => {
  const gridClasses = cn(
    "grid gap-6 mb-12",
    viewMode === "grid"
      ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      : "grid-cols-1"
  );

  if (isLoading) {
    return (
      <div className={gridClasses}>
        {[...Array(8)].map((_, i) => (
          <JerseyCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <>
      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-400">
          Showing {jerseys.length} of {totalJerseys} jerseys
        </p>
      </div>

      {/* Jersey Grid */}
      <div className={gridClasses}>
        {jerseys.map((jersey) => (
          <div key={jersey.id} className="animate-fade-in">
            <JerseyCard
              jersey={jersey}
              onView={onViewJersey}
              onAdd={onAddToCart}
              onCustomize={onCustomizeJersey}
            />
          </div>
        ))}
      </div>

      {jerseys.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No jerseys found matching your criteria.</p>
        </div>
      )}
    </>
  );
};

export default JerseyGrid;
