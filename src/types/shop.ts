import { Database, Tables } from "@/integrations/supabase/types";

type Product = Database['public']['Tables']['products']['Row'];

/**
 * Represents a Jersey product.
 * It extends the base Supabase product type with friendlier aliases.
 */
export type Jersey = Product & {
  team: string; // Alias for product.name
  image: string; // Alias for product.image_url
};

/**
 * Defines the customization options for a jersey.
 */
export type JerseyCustomization = {
  color: string;
  playerName: string;
  playerNumber: string;
};

/**
 * Represents an item in the shopping cart.
 * It can be a standard jersey or a customized one.
 */
export type CartItem = Jersey & { 
  qty: number; 
  customization?: Partial<JerseyCustomization>;
  // For customized items, `id` is a timestamp for uniqueness in cart.
  // `productId` will hold the original product ID for the order.
  productId?: number;
};

/**
 * Represents shipping information for an order.
 */
export type ShippingInfo = {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
};

/**
 * Represents payment information for an order.
 */
export type PaymentInfo = {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  nameOnCard: string;
};

/**
 * Represents a product associated with an order item.
 * Simplified for order contexts.
 */
export type OrderProduct = Pick<Tables<'products'>, 'id' | 'name' | 'image_url'>;

/**
 * Represents an item within an order, including product details and customization.
 */
export type OrderItem = Tables<'order_items'> & {
  products: OrderProduct | null;
};

/**
 * Represents a complete customer order with its items.
 */
export type Order = Tables<'orders'> & {
  order_items: OrderItem[];
};
