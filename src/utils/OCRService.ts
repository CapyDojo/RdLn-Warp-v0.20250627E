/**
 * OCR Service - Main Interface
 * 
 * Provides a simplified interface for OCR text extraction with multi-language support.
 * This service coordinates between language detection, caching, and post-processing services.
 */

import { createWorker } from 'tesseract.js';
import type { Worker as TesseractWorker } from 'tesseract.js';
import { OCRLanguage, CachedWorker, LanguageDetectionCacheEntry, CacheStats } from '../types/ocr-types';
// STAGE 4: Import opencc-js for intelligent Traditional vs Simplified detection
import { Converter } from 'opencc-js';
import { SUPPORTED_LANGUAGES } from '../config/ocrConfig';
// STEP 2: Import Background Language Loader for smart worker usage (SSMR Implementation)
import { BackgroundLanguageLoader } from '../services/BackgroundLanguageLoader';
// PHASE 2: Import standardized error handling
import { 
  safeAsync, 
  ErrorCategory, 
  ErrorFactory, 
  ErrorManager 
} from './errorHandling';

// Note: Re-exports removed to avoid module resolution conflicts

export class OCRService {
  private static workers: Map<string, CachedWorker> = new Map();
  private static loadingPromises: Map<string, Promise<TesseractWorker>> = new Map();
  private static detectionWorker: CachedWorker | null = null;
  
  // Language detection cache
  private static languageCache: Map<string, LanguageDetectionCacheEntry> = new Map();
  private static readonly LANGUAGE_CACHE_EXPIRY_MS = 30 * 60 * 1000; // 30 minutes
  private static readonly MAX_LANGUAGE_CACHE_ENTRIES = 50; // Memory limit
  
  // Cache configuration
  private static readonly CACHE_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes
  private static readonly MAX_CACHED_WORKERS = 5; // Prevent memory bloat
  private static readonly CLEANUP_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

  // Start cleanup timer on first use
  private static cleanupTimer: NodeJS.Timeout | null = null;

  private static startCleanupTimer() {
    if (this.cleanupTimer) return;
    
    this.cleanupTimer = setInterval(() => {
      this.cleanupExpiredWorkers();
      this.cleanupLanguageCache();
    }, this.CLEANUP_INTERVAL_MS);
  }

  private static async cleanupExpiredWorkers() {
    const now = Date.now();
    const expiredKeys: string[] = [];

    // Find expired workers
    for (const [key, cached] of this.workers.entries()) {
      if (now - cached.lastUsed > this.CACHE_EXPIRY_MS) {
        expiredKeys.push(key);
      }
    }

    // Cleanup expired workers
    for (const key of expiredKeys) {
      const cached = this.workers.get(key);
      if (cached) {
        console.log(`🧹 Cleaning up expired OCR worker: ${key}`);
        await cached.worker.terminate();
        this.workers.delete(key);
      }
    }

    // Cleanup detection worker if expired
    if (this.detectionWorker && now - this.detectionWorker.lastUsed > this.CACHE_EXPIRY_MS) {
      console.log('🧹 Cleaning up expired detection worker');
      await this.detectionWorker.worker.terminate();
      this.detectionWorker = null;
    }

    // If cache is too large, remove least recently used
    if (this.workers.size > this.MAX_CACHED_WORKERS) {
      const sortedEntries = Array.from(this.workers.entries())
        .sort(([,a], [,b]) => a.lastUsed - b.lastUsed);
      
      const toRemove = sortedEntries.slice(0, this.workers.size - this.MAX_CACHED_WORKERS);
      for (const [key, cached] of toRemove) {
        console.log(`🧹 Removing LRU OCR worker: ${key}`);
        await cached.worker.terminate();
        this.workers.delete(key);
      }
    }
  }

  // Language cache cleanup
  private static cleanupLanguageCache() {
    const now = Date.now();
    const expiredKeys: string[] = [];

    // Find expired language cache entries
    for (const [key, entry] of this.languageCache.entries()) {
      if (now - entry.timestamp > this.LANGUAGE_CACHE_EXPIRY_MS) {
        expiredKeys.push(key);
      }
    }

    // Remove expired entries
    for (const key of expiredKeys) {
      this.languageCache.delete(key);
      console.log(`🧹 Cleaned up expired language detection cache entry`);
    }

    // If cache is too large, remove least recently used (by hitCount and timestamp)
    if (this.languageCache.size > this.MAX_LANGUAGE_CACHE_ENTRIES) {
      const sortedEntries = Array.from(this.languageCache.entries())
        .sort(([,a], [,b]) => {
          // Sort by hit count first, then by timestamp
          if (a.hitCount !== b.hitCount) {
            return a.hitCount - b.hitCount;
          }
          return a.timestamp - b.timestamp;
        });
      
      const toRemove = sortedEntries.slice(0, this.languageCache.size - this.MAX_LANGUAGE_CACHE_ENTRIES);
      for (const [key] of toRemove) {
        this.languageCache.delete(key);
        console.log(`🧹 Removed LRU language detection cache entry`);
      }
    }
  }

  // Generate cache key for language detection
  private static async generateLanguageCacheKey(imageFile: File | Blob): Promise<string> {
    const size = imageFile.size;
    
    if (imageFile instanceof File) {
      // For File objects: use size + modified date + name
      const modifiedDate = imageFile.lastModified || 0;
      const name = imageFile.name || 'unknown';
      return `file_${size}_${modifiedDate}_${name}`;
    } else {
      // For Blob objects: use size + content hash
      const arrayBuffer = await imageFile.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 16); // First 16 chars
      return `blob_${size}_${hashHex}`;
    }
  }

  // Check language detection cache
  private static async checkLanguageCache(imageFile: File | Blob): Promise<OCRLanguage[] | null> {
    try {
      const cacheKey = await this.generateLanguageCacheKey(imageFile);
      const cached = this.languageCache.get(cacheKey);
      
      if (cached) {
        const now = Date.now();
        if (now - cached.timestamp < this.LANGUAGE_CACHE_EXPIRY_MS) {
          // Update hit count and return cached result
          cached.hitCount++;
          console.log(`🎯 LANGUAGE CACHE HIT: Found cached detection result (hit #${cached.hitCount}):`, cached.languages);
          return cached.languages;
        } else {
          // Expired entry
          this.languageCache.delete(cacheKey);
          console.log(`⏰ Language cache entry expired, removing`);
        }
      }
      
      console.log(`🔍 LANGUAGE CACHE MISS: No cached detection result found`);
      return null;
    } catch (error) {
      console.warn('Failed to check language cache:', error);
      return null;
    }
  }

  // Store language detection result in cache
  private static async storeLanguageCache(imageFile: File | Blob, languages: OCRLanguage[]): Promise<void> {
    try {
      const cacheKey = await this.generateLanguageCacheKey(imageFile);
      
      this.languageCache.set(cacheKey, {
        languages: [...languages], // Clone array
        timestamp: Date.now(),
        hitCount: 0
      });
      
      console.log(`💾 LANGUAGE CACHE STORE: Cached detection result for future use:`, languages);
      
      // Trigger cleanup if cache is getting large
      if (this.languageCache.size > this.MAX_LANGUAGE_CACHE_ENTRIES) {
        this.cleanupLanguageCache();
      }
    } catch (error) {
      console.warn('Failed to store language cache:', error);
    }
  }

  private static createLogger() {
    return (m: any) => {
      // Suppress most logging to reduce console noise
      if (m.status === 'recognizing text') {
        console.log(`OCR progress: ${Math.round(m.progress * 100)}%`);
      }
    };
  }

  private static getWorkerKey(languages: OCRLanguage[]): string {
    return languages.sort().join('-');
  }

  private static async initializeDetectionWorker(): Promise<TesseractWorker> {
    // Check cache first
    if (this.detectionWorker) {
      this.detectionWorker.lastUsed = Date.now();
      this.detectionWorker.useCount++;
      console.log(`🎯 DETECTION CACHE HIT: Reusing detection worker (used ${this.detectionWorker.useCount} times)`);
      return this.detectionWorker.worker;
    }

    // RESTORED: Use comprehensive language set for detection to enable proper multi-language detection
    // This includes all the languages we want to support: English, Chinese (both), Spanish, French, German, Japanese, Korean, Arabic, Russian
    const detectionLanguages: OCRLanguage[] = ['eng', 'chi_sim', 'chi_tra', 'spa', 'fra', 'deu', 'jpn', 'kor', 'ara', 'rus'];
    console.log('🔄 DETECTION CACHE MISS: Creating new detection worker with full language support:', detectionLanguages);
    
    const worker = await createWorker(detectionLanguages, 1, {
      logger: this.createLogger()
    });

    // Cache the worker
    this.detectionWorker = {
      worker,
      lastUsed: Date.now(),
      useCount: 1,
      languages: detectionLanguages
    };

    this.startCleanupTimer();
    console.log('✅ Multi-language detection worker cached successfully');
    return worker;
  }

  private static async initializeWorker(languages: OCRLanguage[]): Promise<TesseractWorker> {
    const workerKey = this.getWorkerKey(languages);
    
    // Check cache first
    if (this.workers.has(workerKey)) {
      const cached = this.workers.get(workerKey)!;
      cached.lastUsed = Date.now();
      cached.useCount++;
      console.log(`🎯 EXTRACTION CACHE HIT: Reusing worker for ${workerKey} (used ${cached.useCount} times)`);
      return cached.worker;
    }

    // Return existing loading promise if in progress
    if (this.loadingPromises.has(workerKey)) {
      console.log(`⏳ Waiting for existing worker creation: ${workerKey}`);
      return this.loadingPromises.get(workerKey)!;
    }

    // Create new worker with basic configuration
    console.log(`🔄 EXTRACTION CACHE MISS: Creating new worker for languages: ${workerKey}`);
    const loadingPromise = createWorker(languages, 1, {
      logger: this.createLogger()
    });

    this.loadingPromises.set(workerKey, loadingPromise);

    try {
      const worker = await loadingPromise;
      
      // Cache the worker
      this.workers.set(workerKey, {
        worker,
        lastUsed: Date.now(),
        useCount: 1,
        languages: languages
      });
      
      this.loadingPromises.delete(workerKey);
      this.startCleanupTimer();
      
      console.log(`✅ Extraction worker cached for ${workerKey}`);
      return worker;
    } catch (error) {
      this.loadingPromises.delete(workerKey);
      throw error;
    }
  }

  public static async detectLanguage(imageFile: File | Blob): Promise<OCRLanguage[]> {
    console.log('🔍 Starting language detection...');
    
    // Check cache first
    const cachedResult = await this.checkLanguageCache(imageFile);
    if (cachedResult) {
      return cachedResult;
    }
    
    try {
      // Use multi-language detection worker for comprehensive language support
      const worker = await this.initializeDetectionWorker();
      
      console.log('📖 Running detection OCR with full language support...');
      const detectionStart = Date.now();
      
      // Perform OCR with all supported languages
      const { data } = await worker.recognize(imageFile);
      
      const detectionTime = Date.now() - detectionStart;
      console.log(`⏱️ Detection OCR completed in ${detectionTime}ms`);
      
      // Extract text for analysis
      const text = data.text;
      console.log('🔍 Analyzing text for language detection:', text.substring(0, 200) + '...');
      
      const detectedLanguages: OCRLanguage[] = [];
      
      // Enhanced text-based language detection
      // Check for non-Latin scripts first (these are easier to identify)
      if (this.containsChinese(text)) {
        // STAGE 4: Use chinese-conv for intelligent Traditional vs Simplified detection
        const chineseVariant = this.detectChineseVariant(text);
        detectedLanguages.push(chineseVariant);
        console.log(`✅ Chinese script detected as: ${chineseVariant}`);
      }
      
      if (this.containsJapanese(text)) {
        detectedLanguages.push('jpn');
        console.log('✅ Japanese script detected');
      }
      
      if (this.containsKorean(text)) {
        detectedLanguages.push('kor');
        console.log('✅ Korean script detected');
      }
      
      if (this.containsArabic(text)) {
        detectedLanguages.push('ara');
        console.log('✅ Arabic script detected');
      }
      
      if (this.containsCyrillic(text)) {
        detectedLanguages.push('rus');
        console.log('✅ Cyrillic/Russian script detected');
      }
      
      // If no non-Latin script detected, check for Latin-based languages
      if (detectedLanguages.length === 0) {
        // STAGE 3: More conservative Latin language detection
        const latinCandidates: { lang: OCRLanguage, confidence: number }[] = [];
        
        // Check each Latin language with confidence scoring
        if (this.containsSpanish(text)) {
          const confidence = this.getSpanishConfidence(text);
          latinCandidates.push({ lang: 'spa', confidence });
          console.log('🔍 Spanish candidate found with confidence:', confidence);
        }
        
        if (this.containsFrench(text)) {
          const confidence = this.getFrenchConfidence(text);
          latinCandidates.push({ lang: 'fra', confidence });
          console.log('🔍 French candidate found with confidence:', confidence);
        }
        
        if (this.containsGerman(text)) {
          const confidence = this.getGermanConfidence(text);
          latinCandidates.push({ lang: 'deu', confidence });
          console.log('🔍 German candidate found with confidence:', confidence);
        }
        
        // Select only the highest confidence Latin language (if confidence > threshold)
        if (latinCandidates.length > 0) {
          latinCandidates.sort((a, b) => b.confidence - a.confidence);
          const topCandidate = latinCandidates[0];
          
          // Only accept if confidence is high enough
          if (topCandidate.confidence >= 0.6) {
            detectedLanguages.push(topCandidate.lang);
            console.log('✅ Selected primary Latin language:', topCandidate.lang, 'with confidence:', topCandidate.confidence);
            
            // Only add secondary languages if they have very high confidence AND are significantly different
            for (let i = 1; i < latinCandidates.length; i++) {
              const candidate = latinCandidates[i];
              if (candidate.confidence >= 0.8 && (topCandidate.confidence - candidate.confidence) < 0.2) {
                detectedLanguages.push(candidate.lang);
                console.log('✅ Added secondary Latin language:', candidate.lang, 'with confidence:', candidate.confidence);
              }
            }
          } else {
            console.log('⚠️ No Latin language met confidence threshold, defaulting to English');
            detectedLanguages.push('eng');
          }
        } else {
          // No Latin languages detected, default to English
          detectedLanguages.push('eng');
          console.log('📝 Defaulting to English - no specific language patterns detected');
        }
      }
      
      // CONSERVATIVE: Only add English as fallback if we detected non-Latin scripts
      // For Latin scripts, stick with the primary detected language to avoid confusion
      const hasNonLatinScript = detectedLanguages.some(lang => 
        ['chi_sim', 'chi_tra', 'jpn', 'kor', 'ara', 'rus'].includes(lang)
      );
      
      if (hasNonLatinScript && !detectedLanguages.includes('eng')) {
        detectedLanguages.push('eng');
      }
      
      console.log('🎯 Final detected languages:', detectedLanguages);
      
      // Store result in cache
      await this.storeLanguageCache(imageFile, detectedLanguages);
      
      return detectedLanguages;
    } catch (error) {
      console.warn('Language detection failed, defaulting to English:', error);
      const fallbackLanguages: OCRLanguage[] = ['eng'];
      
      // Store fallback result in cache to avoid repeated failures
      await this.storeLanguageCache(imageFile, fallbackLanguages);
      
      return fallbackLanguages;
    }
  }

  // Enhanced Spanish detection
  private static containsSpanish(text: string): boolean {
    // Spanish-specific characters
    const spanishChars = /[ñáéíóúüÑÁÉÍÓÚÜ¿¡]/;
    if (spanishChars.test(text)) {
      console.log('🔍 Spanish characters found:', text.match(spanishChars));
      return true;
    }
    
    // Common Spanish words and patterns
    const spanishWords = /\b(el|la|los|las|de|del|en|con|por|para|que|es|son|está|están|tiene|tienen|hace|hacen|muy|más|también|pero|como|cuando|donde|porque|aunque|desde|hasta|entre|sobre|bajo|durante|después|antes|mientras|según|sin|contra|hacia|mediante|salvo|excepto|incluso|además|sino|sólo|solo|cada|todo|toda|todos|todas|otro|otra|otros|otras|mismo|misma|mismos|mismas|cual|cuales|quien|quienes|cuyo|cuya|cuyos|cuyas)\b/gi;
    
    const spanishMatches = text.match(spanishWords);
    if (spanishMatches && spanishMatches.length >= 3) {
      console.log('🔍 Spanish words found:', spanishMatches.slice(0, 5));
      return true;
    }
    
    // Spanish-specific punctuation patterns
    const spanishPunctuation = /[¿¡]/;
    if (spanishPunctuation.test(text)) {
      console.log('🔍 Spanish punctuation found');
      return true;
    }
    
    return false;
  }

  // Enhanced French detection
  private static containsFrench(text: string): boolean {
    // French-specific characters
    const frenchChars = /[àâäçéèêëïîôöùûüÿæœÀÂÄÇÉÈÊËÏÎÔÖÙÛÜŸÆŒ]/;
    if (frenchChars.test(text)) {
      console.log('🔍 French characters found:', text.match(frenchChars));
      return true;
    }
    
    // Common French words and patterns
    const frenchWords = /\b(le|la|les|de|du|des|un|une|et|est|sont|avec|dans|pour|par|sur|sous|entre|vers|chez|sans|contre|pendant|après|avant|depuis|jusqu|jusque|selon|malgré|sauf|hormis|outre|parmi|moyennant|concernant|touchant|suivant|durant|lors|dès|via|envers|devers|que|qui|dont|où|quand|comment|pourquoi|combien|lequel|laquelle|lesquels|lesquelles|auquel|auxquels|duquel|desquels|ce|cette|ces|cet|mon|ma|mes|ton|ta|tes|son|sa|ses|notre|nos|votre|vos|leur|leurs)\b/gi;
    
    const frenchMatches = text.match(frenchWords);
    if (frenchMatches && frenchMatches.length >= 3) {
      console.log('🔍 French words found:', frenchMatches.slice(0, 5));
      return true;
    }
    
    // French-specific contractions and patterns
    const frenchPatterns = /\b(c'est|d'un|d'une|l'|qu'|n'|s'|t'|j'|m')\b/gi;
    if (frenchPatterns.test(text)) {
      console.log('🔍 French patterns found');
      return true;
    }
    
    return false;
  }

  // Enhanced German detection
  private static containsGerman(text: string): boolean {
    // German-specific characters
    const germanChars = /[äöüßÄÖÜ]/;
    if (germanChars.test(text)) {
      console.log('🔍 German characters found:', text.match(germanChars));
      return true;
    }
    
    // Common German words and patterns
    const germanWords = /\b(der|die|das|den|dem|des|ein|eine|einen|einem|einer|eines|und|oder|aber|doch|jedoch|sondern|denn|weil|da|wenn|als|wie|wo|wohin|woher|wann|warum|weshalb|wieso|weswegen|wodurch|womit|wofür|wogegen|worüber|worauf|worin|wozu|von|zu|mit|nach|bei|in|an|auf|über|unter|vor|hinter|neben|zwischen|durch|für|gegen|ohne|um|während|wegen|trotz|statt|anstatt|außer|bis|seit|ab|aus|binnen|dank|entlang|entsprechend|gemäß|laut|mangels|mittels|nebst|samt|seitens|ungeachtet|unweit|zufolge|zugunsten|zulasten|zwecks|ist|sind|war|waren|hat|haben|hatte|hatten|wird|werden|wurde|wurden|kann|können|konnte|konnten|soll|sollen|sollte|sollten|will|wollen|wollte|wollten|mag|mögen|mochte|mochten|darf|dürfen|durfte|durften|muss|müssen|musste|mussten)\b/gi;
    
    const germanMatches = text.match(germanWords);
    if (germanMatches && germanMatches.length >= 3) {
      console.log('🔍 German words found:', germanMatches.slice(0, 5));
      return true;
    }
    
    // German compound words (characteristic long words) - TIGHTENED DETECTION
    // Require BOTH German words AND long words for detection
    const germanCompounds = /\b\w{12,}\b/g;
    const longWords = text.match(germanCompounds);
    if (longWords && longWords.length >= 3 && germanMatches && germanMatches.length >= 5) {
      console.log('🔍 German compound words + German words found:', { longWords: longWords.slice(0, 3), germanWords: germanMatches.slice(0, 3) });
      return true;
    }
    
    // Additional German-specific indicators (more conservative)
    const strongGermanIndicators = /\b(Gesellschaft|Unternehmen|Vereinbarung|Bestimmungen|Verpflichtungen|Verantwortung)\b/gi;
    if (strongGermanIndicators.test(text) && germanMatches && germanMatches.length >= 3) {
      console.log('🔍 Strong German business terms found');
      return true;
    }
    
    return false;
  }

  private static containsChinese(text: string): boolean {
    return /[\u4e00-\u9fff]/.test(text);
  }

  // STAGE 4: Intelligent Chinese variant detection using opencc-js library
  private static detectChineseVariant(text: string): 'chi_sim' | 'chi_tra' {
    try {
      // Use opencc-js for intelligent Traditional vs Simplified detection
      // Create converters to test conversion results
      const toSimplified = Converter({ from: 'tw', to: 'cn' }); // Traditional to Simplified
      const toTraditional = Converter({ from: 'cn', to: 'tw' }); // Simplified to Traditional
      
      // Convert text both ways and compare with original
      const convertedToSimplified = toSimplified(text);
      const convertedToTraditional = toTraditional(text);
      
      // Calculate similarity scores
      const simplicityScore = this.calculateTextSimilarity(text, convertedToSimplified);
      const traditionalScore = this.calculateTextSimilarity(text, convertedToTraditional);
      
      // Determine variant based on which conversion changed the text more
      // If traditional score is higher, the text is more similar to traditional
      const result = traditionalScore > simplicityScore ? 'chi_tra' : 'chi_sim';
      
      console.log(`🎯 Chinese variant detected by opencc-js: ${result}`);
      console.log(`📊 Scores - Simplified: ${simplicityScore.toFixed(2)}, Traditional: ${traditionalScore.toFixed(2)}`);
      console.log(`📝 Sample text analyzed: "${text.substring(0, 100)}..."`);
      
      return result;
    } catch (error) {
      console.warn('⚠️ opencc-js detection failed, falling back to simplified:', error);
      // Safe fallback to simplified (more common globally)
      return 'chi_sim';
    }
  }
  
  // Helper function to calculate text similarity
  private static calculateTextSimilarity(text1: string, text2: string): number {
    const length = Math.max(text1.length, text2.length);
    if (length === 0) return 1.0;
    
    let matches = 0;
    const minLength = Math.min(text1.length, text2.length);
    
    for (let i = 0; i < minLength; i++) {
      if (text1[i] === text2[i]) {
        matches++;
      }
    }
    
    return matches / length;
  }

  // DEPRECATED: Keep for reference but no longer used
  private static isTraditionalChinese(text: string): boolean {
    // Common traditional Chinese characters not used in simplified
    const traditionalChars = /[繁體中文台灣香港澳門]/;
    return traditionalChars.test(text);
  }

  private static containsJapanese(text: string): boolean {
    // Hiragana, Katakana, and Japanese-specific Kanji
    return /[\u3040-\u309f\u30a0-\u30ff]/.test(text);
  }

  private static containsKorean(text: string): boolean {
    // Hangul syllables
    return /[\uac00-\ud7af]/.test(text);
  }

  private static containsArabic(text: string): boolean {
    // Arabic script
    return /[\u0600-\u06ff]/.test(text);
  }

  private static containsCyrillic(text: string): boolean {
    // Cyrillic script
    return /[\u0400-\u04ff]/.test(text);
  }

  // STAGE 3: Confidence scoring functions for more precise Latin language detection
  private static getSpanishConfidence(text: string): number {
    let confidence = 0;
    
    // Spanish-specific characters (high confidence)
    const spanishChars = text.match(/[ñáéíóúüÑÁÉÍÓÚÜ¿¡]/g);
    if (spanishChars) {
      confidence += Math.min(spanishChars.length * 0.1, 0.4);
    }
    
    // Spanish punctuation (medium confidence)
    if (/[¿¡]/.test(text)) {
      confidence += 0.3;
    }
    
    // Spanish words (scaled by frequency)
    const spanishWords = text.match(/\b(el|la|los|las|de|del|en|con|por|para|que|es|son|está|están|tiene|tienen|hace|hacen|muy|más|también|pero|como|cuando|donde|porque)\b/gi);
    if (spanishWords) {
      confidence += Math.min(spanishWords.length * 0.05, 0.4);
    }
    
    return Math.min(confidence, 1.0);
  }
  
  private static getFrenchConfidence(text: string): number {
    let confidence = 0;
    
    // French-specific characters (high confidence)
    const frenchChars = text.match(/[àâäçéèêëïîôöùûüÿæœÀÂÄÇÉÈÊËÏÎÔÖÙÛÜŸÆŒ]/g);
    if (frenchChars) {
      confidence += Math.min(frenchChars.length * 0.1, 0.4);
    }
    
    // French contractions (high confidence)
    const frenchPatterns = text.match(/\b(c'est|d'un|d'une|l'|qu'|n'|s'|t'|j'|m')\b/gi);
    if (frenchPatterns) {
      confidence += Math.min(frenchPatterns.length * 0.15, 0.4);
    }
    
    // French words (scaled by frequency)
    const frenchWords = text.match(/\b(le|la|les|de|du|des|un|une|et|est|sont|avec|dans|pour|par|sur|sous|entre|vers|chez|sans|contre|pendant|après|avant)\b/gi);
    if (frenchWords) {
      confidence += Math.min(frenchWords.length * 0.05, 0.4);
    }
    
    return Math.min(confidence, 1.0);
  }
  
  private static getGermanConfidence(text: string): number {
    let confidence = 0;
    
    // German-specific characters (high confidence)
    const germanChars = text.match(/[äöüßÄÖÜ]/g);
    if (germanChars) {
      confidence += Math.min(germanChars.length * 0.15, 0.4);
    }
    
    // German words (scaled by frequency)
    const germanWords = text.match(/\b(der|die|das|den|dem|des|ein|eine|einen|einem|einer|eines|und|oder|aber|doch|jedoch|sondern|denn|weil|da|wenn|als|wie|wo)\b/gi);
    if (germanWords) {
      confidence += Math.min(germanWords.length * 0.05, 0.4);
    }
    
    // German compound words (medium confidence) - more conservative than before
    const germanCompounds = text.match(/\b\w{12,}\b/g);
    if (germanCompounds && germanCompounds.length >= 3 && germanWords && germanWords.length >= 5) {
      confidence += Math.min(germanCompounds.length * 0.05, 0.2);
    }
    
    // Strong German business terms (high confidence)
    if (/\b(Gesellschaft|Unternehmen|Vereinbarung|Bestimmungen|Verpflichtungen|Verantwortung)\b/gi.test(text)) {
      confidence += 0.3;
    }
    
    return Math.min(confidence, 1.0);
  }

  public static async extractTextFromImage(
    imageFile: File | Blob, 
    options: OCROptions = {}
  ): Promise<string> {
    try {
      let languages: OCRLanguage[];

      if (options.autoDetect !== false) {
        // Auto-detect languages
        console.log('🔍 Detecting document language...');
        const detectedLanguages = await this.detectLanguage(imageFile);
        languages = detectedLanguages;
        console.log('📝 Detected languages:', detectedLanguages.map(lang => 
          SUPPORTED_LANGUAGES.find(l => l.code === lang)?.name || lang
        ).join(', '));
      } else if (options.languages && options.languages.length > 0) {
        // Use specified languages
        languages = options.languages;
      } else {
        // Default to English
        languages = ['eng'];
      }

      // Ensure primary language is first if specified
      if (options.primaryLanguage && languages.includes(options.primaryLanguage)) {
        languages = [
          options.primaryLanguage,
          ...languages.filter(lang => lang !== options.primaryLanguage)
        ];
      }

      console.log('🚀 Getting extraction worker for languages:', languages.map(lang => 
        SUPPORTED_LANGUAGES.find(l => l.code === lang)?.name || lang
      ).join(', '));

      const worker = await this.initializeWorker(languages);
      
      console.log('📖 Extracting text from image...');
      const extractionStart = Date.now();
      
      const { data: { text } } = await worker.recognize(imageFile);
      
      const extractionTime = Date.now() - extractionStart;
      console.log(`⏱️ Text extraction completed in ${extractionTime}ms`);
      
      // Apply language-specific post-processing
      const processedText = this.multiLanguagePostProcessing(text, languages);
      
      return processedText;
    } catch (error) {
      console.error('OCR extraction failed:', error);
      throw new Error(`Failed to extract text from image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // STAGE 2: Safe primary language selection (capability-based priority)
  private static selectPrimaryLanguage(detectedLanguages: OCRLanguage[]): OCRLanguage {
    // Capability-based priority: Most capable OCR models first (handle multiple scripts)
    const capabilityPriority: OCRLanguage[] = [
      'chi_sim',    // Handles Chinese + Latin alphabet
      'chi_tra',    // Handles Traditional Chinese + Latin
      'jpn',        // Handles Japanese scripts + Latin
      'kor',        // Handles Korean + Latin  
      'ara',        // Handles Arabic + some Latin
      'rus',        // Handles Cyrillic + some Latin
      'eng',        // Handles Latin alphabet only
      'fra',        // Handles Latin + French diacritics
      'deu',        // Handles Latin + German characters
      'spa'         // Handles Latin + Spanish characters
    ];
    
    // Select highest priority language from detected languages
    for (const lang of capabilityPriority) {
      if (detectedLanguages.includes(lang)) {
        console.log(`🎯 Primary language selected: ${lang} from detected: [${detectedLanguages.join(', ')}]`);
        return lang;
      }
    }
    
    // Safe fallback
    console.log(`🔄 No priority language found, defaulting to English from: [${detectedLanguages.join(', ')}]`);
    return 'eng';
  }

  private static multiLanguagePostProcessing(text: string, languages: OCRLanguage[]): string {
    // STAGE 2: Primary language selection + universal preservation
    const primaryLanguage = this.selectPrimaryLanguage(languages);
    console.log('🧘 Processing with primary language:', primaryLanguage, 'from detected:', languages.join(', '));
    
    return this.gentleUniversalPreservation(text);
  }

  private static chinesePostProcessing(text: string): string {
    return text
      // Fix common Chinese OCR errors
      .replace(/。\s*(?=[^\s])/g, '。 ')  // Add space after period
      .replace(/，\s*(?=[^\s])/g, '， ')  // Add space after comma
      .replace(/；\s*(?=[^\s])/g, '； ')  // Add space after semicolon
      .replace(/：\s*(?=[^\s])/g, '： ')  // Add space after colon
      .replace(/\s{2,}/g, ' ')           // Multiple spaces to single
      .replace(/\n{3,}/g, '\n\n')       // Multiple newlines to double
      .trim();
  }

  private static japanesePostProcessing(text: string): string {
    return text
      // Fix Japanese punctuation spacing
      .replace(/。\s*(?=[^\s])/g, '。')   // No space after period in Japanese
      .replace(/、\s*(?=[^\s])/g, '、')   // No space after comma in Japanese
      .replace(/\s{2,}/g, ' ')           // Multiple spaces to single
      .replace(/\n{3,}/g, '\n\n')       // Multiple newlines to double
      .trim();
  }

  private static koreanPostProcessing(text: string): string {
    return text
      // Fix Korean punctuation and spacing
      .replace(/\.\s*(?=[^\s])/g, '. ')  // Add space after period
      .replace(/,\s*(?=[^\s])/g, ', ')   // Add space after comma
      .replace(/\s{2,}/g, ' ')           // Multiple spaces to single
      .replace(/\n{3,}/g, '\n\n')       // Multiple newlines to double
      .trim();
  }

  private static arabicPostProcessing(text: string): string {
    return text
      // Fix Arabic text direction and punctuation
      .replace(/\s{2,}/g, ' ')           // Multiple spaces to single
      .replace(/\n{3,}/g, '\n\n')       // Multiple newlines to double
      // Arabic-specific fixes would go here
      .trim();
  }

  private static russianPostProcessing(text: string): string {
    return text
      // Fix Cyrillic character recognition errors
      .replace(/\s{2,}/g, ' ')           // Multiple spaces to single
      .replace(/\n{3,}/g, '\n\n')       // Multiple newlines to double
      // Russian-specific fixes would go here
      .trim();
  }

  private static europeanLanguagePostProcessing(text: string, language: OCRLanguage): string {
    // ENHANCED: Apply universal paragraph preservation for European languages
    let processed = this.universalParagraphPreservation(text);

    // Language-specific character and punctuation fixes
    switch (language) {
      case 'fra':
        // French-specific punctuation rules
        processed = processed
          .replace(/\s+([!?:;])/g, ' $1')  // Space before exclamation, question, colon, semicolon
          .replace(/«\s*/g, '« ')          // French quotes
          .replace(/\s*»/g, ' »');
        break;
      case 'deu':
        // German-specific fixes
        processed = processed
          .replace(/ß/g, 'ß')              // Ensure proper ß character
          .replace(/ae/g, 'ä')             // Common OCR error
          .replace(/oe/g, 'ö')             // Common OCR error
          .replace(/ue/g, 'ü');            // Common OCR error
        break;
      case 'spa':
        // Spanish-specific fixes
        processed = processed
          .replace(/n~/g, 'ñ')             // Fix ñ character
          .replace(/¿\s*/g, '¿')           // Spanish question marks
          .replace(/\s*\?/g, '?')
          .replace(/¡\s*/g, '¡')           // Spanish exclamation marks
          .replace(/\s*!/g, '!');
        break;
    }

    // Final cleanup while preserving paragraph structure
    return this.finalCleanupUniversal(processed);
  }

  // Keep the original English post-processing method
  private static enhancedPostProcessing(text: string): string {
    // Step 1: Basic cleanup
    let processed = this.basicCleanup(text);
    
    // Step 2: Fix common OCR character errors
    processed = this.fixCharacterErrors(processed);
    
    // Step 3: Fix number formatting issues
    processed = this.fixNumberFormatting(processed);
    
    // Step 4: Fix legal/business terminology
    processed = this.fixLegalTerminology(processed);
    
    // Step 5: Fix spacing and punctuation
    processed = this.fixSpacingAndPunctuation(processed);
    
    // Step 6: Reconstruct paragraphs intelligently
    processed = this.intelligentParagraphReconstruction(processed);
    
    // Step 7: Final cleanup
    processed = this.finalCleanup(processed);
    
    return processed;
  }

  private static basicCleanup(text: string): string {
    return text
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .trim();
  }

  private static fixCharacterErrors(text: string): string {
    // Common OCR character substitution errors
    const characterFixes = [
      // Numbers and letters confusion
      [/\b0(?=[a-zA-Z])/g, 'O'],           // 0 before letters -> O
      [/(?<=[a-zA-Z])0\b/g, 'O'],         // 0 after letters -> O
      [/\b1(?=[a-zA-Z])/g, 'I'],          // 1 before letters -> I
      [/(?<=[a-zA-Z])1\b/g, 'l'],         // 1 after letters -> l
      [/\|/g, 'I'],                       // Pipe to I
      [/(?<!\d)5(?=\d)/g, 'S'],           // 5 at start of word -> S
      [/8(?=[a-zA-Z])/g, 'B'],            // 8 before letters -> B
      
      // Common punctuation errors
      [/\s*,\s*(?=\d)/g, ','],            // Fix comma spacing before numbers
      [/(\d)\s*,\s*(\d)/g, '$1,$2'],      // Fix number comma formatting
      [/\s*\.\s*(?=\d)/g, '.'],           // Fix period spacing before numbers
      [/(\d)\s*\.\s*(\d)/g, '$1.$2'],     // Fix decimal formatting
      
      // Quote and apostrophe fixes
      [/[""]/g, '"'],                     // Smart quotes to regular
      [/['']/g, "'"],                     // Smart apostrophes to regular
      
      // Common word boundary issues
      [/\bthe\s+(?=\d)/g, 'the '],        // "the" before numbers
      [/\bof\s+(?=\d)/g, 'of '],          // "of" before numbers
      [/\band\s+(?=\d)/g, 'and '],        // "and" before numbers
    ];

    let result = text;
    characterFixes.forEach(([pattern, replacement]) => {
      result = result.replace(pattern as RegExp, replacement as string);
    });

    return result;
  }

  private static fixNumberFormatting(text: string): string {
    let result = text;

    // Fix common number formatting issues
    const numberFixes = [
      // Fix concatenated numbers like "2,000500" -> "2,000" or "2,500"
      [/(\d{1,3}),(\d{3})(\d{3})/g, (match: string, p1: string, p2: string, p3: string) => {
        // If the third group looks like a separate number, split them
        if (p3.length === 3 && parseInt(p3) < 600) {
          return `${p1},${p2} ${p3}`;
        }
        return `${p1},${p2},${p3}`;
      }],
      
      // Fix malformed currency
      [/\$\s*(\d)/g, '$$$1'],              // Fix "$ 100" -> "$100"
      [/(\d)\s*\$(?!\d)/g, '$1$'],         // Fix "100 $" -> "100$"
      
      // Fix percentage formatting
      [/(\d)\s*%/g, '$1%'],                // Fix "50 %" -> "50%"
      [/%\s*(\d)/g, '% $1'],               // Fix "%50" -> "% 50"
      
      // Fix decimal issues
      [/(\d)\s*\.\s*(\d)/g, '$1.$2'],      // Fix "3 . 14" -> "3.14"
      
      // Fix date formatting
      [/(\d{1,2})\s*\/\s*(\d{1,2})\s*\/\s*(\d{2,4})/g, '$1/$2/$3'],
      
      // Fix phone number formatting
      [/(\d{3})\s*-\s*(\d{3})\s*-\s*(\d{4})/g, '$1-$2-$3'],
    ];

    numberFixes.forEach(([pattern, replacement]) => {
      result = result.replace(pattern as RegExp, replacement as string | Function);
    });

    return result;
  }

  private static fixLegalTerminology(text: string): string {
    // Common legal/business terms that get OCR'd incorrectly
    const legalTermFixes = [
      // Contract terms
      [/\bwhereas\b/gi, 'WHEREAS'],
      [/\bnow therefore\b/gi, 'NOW THEREFORE'],
      [/\bin witness whereof\b/gi, 'IN WITNESS WHEREOF'],
      [/\bto wit\b/gi, 'to wit'],
      [/\binter alia\b/gi, 'inter alia'],
      [/\be\.g\.\b/gi, 'e.g.'],
      [/\bi\.e\.\b/gi, 'i.e.'],
      [/\betc\.\b/gi, 'etc.'],
      
      // Legal entities
      [/\bllc\b/gi, 'LLC'],
      [/\binc\b(?=\.|\s|$)/gi, 'Inc'],
      [/\bcorp\b(?=\.|\s|$)/gi, 'Corp'],
      [/\bltd\b(?=\.|\s|$)/gi, 'Ltd'],
      
      // Common legal phrases
      [/\bforce majeure\b/gi, 'force majeure'],
      [/\bfob\b/gi, 'FOB'],
      [/\bcif\b/gi, 'CIF'],
      [/\bfca\b/gi, 'FCA'],
      
      // Fix common word splits
      [/\bthere fore\b/gi, 'therefore'],
      [/\bthere of\b/gi, 'thereof'],
      [/\bthere in\b/gi, 'therein'],
      [/\bthere under\b/gi, 'thereunder'],
      [/\bwhere as\b/gi, 'whereas'],
      [/\bwhere in\b/gi, 'wherein'],
      [/\bwhere by\b/gi, 'whereby'],
      [/\bwhere upon\b/gi, 'whereupon'],
      
      // Fix common legal abbreviations
      [/\bp\s*\.\s*a\s*\./gi, 'p.a.'],
      [/\bv\s*\.\s*(?=[A-Z])/g, 'v. '],     // Case citations
      [/\bvs\s*\.\s*(?=[A-Z])/g, 'vs. '],   // Case citations
      
      // Fix section references
      [/\bsection\s+(\d+)/gi, 'Section $1'],
      [/\bsec\s*\.\s*(\d+)/gi, 'Sec. $1'],
      [/\bparagraph\s+(\d+)/gi, 'Paragraph $1'],
      [/\bpara\s*\.\s*(\d+)/gi, 'Para. $1'],
    ];

    let result = text;
    legalTermFixes.forEach(([pattern, replacement]) => {
      result = result.replace(pattern as RegExp, replacement as string);
    });

    return result;
  }

  private static fixSpacingAndPunctuation(text: string): string {
    let result = text;

    // Fix spacing issues
    const spacingFixes = [
      // Multiple spaces to single space
      [/\s{2,}/g, ' '],
      
      // Fix spacing around punctuation
      [/\s+([,.;:!?])/g, '$1'],           // Remove space before punctuation
      [/([,.;:!?])(?=[a-zA-Z])/g, '$1 '], // Add space after punctuation
      [/([.!?])([A-Z])/g, '$1 $2'],       // Space after sentence-ending punctuation
      
      // Fix parentheses spacing
      [/\(\s+/g, '('],                    // Remove space after opening paren
      [/\s+\)/g, ')'],                    // Remove space before closing paren
      [/\)(?=[a-zA-Z])/g, ') '],          // Add space after closing paren
      
      // Fix quote spacing
      [/"\s+/g, '"'],                     // Remove space after opening quote
      [/\s+"/g, '"'],                     // Remove space before closing quote
      
      // Fix hyphen and dash spacing
      [/\s+-\s+/g, ' - '],                // Standardize dash spacing
      [/(\w)-(\w)/g, '$1-$2'],            // Remove spaces in hyphenated words
      
      // Fix colon spacing (important for legal documents)
      [/:\s*(?=[A-Z])/g, ': '],           // Standardize colon spacing
      
      // Fix semicolon spacing
      [/;\s*(?=[a-zA-Z])/g, '; '],        // Standardize semicolon spacing
    ];

    spacingFixes.forEach(([pattern, replacement]) => {
      result = result.replace(pattern as RegExp, replacement as string);
    });

    return result;
  }

  private static intelligentParagraphReconstruction(text: string): string {
    // CONSERVATIVE APPROACH: Preserve existing paragraph structure while fixing obvious line breaks
    const lines = text.split('\n');
    const result: string[] = [];
    let currentParagraph = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const prevLine = i > 0 ? lines[i - 1]?.trim() : '';
      const nextLine = i < lines.length - 1 ? lines[i + 1]?.trim() : '';

      // Skip empty lines - they indicate paragraph breaks
      if (line.length === 0) {
        // Finish current paragraph if we have one
        if (currentParagraph.trim()) {
          result.push(currentParagraph.trim());
          currentParagraph = '';
        }
        continue;
      }

      // Definitely start new paragraph for legal/formal indicators
      if (this.isDefiniteNewParagraph(line)) {
        if (currentParagraph.trim()) {
          result.push(currentParagraph.trim());
        }
        currentParagraph = line;
        continue;
      }

      // Only join lines if there's clear evidence they should be joined
      if (currentParagraph && this.shouldDefinitelyJoin(currentParagraph, line)) {
        // Join with previous line (handle hyphenation)
        currentParagraph += (currentParagraph.endsWith('-') ? '' : ' ') + line;
      } else {
        // DEFAULT: Start new paragraph (preserve paragraph breaks)
        if (currentParagraph.trim()) {
          result.push(currentParagraph.trim());
        }
        currentParagraph = line;
      }
    }

    // Add final paragraph
    if (currentParagraph.trim()) {
      result.push(currentParagraph.trim());
    }

    return result.join('\n\n');
  }

  private static isNewParagraphStart(line: string, currentParagraph: string): boolean {
    // Legal document paragraph indicators
    const paragraphStarters = [
      /^\d+\./,                           // Numbered paragraphs
      /^[A-Z]\./,                         // Lettered paragraphs
      /^\([a-z]\)/,                       // Lettered sub-paragraphs
      /^\([0-9]+\)/,                      // Numbered sub-paragraphs
      /^WHEREAS\b/i,                      // Contract clauses
      /^NOW THEREFORE\b/i,                // Contract clauses
      /^IN WITNESS WHEREOF\b/i,           // Contract clauses
      /^Section\s+\d+/i,                  // Section headers
      /^Article\s+\d+/i,                  // Article headers
      /^Chapter\s+\d+/i,                  // Chapter headers
      /^[A-Z][A-Z\s]{3,}:/,              // ALL CAPS headers with colon
      /^[A-Z][a-z]+\s+[A-Z][a-z]+:/,     // Title Case headers with colon
    ];

    return paragraphStarters.some(pattern => pattern.test(line)) && currentParagraph.length > 0;
  }

  private static shouldJoinWithPrevious(currentParagraph: string, line: string): boolean {
    if (!currentParagraph || !line) return false;

    // Don't join if current line looks like a new paragraph
    if (this.isNewParagraphStart(line, currentParagraph)) return false;

    // Join if previous line ends incompletely
    const incompleteEndings = [
      /,$/,                               // Ends with comma
      /\sand$/,                           // Ends with "and"
      /\sor$/,                            // Ends with "or"
      /\sof$/,                            // Ends with "of"
      /\sto$/,                            // Ends with "to"
      /\sthe$/,                           // Ends with "the"
      /\sa$/,                             // Ends with "a"
      /\san$/,                            // Ends with "an"
      /\sin$/,                            // Ends with "in"
      /\sfor$/,                           // Ends with "for"
      /\swith$/,                          // Ends with "with"
      /\sby$/,                            // Ends with "by"
      /\sfrom$/,                          // Ends with "from"
      /-$/,                               // Ends with hyphen
      /\sthat$/,                          // Ends with "that"
      /\swhich$/,                         // Ends with "which"
      /\swho$/,                           // Ends with "who"
      /\swhere$/,                         // Ends with "where"
      /\swhen$/,                          // Ends with "when"
    ];

    if (incompleteEndings.some(pattern => pattern.test(currentParagraph.trim()))) {
      return true;
    }

    // Join if current line starts with lowercase (likely continuation)
    if (/^[a-z]/.test(line)) return true;

    // Join if current line starts with continuation words
    const continuationStarters = [
      /^and\b/i,
      /^or\b/i,
      /^but\b/i,
      /^however\b/i,
      /^therefore\b/i,
      /^furthermore\b/i,
      /^moreover\b/i,
      /^nevertheless\b/i,
      /^accordingly\b/i,
    ];

    return continuationStarters.some(pattern => pattern.test(line));
  }

  private static shouldEndParagraph(currentLine: string, nextLine: string): boolean {
    if (!nextLine) return true;

    // End paragraph if next line starts a new paragraph
    if (this.isNewParagraphStart(nextLine, currentLine)) return true;

    // End paragraph after sentence-ending punctuation if next line starts with capital
    if (/[.!?]$/.test(currentLine.trim()) && /^[A-Z]/.test(nextLine.trim())) {
      return true;
    }

    return false;
  }

  // Conservative helper methods for paragraph reconstruction
  private static isDefiniteNewParagraph(line: string): boolean {
    // Only mark as definite new paragraph for very clear indicators
    const definiteStarters = [
      /^\d+\./,                           // Numbered paragraphs like "1."
      /^[A-Z]\./,                         // Lettered paragraphs like "A."
      /^\([a-z]\)/,                       // Lettered sub-paragraphs like "(a)"
      /^\([0-9]+\)/,                      // Numbered sub-paragraphs like "(1)"
      /^WHEREAS\b/i,                      // Contract clauses
      /^NOW THEREFORE\b/i,                // Contract clauses
      /^IN WITNESS WHEREOF\b/i,           // Contract clauses
      /^Section\s+\d+/i,                  // Section headers
      /^Article\s+\d+/i,                  // Article headers
      /^Chapter\s+\d+/i,                  // Chapter headers
    ];

    return definiteStarters.some(pattern => pattern.test(line));
  }

  private static shouldDefinitelyJoin(currentParagraph: string, line: string): boolean {
    if (!currentParagraph || !line) return false;

    // Don't join if current line looks like a new paragraph
    if (this.isDefiniteNewParagraph(line)) return false;

    // Only join if there's very clear evidence lines should be joined
    const clearJoinIndicators = [
      /-$/,                               // Previous line ends with hyphen
      /,$/,                               // Previous line ends with comma
      /\sand$/,                           // Previous line ends with "and"
      /\sor$/,                            // Previous line ends with "or"
    ];

    // Check if previous line has clear join indicator
    if (clearJoinIndicators.some(pattern => pattern.test(currentParagraph.trim()))) {
      return true;
    }

    // Join if current line starts with lowercase (likely continuation)
    if (/^[a-z]/.test(line)) return true;

    return false;
  }

  private static shouldDefinitelyEndParagraph(currentParagraph: string, line: string): boolean {
    // Only end paragraph if we have very strong evidence
    
    // End if next line is definitely a new paragraph
    if (this.isDefiniteNewParagraph(line)) return true;

    // End if current paragraph ends with sentence punctuation and next starts with capital
    if (/[.!?]$/.test(currentParagraph.trim()) && /^[A-Z]/.test(line.trim())) {
      return true;
    }

    return false;
  }

  private static finalCleanup(text: string): string {
    return text
      // Remove excessive line breaks
      .replace(/\n{3,}/g, '\n\n')
      // Trim each paragraph
      .split('\n\n')
      .map(para => para.trim())
      .filter(para => para.length > 0)
      .join('\n\n')
      // Final trim
      .trim();
  }

  public static getLanguageInfo(languageCode: OCRLanguage): LanguageOption | undefined {
    return SUPPORTED_LANGUAGES.find(lang => lang.code === languageCode);
  }

  // Enhanced cache statistics for monitoring
  public static getCacheStats() {
    return {
      cachedWorkers: this.workers.size,
      detectionWorkerCached: !!this.detectionWorker,
      totalCacheHits: Array.from(this.workers.values()).reduce((sum, cached) => sum + cached.useCount, 0) +
                     (this.detectionWorker?.useCount || 0),
      oldestWorker: this.workers.size > 0 ? Math.min(...Array.from(this.workers.values()).map(cached => cached.lastUsed)) : Infinity,
      newestWorker: this.workers.size > 0 ? Math.max(...Array.from(this.workers.values()).map(cached => cached.lastUsed)) : -Infinity,
      // Language detection cache stats
      languageCacheSize: this.languageCache.size,
      languageCacheHits: Array.from(this.languageCache.values()).reduce((sum, entry) => sum + entry.hitCount, 0),
      oldestLanguageCache: this.languageCache.size > 0 ? Math.min(...Array.from(this.languageCache.values()).map(entry => entry.timestamp)) : Infinity,
      newestLanguageCache: this.languageCache.size > 0 ? Math.max(...Array.from(this.languageCache.values()).map(entry => entry.timestamp)) : -Infinity
    };
  }

  // Universal paragraph preservation function for all European languages
  private static universalParagraphPreservation(text: string): string {
    // SAFE UNIVERSAL APPROACH: Preserve existing structure while fixing obvious issues
    const lines = text.split('\n');
    const result: string[] = [];
    let currentParagraph = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Skip empty lines - they indicate paragraph breaks
      if (line.length === 0) {
        // Finish current paragraph if we have one
        if (currentParagraph.trim()) {
          result.push(currentParagraph.trim());
          currentParagraph = '';
        }
        continue;
      }

      // Universal paragraph starters (work across European languages)
      if (this.isUniversalNewParagraph(line)) {
        if (currentParagraph.trim()) {
          result.push(currentParagraph.trim());
        }
        currentParagraph = line;
        continue;
      }

      // Universal line joining (very conservative)
      if (currentParagraph && this.shouldUniversallyJoin(currentParagraph, line)) {
        // Join with previous line (handle hyphenation)
        currentParagraph += (currentParagraph.endsWith('-') ? '' : ' ') + line;
      } else {
        // DEFAULT: Start new paragraph (preserve paragraph breaks)
        if (currentParagraph.trim()) {
          result.push(currentParagraph.trim());
        }
        currentParagraph = line;
      }
    }

    // Add final paragraph
    if (currentParagraph.trim()) {
      result.push(currentParagraph.trim());
    }

    return result.join('\n\n');
  }

  // Universal paragraph starter detection (language-agnostic)
  private static isUniversalNewParagraph(line: string): boolean {
    // Only very obvious paragraph starters that work across languages
    const universalStarters = [
      /^\d+\./,                           // Numbered paragraphs like "1."
      /^[A-Z]\./,                         // Lettered paragraphs like "A."
      /^\([a-z]\)/,                       // Lettered sub-paragraphs like "(a)"
      /^\([0-9]+\)/,                      // Numbered sub-paragraphs like "(1)"
      /^[IVX]+\./,                        // Roman numerals like "I.", "II."
    ];

    return universalStarters.some(pattern => pattern.test(line));
  }

  // Universal line joining (very conservative, works across languages)
  private static shouldUniversallyJoin(currentParagraph: string, line: string): boolean {
    if (!currentParagraph || !line) return false;

    // Don't join if current line looks like a new paragraph
    if (this.isUniversalNewParagraph(line)) return false;

    // Only join with very clear universal indicators
    const universalJoinIndicators = [
      /-$/,                               // Previous line ends with hyphen (universal)
      /,$/,                               // Previous line ends with comma (universal)
    ];

    // Check if previous line has clear join indicator
    if (universalJoinIndicators.some(pattern => pattern.test(currentParagraph.trim()))) {
      return true;
    }

    // Join if current line starts with lowercase (universal continuation)
    if (/^[a-z]/.test(line)) return true;

    return false;
  }

  // Universal final cleanup (preserves paragraph structure)
  private static finalCleanupUniversal(text: string): string {
    return text
      // Clean up excessive spaces within lines
      .replace(/\s{2,}/g, ' ')
      // Remove excessive line breaks (preserve double breaks for paragraphs)
      .replace(/\n{3,}/g, '\n\n')
      // Trim each paragraph
      .split('\n\n')
      .map(para => para.trim())
      .filter(para => para.length > 0)
      .join('\n\n')
      // Final trim
      .trim();
  }

  // STAGE 1: Gentle universal preservation - preserves paragraph structure for ALL languages
  private static gentleUniversalPreservation(text: string): string {
    console.log('🧘 Re-evaluating paragraph preservation...');

    const lines = text.split('\n');
    const result: string[] = [];
    let currentParagraph = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (line.length === 0) {
        // Empty line: end of paragraph
        if (currentParagraph.trim()) {
          result.push(currentParagraph.trim());
          currentParagraph = '';
        }
        continue;
      }

      // Detect definitive paragraph starters (numbered sections, legal headers)
      const definiteParagraphStart = /^[1-9]\d*\.|^[A-Z]\.|^\([a-z]\)|^\([0-9]+\)|^WHEREAS\b|^NOW THEREFORE\b|^IN WITNESS WHEREOF\b/i.test(line);

      // Intelligent line joining logic
      if (currentParagraph && !definiteParagraphStart) {
        // Check if we should join this line with the previous paragraph
        const shouldJoin = this.shouldJoinLines(currentParagraph, line);
        
        if (shouldJoin) {
          currentParagraph += ' ' + line;
        } else {
          // Start new paragraph
          result.push(currentParagraph.trim());
          currentParagraph = line;
        }
      } else {
        // Definitive paragraph start or first line
        if (currentParagraph.trim()) {
          result.push(currentParagraph.trim());
        }
        currentParagraph = line;
      }
    }

    if (currentParagraph.trim()) {
      result.push(currentParagraph.trim());
    }
    return result.join('\n\n');
  }

  // ZEN APPROACH: Simple and effective - preserve clear paragraph breaks, join everything else
  private static shouldJoinLines(currentParagraph: string, line: string): boolean {
    if (!currentParagraph || !line) return false;

    // DON'T join if current line is clearly a new paragraph
    if (this.isDefiniteNewParagraph(line)) {
      return false;
    }

    // JOIN everything else - simple and effective!
    console.log('🧘 Zen joining:', currentParagraph.slice(-20), '|', line.slice(0, 30));
    return true;
  }

  public static async terminate(): Promise<void> {
    // Clear cleanup timer
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }

    // Terminate all workers
    const terminationPromises = Array.from(this.workers.values()).map(cached => cached.worker.terminate());
    
    if (this.detectionWorker) {
      terminationPromises.push(this.detectionWorker.worker.terminate());
    }

    await Promise.all(terminationPromises);
    
    this.workers.clear();
    this.loadingPromises.clear();
    this.detectionWorker = null;
    
    // Clear language detection cache
    this.languageCache.clear();
    
    console.log('🧹 All OCR workers terminated and caches cleared');
  }
}
