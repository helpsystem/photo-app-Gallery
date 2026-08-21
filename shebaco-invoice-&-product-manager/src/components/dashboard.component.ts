
import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Product, PricingTier, CompanyInfo } from '../types';
import { ProductService } from '../services/product.service';
import { BrandingService } from '../services/branding.service';
import { PrintService } from '../services/print.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  productService = inject(ProductService);
  brandingService = inject(BrandingService);
  printService = inject(PrintService);
  fb = inject(FormBuilder);

  products = this.productService.products;
  logoUrl = this.brandingService.logoUrl;
  logoSize = this.brandingService.logoSize;
  
  isModalOpen = false;
  editingProduct: Product | null = null;
  
  fonts = [
    { name: 'Inter', value: 'Inter, sans-serif' },
    { name: 'Roboto', value: 'Roboto, sans-serif' },
    { name: 'Lato', value: 'Lato, sans-serif' },
    { name: 'Montserrat', value: 'Montserrat, sans-serif' }
  ];

  productForm = this.fb.group({
    id: [null as number | null],
    name: ['', Validators.required],
    category: ['', Validators.required],
    details: [''],
    pricingTiers: this.fb.array([])
  });

  companyInfoForm = this.fb.group({
    name: [''],
    address: [''],
    email: [''],
    phone: ['']
  });

  settingsForm = this.fb.group({
    taxRate: [6],
    accentColor: ['#0891b2'],
    fontFamily: ['Inter, sans-serif'],
    paperSize: ['a4']
  });

  ngOnInit(): void {
    // Sync forms with service state on init
    this.companyInfoForm.patchValue(this.brandingService.companyInfo());
    this.settingsForm.patchValue({
      taxRate: this.brandingService.taxRate(),
      accentColor: this.brandingService.accentColor(),
      fontFamily: this.brandingService.fontFamily(),
      paperSize: this.printService.paperSize()
    });

    // Subscribe to form changes and update services
    this.companyInfoForm.valueChanges.subscribe(value => {
      this.brandingService.setCompanyInfo(value as CompanyInfo);
    });
    this.settingsForm.get('taxRate')?.valueChanges.subscribe(val => this.brandingService.setTaxRate(Number(val)));
    this.settingsForm.get('accentColor')?.valueChanges.subscribe(val => this.brandingService.setAccentColor(val ?? '#0891b2'));
    this.settingsForm.get('fontFamily')?.valueChanges.subscribe(val => this.brandingService.setFontFamily(val ?? 'Inter, sans-serif'));
    this.settingsForm.get('paperSize')?.valueChanges.subscribe(val => this.printService.setPaperSize(val as 'a4' | 'letter'));
  }

  get pricingTiers() {
    return this.productForm.get('pricingTiers') as FormArray;
  }

  addTier(tier?: PricingTier): void {
    this.pricingTiers.push(this.fb.group({
      tierName: [tier?.tierName || '', Validators.required],
      minQuantity: [tier?.minQuantity || 1, [Validators.required, Validators.min(1)]],
      price: [tier?.price || 0, [Validators.required, Validators.min(0)]]
    }));
  }

  removeTier(index: number): void {
    this.pricingTiers.removeAt(index);
  }

  openModal(product: Product | null = null): void {
    this.editingProduct = product;
    this.productForm.reset();
    this.pricingTiers.clear();
    
    if (product) {
      this.productForm.patchValue(product);
      product.pricingTiers.forEach(tier => this.addTier(tier));
    } else {
      this.addTier({ tierName: 'Retail', minQuantity: 1, price: 0 });
    }
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  saveProduct(): void {
    if (this.productForm.invalid) {
      return;
    }

    const formValue = this.productForm.getRawValue();

    if (this.editingProduct && formValue.id) {
      this.productService.updateProduct(formValue as Product);
    } else {
      const { id, ...newProduct } = formValue;
      this.productService.addProduct(newProduct as Omit<Product, 'id'>);
    }
    this.closeModal();
  }

  deleteProduct(productId: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(productId);
    }
  }

  onLogoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.brandingService.setLogo(input.files[0]);
    }
  }

  onLogoSizeChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.brandingService.setLogoSize(Number(input.value));
  }
}