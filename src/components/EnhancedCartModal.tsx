import React from "react";
import { X, Plus, Minus, ShoppingBag, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { CartItem } from "@/types/shop";

type Props = {
  open: boolean;
  cart: CartItem[];
  onClose: () => void;
  onUpdateQty: (id: number, qty: number) => void;
  onRemove: (id: number) => void;
  onCheckout: () => void;
};

const EnhancedCartModal: React.FC<Props> = ({
  open,
  cart,
  onClose,
  onUpdateQty,
  onRemove,
  onCheckout,
}) => {
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose} />
      
      {/* Cart Panel */}
      <div className="relative h-full w-full max-w-md bg-gradient-to-b from-gray-900 to-black shadow-2xl flex flex-col animate-slide-in-right border-l border-white/10">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-black/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-['Space_Grotesk']">
                Shopping Cart
              </h2>
              <p className="text-sm text-gray-300">
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-300 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Your cart is empty</h3>
              <p className="text-gray-400 text-sm mb-6">Add some amazing jerseys to get started!</p>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="glass-card rounded-xl p-4 flex items-start space-x-4 hover:bg-white/5 transition-colors duration-200"
                >
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
                    <h3 className="font-semibold text-white text-sm leading-tight mb-1">
                      {item.team}
                    </h3>
                    <p className="text-gradient font-bold text-sm mb-3">
                      ₹{Math.round(item.price)} each
                    </p>
                    
                    <div className="flex items-center justify-between">
                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onUpdateQty(item.id, Math.max(0, item.qty - 1))}
                          className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center font-medium text-white">{item.qty}</span>
                        <button
                          onClick={() => onUpdateQty(item.id, item.qty + 1)}
                          className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Item Total & Remove */}
                      <div className="flex items-center space-x-2">
                        <span className="text-white font-bold text-sm">
                          ₹{Math.round(item.price * item.qty)}
                        </span>
                        <button
                          onClick={() => onRemove(item.id)}
                          className="p-1 text-red-400 hover:bg-red-500/20 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-white/10 p-6 space-y-4 bg-black/50">
            {/* Subtotal */}
            <div className="flex justify-between items-center text-sm text-gray-300">
              <span>Subtotal ({totalItems} items)</span>
              <span>₹{Math.round(total)}</span>
            </div>
            
            {/* Total */}
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <span className="text-xl font-bold text-white font-['Space_Grotesk']">Total:</span>
              <span className="text-2xl font-bold text-gradient">
                ₹{Math.round(total)}
              </span>
            </div>
            
            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={onCheckout}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-4 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
              >
                Proceed to Checkout
              </button>
              <button
                onClick={onClose}
                className="w-full bg-white/10 text-white font-medium py-3 rounded-xl hover:bg-white/20 transition-colors border border-white/20"
              >
                Continue Shopping
              </button>
            </div>
            
            <p className="text-center text-xs text-gray-400 pt-2">
              🔒 Secure checkout with SSL encryption
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedCartModal;
