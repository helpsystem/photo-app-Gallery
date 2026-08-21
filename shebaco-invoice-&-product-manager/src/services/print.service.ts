
import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PrintService {
  paperSize = signal<'a4' | 'letter'>('a4');

  setPaperSize(size: 'a4' | 'letter'): void {
    this.paperSize.set(size);
  }
}
