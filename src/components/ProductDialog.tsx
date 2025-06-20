
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Product = Database['public']['Tables']['products']['Row'];
type ProductInsert = Database['public']['Tables']['products']['Insert'];

const productFormSchema = z.object({
  name: z.string().min(1, 'Product name is required.'),
  description: z.string().optional(),
  price: z.coerce.number().min(0, 'Price must be a positive number.'),
  category: z.string().min(1, 'Category is required.'),
  image_url: z.string().url('Must be a valid URL.').optional().or(z.literal('')),
  featured: z.boolean().default(false),
  stock: z.coerce.number().int().min(0, 'Stock must be a non-negative integer.'),
  low_stock_threshold: z.coerce.number().int().min(0, 'Threshold must be a non-negative integer.'),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onSuccess: () => void;
}

const ProductDialog: React.FC<ProductDialogProps> = ({ open, onOpenChange, product, onSuccess }) => {
  const queryClient = useQueryClient();
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      category: '',
      image_url: '',
      featured: false,
      stock: 0,
      low_stock_threshold: 5,
    },
  });

  React.useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        description: product.description || '',
        price: product.price,
        category: product.category,
        image_url: product.image_url || '',
        featured: product.featured || false,
        stock: product.stock ?? 0,
        low_stock_threshold: product.low_stock_threshold ?? 5,
      });
    } else {
      form.reset({
        name: '',
        description: '',
        price: 0,
        category: '',
        image_url: '',
        featured: false,
        stock: 100, // Default for new products
        low_stock_threshold: 5,
      });
    }
  }, [product, form]);

  const { mutate: saveProduct, isPending } = useMutation({
    mutationFn: async (values: ProductFormValues) => {
      const productData: ProductInsert = {
        name: values.name,
        description: values.description || null,
        price: values.price,
        category: values.category,
        image_url: values.image_url || null,
        featured: values.featured,
        stock: values.stock,
        low_stock_threshold: values.low_stock_threshold,
      };

      if (product) {
        // Update existing product
        const { error } = await supabase.from('products').update(productData).eq('id', product.id);
        if (error) throw error;
      } else {
        // Create new product
        const { error } = await supabase.from('products').insert(productData);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(product ? 'Product updated successfully!' : 'Product created successfully!');
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['featured-products'] });
      onSuccess();
    },
    onError: (error) => {
      toast.error(`Failed to save product: ${error.message}`);
    },
  });

  const onSubmit = (values: ProductFormValues) => {
    saveProduct(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-background">
        <DialogHeader>
          <DialogTitle>{product ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          <DialogDescription>
            {product ? 'Update the details of your product.' : 'Fill in the details for the new product.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Manchester United Home Jersey" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Product description..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="99.99" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Club Jerseys" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="low_stock_threshold"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Low Stock Threshold</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
             <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/image.png" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="featured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Featured Product</FormLabel>
                    <DialogDescription>
                      Featured products will be displayed on the homepage.
                    </DialogDescription>
                  </div>
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Saving...' : 'Save Product'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDialog;

