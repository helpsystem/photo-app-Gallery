
import { ChangeDetectionStrategy, Component, computed, inject, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';

import { Product, OrderItem, AspectRatio, PricingTier, Customer, DiscountType } from '../types';
import { ProductService } from '../services/product.service';
import { GeminiService } from '../services/gemini.service';
import { BrandingService } from '../services/branding.service';
import { PrintService } from '../services/print.service';
import { InvoiceComponent } from './invoice.component';
import { ShippingLabelComponent } from './shipping-label.component';

declare var jspdf: any;
declare var html2canvas: any;

@Component({
  selector: 'app-invoice-builder',
  imports: [CommonModule, InvoiceComponent, ReactiveFormsModule, ShippingLabelComponent],
  templateUrl: './invoice-builder.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoiceBuilderComponent {
  productService = inject(ProductService);
  geminiService = inject(GeminiService);
  brandingService = inject(BrandingService);
  printService = inject(PrintService);
  fb = inject(FormBuilder);

  products = this.productService.products;
  // Private signal to hold the raw order items (without calculated prices)
  private rawOrderItems: WritableSignal<Omit<OrderItem, 'price' | 'totalPrice'>[]> = signal([]);
  
  // Public computed signal that automatically calculates correct prices and totals
  orderItems = computed(() => {
    return this.rawOrderItems().map(item => {
      const price = this.calculatePrice(item.product, item.quantity);
      return {
        ...item,
        price,
        totalPrice: price * item.quantity
      };
    });
  });

  companyInfo = this.brandingService.companyInfo;
  paperSize = this.printService.paperSize;

  customerForm = this.fb.group({
    name: [''], address: [''], email: ['']
  });
  customer = signal<Customer>({name: '', address: '', email: ''});

  discountForm = this.fb.group({
    value: [0],
    type: ['fixed' as DiscountType]
  });
  
  // Invoice calculations now derive from the computed `orderItems`
  subtotal = computed(() => this.orderItems().reduce((acc, item) => acc + item.totalPrice, 0));
  
  discountAmount = computed(() => {
    const type = this.discountForm.get('type')?.value;
    const value = this.discountForm.get('value')?.value ?? 0;
    if (type === 'percentage') {
      return this.subtotal() * (value / 100);
    }
    return value;
  });

  subtotalAfterDiscount = computed(() => this.subtotal() - this.discountAmount());
  taxRate = this.brandingService.taxRate;
  tax = computed(() => this.subtotalAfterDiscount() * (this.taxRate() / 100));
  total = computed(() => this.subtotalAfterDiscount() + this.tax());

  aiDescription = signal('');
  aiDescriptionLoading = signal(false);
  selectedProductForAI = signal<Product | null>(null);
  
  marketCheckText = signal('');
  marketCheckSources = signal<any[]>([]);
  marketCheckLoading = signal(false);

  pdfLoading = signal(false);

  constructor() {
    this.customerForm.valueChanges.subscribe(value => {
      this.customer.set({ name: value.name ?? '', address: value.address ?? '', email: value.email ?? '' });
    });
  }

  addToOrder(product: Product, tier: PricingTier): void {
    const existingItem = this.rawOrderItems().find(item => item.product.id === product.id);
    if (existingItem) {
      // If item exists, just increment its quantity
      this.rawOrderItems.update(items => 
        items.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
      );
    } else {
      // Add new item with the tier's minimum quantity.
      // Price and total are omitted as they are handled by the computed signal.
      this.rawOrderItems.update(items => [...items, { product, quantity: tier.minQuantity }]);
    }
  }

  updateQuantity(productId: number, quantityStr: string): void {
    const quantity = Number(quantityStr);
    if (isNaN(quantity) || quantity < 0) return;

    if (quantity === 0) {
      this.removeFromOrder(productId);
      return;
    }

    this.rawOrderItems.update(items => 
        items.map(item => item.product.id === productId ? { ...item, quantity } : item)
    );
  }

  removeFromOrder(productId: number): void {
    this.rawOrderItems.update(items => items.filter(item => item.product.id !== productId));
  }

  calculatePrice(product: Product, quantity: number): number {
    let price = product.pricingTiers[0].price;
    // Tiers must be sorted by minQuantity to ensure the correct price is selected.
    const sortedTiers = [...product.pricingTiers].sort((a,b) => a.minQuantity - b.minQuantity);
    for (const tier of sortedTiers) {
      if (quantity >= tier.minQuantity) {
        price = tier.price;
      }
    }
    return price;
  }

  printInvoice(): void { window.print(); }

  async downloadPdf(): Promise<void> {
    this.pdfLoading.set(true);
    try {
      const invoiceElement = document.getElementById('invoice-print-area');
      if (!invoiceElement) {
        console.error('Invoice element not found.');
        return;
      }
      const canvas = await html2canvas(invoiceElement, { scale: 2, windowWidth: invoiceElement.scrollWidth, windowHeight: invoiceElement.scrollHeight });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jspdf.jsPDF('p', 'mm', this.paperSize());
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('Shebaco-Invoice.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      this.pdfLoading.set(false);
    }
  }
  
  selectProductForAI(product: Product): void {
    this.selectedProductForAI.set(product);
    this.aiDescription.set('');
    this.marketCheckText.set('');
    this.marketCheckSources.set([]);
  }

  async checkMarketPrice(): Promise<void> {
    const product = this.selectedProductForAI();
    if (!product) return;
    
    this.marketCheckLoading.set(true);
    this.marketCheckText.set('');
    this.marketCheckSources.set([]);
    try {
      const result = await this.geminiService.getMarketPriceInfo(product.name);
      this.marketCheckText.set(result.text);
      this.marketCheckSources.set(result.sources);
    } catch (error) {
      console.error('Error checking market price:', error);
      this.marketCheckText.set('Sorry, there was an error fetching market data.');
    } finally {
      this.marketCheckLoading.set(false);
    }
  }
}