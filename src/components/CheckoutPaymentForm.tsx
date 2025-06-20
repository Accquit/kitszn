import React from "react";
import { CreditCard, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { PaymentInfo } from "@/types/shop";

type Props = {
  paymentInfo: PaymentInfo;
  onPaymentInfoChange: (info: PaymentInfo) => void;
};

const CheckoutPaymentForm: React.FC<Props> = ({
  paymentInfo,
  onPaymentInfoChange,
}) => {
  const handleInputChange = (field: keyof PaymentInfo, value: string) => {
    let formattedValue = value;

    // Format card number with spaces
    if (field === "cardNumber") {
      formattedValue = value.replace(/\s/g, "").replace(/(.{4})/g, "$1 ").trim();
      if (formattedValue.length > 19) formattedValue = formattedValue.slice(0, 19);
    }

    // Format expiry date
    if (field === "expiryDate") {
      formattedValue = value.replace(/\D/g, "").replace(/(\d{2})(\d)/, "$1/$2");
      if (formattedValue.length > 5) formattedValue = formattedValue.slice(0, 5);
    }

    // Format CVV
    if (field === "cvv") {
      formattedValue = value.replace(/\D/g, "");
      if (formattedValue.length > 4) formattedValue = formattedValue.slice(0, 4);
    }

    onPaymentInfoChange({
      ...paymentInfo,
      [field]: formattedValue,
    });
  };

  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
          <CreditCard className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-white font-['Space_Grotesk']">
          Payment Information
        </h2>
        <div className="flex items-center text-green-400 text-sm">
          <Lock className="w-4 h-4 mr-1" />
          Secure
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Name on Card *
          </label>
          <Input
            type="text"
            value={paymentInfo.nameOnCard}
            onChange={(e) => handleInputChange("nameOnCard", e.target.value)}
            className="bg-white/5 border-white/20 text-white placeholder-gray-400"
            placeholder="John Doe"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Card Number *
          </label>
          <Input
            type="text"
            value={paymentInfo.cardNumber}
            onChange={(e) => handleInputChange("cardNumber", e.target.value)}
            className="bg-white/5 border-white/20 text-white placeholder-gray-400"
            placeholder="1234 5678 9012 3456"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Expiry Date *
            </label>
            <Input
              type="text"
              value={paymentInfo.expiryDate}
              onChange={(e) => handleInputChange("expiryDate", e.target.value)}
              className="bg-white/5 border-white/20 text-white placeholder-gray-400"
              placeholder="MM/YY"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              CVV *
            </label>
            <Input
              type="text"
              value={paymentInfo.cvv}
              onChange={(e) => handleInputChange("cvv", e.target.value)}
              className="bg-white/5 border-white/20 text-white placeholder-gray-400"
              placeholder="123"
              required
            />
          </div>
        </div>

        {/* Payment Methods */}
        <div className="pt-4 border-t border-white/10">
          <p className="text-sm text-gray-400 mb-3">Accepted Payment Methods:</p>
          <div className="flex space-x-2">
            {["Visa", "Mastercard", "American Express", "Discover"].map((method) => (
              <div
                key={method}
                className="w-12 h-8 bg-white/10 rounded flex items-center justify-center text-xs text-gray-300"
              >
                {method.slice(0, 4)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPaymentForm;
