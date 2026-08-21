
export interface Product {
  id: number;
  name: string;
  category: string;
  pricingTiers: PricingTier[];
  details?: string;
}

export interface PricingTier {
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
  name: string;
  address: string;
  email: string;
}

export interface CompanyInfo {
  name: string;
  address: string;
  email: string;
  phone: string;
}

export type DiscountType = 'percentage' | 'fixed';

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
  content: string | Product; // URL for image, text content for text, Product object for product
  style: {
    fontSize?: number;
    fontWeight?: 'normal' | 'bold';
    color?: string;
    opacity?: number;
  };
}