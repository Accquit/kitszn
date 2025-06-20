
-- Convert prices from USD to INR (using an exchange rate of 1 USD = 83 INR)
UPDATE public.products SET price = price * 83;
UPDATE public.order_items SET price = price * 83;
UPDATE public.orders SET total = total * 83;
