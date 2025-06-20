import React from "react";
import { ShoppingBag } from "lucide-react";
import { CartItem } from "@/types/shop";

type Props = {
  cart: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  onPlaceOrder: () => void;
  isPlacingOrder?: boolean;
};

const CheckoutOrderSummary: React.FC<Props> = ({
  cart,
  subtotal,
  shipping,
  tax,
  total,
  onPlaceOrder,
  isPlacingOrder,
}) => {
  return (
    <div className="glass-card rounded-xl p-6 sticky top-24">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
          <ShoppingBag className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-white font-['Space_Grotesk']">
          Order Summary
        </h2>
      </div>

      {/* Cart Items */}
      <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
        {cart.map((item) => (
          <div key={item.id} className="flex items-start space-x-3">
            <div className="relative">
              <img
                src={item.image}
                alt={item.team}
                className="w-16 h-16 object-cover rounded-lg bg-white/10"
              />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">{item.qty}</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-white text-sm leading-tight">
                {item.team}
              </h3>
              {item.customization && (
                <div className="text-xs text-gray-400 mt-1">
                  {item.customization.playerName && (
                    <div>Name: {item.customization.playerName}</div>
                  )}
                  {item.customization.playerNumber && (
                    <div>Number: {item.customization.playerNumber}</div>
                  )}
                </div>
              )}
              <p className="text-gradient font-bold text-sm mt-1">
                ₹{Math.round(item.price * item.qty)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Order Totals */}
      <div className="border-t border-white/10 pt-4 space-y-3">
        <div className="flex justify-between text-sm text-gray-300">
          <span>Subtotal ({cart.reduce((sum, item) => sum + item.qty, 0)} items)</span>
          <span>₹{Math.round(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-300">
          <span>Shipping</span>
          <span>{shipping === 0 ? "Free" : `₹${Math.round(shipping)}`}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-300">
          <span>Tax</span>
          <span>₹{Math.round(tax)}</span>
        </div>
        <div className="border-t border-white/10 pt-3 flex justify-between items-center">
          <span className="text-xl font-bold text-white font-['Space_Grotesk']">Total:</span>
          <span className="text-2xl font-bold text-gradient">
            ₹{Math.round(total)}
          </span>
        </div>
      </div>

      {/* Place Order Button */}
      <button
        onClick={onPlaceOrder}
        disabled={isPlacingOrder}
        className="w-full mt-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-4 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
      </button>

      <p className="text-center text-xs text-gray-400 mt-4">
        🔒 Your payment information is secure and encrypted
      </p>
    </div>
  );
};

export default CheckoutOrderSummary;
