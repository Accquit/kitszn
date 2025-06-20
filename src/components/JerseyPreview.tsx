import React from "react";
import { cn } from "@/lib/utils";
import { JerseyCustomization } from "@/types/shop";

type Props = {
  baseImage: string;
  customization: JerseyCustomization;
  className?: string;
};

const JerseyPreview: React.FC<Props> = ({ baseImage, customization, className }) => {
  return (
    <div className={cn("relative", className)}>
      {/* Base Jersey Image */}
      <div className="relative overflow-hidden rounded-lg bg-gray-900">
        <img
          src={baseImage}
          alt="Jersey Preview"
          className="w-full h-80 object-cover"
        />
        
        {/* Color Overlay - More subtle and jersey-focused */}
        <div 
          className="absolute inset-0 mix-blend-multiply opacity-60 rounded-lg"
          style={{ backgroundColor: customization.color }}
        />
        
        {/* Player Name - Positioned like real jersey with proper sports font */}
        {customization.playerName && (
          <div className="absolute top-12 left-1/2 transform -translate-x-1/2">
            <div 
              className="text-white font-black text-sm uppercase tracking-[0.2em] text-center"
              style={{
                fontFamily: "'Arial Black', 'Helvetica', sans-serif",
                textShadow: "2px 2px 4px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.5)",
                letterSpacing: "0.15em",
                WebkitTextStroke: "1px rgba(0,0,0,0.3)"
              }}
            >
              {customization.playerName}
            </div>
          </div>
        )}
        
        {/* Player Number - Large, centered, and bold like real jersey */}
        {customization.playerNumber && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div 
              className="text-white font-black text-6xl text-center leading-none"
              style={{
                fontFamily: "'Arial Black', 'Helvetica', sans-serif",
                textShadow: "3px 3px 6px rgba(0,0,0,0.9), -2px -2px 4px rgba(0,0,0,0.6)",
                WebkitTextStroke: "2px rgba(0,0,0,0.4)"
              }}
            >
              {customization.playerNumber}
            </div>
          </div>
        )}
      </div>
      
      {/* Customization Details */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center space-x-2">
          <div 
            className="w-4 h-4 rounded-full border border-gray-300"
            style={{ backgroundColor: customization.color }}
          />
          <span className="text-sm text-gray-300">Color: {customization.color}</span>
        </div>
        {customization.playerName && (
          <div className="text-sm text-gray-300">
            Name: {customization.playerName}
          </div>
        )}
        {customization.playerNumber && (
          <div className="text-sm text-gray-300">
            Number: #{customization.playerNumber}
          </div>
        )}
      </div>
    </div>
  );
};

export default JerseyPreview;
