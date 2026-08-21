import { Injectable } from '@angular/core';
import { GoogleGenAI } from '@google/genai';
import { AspectRatio } from '../types';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    // IMPORTANT: The API key is securely managed by the environment.
    // Do not hardcode or expose the API key in the client-side code.
    if (!process.env.API_KEY) {
      console.error("API_KEY environment variable not set.");
      // In a real app, you might want to disable AI features or show an error.
    }
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async generateProductDescription(productName: string): Promise<string> {
    const prompt = `Create a short, vibrant, and tech-focused marketing description for a product called "${productName}". Highlight its premium quality and modern appeal. Keep it under 50 words.`;
    
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });
      return response.text;
    } catch (error) {
      console.error('Gemini API Error (generateProductDescription):', error);
      throw new Error('Failed to generate description from Gemini API.');
    }
  }

  async generateFlyerCopy(productName: string): Promise<string> {
    const prompt = `Generate a compelling, short headline (under 10 words) for a marketing flyer about a product called "${productName}". The brand is modern, tech-focused, and premium.`;
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });
      return response.text;
    } catch (error) {
      console.error('Gemini API Error (generateFlyerCopy):', error);
      throw new Error('Failed to generate flyer copy from Gemini API.');
    }
  }

  async getMarketPriceInfo(productName: string): Promise<{text: string; sources: any[]}> {
    const prompt = `What is the typical market price range for custom "${productName}"? Provide some examples from popular online marketplaces.`;
    
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }]
        }
      });
      const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      return { text: response.text, sources };
    // FIX: Added curly braces to the catch block to correct a syntax error.
    } catch (error) {
      console.error('Gemini API Error (getMarketPriceInfo):', error);
      throw new Error('Failed to fetch market data from Gemini API.');
    }
  }

  async generateImage(prompt: string, aspectRatio: AspectRatio): Promise<string> {
    try {
      const response = await this.ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: `Professional product photography of: ${prompt}. Clean, dark, futuristic background with neon accents. Shebaco brand aesthetic.`,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/png',
          aspectRatio: aspectRatio,
        }
      });

      if (response.generatedImages && response.generatedImages.length > 0) {
        return response.generatedImages[0].image.imageBytes;
      }
      throw new Error('No image was generated.');
    } catch (error) {
      console.error('Gemini API Error (generateImage):', error);
      const errorMessage = (error as Error).toString();
      if (errorMessage.includes('PERMISSION_DENIED') || errorMessage.includes('403')) {
          throw new Error('API key missing permissions. Please ensure the "Vertex AI API" is enabled in your Google Cloud project for image generation.');
      }
      throw new Error('Failed to generate image from Gemini API.');
    }
  }
}
