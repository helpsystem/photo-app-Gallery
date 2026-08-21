-- محصولات نمونه Shebaco - روش ساده
-- این را در Supabase SQL Editor اجرا کنید

-- ابتدا User ID خود را پیدا کنید
SELECT id, email FROM auth.users LIMIT 5;

-- سپس این Function را اجرا کنید (فقط یک بار)
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
  INSERT INTO products (name, category, details, user_id)
  VALUES (p_name, p_category, p_details, p_user_id)
  RETURNING id INTO v_product_id;
  
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

-- حالا این را اجرا کنید (جایگزین USER_ID_HERE با UUID خود)
DO $$
DECLARE
  v_user_id UUID := 'USER_ID_HERE'; -- 👈 اینجا را تغییر دهید!
BEGIN
  -- Custom Resin Keychains
  PERFORM add_sample_product('Simple Resin', 'Custom Resin Keychains', 
    'Single color, no inclusions', v_user_id,
    '[{"tier_name": "Retail", "min_quantity": 1, "price": 12.00},
      {"tier_name": "Bulk (50+)", "min_quantity": 50, "price": 5.50},
      {"tier_name": "Bulk (500+)", "min_quantity": 500, "price": 2.80}]'::jsonb);
      
  PERFORM add_sample_product('Artisan Resin', 'Custom Resin Keychains',
    'Gold leaf, floral, custom inserts', v_user_id,
    '[{"tier_name": "Retail", "min_quantity": 1, "price": 18.00},
      {"tier_name": "Bulk (50+)", "min_quantity": 50, "price": 6.50},
      {"tier_name": "Bulk (500+)", "min_quantity": 500, "price": 3.50}]'::jsonb);
      
  PERFORM add_sample_product('Smart NFC (Social)', 'Custom Resin Keychains',
    'Basic V-Card/Social link', v_user_id,
    '[{"tier_name": "Retail", "min_quantity": 1, "price": 25.00},
      {"tier_name": "Bulk (50+)", "min_quantity": 50, "price": 12.00},
      {"tier_name": "Bulk (500+)", "min_quantity": 500, "price": 6.50}]'::jsonb);
      
  PERFORM add_sample_product('Smart Professional', 'Custom Resin Keychains',
    'CRM Integrated, Metal trim', v_user_id,
    '[{"tier_name": "Retail", "min_quantity": 1, "price": 35.00},
      {"tier_name": "Bulk (50+)", "min_quantity": 50, "price": 14.50},
      {"tier_name": "Bulk (500+)", "min_quantity": 500, "price": 8.00}]'::jsonb);
  
  -- 3D Domed Resin Stickers
  PERFORM add_sample_product('Standard 3D Domed (1"-2")', '3D Domed Resin Stickers',
    'Shore A 60 Hardness, Flexible', v_user_id,
    '[{"tier_name": "Retail (1-10)", "min_quantity": 1, "price": 8.00},
      {"tier_name": "Bulk (100+)", "min_quantity": 100, "price": 2.15},
      {"tier_name": "Enterprise (1000+)", "min_quantity": 1000, "price": 0.85}]'::jsonb);
      
  PERFORM add_sample_product('Custom Shape/Large (Up to 4")', '3D Domed Resin Stickers',
    'Shore A 60 Hardness, Flexible', v_user_id,
    '[{"tier_name": "Retail (1-10)", "min_quantity": 1, "price": 12.00},
      {"tier_name": "Bulk (100+)", "min_quantity": 100, "price": 3.50},
      {"tier_name": "Enterprise (1000+)", "min_quantity": 1000, "price": 1.25}]'::jsonb);
      
  PERFORM add_sample_product('Custom Shape Premium (Up to 4")', '3D Domed Resin Stickers',
    'Shore A 60 Hardness', v_user_id,
    '[{"tier_name": "Retail (1-10)", "min_quantity": 1, "price": 15.00},
      {"tier_name": "Bulk (100+)", "min_quantity": 100, "price": 4.50},
      {"tier_name": "Enterprise (1000+)", "min_quantity": 1000, "price": 1.95}]'::jsonb);
  
  RAISE NOTICE '✅ Sample Shebaco products added successfully!';
END $$;
