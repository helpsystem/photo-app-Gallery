
import { Injectable, signal } from '@angular/core';
import { Product } from '../types';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  products = signal<Product[]>([
    {
      id: 1,
      name: 'Simple Resin (Single color, no inclusions)',
      category: 'Custom Resin Keychains',
      details: 'Shore D 80 Hardness',
      pricingTiers: [
        { tierName: 'Retail', minQuantity: 1, price: 12.00 },
        { tierName: 'Bulk (50+)', minQuantity: 50, price: 5.50 },
        { tierName: 'Bulk (500+)', minQuantity: 500, price: 2.80 }
      ]
    },
    {
      id: 2,
      name: 'Artisan Resin (Gold leaf, floral, custom inserts)',
      category: 'Custom Resin Keychains',
      details: 'Multi-layer, Shore D 82 Hardness',
      pricingTiers: [
        { tierName: 'Retail', minQuantity: 1, price: 18.00 },
        { tierName: 'Bulk (50+)', minQuantity: 50, price: 6.50 },
        { tierName: 'Bulk (500+)', minQuantity: 500, price: 3.50 }
      ]
    },
    {
      id: 3,
      name: 'Smart NFC (Social) (Basic V-Card/Social link)',
      category: 'Custom Resin Keychains',
      details: 'NTAG213 Chip, Social Profile Link',
      pricingTiers: [
        { tierName: 'Retail', minQuantity: 1, price: 25.00 },
        { tierName: 'Bulk (50+)', minQuantity: 50, price: 12.00 },
        { tierName: 'Bulk (500+)', minQuantity: 500, price: 6.50 }
      ]
    },
    {
      id: 4,
      name: 'Smart Professional (CRM Integrated, Metal trim)',
      category: 'Custom Resin Keychains',
      details: 'NTAG215 Chip, CRM Integration',
      pricingTiers: [
        { tierName: 'Retail', minQuantity: 1, price: 35.00 },
        { tierName: 'Bulk (50+)', minQuantity: 50, price: 14.50 },
        { tierName: 'Bulk (500+)', minQuantity: 500, price: 8.00 }
      ]
    },
    {
      id: 5,
      name: 'Standard 3D Domed Sticker (1" - 2" diameter)',
      category: '3D Domed Resin Stickers',
      details: 'Shore A 60 Hardness, Flexible',
      pricingTiers: [
        { tierName: 'Retail', minQuantity: 1, price: 8.00 },
        { tierName: 'Bulk (100+)', minQuantity: 100, price: 2.15 },
        { tierName: 'Enterprise (1000+)', minQuantity: 1000, price: 0.85 }
      ]
    },
    {
      id: 6,
      name: 'Custom Shape/Large Sticker (Up to 4" diameter)',
      category: '3D Domed Resin Stickers',
      details: 'Shore A 60 Hardness, Flexible',
      pricingTiers: [
        { tierName: 'Retail', minQuantity: 1, price: 15.00 },
        { tierName: 'Bulk (100+)', minQuantity: 100, price: 4.50 },
        { tierName: 'Enterprise (1000+)', minQuantity: 1000, price: 1.95 }
      ]
    },
    {
      id: 7,
      name: 'Smart NFC Tech Upgrade',
      category: 'Add-ons & Services',
      details: 'Adds NFC capability to a compatible item',
      pricingTiers: [
        { tierName: 'Per Unit', minQuantity: 1, price: 13.00 }
      ]
    },
    {
      id: 8,
      name: 'Design Services',
      category: 'Add-ons & Services',
      details: 'Core branding & promotional print design',
      pricingTiers: [
        { tierName: 'Per Project', minQuantity: 1, price: 100.00 }
      ]
    },
    {
      id: 9,
      name: 'Standard Shipping',
      category: 'Add-ons & Services',
      details: 'USPS Ground Advantage (2-5 Days)',
      pricingTiers: [
        { tierName: 'Per Order', minQuantity: 1, price: 8.50 }
      ]
    }
  ]);

  constructor() { }

  addProduct(product: Omit<Product, 'id'>): void {
    // In a real app, this would send data to a backend (e.g., Google Apps Script).
    // The backend would add a row to Google Sheets and return the new product with an ID.
    console.log('SIMULATING ADD:', product);
    const newProduct: Product = { ...product, id: Date.now() }; // Use timestamp for unique ID in simulation
    this.products.update(products => [...products, newProduct]);
  }

  updateProduct(updatedProduct: Product): void {
    // In a real app, this would send data to a backend to update the corresponding row in Google Sheets.
    console.log('SIMULATING UPDATE:', updatedProduct);
    this.products.update(products =>
      products.map(p => p.id === updatedProduct.id ? updatedProduct : p)
    );
  }

  deleteProduct(productId: number): void {
    // In a real app, this would call a backend endpoint to delete the row from Google Sheets.
    console.log('SIMULATING DELETE:', productId);
    this.products.update(products => products.filter(p => p.id !== productId));
  }
}