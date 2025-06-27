/**
 * OCR Service Type Definitions
 * 
 * This file contains all type definitions used by the OCR service,
 * including language options, caching interfaces, and configuration types.
 */

/** Supported language option with metadata */
export interface LanguageOption {
  /** Language code (ISO 639-1 based) */
  code: string;
  /** Human-readable language name */
  name: string;
  /** Flag emoji for UI display */
  flag: string;
  /** Download size for the language pack */
  downloadSize: string;
}

/** Supported OCR language codes */
export type OCRLanguage = 'eng' | 'chi_sim' | 'chi_tra' | 'spa' | 'fra' | 'deu' | 'jpn' | 'kor' | 'ara' | 'rus';

/** OCR processing options */
export interface OCROptions {
  /** Languages to use for OCR processing */
  languages?: OCRLanguage[];
  /** Whether to auto-detect languages from image content */
  autoDetect?: boolean;
  /** Primary language to prioritize in processing */
  primaryLanguage?: OCRLanguage;
}

/** Cached worker with lifecycle management */
export interface CachedWorker {
  /** The Tesseract worker instance */
  worker: Tesseract.Worker;
  /** Timestamp of last usage */
  lastUsed: number;
  /** Number of times this worker has been used */
  useCount: number;
  /** Languages this worker supports */
  languages: OCRLanguage[];
}

/** Language detection cache entry */
export interface LanguageDetectionCacheEntry {
  /** Detected languages for this image */
  languages: OCRLanguage[];
  /** Cache entry timestamp */
  timestamp: number;
  /** Number of cache hits for this entry */
  hitCount: number;
}

/** Cache configuration settings */
export interface CacheConfiguration {
  /** Worker cache expiry time in milliseconds */
  cacheExpiryMs: number;
  /** Maximum number of cached workers */
  maxCachedWorkers: number;
  /** Cleanup interval in milliseconds */
  cleanupIntervalMs: number;
  /** Language detection cache expiry time in milliseconds */
  languageCacheExpiryMs: number;
  /** Maximum number of language cache entries */
  maxLanguageCacheEntries: number;
}

/** Cache statistics for monitoring */
export interface CacheStats {
  /** Number of currently cached workers */
  cachedWorkers: number;
  /** Whether detection worker is cached */
  detectionWorkerCached: boolean;
  /** Total cache hits across all workers */
  totalCacheHits: number;
  /** Timestamp of oldest cached worker */
  oldestWorker: number;
  /** Timestamp of newest cached worker */
  newestWorker: number;
  /** Language detection cache size */
  languageCacheSize: number;
  /** Language detection cache hits */
  languageCacheHits: number;
  /** Timestamp of oldest language cache entry */
  oldestLanguageCache: number;
  /** Timestamp of newest language cache entry */
  newestLanguageCache: number;
}

/** Character fixing patterns for OCR post-processing */
export interface CharacterFixPattern {
  /** Regular expression pattern to match */
  pattern: RegExp;
  /** Replacement string or function */
  replacement: string | ((match: string, ...groups: string[]) => string);
}

/** Language-specific post-processing rules */
export interface LanguagePostProcessingRules {
  /** Character substitution patterns */
  characterFixes: CharacterFixPattern[];
  /** Number formatting patterns */
  numberFixes: CharacterFixPattern[];
  /** Legal terminology fixes */
  legalTermFixes: CharacterFixPattern[];
  /** Spacing and punctuation rules */
  spacingFixes: CharacterFixPattern[];
}

/** Language detection patterns */
export interface LanguageDetectionPatterns {
  /** Script-specific character ranges */
  scriptPatterns: Record<string, RegExp>;
  /** Common words for language identification */
  wordPatterns: Record<OCRLanguage, RegExp>;
  /** Language-specific punctuation patterns */
  punctuationPatterns: Record<string, RegExp>;
}

/** Paragraph reconstruction settings */
export interface ParagraphReconstructionRules {
  /** Patterns that indicate new paragraph starts */
  paragraphStarters: RegExp[];
  /** Patterns that indicate incomplete line endings */
  incompleteEndings: RegExp[];
  /** Patterns that indicate continuation words */
  continuationStarters: RegExp[];
}
