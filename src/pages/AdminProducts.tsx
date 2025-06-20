import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Plus, Edit, Trash2 } from 'lucide-react';

import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import ProductDialog from '@/components/ProductDialog';
import { Badge } from '@/components/ui/badge';

type Product = Database['public']['Tables']['products']['Row'];

const AdminProducts = () => {
  const { cart } = useCart();
  const [dialogState, setDialogState] = React.useState<{ open: boolean; product: Product | null }>({ open: false, product: null });
  const [deleteAlertState, setDeleteAlertState] = React.useState<{ open: boolean; productId: number | null }>({ open: false, productId: null });
  const queryClient = useQueryClient();

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { mutate: deleteProduct } = useMutation({
    mutationFn: async (productId: number) => {
      const { error } = await supabase.from('products').delete().eq('id', productId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Product deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['featured-products'] });
    },
    onError: (error) => {
      toast.error(`Failed to delete product: ${error.message}`);
    },
  });

  const handleDeleteConfirm = () => {
    if (deleteAlertState.productId) {
      deleteProduct(deleteAlertState.productId);
      setDeleteAlertState({ open: false, productId: null });
    }
  };

  if (error) {
    return <div className="text-red-500 text-center p-8">Error loading products: {error.message}</div>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header cart={cart} onCartClick={() => {}} />
      <main className="pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold font-['Space_Grotesk'] text-gradient">Manage Products</h1>
          <Button onClick={() => setDialogState({ open: true, product: null })}>
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Button>
        </div>
        <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800/50 rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center h-24">Loading products...</TableCell>
                </TableRow>
              ) : products && products.length > 0 ? (
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <img src={product.image_url || '/placeholder.svg'} alt={product.name} className="h-12 w-12 object-cover rounded-md bg-gray-700" />
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>₹{Math.round(product.price)}</TableCell>
                    <TableCell>
                      {product.stock != null && product.low_stock_threshold != null && product.stock <= product.low_stock_threshold ? (
                        <Badge variant="destructive">Low ({product.stock})</Badge>
                      ) : (
                        product.stock
                      )}
                    </TableCell>
                    <TableCell>{product.featured ? 'Yes' : 'No'}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => setDialogState({ open: true, product })}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteAlertState({ open: true, productId: product.id })}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center h-24">No products found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </main>
      <Footer />
      <ProductDialog 
        open={dialogState.open}
        onOpenChange={(open) => setDialogState({ ...dialogState, open })}
        product={dialogState.product}
        onSuccess={() => {
          setDialogState({ open: false, product: null });
        }}
      />
      <AlertDialog open={deleteAlertState.open} onOpenChange={(open) => setDeleteAlertState({ ...deleteAlertState, open })}>
        <AlertDialogContent className="bg-background">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminProducts;
