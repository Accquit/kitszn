
-- Add a 'customization' column to the order_items table to store details for customized jerseys.
ALTER TABLE public.order_items ADD COLUMN customization jsonb;
COMMENT ON COLUMN public.order_items.customization IS 'Stores jersey customization details.';

-- Create a custom type to represent a cart item. This will be used as an argument for our new database function.
CREATE TYPE public.cart_item_type AS (
  product_id integer,
  quantity integer,
  price numeric,
  customization jsonb
);

-- Create a new database function to handle the entire order creation process in a single transaction.
-- This is a critical improvement for data consistency. It will:
-- 1. Create an order.
-- 2. Validate stock for each item.
-- 3. Create order items.
-- 4. Update product stock levels.
-- If any step fails, the entire transaction is rolled back, preventing inconsistent data.
CREATE OR REPLACE FUNCTION public.create_new_order(
  p_user_id uuid,
  p_cart_items public.cart_item_type[],
  p_shipping_info jsonb,
  p_total numeric
)
RETURNS uuid AS $$
DECLARE
  v_order_id uuid;
  v_item public.cart_item_type;
  v_product_stock integer;
  v_customer_name text;
  v_customer_email text;
BEGIN
  -- Extract customer info from shipping_info
  v_customer_name := p_shipping_info->>'firstName' || ' ' || p_shipping_info->>'lastName';
  v_customer_email := p_shipping_info->>'email';

  -- 1. Create the order
  INSERT INTO public.orders (user_id, total, shipping_address, customer_name, customer_email, status)
  VALUES (
    p_user_id,
    p_total,
    p_shipping_info,
    v_customer_name,
    v_customer_email,
    'Pending'
  ) RETURNING id INTO v_order_id;

  -- 2. Process order items
  FOREACH v_item IN ARRAY p_cart_items
  LOOP
    -- Check stock
    SELECT stock INTO v_product_stock FROM public.products WHERE id = v_item.product_id;

    IF v_product_stock IS NULL OR v_product_stock < v_item.quantity THEN
      RAISE EXCEPTION 'Not enough stock for product ID %. Only % left in stock.', v_item.product_id, v_product_stock;
    END IF;

    -- Insert order item
    INSERT INTO public.order_items (order_id, product_id, quantity, price, customization)
    VALUES (v_order_id, v_item.product_id, v_item.quantity, v_item.price, v_item.customization);

    -- Update stock
    UPDATE public.products
    SET stock = stock - v_item.quantity
    WHERE id = v_item.product_id;
  END LOOP;

  RETURN v_order_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
