// Types for Invoice & Product Manager (Shebaco)

export interface Product {
  id: string;
  name: string;
  category: string;
  pricingTiers: PricingTier[];
  details?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PricingTier {
  id?: string;
  tierName: string;
  minQuantity: number;
  price: number;
}

export interface OrderItem {
  product: Product;
  quantity: number;
  price: number;
  totalPrice: number;
}

export interface Customer {
  id?: string;
  name: string;
  address: string;
  email: string;
  phone?: string;
}

export interface CompanyInfo {
  id?: string;
  name: string;
  address: string;
  email: string;
  phone: string;
  logoUrl?: string;
  logoSize?: number;
}

export type DiscountType = 'percentage' | 'fixed';

export interface Invoice {
  id: string;
  invoice_number: string;
  customer_id?: string;
  customer_name: string;
  customer_email?: string;
  customer_address?: string;
  subtotal: number;
  discount_type: DiscountType;
  discount_value: number;
  discount_amount: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'cancelled';
  notes?: string;
  created_at: string;
  items?: InvoiceItem[];
}

export interface InvoiceItem {
  id?: string;
  invoice_id: string;
  product_id?: string;
  product_name: string;
  product_category?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface InvoiceSettings {
  id?: string;
  tax_rate: number;
  accent_color: string;
  font_family: string;
  paper_size: 'a4' | 'letter';
  next_invoice_number?: number;
}

export type AspectRatio = "1:1" | "3:4" | "4:3" | "9:16" | "16:9";

// Types for Flyer Designer
export type FlyerElementType = 'text' | 'image' | 'product';

export interface FlyerElement {
  id: number;
  type: FlyerElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  content: string | Product;
  style: {
    fontSize?: number;
    fontWeight?: 'normal' | 'bold';
    color?: string;
    opacity?: number;
  };
}
