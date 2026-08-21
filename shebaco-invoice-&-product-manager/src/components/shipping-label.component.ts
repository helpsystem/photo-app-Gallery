
import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Customer, CompanyInfo } from '../types';

@Component({
  selector: 'app-shipping-label',
  imports: [CommonModule],
  templateUrl: './shipping-label.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShippingLabelComponent {
  sender = input.required<CompanyInfo>();
  receiver = input.required<Customer>();
}
