
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Jersey, CartItem, JerseyCustomization } from '@/types/shop';

interface CartContextType {
  cart: CartItem[];
  handleAddToCart: (jersey: Jersey) => void;
  handleAddCustomizedToCart: (jersey: Jersey, customization: Partial<JerseyCustomization>) => void;
  handleUpdateQty: (id: number, qty: number) => void;
  handleRemoveFromCart: (id: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { toast } = useToast();

  const handleAddToCart = (jersey: Jersey) => {
    setCart((prev) => {
      const exists = prev.find(item => item.id === jersey.id && !item.customization);
      if (exists) {
        return prev.map(item =>
          item.id === jersey.id && !item.customization ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...jersey, qty: 1 }];
    });
    toast({
      title: "Added to cart",
      description: jersey.team,
      duration: 1600,
    });
  };

  const handleAddCustomizedToCart = (jersey: Jersey, customization: Partial<JerseyCustomization>) => {
    // Calculate dynamic pricing
    let customizationFee = 1245; // Base fee (15 USD * 83)
    
    if (customization.playerName?.trim()) {
      customizationFee += 415; // Add fee for name (5 USD * 83)
    }
    
    if (customization.playerNumber?.trim()) {
      customizationFee += 415; // Add fee for number (5 USD * 83)
    }
    
    const customizedJersey: CartItem = {
      ...jersey,
      productId: jersey.id, // Store original product ID
      price: jersey.price + customizationFee,
      customization,
      id: Date.now(), // Generate unique ID for customized jersey in cart
      qty: 1,
    };
    
    setCart((prev) => [...prev, customizedJersey]);
    
    toast({
      title: "Custom jersey added to cart",
      description: `${jersey.team} - ${customization.playerName || 'Custom'}`,
      duration: 1600,
    });
  };

  const handleUpdateQty = (id: number, qty: number) => {
    if (qty === 0) {
      handleRemoveFromCart(id);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.id === id ? { ...item, qty } : item
      )
    );
  };

  const handleRemoveFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{
      cart,
      handleAddToCart,
      handleAddCustomizedToCart,
      handleUpdateQty,
      handleRemoveFromCart,
      clearCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
