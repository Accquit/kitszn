import React from "react";
import { cn } from "@/lib/utils";
import { Palette } from "lucide-react";
import { Jersey } from "@/types/shop";

type Props = {
  jersey: Jersey;
  onView: (jersey: Jersey) => void;
  onAdd: (jersey: Jersey) => void;
  onCustomize?: (jersey: Jersey) => void;
};

const JerseyCard: React.FC<Props> = ({ jersey, onView, onAdd, onCustomize }) => (
  <div
    className={cn(
      "glass-card rounded-xl p-6 cursor-pointer transform transition-all duration-300 hover-lift group"
    )}
    onClick={() => onView(jersey)}
  >
    {/* Image */}
    <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 mb-4">
      <img
        src={jersey.image}
        alt={`${jersey.team} Jersey`}
        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        draggable={false}
      />
    </div>

    {/* Content */}
    <div className="space-y-3">
      <h3 className="font-bold text-lg text-white font-['Space_Grotesk']">
        {jersey.team}
      </h3>
      
      <div className="flex items-center justify-between">
        <span className="text-xl font-bold text-gradient-accent">
          ₹{Math.round(jersey.price)}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        <button
          className="w-full py-3 bg-[#cc73f8] text-white font-semibold rounded-lg hover:bg-[#b85df0] transition-all duration-300"
          onClick={e => {
            e.stopPropagation();
            onAdd(jersey);
          }}
        >
          Add to Cart
        </button>
        
        {onCustomize && (
          <button
            className="w-full py-2 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 transition-all duration-300 border border-white/20 flex items-center justify-center space-x-2"
            onClick={e => {
              e.stopPropagation();
              onCustomize(jersey);
            }}
          >
            <Palette className="w-4 h-4" />
            <span>Customize</span>
          </button>
        )}
      </div>
    </div>
  </div>
);

export default JerseyCard;
