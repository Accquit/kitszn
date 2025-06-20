import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Jersey } from "@/types/shop";

export const useShopData = () => {
  const [modalJersey, setModalJersey] = React.useState<Jersey | undefined>(undefined);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [cartOpen, setCartOpen] = React.useState(false);
  const [customizerOpen, setCustomizerOpen] = React.useState(false);
  const [customizerJersey, setCustomizerJersey] = React.useState<Jersey | undefined>(undefined);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("All");
  const [sortBy, setSortBy] = React.useState("featured");
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");

  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*");
      if (error) throw error;
      return data;
    },
  });

  const jerseys: Jersey[] = React.useMemo(() => {
    if (!products) return [];
    return products.map(p => ({
      ...p,
      team: p.name,
      image: p.image_url || '/placeholder.svg'
    }));
  }, [products]);

  const categories = React.useMemo(() => {
    if (!products) return ["All"];
    const uniqueCategories = [...new Set(products.map(p => p.category))];
    return ["All", ...uniqueCategories];
  }, [products]);

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

  const filteredJerseys = React.useMemo(() => {
    let filtered = jerseys;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((jersey) =>
        jersey.team.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter((jersey) => jersey.category === selectedCategory);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "name":
          return a.team.localeCompare(b.team);
        case "featured":
        default:
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      }
    });

    return filtered;
  }, [jerseys, searchTerm, selectedCategory, sortBy]);

  return {
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
  };
};
