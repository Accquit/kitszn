
import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import QualitySection from "@/components/QualitySection";
import Testimonials from "@/components/Testimonials";
import JerseyCard from "@/components/JerseyCard";
import JerseyCardSkeleton from "@/components/JerseyCardSkeleton";
import ProductModal from "@/components/ProductModal";
import EnhancedCartModal from "@/components/EnhancedCartModal";
import JerseyCustomizer from "@/components/JerseyCustomizer";
import { useCart } from "@/contexts/CartContext";
import { type Jersey } from "@/types/shop";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight } from "lucide-react";

const Index = () => {
  const { cart, handleAddToCart, handleAddCustomizedToCart, handleUpdateQty, handleRemoveFromCart } = useCart();
  const [modalJersey, setModalJersey] = React.useState<Jersey | undefined>(undefined);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [cartOpen, setCartOpen] = React.useState(false);
  const [customizerOpen, setCustomizerOpen] = React.useState(false);
  const [customizerJersey, setCustomizerJersey] = React.useState<Jersey | undefined>(undefined);
  const navigate = useNavigate();

  const { data: featuredJerseys, isLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('featured', true)
        .limit(4);
      if (error) throw error;
      return data.map(p => ({
        ...p,
        id: p.id,
        team: p.name,
        image: p.image_url || '/placeholder.svg',
      })) as Jersey[];
    }
  });

  const handleCustomizeJersey = (jersey: Jersey) => {
    setCustomizerJersey(jersey);
    setCustomizerOpen(true);
  };

  const handleCloseCustomizer = () => {
    setCustomizerOpen(false);
    setTimeout(() => setCustomizerJersey(undefined), 250);
  };

  const handleViewJersey = (jersey: Jersey) => {
    setModalJersey(jersey);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setTimeout(() => setModalJersey(undefined), 250);
  };

  const handleCheckout = () => {
    setCartOpen(false);
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header cart={cart} onCartClick={() => setCartOpen(true)} />
      
      <main>
        <Hero />
        <QualitySection />
        
        {/* Featured Collection */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-['Space_Grotesk'] text-gradient mb-4">
              Featured Collection
            </h2>
            <p className="text-lg text-gray-400 max-w-xl mx-auto">
              Premium jerseys from legendary teams and moments in sports history.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {isLoading ? (
              [...Array(4)].map((_, i) => <JerseyCardSkeleton key={i} />)
            ) : (
              featuredJerseys?.map((jersey) => (
                <div key={jersey.id} className="animate-fade-in">
                  <JerseyCard
                    jersey={jersey}
                    onView={handleViewJersey}
                    onAdd={handleAddToCart}
                    onCustomize={handleCustomizeJersey}
                  />
                </div>
              ))
            )}
          </div>

          <div className="text-center">
            <button
              onClick={() => navigate('/shop')}
              className="px-8 py-4 bg-[#cc73f8] text-white font-semibold rounded-xl hover:bg-[#b85df0] transition-all duration-300 hover:scale-105"
            >
              <span className="flex items-center space-x-2">
                <span>View All Products</span>
                <ArrowRight className="w-5 h-5" />
              </span>
            </button>
          </div>
        </section>

        <Testimonials />
      </main>

      <Footer />
      
      <ProductModal
        open={modalOpen}
        jersey={modalJersey}
        onClose={handleCloseModal}
        onAdd={handleAddToCart}
      />
      
      <EnhancedCartModal
        open={cartOpen}
        cart={cart}
        onClose={() => setCartOpen(false)}
        onUpdateQty={handleUpdateQty}
        onRemove={handleRemoveFromCart}
        onCheckout={handleCheckout}
      />

      <JerseyCustomizer
        open={customizerOpen}
        jersey={customizerJersey}
        onClose={handleCloseCustomizer}
        onAddCustomized={handleAddCustomizedToCart}
      />
    </div>
  );
};

export default Index;
