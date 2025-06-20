import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import EnhancedCartModal from '@/components/EnhancedCartModal';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User, ShoppingBag, Loader2 } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';
import OrderHistoryTable from '@/components/OrderHistoryTable';

const Dashboard = () => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { cart, handleUpdateQty, handleRemoveFromCart } = useCart();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async (): Promise<Tables<'profiles'> | null> => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (error && error.code !== 'PGRST116') {
        toast.error(error.message);
        throw new Error(error.message);
      }
      return data;
    },
    enabled: !!user,
  });

  const { data: orders, isLoading: isLoadingOrders } = useQuery({
    queryKey: ['orders', user?.id],
    queryFn: async (): Promise<Tables<'orders'>[]> => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        toast.error("Failed to fetch orders.");
        throw new Error(error.message);
      }
      return data || [];
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setUsername(profile.username || '');
    }
  }, [profile]);

  const { mutate: updateProfile, isPending: isUpdating } = useMutation({
    mutationFn: async ({ fullName, username }: { fullName: string; username: string }) => {
      if (!user) throw new Error("User not authenticated");
      const { data, error } = await supabase
        .from('profiles')
        .update({ full_name: fullName, username, updated_at: new Date().toISOString() })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Profile updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
      setIsEditing(false);
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ fullName, username });
  };

  const handleCheckout = () => {
    setCartOpen(false);
    navigate('/checkout');
  };
  
  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    const names = name.split(' ');
    if (names.length > 1) {
      return names[0][0] + names[names.length - 1][0];
    }
    return name.substring(0, 2).toUpperCase();
  };

  if (isAuthLoading || isLoadingProfile || isLoadingOrders) {
    return <div className="flex justify-center items-center h-screen bg-background"><Loader2 className="w-8 h-8 animate-spin text-purple-400" /></div>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header cart={cart} onCartClick={() => setCartOpen(true)} />
      <main className="pt-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <h1 className="text-4xl font-bold font-['Space_Grotesk'] text-gradient mb-8">Dashboard</h1>

        <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800/50 rounded-2xl p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile?.avatar_url || ''} alt={profile?.full_name || 'User'} />
                <AvatarFallback className="text-3xl bg-gray-700 text-white">{getInitials(profile?.full_name)}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-semibold">{profile?.full_name || 'New User'}</h2>
                <p className="text-gray-400">{user?.email}</p>
              </div>
            </div>
            <Button onClick={() => setIsEditing(!isEditing)} variant="outline" className="bg-transparent border-gray-600 hover:bg-gray-800">
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </Button>
          </div>
          
          {isEditing ? (
            <form onSubmit={handleUpdate} className="space-y-4 pt-6 border-t border-gray-800">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormItem label="Full Name">
                  <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your full name" />
                </FormItem>
                <FormItem label="Username">
                  <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="A cool username" />
                </FormItem>
              </div>
              <FormItem label="Email">
                <Input value={user?.email || ''} disabled />
              </FormItem>
              <Button type="submit" disabled={isUpdating} className="bg-[#cc73f8] hover:bg-[#b85df0]">
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          ) : (
             <div className="space-y-2 pt-6 border-t border-gray-800">
                <InfoRow label="Full Name" value={profile?.full_name} />
                <InfoRow label="Username" value={profile?.username} />
                <InfoRow label="Email" value={user?.email} />
             </div>
          )}
        </div>
        
        <div className="mt-12 bg-gray-900/50 backdrop-blur-md border border-gray-800/50 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2"><ShoppingBag size={24} /> Order History</h2>
          <OrderHistoryTable orders={orders || []} />
        </div>

      </main>
      <Footer />
      <EnhancedCartModal
        open={cartOpen}
        cart={cart}
        onClose={() => setCartOpen(false)}
        onUpdateQty={handleUpdateQty}
        onRemove={handleRemoveFromCart}
        onCheckout={handleCheckout}
      />
    </div>
  );
};

const FormItem = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
    {children}
  </div>
);

const InfoRow = ({ label, value }: { label: string; value: string | null | undefined }) => (
    <div>
        <p className="text-sm text-gray-400">{label}</p>
        <p className="text-lg">{value || <span className="text-gray-500 italic">Not set</span>}</p>
    </div>
);

export default Dashboard;
