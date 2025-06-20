import React from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { CartItem } from "@/types/shop";

type Props = {
  cart: CartItem[];
  onRemove: (id: number) => void;
  onCheckout: () => void;
};

const CartFloating: React.FC<Props> = ({ cart, onRemove }) => {
  const navigate = useNavigate();
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <aside
      className={cn(
        "fixed z-50 bottom-8 right-8 w-80 max-w-full bg-white/95 border shadow-2xl rounded-2xl p-4 backdrop-blur-md animate-fade-in flex flex-col gap-3"
      )}
    >
      <div className="font-bold text-lg mb-2 text-blue-900">Cart</div>
      {cart.length === 0 ? (
        <div className="text-muted-foreground text-sm">Your cart is empty.</div>
      ) : (
        <div className="flex flex-col gap-3 max-h-60 overflow-y-auto">
          {cart.map(item => (
            <div key={item.id} className="flex justify-between items-center border-b py-1 last:border-b-0">
              <div>
                <span className="font-semibold">{item.team}</span>
                <span className="block text-xs text-gray-500">x{item.qty}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">₹{Math.round(item.price * item.qty)}</span>
                <button onClick={() => onRemove(item.id)} className="p-1 rounded hover:bg-red-100">
                  <X size={18} className="text-red-400" />
                  <span className="sr-only">Remove</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-2 flex justify-between items-center">
        <span className="font-semibold text-md">Total:</span>
        <span className="font-bold text-blue-700 text-lg">₹{Math.round(total)}</span>
      </div>
      <button
        className={cn(
          "mt-3 w-full bg-blue-700 text-white font-bold py-2 rounded-xl hover:bg-blue-800 transition-colors shadow animate-scale-in disabled:opacity-60"
        )}
        disabled={cart.length === 0}
        onClick={handleCheckout}
      >
        Checkout
      </button>
    </aside>
  );
};

export default CartFloating;
