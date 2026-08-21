
import { Component, ChangeDetectionStrategy, inject, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { GeminiService } from '../services/gemini.service';
import { Product, FlyerElement } from '../types';

@Component({
  selector: 'app-flyer-designer',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './flyer-designer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlyerDesignerComponent {
  productService = inject(ProductService);
  geminiService = inject(GeminiService);
  fb = inject(FormBuilder);

  products = this.productService.products;
  flyerElements: WritableSignal<FlyerElement[]> = signal([]);
  selectedElement = signal<FlyerElement | null>(null);

  // AI State
  imageGenPrompt = signal('A futuristic resin keychain with glowing circuits');
  imageGenLoading = signal(false);
  generatedImages = signal<string[]>([]);
  
  propertiesForm = this.fb.group({
    fontSize: [16],
    fontWeight: ['normal'],
    color: ['#ffffff'],
    opacity: [1]
  });

  constructor() {
    this.propertiesForm.valueChanges.subscribe(values => {
      this.updateSelectedElement(values);
    });
  }

  addElement(type: 'text' | 'product', content: string | Product): void {
    const newElement: FlyerElement = {
      id: Date.now(),
      type: type,
      x: 20, y: 20,
      width: type === 'product' ? 150 : 200,
      height: type === 'product' ? 150 : 50,
      content: content,
      style: {
        fontSize: type === 'text' && (content as string).toLowerCase().includes('headline') ? 32 : 16,
        fontWeight: type === 'text' && (content as string).toLowerCase().includes('headline') ? 'bold' : 'normal',
        color: '#FFFFFF',
        opacity: 1
      }
    };
    this.flyerElements.update(elements => [...elements, newElement]);
    this.selectElement(newElement);
  }
  
  addImageElement(base64: string): void {
     const newElement: FlyerElement = {
      id: Date.now(),
      type: 'image',
      x: 20, y: 20,
      width: 200, height: 200,
      content: `data:image/png;base64,${base64}`,
      style: { opacity: 1 }
    };
    this.flyerElements.update(elements => [...elements, newElement]);
    this.selectElement(newElement);
  }

  selectElement(element: FlyerElement): void {
    this.selectedElement.set(element);
    this.propertiesForm.patchValue({
      fontSize: element.style.fontSize ?? 16,
      fontWeight: element.style.fontWeight ?? 'normal',
      color: element.style.color ?? '#ffffff',
      opacity: element.style.opacity ?? 1
    }, { emitEvent: false }); // Avoid recursive loop
  }

  updateSelectedElement(values: any): void {
    const selected = this.selectedElement();
    if (!selected) return;

    selected.style = {
        ...selected.style,
        fontSize: values.fontSize,
        fontWeight: values.fontWeight,
        color: values.color,
        opacity: values.opacity
    };
    
    this.flyerElements.update(elements =>
      elements.map(el => el.id === selected.id ? { ...selected } : el)
    );
  }
  
  clearCanvas(): void {
    this.flyerElements.set([]);
    this.selectedElement.set(null);
  }
  
  async generateImage(): Promise<void> {
    const prompt = this.imageGenPrompt();
    if (!prompt) return;

    this.imageGenLoading.set(true);
    this.generatedImages.set([]);
    try {
      // For demonstration, we'll generate one image. A real app might generate more.
      const base64Image = await this.geminiService.generateImage(prompt, '1:1');
      this.generatedImages.set([`data:image/png;base64,${base64Image}`]);
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      this.imageGenLoading.set(false);
    }
  }
}
