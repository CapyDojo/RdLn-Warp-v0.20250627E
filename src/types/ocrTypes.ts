export type OCRLanguage = string;

export interface OCRResult {
  text: string;
  language: OCRLanguage;
  confidence: number;
}

export interface OCROptions {
  languages?: OCRLanguage[];
  autoDetect?: boolean;
}
