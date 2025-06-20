
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, Truck, Shield } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CheckoutOrderSummary from "@/components/CheckoutOrderSummary";
import CheckoutShippingForm from "@/components/CheckoutShippingForm";
import CheckoutPaymentForm from "@/components/CheckoutPaymentForm";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { ShippingInfo, PaymentInfo } from "@/types/shop";

const Checkout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States"
  });
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: ""
  });

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal > 8300 ? 0 : 829;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handlePlaceOrder = async () => {
    if (!shippingInfo.firstName || !shippingInfo.email || !paymentInfo.cardNumber) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Not Logged In",
        description: "You must be logged in to place an order.",
        variant: "destructive",
      });
      return;
    }

    setIsPlacingOrder(true);
    try {
      const cartItemsForDb = cart.map((item) => ({
        product_id: item.productId || item.id, // Use productId for custom items, id for standard
        quantity: item.qty,
        price: item.price,
        customization: item.customization || null,
      }));

      // Convert shipping info to JSON string to match the updated function signature
      const shippingInfoString = JSON.stringify(shippingInfo);

      const { data: orderId, error } = await supabase.rpc('create_new_order', {
        p_user_id: user.id,
        p_cart_items: cartItemsForDb,
        p_shipping_info: shippingInfoString, // Now passing as string
        p_total: total,
      });

      if (error) {
        throw error;
      }

      // Invoke edge function to send email confirmation.
      // We don't await this, let it run in the background.
      supabase.functions.invoke('send-order-confirmation', {
        body: { orderId },
      }).then(({ error: functionError }) => {
        if (functionError) {
          console.error('Error sending confirmation email:', functionError);
        }
      });

      // Order placed successfully
      clearCart();
      toast({
        title: "Order Placed!",
        description: "Your order has been successfully placed.",
      });
      navigate("/order-confirmation", { state: { orderId: orderId } });

    } catch (error: any) {
      toast({
        title: "Order Placement Failed",
        description: error.message || "There was an issue placing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header cart={cart} onCartClick={() => {}} />
        <div className="pt-20 pb-20">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold text-gradient mb-6 font-['Space_Grotesk']">
              Your Cart is Empty
            </h1>
            <p className="text-gray-400 mb-8">Add some amazing jerseys to get started!</p>
            <button
              onClick={() => navigate("/shop")}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium"
            >
              Continue Shopping
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header cart={cart} onCartClick={() => {}} />
      
      <div className="pt-20 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate("/shop")}
              className="flex items-center text-gray-400 hover:text-white transition-colors mb-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Shop
            </button>
            <h1 className="text-4xl font-bold text-gradient font-['Space_Grotesk']">
              Checkout
            </h1>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            {[
              { icon: Shield, text: "Secure SSL Encryption" },
              { icon: Truck, text: "Free Shipping Over ₹8300" },
              { icon: CreditCard, text: "Safe Payment Processing" }
            ].map((item, index) => (
              <div key={index} className="glass-card rounded-lg p-4 flex items-center space-x-3">
                <item.icon className="w-5 h-5 text-blue-400" />
                <span className="text-sm text-gray-300">{item.text}</span>
              </div>
            ))}
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Forms Section */}
            <div className="lg:col-span-2 space-y-8">
              <CheckoutShippingForm
                shippingInfo={shippingInfo}
                onShippingInfoChange={setShippingInfo}
              />
              <CheckoutPaymentForm
                paymentInfo={paymentInfo}
                onPaymentInfoChange={setPaymentInfo}
              />
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <CheckoutOrderSummary
                cart={cart}
                subtotal={subtotal}
                shipping={shipping}
                tax={tax}
                total={total}
                onPlaceOrder={handlePlaceOrder}
                isPlacingOrder={isPlacingOrder}
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;
