-- Run this once against your existing TiDB Cloud database to add
-- GST / delivery-fee / payment-method support to the orders table.
-- Safe to re-run: each column is only added if it doesn't already exist.

ALTER TABLE orders ADD COLUMN IF NOT EXISTS subtotal DECIMAL(10,2) NOT NULL DEFAULT 0 AFTER address;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS gst_amount DECIMAL(10,2) NOT NULL DEFAULT 0 AFTER subtotal;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_fee DECIMAL(10,2) NOT NULL DEFAULT 0 AFTER gst_amount;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method ENUM('cod','online') NOT NULL DEFAULT 'cod' AFTER total_price;

-- Backfill existing rows so subtotal/gst/delivery aren't all zero for past orders
-- (assumes old orders had no GST/delivery split — adjust if needed)
UPDATE orders SET subtotal = total_price WHERE subtotal = 0 AND total_price > 0;
