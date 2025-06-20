
-- Create an ENUM type for order statuses for better data integrity.
CREATE TYPE public.order_status AS ENUM ('Pending', 'Shipped', 'Completed', 'Cancelled');

-- Alter the 'orders' table to use the new ENUM type for the 'status' column.
-- This will also attempt to cast existing text values to the new enum type.
-- We drop the old text-based default, change the type, and set a new default using the enum.
ALTER TABLE public.orders
    ALTER COLUMN status DROP DEFAULT,
    ALTER COLUMN status TYPE public.order_status USING status::text::public.order_status,
    ALTER COLUMN status SET DEFAULT 'Pending';
