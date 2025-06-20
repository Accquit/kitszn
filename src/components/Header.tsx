import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingBag, Menu, X, User, LogOut, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

type CartItem = {
  id: number;
  team: string;
  price: number;
  image: string;
  qty: number;
};

type Props = {
  cart: CartItem[];
  onCartClick: () => void;
};

const Header: React.FC<Props> = ({ cart, onCartClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const cartItemsCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const { user, isAdmin } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('id', user.id)
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!user,
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/shop", label: "Shop" },
    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact" },
  ];
  
  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    const names = name.split(' ');
    if (names.length > 1) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <>
      <header className="fixed top-0 z-50 w-full">
        <div className="bg-black/90 backdrop-blur-md border-b border-gray-800/50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <Link to="/" className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-[#cc73f8] rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-sm transform rotate-45"></div>
                </div>
                <span className="text-xl font-bold font-['Space_Grotesk'] text-white">
                  Kitszn
                </span>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center space-x-8">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "text-sm font-medium transition-colors duration-200 hover:text-white",
                      location.pathname === item.path
                        ? "text-white"
                        : "text-gray-300"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              {/* Right side actions */}
              <div className="flex items-center space-x-4">
                {/* Cart Button */}
                <button
                  onClick={onCartClick}
                  className="relative p-2 text-gray-300 hover:text-white transition-colors duration-200"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#cc73f8] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                      {cartItemsCount}
                    </span>
                  )}
                </button>

                {/* User Dropdown / Login Button - Desktop */}
                <div className="hidden lg:block">
                  {user ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="flex items-center rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-[#cc73f8]">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={profile?.avatar_url || ''} alt={profile?.full_name || 'User'} />
                            <AvatarFallback className="bg-gray-700 text-white">{getInitials(profile?.full_name || user.email)}</AvatarFallback>
                          </Avatar>
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56 bg-gray-900 border-gray-700 text-white" align="end">
                        <DropdownMenuLabel className="font-normal">
                          <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{profile?.full_name || 'New User'}</p>
                            <p className="text-xs leading-none text-gray-400">{user.email}</p>
                          </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-gray-700" />
                        <DropdownMenuItem onSelect={() => navigate('/dashboard')} className="cursor-pointer focus:bg-gray-800">
                          <User className="mr-2 h-4 w-4" />
                          <span>Dashboard</span>
                        </DropdownMenuItem>
                        {isAdmin && (
                          <DropdownMenuItem onSelect={() => navigate('/admin')} className="cursor-pointer focus:bg-gray-800">
                            <Shield className="mr-2 h-4 w-4 text-[#cc73f8]" />
                            <span>Admin</span>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator className="bg-gray-700" />
                        <DropdownMenuItem onSelect={handleLogout} className="cursor-pointer focus:bg-gray-800 focus:text-red-400">
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Logout</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Link
                      to="/login"
                      className="px-6 py-2 bg-[#cc73f8] text-white font-medium rounded-full hover:bg-[#b85df0] transition-colors duration-200"
                    >
                      Login
                    </Link>
                  )}
                </div>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="lg:hidden p-2 text-gray-300 hover:text-white transition-colors duration-200"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="lg:hidden border-t border-gray-800/50 bg-black/95">
              <div className="px-6 py-4">
                <nav className="flex flex-col space-y-3">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "px-4 py-3 text-base font-medium rounded-lg transition-colors duration-200",
                        location.pathname === item.path
                          ? "text-white bg-gray-800"
                          : "text-gray-300 hover:text-white hover:bg-gray-800/50"
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                  {user ? (
                    <>
                      <Link
                        to="/dashboard"
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "px-4 py-3 text-base font-medium rounded-lg transition-colors duration-200",
                          location.pathname === '/dashboard'
                            ? "text-white bg-gray-800"
                            : "text-gray-300 hover:text-white hover:bg-gray-800/50"
                        )}
                      >
                        Dashboard
                      </Link>
                      {isAdmin && (
                         <Link
                          to="/admin"
                          onClick={() => setMobileMenuOpen(false)}
                           className={cn(
                            "px-4 py-3 text-base font-medium rounded-lg transition-colors duration-200",
                            location.pathname === '/admin'
                              ? "text-white bg-gray-800"
                              : "text-gray-300 hover:text-white hover:bg-gray-800/50"
                          )}
                        >
                          Admin
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          handleLogout();
                          setMobileMenuOpen(false);
                        }}
                        className="mt-4 px-6 py-3 bg-[#cc73f8] text-white font-medium rounded-full text-center hover:bg-[#b85df0] transition-colors duration-200 w-full"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="mt-4 px-6 py-3 bg-[#cc73f8] text-white font-medium rounded-full text-center hover:bg-[#b85df0] transition-colors duration-200"
                    >
                      Login
                    </Link>
                  )}
                </nav>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
