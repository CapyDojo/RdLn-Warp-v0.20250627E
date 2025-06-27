/**
 * OCR Cache Manager
 * 
 * Handles caching of Tesseract workers and language detection results
 * to optimize performance and resource utilization.
 */

import { createWorker } from 'tesseract.js';
import { 
  CachedWorker, 
  LanguageDetectionCacheEntry, 
  OCRLanguage, 
  CacheStats 
} from '../types/ocr-types';
import { CACHE_CONFIGURATION, DETECTION_LANGUAGES } from '../config/ocrConfig';

export class OCRCacheManager {
  private static workers: Map<string, CachedWorker> = new Map();
  private static loadingPromises: Map<string, Promise<Tesseract.Worker>> = new Map();
  private static detectionWorker: CachedWorker | null = null;
  
  // Language detection cache
  private static languageCache: Map<string, LanguageDetectionCacheEntry> = new Map();
  
  // Cleanup timer
  private static cleanupTimer: NodeJS.Timeout | null = null;

  /**
   * Creates a logger function for Tesseract worker progress
   */
  private static createLogger() {
    return (m: any) => {
      // Suppress most logging to reduce console noise
      if (m.status === 'recognizing text') {
        console.log(`OCR progress: ${Math.round(m.progress * 100)}%`);
      }
    };
  }

  /**
   * Generates a cache key for worker identification
   */
  private static getWorkerKey(languages: OCRLanguage[]): string {
    return languages.sort().join('-');
  }

  /**
   * Starts the cleanup timer for expired workers and cache entries
   */
  private static startCleanupTimer() {
    if (this.cleanupTimer) return;
    
    this.cleanupTimer = setInterval(() => {
      this.cleanupExpiredWorkers();
      this.cleanupLanguageCache();
    }, CACHE_CONFIGURATION.cleanupIntervalMs);
  }

  /**
   * Cleans up expired workers and manages cache size
   */
  private static async cleanupExpiredWorkers() {
    const now = Date.now();
    const expiredKeys: string[] = [];

    // Find expired workers
    for (const [key, cached] of this.workers.entries()) {
      if (now - cached.lastUsed > CACHE_CONFIGURATION.cacheExpiryMs) {
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
    if (this.detectionWorker && now - this.detectionWorker.lastUsed > CACHE_CONFIGURATION.cacheExpiryMs) {
      console.log('🧹 Cleaning up expired detection worker');
      await this.detectionWorker.worker.terminate();
      this.detectionWorker = null;
    }

    // If cache is too large, remove least recently used
    if (this.workers.size > CACHE_CONFIGURATION.maxCachedWorkers) {
      const sortedEntries = Array.from(this.workers.entries())
        .sort(([,a], [,b]) => a.lastUsed - b.lastUsed);
      
      const toRemove = sortedEntries.slice(0, this.workers.size - CACHE_CONFIGURATION.maxCachedWorkers);
      for (const [key, cached] of toRemove) {
        console.log(`🧹 Removing LRU OCR worker: ${key}`);
        await cached.worker.terminate();
        this.workers.delete(key);
      }
    }
  }

  /**
   * Cleans up expired language detection cache entries
   */
  private static cleanupLanguageCache() {
    const now = Date.now();
    const expiredKeys: string[] = [];

    // Find expired language cache entries
    for (const [key, entry] of this.languageCache.entries()) {
      if (now - entry.timestamp > CACHE_CONFIGURATION.languageCacheExpiryMs) {
        expiredKeys.push(key);
      }
    }

    // Remove expired entries
    for (const key of expiredKeys) {
      this.languageCache.delete(key);
      console.log(`🧹 Cleaned up expired language detection cache entry`);
    }

    // If cache is too large, remove least recently used
    if (this.languageCache.size > CACHE_CONFIGURATION.maxLanguageCacheEntries) {
      const sortedEntries = Array.from(this.languageCache.entries())
        .sort(([,a], [,b]) => {
          // Sort by hit count first, then by timestamp
          if (a.hitCount !== b.hitCount) {
            return a.hitCount - b.hitCount;
          }
          return a.timestamp - b.timestamp;
        });
      
      const toRemove = sortedEntries.slice(0, this.languageCache.size - CACHE_CONFIGURATION.maxLanguageCacheEntries);
      for (const [key] of toRemove) {
        this.languageCache.delete(key);
        console.log(`🧹 Removed LRU language detection cache entry`);
      }
    }
  }

  /**
   * Generates a cache key for language detection
   */
  public static async generateLanguageCacheKey(imageFile: File | Blob): Promise<string> {
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

  /**
   * Checks language detection cache for existing results
   */
  public static async checkLanguageCache(imageFile: File | Blob): Promise<OCRLanguage[] | null> {
    try {
      const cacheKey = await this.generateLanguageCacheKey(imageFile);
      const cached = this.languageCache.get(cacheKey);
      
      if (cached) {
        const now = Date.now();
        if (now - cached.timestamp < CACHE_CONFIGURATION.languageCacheExpiryMs) {
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

  /**
   * Stores language detection result in cache
   */
  public static async storeLanguageCache(imageFile: File | Blob, languages: OCRLanguage[]): Promise<void> {
    try {
      const cacheKey = await this.generateLanguageCacheKey(imageFile);
      
      this.languageCache.set(cacheKey, {
        languages: [...languages], // Clone array
        timestamp: Date.now(),
        hitCount: 0
      });
      
      console.log(`💾 LANGUAGE CACHE STORE: Cached detection result for future use:`, languages);
      
      // Trigger cleanup if cache is getting large
      if (this.languageCache.size > CACHE_CONFIGURATION.maxLanguageCacheEntries) {
        this.cleanupLanguageCache();
      }
    } catch (error) {
      console.warn('Failed to store language cache:', error);
    }
  }

  /**
   * Initializes or retrieves cached detection worker
   */
  public static async initializeDetectionWorker(): Promise<Tesseract.Worker> {
    // Check cache first
    if (this.detectionWorker) {
      this.detectionWorker.lastUsed = Date.now();
      this.detectionWorker.useCount++;
      console.log(`🎯 DETECTION CACHE HIT: Reusing detection worker (used ${this.detectionWorker.useCount} times)`);
      return this.detectionWorker.worker;
    }

    console.log('🔄 DETECTION CACHE MISS: Creating new detection worker with full language support:', DETECTION_LANGUAGES);
    
    const worker = await createWorker(DETECTION_LANGUAGES, 1, {
      logger: this.createLogger()
    });

    // Cache the worker
    this.detectionWorker = {
      worker,
      lastUsed: Date.now(),
      useCount: 1,
      languages: DETECTION_LANGUAGES
    };

    this.startCleanupTimer();
    console.log('✅ Multi-language detection worker cached successfully');
    return worker;
  }

  /**
   * Initializes or retrieves cached extraction worker
   */
  public static async initializeWorker(languages: OCRLanguage[]): Promise<Tesseract.Worker> {
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

  /**
   * Gets cache statistics for monitoring
   */
  public static getCacheStats(): CacheStats {
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

  /**
   * Terminates all workers and clears caches
   */
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
