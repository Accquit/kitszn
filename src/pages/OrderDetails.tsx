
import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Loader2, ShoppingBag, Home, FileText } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { JerseyCustomization, Order, ShippingInfo } from "@/types/shop";
import { Button } from "@/components/ui/button";

const OrderDetails = () => {
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();
  const { user } = useAuth();

  const fetchOrder = async (id: string) => {
    if (!user) throw new Error("User not authenticated");
    const { data, error } = await supabase
      .from("orders")
      .select(`*, order_items(*, products(*))`)
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new Error("Order not found or you don't have permission to view it.");
      }
      throw new Error(error.message);
    }
    return data as Order;
  };

  const { data: order, isLoading, error } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => fetchOrder(orderId!),
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
                ? error.message
                : "We couldn't find the order you're looking for."}
            </p>
            <Button onClick={() => navigate("/dashboard")} >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const orderNumber = `JT-${order.id.split("-")[0].toUpperCase()}`;
  const shippingInfo = order.shipping_address as ShippingInfo;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header cart={[]} onCartClick={() => {}} />

      <main className="pt-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <Button onClick={() => navigate('/dashboard')} variant="outline" className="mb-6 bg-transparent border-gray-600 hover:bg-gray-800">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
        </Button>
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold font-['Space_Grotesk'] text-gradient">Order Details</h1>
            <div className="text-right">
                <p className="text-gray-400">Order #{orderNumber}</p>
                <p className="text-sm text-gray-500">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                <div className="glass-card p-6 rounded-xl">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><ShoppingBag size={22}/> Order Summary</h2>
                    <div className="space-y-4">
                    {order.order_items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between py-2 border-b border-white/10 last:border-0">
                            <div className="flex items-center space-x-4">
                                <img src={item.products?.image_url || "/placeholder.svg"} alt={item.products?.name || "Product image"} className="w-16 h-16 object-cover rounded-lg"/>
                                <div>
                                    <p className="font-medium text-white">{item.products?.name}</p>
                                    {item.customization && Object.keys(item.customization).length > 0 && (
                                        <p className="text-sm text-gray-400">
                                            Custom: 
                                            {(item.customization as Partial<JerseyCustomization>).playerName && ` Name: ${(item.customization as Partial<JerseyCustomization>).playerName}`}
                                            {(item.customization as Partial<JerseyCustomization>).playerNumber && `, Number: ${(item.customization as Partial<JerseyCustomization>).playerNumber}`}
                                        </p>
                                    )}
                                    <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                                </div>
                            </div>
                            <p className="font-semibold text-gradient">₹{Math.round(item.price * item.quantity)}</p>
                        </div>
                    ))}
                    </div>
                </div>
            </div>
            <div className="space-y-8">
                <div className="glass-card p-6 rounded-xl">
                    <h3 className="text-lg font-semibold mb-4">Shipping Address</h3>
                    <div className="text-gray-300 space-y-1">
                        <p>{shippingInfo.firstName} {shippingInfo.lastName}</p>
                        <p>{shippingInfo.address}</p>
                        <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
                        <p>{shippingInfo.country}</p>
                        <p>{shippingInfo.email}</p>
                    </div>
                </div>
                 <div className="glass-card p-6 rounded-xl">
                    <h3 className="text-lg font-semibold mb-4">Order Total</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between text-gray-300"><p>Subtotal</p> <p>₹{order.total.toFixed(2)}</p></div>
                        <div className="flex justify-between text-gray-300"><p>Shipping</p> <p>Free</p></div>
                        <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-white/10"><p>Total</p> <p>₹{order.total.toFixed(2)}</p></div>
                    </div>
                </div>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderDetails;

