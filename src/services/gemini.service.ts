import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GeminiService { // The class name is kept for minimal changes
  
  private francoMap: { [key: string]: string } = {
      'a': 'ا', 'b': 'ب', 't': 'ت', 'j': 'ج', 'h': 'ه',
      '5': 'خ', 'd': 'د', 'r': 'ر', 'z': 'ز', 's': 'س',
      '9': 'ص', '6': 'ط', '3': 'ع', 'f': 'ف', '8': 'ق',
      'k': 'ك', 'l': 'ل', 'm': 'م', 'n': 'ن', 'w': 'و',
      'o': 'و', 'u': 'و', 'y': 'ي', 'e': 'ي', 'i': 'ي',
      '2': 'أ', '7': 'ح',
  };

  private arabicMap: { [key: string]: string } = {
      'ا': 'a', 'أ': '2', 'إ': 'e', 'آ': 'a', 'ب': 'b', 'ت': 't', 'ث': 'th',
      'ج': 'g', 'ح': '7', 'خ': '5', 'د': 'd', 'ذ': 'z', 'ر': 'r', 'ز': 'z',
      'س': 's', 'ش': 'sh', 'ص': '9', 'ض': 'd', 'ط': '6', 'ظ': 'z', 'ع': '3',
      'غ': 'gh', 'ف': 'f', 'ق': '8', 'ك': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n',
      'ه': 'h', 'ة': 'a', 'و': 'w', 'ي': 'y', 'ى': 'a', 'ء': '2'
  };

  translate(
    text: string,
    sourceLang: 'franco' | 'arabic'
  ): string {
    if (!text.trim()) {
      return '';
    }

    if (sourceLang === 'franco') {
      return this.translateFrancoToArabic(text.toLowerCase());
    } else {
      return this.translateArabicToFranco(text);
    }
  }

  private translateFrancoToArabic(text: string): string {
    // Handle multi-character replacements first for better accuracy
    let result = text
      .replace(/gh/g, 'غ')
      .replace(/kh/g, 'خ')
      .replace(/sh/g, 'ش')
      .replace(/th/g, 'ث');
    
    return result.split('').map(char => this.francoMap[char] || char).join('');
  }

  private translateArabicToFranco(text: string): string {
    return text.split('').map(char => this.arabicMap[char] || char).join('');
  }
}
