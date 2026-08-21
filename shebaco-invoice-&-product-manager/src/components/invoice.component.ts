
import { Component, ChangeDetectionStrategy, input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderItem, Customer } from '../types';
import { BrandingService } from '../services/branding.service';

@Component({
  selector: 'app-invoice',
  imports: [CommonModule],
  templateUrl: './invoice.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoiceComponent {
  brandingService = inject(BrandingService);

  orderItems = input.required<OrderItem[]>();
  subtotal = input.required<number>();
  discount = input.required<number>();
  subtotalAfterDiscount = input.required<number>();
  tax = input.required<number>();
  total = input.required<number>();
  customer = input.required<Customer>();

  logoUrl = this.brandingService.logoUrl;
  logoSize = this.brandingService.logoSize;
  companyInfo = this.brandingService.companyInfo;
  accentColor = this.brandingService.accentColor;
  fontFamily = this.brandingService.fontFamily;
  
  currentDate = new Date();
}