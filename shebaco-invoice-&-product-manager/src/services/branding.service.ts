
import { Injectable, signal } from '@angular/core';
import { CompanyInfo } from '../types';

@Injectable({
  providedIn: 'root'
})
export class BrandingService {
  logoUrl = signal<string>('https://i.ibb.co/6Pq9Z1g/shebaco-logo.png');
  logoSize = signal<number>(48); // Default size in pixels (h-12)

  companyInfo = signal<CompanyInfo>({
    name: 'Shebaco',
    address: '123 Tech Lane, Innovation City, 12345',
    email: 'sabaramservices@gmail.com',
    phone: '301-337-1221'
  });

  // Invoice Appearance Settings
  taxRate = signal<number>(6); // Default 6%
  accentColor = signal<string>('#0891b2'); // Default: cyan-600
  fontFamily = signal<string>('Inter, sans-serif');

  setLogo(file: File): void {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          this.logoUrl.set(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  }

  setLogoSize(size: number): void {
    this.logoSize.set(size);
  }

  setCompanyInfo(info: CompanyInfo): void {
    this.companyInfo.set(info);
  }

  setTaxRate(rate: number): void {
    this.taxRate.set(rate);
  }
  
  setAccentColor(color: string): void {
    this.accentColor.set(color);
  }

  setFontFamily(font: string): void {
    this.fontFamily.set(font);
  }
}