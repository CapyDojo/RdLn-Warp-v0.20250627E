import { LanguageOption, OCRLanguage, OCROptions, CacheConfiguration } from '../types/ocr-types';
import languagesData from '../data/ocr-languages.json';

export const SUPPORTED_LANGUAGES: LanguageOption[] = languagesData.supportedLanguages;
export const DETECTION_LANGUAGES: OCRLanguage[] = languagesData.detectionLanguages;
export const CACHE_CONFIGURATION: CacheConfiguration = languagesData.cacheConfiguration;
