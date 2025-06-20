
import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductModal from "@/components/ProductModal";
import EnhancedCartModal from "@/components/EnhancedCartModal";
import JerseyCustomizer from "@/components/JerseyCustomizer";
import ShopHeader from "@/components/ShopHeader";
import ShopFilters from "@/components/ShopFilters";
import JerseyGrid from "@/components/JerseyGrid";
import { useShopData } from "@/hooks/useShopData";
import { useCart } from "@/contexts/CartContext";

const Shop = () => {
  const { cart, handleAddToCart, handleAddCustomizedToCart, handleUpdateQty, handleRemoveFromCart } = useCart();
  const navigate = useNavigate();
  
  const {
    // Data
    jerseys,
    filteredJerseys,
    categories,
    isLoading,
    
    // Modal states
    modalJersey,
    modalOpen,
    cartOpen,
    customizerOpen,
    customizerJersey,
    
    // Filter states
    searchTerm,
    selectedCategory,
    sortBy,
    viewMode,
    
    // Setters
    setSearchTerm,
    setSelectedCategory,
    setSortBy,
    setViewMode,
    setCartOpen,
    
    // Handlers
    handleCustomizeJersey,
    handleCloseCustomizer,
    handleViewJersey,
    handleCloseModal,
  } = useShopData();

  const handleCheckout = () => {
    setCartOpen(false);
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header cart={cart} onCartClick={() => setCartOpen(true)} />
      
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ShopHeader />

          <ShopFilters
            searchTerm={searchTerm}
            selectedCategory={selectedCategory}
            sortBy={sortBy}
            viewMode={viewMode}
            categories={categories}
            onSearchChange={setSearchTerm}
            onCategoryChange={setSelectedCategory}
            onSortChange={setSortBy}
            onViewModeChange={setViewMode}
          />

          <JerseyGrid
            jerseys={filteredJerseys}
            totalJerseys={jerseys.length}
            viewMode={viewMode}
            isLoading={isLoading}
            onViewJersey={handleViewJersey}
            onAddToCart={handleAddToCart}
            onCustomizeJersey={handleCustomizeJersey}
          />
        </div>
      </div>

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

export default Shop;
