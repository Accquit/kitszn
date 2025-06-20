import React, { useState } from "react";
import { X, Palette, Type, Hash } from "lucide-react";
import { cn } from "@/lib/utils";
import JerseyPreview from "./JerseyPreview";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

type Jersey = {
  id: number;
  team: string;
  price: number;
  image: string;
};

type JerseyCustomization = {
  color: string;
  playerName: string;
  playerNumber: string;
};

type Props = {
  open: boolean;
  jersey?: Jersey;
  onClose: () => void;
  onAddCustomized: (jersey: Jersey, customization: JerseyCustomization) => void;
};

const AVAILABLE_COLORS = [
  { name: "Red", value: "#dc2626" },
  { name: "Blue", value: "#2563eb" },
  { name: "Green", value: "#16a34a" },
  { name: "Purple", value: "#9333ea" },
  { name: "Orange", value: "#ea580c" },
  { name: "Yellow", value: "#eab308" },
  { name: "Pink", value: "#ec4899" },
  { name: "Black", value: "#000000" },
];

const JerseyCustomizer: React.FC<Props> = ({ open, jersey, onClose, onAddCustomized }) => {
  const [customization, setCustomization] = useState<JerseyCustomization>({
    color: AVAILABLE_COLORS[0].value,
    playerName: "",
    playerNumber: "",
  });

  const handleCustomizationChange = (field: keyof JerseyCustomization, value: string) => {
    setCustomization(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddToCart = () => {
    if (jersey) {
      onAddCustomized(jersey, customization);
      onClose();
    }
  };

  const resetCustomization = () => {
    setCustomization({
      color: AVAILABLE_COLORS[0].value,
      playerName: "",
      playerNumber: "",
    });
  };

  React.useEffect(() => {
    if (open) {
      resetCustomization();
    }
  }, [open]);

  if (!open || !jersey) return null;

  const baseCustomizationFee = 1245;
  const nameFee = customization.playerName.trim() ? 415 : 0;
  const numberFee = customization.playerNumber.trim() ? 415 : 0;
  const totalCustomizationFee = baseCustomizationFee + nameFee + numberFee;
  const totalPrice = jersey.price + totalCustomizationFee;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="relative max-w-4xl w-full mx-4 bg-gradient-to-b from-gray-900 to-black rounded-2xl shadow-2xl animate-scale-in border border-white/10 max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-white font-['Space_Grotesk']">
              Customize Your Jersey
            </h2>
            <p className="text-gray-300">{jersey.team}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-300 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row flex-1 min-h-0">
          {/* Preview Section */}
          <div className="lg:w-1/2 p-6 border-r border-white/10 flex-shrink-0">
            <div className="sticky top-0">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Palette className="w-5 h-5 mr-2" />
                Live Preview
              </h3>
              <JerseyPreview
                baseImage={jersey.image}
                customization={customization}
                className="w-full max-w-sm mx-auto"
              />
            </div>
          </div>

          {/* Customization Options */}
          <div className="lg:w-1/2 flex flex-col min-h-0">
            <div className="p-6 overflow-y-auto flex-1">
              <div className="space-y-6">
                {/* Color Selection */}
                <div>
                  <Label className="text-white text-base font-semibold mb-3 flex items-center">
                    <Palette className="w-4 h-4 mr-2" />
                    Jersey Color
                  </Label>
                  <div className="grid grid-cols-4 gap-3">
                    {AVAILABLE_COLORS.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => handleCustomizationChange('color', color.value)}
                        className={cn(
                          "w-12 h-12 rounded-lg border-2 transition-all duration-200 hover:scale-105",
                          customization.color === color.value
                            ? "border-white shadow-lg scale-105"
                            : "border-gray-600 hover:border-gray-400"
                        )}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-400 mt-2">
                    Selected: {AVAILABLE_COLORS.find(c => c.value === customization.color)?.name}
                  </p>
                </div>

                {/* Player Name */}
                <div>
                  <Label className="text-white text-base font-semibold mb-3 flex items-center">
                    <Type className="w-4 h-4 mr-2" />
                    Player Name {customization.playerName.trim() && <span className="text-green-400 ml-2">(+₹{nameFee})</span>}
                  </Label>
                  <Input
                    type="text"
                    placeholder="Enter player name (optional)"
                    value={customization.playerName}
                    onChange={(e) => handleCustomizationChange('playerName', e.target.value.slice(0, 15))}
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-500"
                    maxLength={15}
                  />
                  <p className="text-sm text-gray-400 mt-1">
                    {customization.playerName.length}/15 characters
                  </p>
                </div>

                {/* Player Number */}
                <div>
                  <Label className="text-white text-base font-semibold mb-3 flex items-center">
                    <Hash className="w-4 h-4 mr-2" />
                    Player Number {customization.playerNumber.trim() && <span className="text-green-400 ml-2">(+₹{numberFee})</span>}
                  </Label>
                  <Input
                    type="text"
                    placeholder="Enter number (0-99)"
                    value={customization.playerNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      if (parseInt(value) <= 99 || value === '') {
                        handleCustomizationChange('playerNumber', value);
                      }
                    }}
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-500"
                    maxLength={2}
                  />
                  <p className="text-sm text-gray-400 mt-1">
                    Numbers 0-99 only
                  </p>
                </div>

                {/* Pricing */}
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Base Price:</span>
                    <span className="text-white">₹{Math.round(jersey.price)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Base Customization:</span>
                    <span className="text-white">₹{baseCustomizationFee}</span>
                  </div>
                  {customization.playerName.trim() && (
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300">Player Name:</span>
                      <span className="text-green-400">+₹{nameFee}</span>
                    </div>
                  )}
                  {customization.playerNumber.trim() && (
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300">Player Number:</span>
                      <span className="text-green-400">+₹{numberFee}</span>
                    </div>
                  )}
                  <div className="border-t border-white/20 pt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-white">Total:</span>
                      <span className="text-xl font-bold text-gradient">
                        ₹{Math.round(totalPrice)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-4">
                  <Button
                    onClick={handleAddToCart}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 rounded-xl transition-all duration-200 transform hover:scale-[1.02]"
                  >
                    Add Custom Jersey to Cart
                  </Button>
                  <Button
                    onClick={onClose}
                    variant="outline"
                    className="w-full border-white/20 text-white hover:bg-white/10"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JerseyCustomizer;
