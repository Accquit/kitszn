
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Database } from '@/integrations/supabase/types';
import { Skeleton } from "@/components/ui/skeleton";

type Profile = Database['public']['Tables']['profiles']['Row'];

const AdminUsers = () => {
  const { cart } = useCart();

  const { data: profiles, isLoading, error } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase.from('profiles').select('*');
      if (error) {
        throw new Error(error.message);
      }
      return data as Profile[];
    },
  });

  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }

  const renderLoading = () => (
    Array.from({ length: 5 }).map((_, index) => (
      <TableRow key={index}>
        <TableCell><Skeleton className="h-10 w-10 rounded-full" /></TableCell>
        <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
        <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
        <TableCell><Skeleton className="h-4 w-[250px]" /></TableCell>
        <TableCell className="text-right"></TableCell>
      </TableRow>
    ))
  );

  const renderUsers = () => (
    profiles && profiles.length > 0 ? (
      profiles.map((profile) => (
        <TableRow key={profile.id}>
          <TableCell>
            <Avatar>
              <AvatarImage src={profile.avatar_url ?? undefined} alt={profile.full_name ?? ''} />
              <AvatarFallback>{getInitials(profile.full_name)}</AvatarFallback>
            </Avatar>
          </TableCell>
          <TableCell className="font-medium">{profile.full_name ?? 'N/A'}</TableCell>
          <TableCell>{profile.username ?? 'N/A'}</TableCell>
          <TableCell className="font-mono text-xs">{profile.id}</TableCell>
          <TableCell className="text-right">
            {/* Actions can be added here in the future */}
          </TableCell>
        </TableRow>
      ))
    ) : (
      <TableRow>
        <TableCell colSpan={5} className="text-center h-24">No users found.</TableCell>
      </TableRow>
    )
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header cart={cart} onCartClick={() => {}} />
      <main className="pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold font-['Space_Grotesk'] text-gradient">Manage Users</h1>
        </div>
        {error && <div className="text-red-500 text-center p-8 bg-red-900/10 rounded-lg">Error loading users: {error.message}</div>}
        <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800/50 rounded-lg overflow-hidden mt-8">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Avatar</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? renderLoading() : renderUsers()}
            </TableBody>
          </Table>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminUsers;
