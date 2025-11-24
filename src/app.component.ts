import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule]
})
export class AppComponent {
  francoText = signal('');
  arabicText = signal('');
  sourceLanguage = signal<'franco' | 'arabic'>('franco');
  copied = signal<'franco' | 'arabic' | null>(null);
  
  private translateTimeout: any;

  // Logic from GeminiService moved here
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
  // End of moved logic

  onFrancoInput(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    this.francoText.set(target.value);
    this.sourceLanguage.set('franco');
    this.debouncedTranslate();
  }

  onArabicInput(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    this.arabicText.set(target.value);
    this.sourceLanguage.set('arabic');
    this.debouncedTranslate();
  }

  debouncedTranslate() {
    clearTimeout(this.translateTimeout);
    this.translateTimeout = setTimeout(() => this.translate(), 250); // 250ms debounce
  }

  swapLanguages() {
    const franco = this.francoText();
    const arabic = this.arabicText();
    this.francoText.set(arabic);
    this.arabicText.set(franco);
    this.sourceLanguage.update(lang => lang === 'franco' ? 'arabic' : 'franco');
  }

  translate() {
    clearTimeout(this.translateTimeout);
    const sourceLang = this.sourceLanguage();
    const textToTranslate = sourceLang === 'franco' ? this.francoText() : this.arabicText();

    if (!textToTranslate.trim()) {
      if (sourceLang === 'franco') {
        this.arabicText.set('');
      } else {
        this.francoText.set('');
      }
      return;
    }
    
    const result = sourceLang === 'franco' 
      ? this.translateFrancoToArabic(textToTranslate.toLowerCase()) 
      : this.translateArabicToFranco(textToTranslate);

    if (sourceLang === 'franco') {
      this.arabicText.set(result);
    } else {
      this.francoText.set(result);
    }
  }

  clearText() {
    this.francoText.set('');
    this.arabicText.set('');
    this.sourceLanguage.set('franco');
    this.copied.set(null);
  }

  copyToClipboard(type: 'franco' | 'arabic') {
    const textToCopy = type === 'franco' ? this.francoText() : this.arabicText();
    if (!textToCopy) return;
    
    navigator.clipboard.writeText(textToCopy).then(() => {
        this.copied.set(type);
        setTimeout(() => this.copied.set(null), 2000);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
  }
}
