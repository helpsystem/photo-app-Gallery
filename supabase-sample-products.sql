-- Sample Products for Shebaco (Custom Resin Keychains & 3D Domed Stickers)
-- این محصولات نمونه هستند که می‌توانید به دیتابیس اضافه کنید
-- IMPORTANT: به جای 'YOUR_USER_ID' از UUID کاربر خود استفاده کنید

-- ابتدا UUID کاربر خود را پیدا کنید:
-- SELECT id FROM auth.users WHERE email = 'your-email@example.com';

-- سپس در هر INSERT به جای 'YOUR_USER_ID' از آن استفاده کنید

-- ========================================
-- CUSTOM RESIN KEYCHAINS
-- ========================================

-- Product 1: Simple Resin
INSERT INTO products (name, category, details, user_id) 
VALUES (
  'Simple Resin',
  'Custom Resin Keychains',
  'Single color, no inclusions - Shore D 80 Hardness',
  'YOUR_USER_ID'
) RETURNING id;

-- Get the product ID from above and use it for pricing tiers
-- Replace PRODUCT_ID_1 with the actual UUID returned above
INSERT INTO pricing_tiers (product_id, tier_name, min_quantity, price) VALUES
('PRODUCT_ID_1', 'Retail', 1, 12.00),
('PRODUCT_ID_1', 'Bulk (50+)', 50, 5.50),
('PRODUCT_ID_1', 'Bulk (500+)', 500, 2.80);

-- Product 2: Artisan Resin
INSERT INTO products (name, category, details, user_id) 
VALUES (
  'Artisan Resin',
  'Custom Resin Keychains',
  'Gold leaf, floral, custom inserts - Multi-layer, Shore D 82 Hardness',
  'YOUR_USER_ID'
) RETURNING id;

-- Replace PRODUCT_ID_2 with the actual UUID
INSERT INTO pricing_tiers (product_id, tier_name, min_quantity, price) VALUES
('PRODUCT_ID_2', 'Retail', 1, 18.00),
('PRODUCT_ID_2', 'Bulk (50+)', 50, 6.50),
('PRODUCT_ID_2', 'Bulk (500+)', 500, 3.50);

-- Product 3: Smart NFC (Social)
INSERT INTO products (name, category, details, user_id) 
VALUES (
  'Smart NFC (Social)',
  'Custom Resin Keychains',
  'Basic V-Card/Social link - NTAG213 Chip, Social Profile Link',
  'YOUR_USER_ID'
) RETURNING id;

-- Replace PRODUCT_ID_3 with the actual UUID
INSERT INTO pricing_tiers (product_id, tier_name, min_quantity, price) VALUES
('PRODUCT_ID_3', 'Retail', 1, 25.00),
('PRODUCT_ID_3', 'Bulk (50+)', 50, 12.00),
('PRODUCT_ID_3', 'Bulk (500+)', 500, 6.50);

-- Product 4: Smart Professional
INSERT INTO products (name, category, details, user_id) 
VALUES (
  'Smart Professional',
  'Custom Resin Keychains',
  'CRM Integrated, Metal trim - NTAG215 Chip, CRM Integration',
  'YOUR_USER_ID'
) RETURNING id;

-- Replace PRODUCT_ID_4 with the actual UUID
INSERT INTO pricing_tiers (product_id, tier_name, min_quantity, price) VALUES
('PRODUCT_ID_4', 'Retail', 1, 35.00),
('PRODUCT_ID_4', 'Bulk (50+)', 50, 14.50),
('PRODUCT_ID_4', 'Bulk (500+)', 500, 8.00);

-- ========================================
-- 3D DOMED RESIN STICKERS
-- ========================================

-- Product 5: Standard 3D Domed Sticker
INSERT INTO products (name, category, details, user_id) 
VALUES (
  'Standard 3D Domed',
  '3D Domed Resin Stickers',
  '1" - 2" diameter - Shore A 60 Hardness, Flexible',
  'YOUR_USER_ID'
) RETURNING id;

-- Replace PRODUCT_ID_5 with the actual UUID
INSERT INTO pricing_tiers (product_id, tier_name, min_quantity, price) VALUES
('PRODUCT_ID_5', 'Retail (1-10)', 1, 8.00),
('PRODUCT_ID_5', 'Bulk (100+)', 100, 2.15),
('PRODUCT_ID_5', 'Enterprise (1000+)', 1000, 0.85);

-- Product 6: Custom Shape/Large Sticker (Option 1)
INSERT INTO products (name, category, details, user_id) 
VALUES (
  'Custom Shape/Large Sticker',
  '3D Domed Resin Stickers',
  'Up to 4" diameter - Shore A 60 Hardness, Flexible',
  'YOUR_USER_ID'
) RETURNING id;

-- Replace PRODUCT_ID_6 with the actual UUID
INSERT INTO pricing_tiers (product_id, tier_name, min_quantity, price) VALUES
('PRODUCT_ID_6', 'Retail (1-10)', 1, 12.00),
('PRODUCT_ID_6', 'Bulk (100+)', 100, 3.50),
('PRODUCT_ID_6', 'Enterprise (1000+)', 1000, 1.25);

-- Product 7: Custom Shape/Large Sticker (Option 2)
INSERT INTO products (name, category, details, user_id) 
VALUES (
  'Custom Shape/Large Premium',
  '3D Domed Resin Stickers',
  'Up to 4" diameter - Premium Quality',
  'YOUR_USER_ID'
) RETURNING id;

-- Replace PRODUCT_ID_7 with the actual UUID
INSERT INTO pricing_tiers (product_id, tier_name, min_quantity, price) VALUES
('PRODUCT_ID_7', 'Retail (1-10)', 1, 15.00),
('PRODUCT_ID_7', 'Bulk (100+)', 100, 4.50),
('PRODUCT_ID_7', 'Enterprise (1000+)', 1000, 1.95);

-- ========================================
-- ADD-ONS & SERVICES
-- ========================================

-- Product 8: Smart NFC Tech Upgrade
INSERT INTO products (name, category, details, user_id) 
VALUES (
  'Smart NFC Tech Upgrade',
  'Add-ons & Services',
  'Adds NFC capability to a compatible item',
  'YOUR_USER_ID'
) RETURNING id;

-- Replace PRODUCT_ID_8 with the actual UUID
INSERT INTO pricing_tiers (product_id, tier_name, min_quantity, price) VALUES
('PRODUCT_ID_8', 'Per Unit', 1, 13.00);

-- Product 9: Design Services
INSERT INTO products (name, category, details, user_id) 
VALUES (
  'Design Services',
  'Add-ons & Services',
  'Core branding & promotional print design',
  'YOUR_USER_ID'
) RETURNING id;

-- Replace PRODUCT_ID_9 with the actual UUID
INSERT INTO pricing_tiers (product_id, tier_name, min_quantity, price) VALUES
('PRODUCT_ID_9', 'Per Project', 1, 100.00);

-- Product 10: Standard Shipping
INSERT INTO products (name, category, details, user_id) 
VALUES (
  'Standard Shipping',
  'Add-ons & Services',
  'USPS Ground Advantage (2-5 Days)',
  'YOUR_USER_ID'
) RETURNING id;

-- Replace PRODUCT_ID_10 with the actual UUID
INSERT INTO pricing_tiers (product_id, tier_name, min_quantity, price) VALUES
('PRODUCT_ID_10', 'Per Order', 1, 8.50);

-- ========================================
-- EASIER METHOD: Using a Function
-- ========================================

-- Create a function to easily add products with tiers
CREATE OR REPLACE FUNCTION add_sample_product(
  p_name TEXT,
  p_category TEXT,
  p_details TEXT,
  p_user_id UUID,
  p_tiers JSONB
)
RETURNS UUID AS $$
DECLARE
  v_product_id UUID;
  v_tier JSONB;
BEGIN
  -- Insert product
  INSERT INTO products (name, category, details, user_id)
  VALUES (p_name, p_category, p_details, p_user_id)
  RETURNING id INTO v_product_id;
  
  -- Insert pricing tiers
  FOR v_tier IN SELECT * FROM jsonb_array_elements(p_tiers)
  LOOP
    INSERT INTO pricing_tiers (product_id, tier_name, min_quantity, price)
    VALUES (
      v_product_id,
      (v_tier->>'tier_name')::TEXT,
      (v_tier->>'min_quantity')::INTEGER,
      (v_tier->>'price')::DECIMAL
    );
  END LOOP;
  
  RETURN v_product_id;
END;
$$ LANGUAGE plpgsql;

-- Usage example:
-- Replace 'your-user-id-here' with your actual user ID
/*
SELECT add_sample_product(
  'Simple Resin',
  'Custom Resin Keychains',
  'Single color, no inclusions - Shore D 80 Hardness',
  'your-user-id-here',
  '[
    {"tier_name": "Retail", "min_quantity": 1, "price": 12.00},
    {"tier_name": "Bulk (50+)", "min_quantity": 50, "price": 5.50},
    {"tier_name": "Bulk (500+)", "min_quantity": 500, "price": 2.80}
  ]'::jsonb
);
*/

-- ========================================
-- Quick Setup: Add ALL Shebaco Products
-- ========================================

-- Step 1: Get your user ID
-- Run this and note the ID:
-- SELECT id FROM auth.users WHERE email = 'your-email@example.com';

-- Step 2: Replace 'YOUR_USER_ID' below and run this block:
/*
DO $$
DECLARE
  v_user_id UUID := 'YOUR_USER_ID'; -- REPLACE THIS!
BEGIN
  -- Custom Resin Keychains
  PERFORM add_sample_product('Simple Resin', 'Custom Resin Keychains', 
    'Single color, no inclusions - Shore D 80 Hardness', v_user_id,
    '[{"tier_name": "Retail", "min_quantity": 1, "price": 12.00},
      {"tier_name": "Bulk (50+)", "min_quantity": 50, "price": 5.50},
      {"tier_name": "Bulk (500+)", "min_quantity": 500, "price": 2.80}]'::jsonb);
      
  PERFORM add_sample_product('Artisan Resin', 'Custom Resin Keychains',
    'Gold leaf, floral, custom inserts - Multi-layer, Shore D 82 Hardness', v_user_id,
    '[{"tier_name": "Retail", "min_quantity": 1, "price": 18.00},
      {"tier_name": "Bulk (50+)", "min_quantity": 50, "price": 6.50},
      {"tier_name": "Bulk (500+)", "min_quantity": 500, "price": 3.50}]'::jsonb);
      
  PERFORM add_sample_product('Smart NFC (Social)', 'Custom Resin Keychains',
    'Basic V-Card/Social link - NTAG213 Chip', v_user_id,
    '[{"tier_name": "Retail", "min_quantity": 1, "price": 25.00},
      {"tier_name": "Bulk (50+)", "min_quantity": 50, "price": 12.00},
      {"tier_name": "Bulk (500+)", "min_quantity": 500, "price": 6.50}]'::jsonb);
      
  PERFORM add_sample_product('Smart Professional', 'Custom Resin Keychains',
    'CRM Integrated, Metal trim - NTAG215 Chip', v_user_id,
    '[{"tier_name": "Retail", "min_quantity": 1, "price": 35.00},
      {"tier_name": "Bulk (50+)", "min_quantity": 50, "price": 14.50},
      {"tier_name": "Bulk (500+)", "min_quantity": 500, "price": 8.00}]'::jsonb);
  
  -- 3D Domed Resin Stickers
  PERFORM add_sample_product('Standard 3D Domed', '3D Domed Resin Stickers',
    '1" - 2" diameter - Shore A 60 Hardness, Flexible', v_user_id,
    '[{"tier_name": "Retail (1-10)", "min_quantity": 1, "price": 8.00},
      {"tier_name": "Bulk (100+)", "min_quantity": 100, "price": 2.15},
      {"tier_name": "Enterprise (1000+)", "min_quantity": 1000, "price": 0.85}]'::jsonb);
      
  PERFORM add_sample_product('Custom Shape/Large', '3D Domed Resin Stickers',
    'Up to 4" diameter - Shore A 60 Hardness', v_user_id,
    '[{"tier_name": "Retail (1-10)", "min_quantity": 1, "price": 12.00},
      {"tier_name": "Bulk (100+)", "min_quantity": 100, "price": 3.50},
      {"tier_name": "Enterprise (1000+)", "min_quantity": 1000, "price": 1.25}]'::jsonb);
  
  RAISE NOTICE 'Sample products added successfully!';
END $$;
*/
