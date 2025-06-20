
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle, Download, ArrowRight, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { JerseyCustomization, Order } from "@/types/shop";

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const orderId = location.state?.orderId;

  const fetchOrder = async (id: string) => {
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items (
          *,
          products (
            *
          )
        )
      `
      )
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(error.message);
    }
    return data as Order;
  };

  const { data: order, isLoading, error } = useQuery<Order>({
    queryKey: ["order", orderId],
    queryFn: () => fetchOrder(orderId),
    enabled: !!orderId && !!user,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <Loader2 className="w-16 h-16 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header cart={[]} onCartClick={() => {}} />
        <div className="pt-20 pb-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold text-gradient mb-4 font-['Space_Grotesk']">
              {error ? "Error Loading Order" : "Order Not Found"}
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              {error
                ? "There was a problem retrieving your order details."
                : "We couldn't find the order you're looking for. Please check your dashboard for your orders."}
            </p>
            <button
              onClick={() => navigate("/shop")}
              className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium mx-auto"
            >
              <ArrowRight className="w-5 h-5 mr-2" />
              Continue Shopping
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const orderNumber = `JT-${order.id.split("-")[0].toUpperCase()}`;
  const estimatedDelivery = new Date(
    new Date(order.created_at).getTime() + 7 * 24 * 60 * 60 * 1000
  ).toLocaleDateString();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header cart={[]} onCartClick={() => {}} />

      <div className="pt-20 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Success Icon */}
          <div className="mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gradient mb-4 font-['Space_Grotesk']">
              Order Confirmed!
            </h1>
            <p className="text-xl text-gray-300">
              Thank you for your purchase. Your order has been received and is
              being processed.
            </p>
          </div>

          {/* Order Details */}
          <div className="glass-card rounded-xl p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Order Number
                </h3>
                <p className="text-gradient font-bold text-xl">{orderNumber}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Estimated Delivery
                </h3>
                <p className="text-gray-300">{estimatedDelivery}</p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="glass-card rounded-xl p-8 mb-8 text-left">
            <h3 className="text-xl font-bold text-white mb-6 font-['Space_Grotesk']">
              Order Summary
            </h3>
            <div className="space-y-4">
              {order.order_items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-2 border-b border-white/10 last:border-0"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.products?.image_url || "/placeholder.svg"}
                      alt={item.products?.name || "Product image"}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div>
                      <p className="font-medium text-white">
                        {item.products?.name}
                      </p>
                      {item.customization && (
                        <p className="text-sm text-gray-400">
                          Custom: {' '}
                          {(item.customization as Partial<JerseyCustomization>).playerName && `Name: ${(item.customization as Partial<JerseyCustomization>).playerName}`}
                          {(item.customization as Partial<JerseyCustomization>).playerNumber && `, Number: ${(item.customization as Partial<JerseyCustomization>).playerNumber}`}
                        </p>
                      )}
                      <p className="text-sm text-gray-400">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold text-gradient">
                    ₹{Math.round(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/shop")}
              className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium"
            >
              Continue Shopping
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
            <button className="flex items-center justify-center px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors border border-white/20 font-medium">
              <Download className="w-5 h-5 mr-2" />
              Download Receipt
            </button>
          </div>

          {/* Additional Info */}
          <div className="mt-12 text-center">
            <p className="text-gray-400 mb-2">
              You will receive an email confirmation shortly with tracking
              information.
            </p>
            <p className="text-sm text-gray-500">
              Need help? Contact us at{" "}
              <a
                href="mailto:support@jerseytown.com"
                className="text-blue-400 hover:underline"
              >
                support@jerseytown.com
              </a>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OrderConfirmation;
