
-- Enable Row-Level Security for the 'products' table
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- RLS Policy for public access (read-only for everyone)
CREATE POLICY "Products are viewable by everyone" ON public.products
    FOR SELECT USING (true);

-- RLS Policy for admin access (full control for admins)
CREATE POLICY "Admins can manage all products" ON public.products
    FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
