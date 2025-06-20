
-- Update the create_new_order function to handle shipping information more robustly.
-- It now accepts shipping_info as text and casts it to jsonb internally.
-- This prevents type mismatch errors during function execution.
CREATE OR REPLACE FUNCTION public.create_new_order(
  p_user_id uuid,
  p_cart_items public.cart_item_type[],
  p_shipping_info text, -- Changed from jsonb to text
  p_total numeric
)
RETURNS uuid AS $$
DECLARE
  v_order_id uuid;
  v_item public.cart_item_type;
  v_product_stock integer;
  v_customer_name text;
  v_customer_email text;
  v_shipping_info_jsonb jsonb;
BEGIN
  -- Cast the text input to jsonb
  v_shipping_info_jsonb := p_shipping_info::jsonb;

  -- Extract customer info from shipping_info
  v_customer_name := v_shipping_info_jsonb->>'firstName' || ' ' || v_shipping_info_jsonb->>'lastName';
  v_customer_email := v_shipping_info_jsonb->>'email';

  -- 1. Create the order
  INSERT INTO public.orders (user_id, total, shipping_address, customer_name, customer_email, status)
  VALUES (
    p_user_id,
    p_total,
    v_shipping_info_jsonb,
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
