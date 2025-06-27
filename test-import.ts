// Test file to verify import works
import { LanguageOption } from './src/types/ocr-types';

console.log('Import test successful');

const test: LanguageOption = {
  code: 'en',
  name: 'English',
  flag: '🇺🇸',
  downloadSize: '4MB'
};

console.log(test);
