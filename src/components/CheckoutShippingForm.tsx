import React from "react";
import { Truck } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { ShippingInfo } from "@/types/shop";

type Props = {
  shippingInfo: ShippingInfo;
  onShippingInfoChange: (info: ShippingInfo) => void;
};

const CheckoutShippingForm: React.FC<Props> = ({
  shippingInfo,
  onShippingInfoChange,
}) => {
  const handleInputChange = (field: keyof ShippingInfo, value: string) => {
    onShippingInfoChange({
      ...shippingInfo,
      [field]: value,
    });
  };

  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
          <Truck className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-white font-['Space_Grotesk']">
          Shipping Information
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            First Name *
          </label>
          <Input
            type="text"
            value={shippingInfo.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            className="bg-white/5 border-white/20 text-white placeholder-gray-400"
            placeholder="John"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Last Name *
          </label>
          <Input
            type="text"
            value={shippingInfo.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            className="bg-white/5 border-white/20 text-white placeholder-gray-400"
            placeholder="Doe"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Email Address *
          </label>
          <Input
            type="email"
            value={shippingInfo.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className="bg-white/5 border-white/20 text-white placeholder-gray-400"
            placeholder="john.doe@example.com"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Address *
          </label>
          <Input
            type="text"
            value={shippingInfo.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
            className="bg-white/5 border-white/20 text-white placeholder-gray-400"
            placeholder="123 Main Street"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            City *
          </label>
          <Input
            type="text"
            value={shippingInfo.city}
            onChange={(e) => handleInputChange("city", e.target.value)}
            className="bg-white/5 border-white/20 text-white placeholder-gray-400"
            placeholder="New York"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            State *
          </label>
          <Input
            type="text"
            value={shippingInfo.state}
            onChange={(e) => handleInputChange("state", e.target.value)}
            className="bg-white/5 border-white/20 text-white placeholder-gray-400"
            placeholder="NY"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            ZIP Code *
          </label>
          <Input
            type="text"
            value={shippingInfo.zipCode}
            onChange={(e) => handleInputChange("zipCode", e.target.value)}
            className="bg-white/5 border-white/20 text-white placeholder-gray-400"
            placeholder="10001"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Country
          </label>
          <select
            value={shippingInfo.country}
            onChange={(e) => handleInputChange("country", e.target.value)}
            className="w-full h-10 px-3 py-2 bg-white/5 border border-white/20 rounded-md text-white"
          >
            <option value="United States">United States</option>
            <option value="Canada">Canada</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Australia">Australia</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default CheckoutShippingForm;
