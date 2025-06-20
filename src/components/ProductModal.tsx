import React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Jersey } from "@/types/shop";

type Props = {
  open: boolean;
  jersey?: Jersey;
  onClose: () => void;
  onAdd: (jersey: Jersey) => void;
};

const ProductModal: React.FC<Props> = ({ open, jersey, onClose, onAdd }) => {
  if (!open || !jersey) return null;
  return (
    <div className={cn(
      "fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in"
    )}>
      <div className="relative max-w-xl w-full bg-white rounded-2xl p-8 shadow-2xl animate-scale-in">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-muted-foreground bg-muted p-2 rounded-full hover:bg-gray-200 transition"
        >
          <X />
        </button>
        <div className="flex flex-col md:flex-row gap-6">
          <img
            src={jersey.image}
            alt={`${jersey.team} Jersey Large`}
            className="w-48 h-56 object-cover rounded-xl shadow-md bg-muted mx-auto md:mx-0"
            draggable={false}
            style={{ backgroundColor: "#e2e8f0" }}
          />
          <div className="flex-1 flex flex-col gap-3">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-blue-900">{jersey.team}</h2>
            <div className="text-lg text-muted-foreground font-semibold">₹{Math.round(jersey.price)}</div>
            <p className="text-gray-600">
              This is a legendary jersey from the <span className="font-semibold">{jersey.team}</span> lineup. Premium quality. Limited edition.
            </p>
            <button
              onClick={() => onAdd(jersey)}
              className="mt-4 w-full bg-[#cc73f8] text-white font-bold py-2 rounded-xl hover:bg-[#b85df0] transition-colors animate-scale-in"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
