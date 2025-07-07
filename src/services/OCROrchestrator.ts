/**
 * OCR Orchestrator Service
 * 
 * Coordinates specialized OCR services for text extraction workflow.
 * Part of Phase 3 SSMR refactor - service composition pattern.
 * 
 * Responsibilities:
 * - Workflow coordination between services
 * - Language detection and worker management
 * - Text processing pipeline orchestration
 * - Performance monitoring and error handling
 * - Background loading integration
 */

import { createWorker } from 'tesseract.js';
import type { Worker as TesseractWorker } from 'tesseract.js';
import { OCRLanguage, OCROptions } from '../types/ocr-types';
import { SUPPORTED_LANGUAGES } from '../config/ocrConfig';
import { appConfig } from '../config/appConfig';

// Import specialized services
import { TextProcessingService, TextProcessingOptions } from './TextProcessingService';
import { LanguageDetectionService } from './LanguageDetectionService';
import { OCRCacheManager } from './OCRCacheManager';
import { BackgroundLanguageLoader } from './BackgroundLanguageLoader';

// Import error handling
import { 
  safeAsync, 
  ErrorCategory, 
  ErrorFactory,
  ErrorManager 
} from '../utils/errorHandling';

// Import centralized performance monitoring
import { PerformanceMonitor } from './PerformanceMonitor';

export interface OrchestrationResult {
  text: string;
  detectedLanguages: OCRLanguage[];
  extractionTime: number;
  processingTime: number;
  totalTime: number;
  cacheHit: boolean;
  backgroundLoaderUsed: boolean;
  appliedProcessors: string[];
  performanceMetrics: {
    languageDetectionMs: number;
    workerInitializationMs: number;
    ocrExtractionMs: number;
    textProcessingMs: number;
  };
}

export interface OrchestrationOptions extends OCROptions {
  textProcessing?: TextProcessingOptions;
  useBackgroundLoader?: boolean;
  performanceTracking?: boolean;
}

export class OCROrchestrator {
  // SSMR MODULAR: Centralized performance monitoring integration
  private static performanceMonitor = PerformanceMonitor.getInstance();

  /**
   * Main orchestration method for OCR text extraction
   */
  public static async extractText(
    imageFile: File | Blob,
    options: OrchestrationOptions = {}
  ): Promise<OrchestrationResult> {
    // SSMR STEP-BY-STEP: Create operation ID for correlation with component performance
    const operationId = `ocr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Track OCR operation start in centralized monitor
    this.performanceMonitor.recordMetric('ocr_operation_started', {
      operationId,
      imageSize: imageFile.size,
      imageType: imageFile.type,
      options: {
        autoDetect: options.autoDetect,
        useBackgroundLoader: options.useBackgroundLoader,
        performanceTracking: options.performanceTracking
      },
      timestamp: Date.now()
    });
    
    const startTime = performance.now();
    let detectedLanguages: OCRLanguage[] = [];
    let extractionTime = 0;
    let processingTime = 0;
    let cacheHit = false;
    let backgroundLoaderUsed = false;
    let appliedProcessors: string[] = [];

    const performanceMetrics = {
      languageDetectionMs: 0,
      workerInitializationMs: 0,
      ocrExtractionMs: 0,
      textProcessingMs: 0
    };

    try {
      // Phase 1: Language Detection
      const languageDetectionStart = performance.now();
      
      if (options.autoDetect !== false) {
        console.log('🔍 Starting language detection workflow...');
        const languageResult = await safeAsync(
          () => LanguageDetectionService.detectLanguage(imageFile),
          ErrorCategory.OCR,
          'Language detection failed'
        );
        
        if (languageResult.success) {
          detectedLanguages = languageResult.data;
          console.log('📝 Languages detected:', detectedLanguages.map(lang => 
            SUPPORTED_LANGUAGES.find(l => l.code === lang)?.name || lang
          ).join(', '));
        } else {
          // Language detection failed, use fallback
          detectedLanguages = ['eng'];
          console.log('🔄 Language detection failed, defaulting to English');
        }
      } else if (options.languages && options.languages.length > 0) {
        detectedLanguages = options.languages;
        console.log('🎯 Using specified languages:', detectedLanguages.join(', '));
      } else {
        detectedLanguages = ['eng'];
        console.log('🔄 Defaulting to English');
      }

      performanceMetrics.languageDetectionMs = performance.now() - languageDetectionStart;
      
      // Track language detection performance in centralized monitor
      this.performanceMonitor.recordMetric('ocr_language_detection', {
        operationId,
        duration: performanceMetrics.languageDetectionMs,
        detectedLanguages,
        success: detectedLanguages.length > 0,
        autoDetectUsed: options.autoDetect !== false
      });

      // Apply primary language priority if specified
      if (options.primaryLanguage && detectedLanguages.includes(options.primaryLanguage)) {
        detectedLanguages = [
          options.primaryLanguage,
          ...detectedLanguages.filter(lang => lang !== options.primaryLanguage)
        ];
        console.log('🎯 Primary language prioritized:', detectedLanguages.join(', '));
      }

      // Phase 2: Worker Initialization with Background Loader Integration
      const workerInitStart = performance.now();
      const worker = await this.initializeOptimalWorker(detectedLanguages, options);
      
      if (worker.backgroundLoaderUsed) {
        backgroundLoaderUsed = true;
        console.log('⚡ Background loader worker utilized');
      }
      
      if (worker.cacheHit) {
        cacheHit = true;
        console.log('🎯 Worker cache hit');
      }

      performanceMetrics.workerInitializationMs = performance.now() - workerInitStart;
      
      // Track worker initialization performance
      this.performanceMonitor.recordMetric('ocr_worker_initialization', {
        operationId,
        duration: performanceMetrics.workerInitializationMs,
        languages: detectedLanguages,
        cacheHit,
        backgroundLoaderUsed
      });

      // Phase 3: OCR Text Extraction
      const extractionStart = performance.now();
      console.log('📖 Extracting text from image...');
      
      const extractionResult = await safeAsync(
        () => worker.tesseractWorker.recognize(imageFile),
        ErrorCategory.OCR,
        'OCR text extraction failed'
      );
      
      if (!extractionResult.success) {
        throw new Error('OCR text extraction failed: ' + extractionResult.error.message);
      }
      
      const { data: { text } } = extractionResult.data;

      extractionTime = performance.now() - extractionStart;
      performanceMetrics.ocrExtractionMs = extractionTime;
      
      // Track text extraction performance
      this.performanceMonitor.recordMetric('ocr_text_extraction', {
        operationId,
        duration: extractionTime,
        textLength: text.length,
        imageSize: imageFile.size,
        languages: detectedLanguages
      });
      
      console.log(`⏱️ Text extraction completed in ${extractionTime}ms`);

      // Phase 4: Text Processing
      const processingStart = performance.now();
      console.log('🧘 Processing extracted text...');

      const textProcessingOptions = options.textProcessing || {};
      const textResult = await safeAsync(
        () => TextProcessingService.processText(text, detectedLanguages, textProcessingOptions),
        ErrorCategory.OCR,
        'Text processing failed'
      );
      
      let processingResult;
      if (textResult.success) {
        processingResult = textResult.data;
      } else {
        // Text processing failed, use fallback
        processingResult = {
          processedText: text, // Use original text
          processingTime: 0,
          language: detectedLanguages[0] || 'eng',
          appliedProcessors: ['fallback-original-text']
        };
      }

      processingTime = processingResult.processingTime;
      appliedProcessors = processingResult.appliedProcessors;
      performanceMetrics.textProcessingMs = processingTime;

      const totalTime = performance.now() - startTime;

      console.log(`✅ OCR orchestration completed in ${totalTime}ms (extraction: ${extractionTime}ms, processing: ${processingTime}ms)`);
      
      // SSMR REVERSIBLE: Track comprehensive completion metrics
      this.performanceMonitor.recordMetric('ocr_operation_completed', {
        operationId,
        totalTime,
        extractionTime,
        processingTime,
        textLength: processingResult.processedText.length,
        detectedLanguages,
        cacheHit,
        backgroundLoaderUsed,
        appliedProcessors,
        imageSize: imageFile.size,
        performanceMetrics,
        timestamp: Date.now()
      });

      // Optional: Legacy performance tracking (maintain backward compatibility)
      if (options.performanceTracking !== false) {
        this.recordPerformanceMetrics({
          totalTime,
          extractionTime,
          processingTime,
          detectedLanguages,
          cacheHit,
          backgroundLoaderUsed,
          imageSize: imageFile.size
        });
      }

      return {
        text: processingResult.processedText,
        detectedLanguages,
        extractionTime,
        processingTime,
        totalTime,
        cacheHit,
        backgroundLoaderUsed,
        appliedProcessors,
        performanceMetrics
      };

    } catch (error) {
      const totalTime = performance.now() - startTime;
      
      // Track OCR error with performance context
      this.performanceMonitor.recordMetric('ocr_operation_error', {
        operationId,
        error: error instanceof Error ? error.message : String(error),
        totalTime,
        detectedLanguages,
        imageSize: imageFile.size,
        options,
        timestamp: Date.now()
      });
      
      const orchError = ErrorFactory.createError(
        ErrorCategory.OCR,
        'OCR orchestration failed',
        { 
          operationId,
          detectedLanguages, 
          options, 
          imageSize: imageFile.size,
          performanceContext: {
            totalTime,
            extractionTime,
            processingTime,
            performanceMetrics
          },
          error: error instanceof Error ? error.message : String(error)
        },
        'Text extraction failed. Please try again with a different image.'
      );

      // Add performance context to error if ErrorManager supports it
      const performanceContext = {
        operationId,
        totalTime,
        extractionTime,
        processingTime,
        recentMetrics: this.performanceMonitor.getRecentMetrics?.() || []
      };
      
      if (typeof ErrorManager.addError === 'function' && ErrorManager.addError.length > 1) {
        (ErrorManager as any).addError(orchError, performanceContext);
      } else {
        ErrorManager.addError(orchError);
      }

      // Return safe fallback
      return {
        text: '',
        detectedLanguages: detectedLanguages.length > 0 ? detectedLanguages : ['eng'],
        extractionTime: 0,
        processingTime: 0,
        totalTime,
        cacheHit: false,
        backgroundLoaderUsed: false,
        appliedProcessors: ['error-fallback'],
        performanceMetrics
      };
    }
  }

  /**
   * Initialize optimal worker with background loader and cache integration
   */
  private static async initializeOptimalWorker(
    languages: OCRLanguage[],
    options: OrchestrationOptions
  ): Promise<{
    tesseractWorker: TesseractWorker;
    cacheHit: boolean;
    backgroundLoaderUsed: boolean;
  }> {
    let cacheHit = false;
    let backgroundLoaderUsed = false;

    // Try background loader first (if enabled and available)
    if (options.useBackgroundLoader !== false && BackgroundLanguageLoader.isEnabled()) {
      const primaryLanguage = languages[0];
      if (BackgroundLanguageLoader.isLanguageReady(primaryLanguage)) {
        const bgWorker = BackgroundLanguageLoader.getLoadedWorker(primaryLanguage);
        if (bgWorker) {
          console.log(`⚡ Using background-loaded worker for ${primaryLanguage}`);
          return {
            tesseractWorker: bgWorker,
            cacheHit: false,
            backgroundLoaderUsed: true
          };
        }
      }
    }

    // Fall back to cache manager
    const worker = await OCRCacheManager.initializeWorker(languages);
    
    // Check if this was a cache hit by examining use count
    const workerKey = [...languages].sort().join('-'); // Use copy to avoid mutating original array
    const cachedWorker = OCRCacheManager.getCachedWorker(workerKey);
    cacheHit = cachedWorker ? cachedWorker.useCount > 1 : false;

    return {
      tesseractWorker: worker,
      cacheHit,
      backgroundLoaderUsed
    };
  }

  /**
   * Get comprehensive performance statistics
   */
  public static getPerformanceStats(): {
    cacheStats: any;
    backgroundLoaderStats: any;
    recentExtractions: number;
    averageExtractionTime: number;
    averageProcessingTime: number;
  } {
    return {
      cacheStats: OCRCacheManager.getCacheStats(),
      backgroundLoaderStats: BackgroundLanguageLoader.getStats(),
      recentExtractions: this.performanceHistory.length,
      averageExtractionTime: this.calculateAverageMetric('extractionTime'),
      averageProcessingTime: this.calculateAverageMetric('processingTime')
    };
  }
  
  /**
   * SSMR MODULAR: Get centralized performance analytics
   * Provides access to performance data from the centralized monitoring system
   */
  public static getCentralizedPerformanceStats(): {
    legacy: ReturnType<typeof OCROrchestrator.getPerformanceStats>;
    centralized: {
      recentOCROperations: any[];
      averageOperationTime: number;
      successRate: number;
      errorRate: number;
      cacheHitRate: number;
      backgroundLoaderUsage: number;
    };
  } {
    const recentMetrics = this.performanceMonitor.getRecentMetrics?.() || [];
    const ocrMetrics = recentMetrics.filter(m => m.name.startsWith('ocr_'));
    
    // Calculate centralized analytics
    const completedOperations = ocrMetrics.filter(m => m.name === 'ocr_operation_completed');
    const errorOperations = ocrMetrics.filter(m => m.name === 'ocr_operation_error');
    const totalOperations = completedOperations.length + errorOperations.length;
    
    const avgOperationTime = completedOperations.length > 0 
      ? completedOperations.reduce((sum, m) => sum + (m.value?.totalTime || 0), 0) / completedOperations.length
      : 0;
      
    const cacheHits = completedOperations.filter(m => m.value?.cacheHit).length;
    const backgroundLoaderUsed = completedOperations.filter(m => m.value?.backgroundLoaderUsed).length;
    
    return {
      legacy: this.getPerformanceStats(),
      centralized: {
        recentOCROperations: ocrMetrics.slice(-20), // Last 20 operations
        averageOperationTime: avgOperationTime,
        successRate: totalOperations > 0 ? completedOperations.length / totalOperations : 1,
        errorRate: totalOperations > 0 ? errorOperations.length / totalOperations : 0,
        cacheHitRate: completedOperations.length > 0 ? cacheHits / completedOperations.length : 0,
        backgroundLoaderUsage: completedOperations.length > 0 ? backgroundLoaderUsed / completedOperations.length : 0
      }
    };
  }

  /**
   * Performance tracking history
   */
  private static performanceHistory: Array<{
    timestamp: number;
    totalTime: number;
    extractionTime: number;
    processingTime: number;
    detectedLanguages: OCRLanguage[];
    cacheHit: boolean;
    backgroundLoaderUsed: boolean;
    imageSize: number;
  }> = [];

  private static readonly MAX_PERFORMANCE_HISTORY = 50; // Keep last 50 extractions

  /**
   * Record performance metrics for analysis
   */
  private static recordPerformanceMetrics(metrics: {
    totalTime: number;
    extractionTime: number;
    processingTime: number;
    detectedLanguages: OCRLanguage[];
    cacheHit: boolean;
    backgroundLoaderUsed: boolean;
    imageSize: number;
  }): void {
    this.performanceHistory.push({
      timestamp: Date.now(),
      ...metrics
    });

    // Keep history size manageable
    if (this.performanceHistory.length > this.MAX_PERFORMANCE_HISTORY) {
      this.performanceHistory = this.performanceHistory.slice(-this.MAX_PERFORMANCE_HISTORY);
    }

    // Log performance insights in development
    if (appConfig.dev.LOGGING.ENABLED) {
      console.log('📊 Performance recorded:', {
        totalTime: `${metrics.totalTime.toFixed(1)}ms`,
        extractionTime: `${metrics.extractionTime.toFixed(1)}ms`, 
        processingTime: `${metrics.processingTime.toFixed(1)}ms`,
        languages: metrics.detectedLanguages.join(','),
        cacheHit: metrics.cacheHit,
        backgroundLoader: metrics.backgroundLoaderUsed,
        imageSize: `${(metrics.imageSize / 1024).toFixed(1)}KB`
      });
    }
  }

  /**
   * Calculate average metric from performance history
   */
  private static calculateAverageMetric(metric: 'totalTime' | 'extractionTime' | 'processingTime'): number {
    if (this.performanceHistory.length === 0) return 0;
    
    const sum = this.performanceHistory.reduce((acc, entry) => acc + entry[metric], 0);
    return sum / this.performanceHistory.length;
  }

  /**
   * Get supported languages for orchestration
   */
  public static getSupportedLanguages(): OCRLanguage[] {
    return SUPPORTED_LANGUAGES.map(lang => lang.code);
  }

  /**
   * Clear performance history (for testing)
   */
  public static clearPerformanceHistory(): void {
    this.performanceHistory = [];
  }

  /**
   * Check orchestration health status
   */
  public static async getHealthStatus(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    services: {
      textProcessing: boolean;
      languageDetection: boolean;
      cacheManager: boolean;
      backgroundLoader: boolean;
    };
    performance: {
      averageExtractionTime: number;
      cacheHitRate: number;
      backgroundLoaderUsage: number;
    };
  }> {
    const services = {
      textProcessing: true, // Always available (no external dependencies)
      languageDetection: true, // Always available (no external dependencies) 
      cacheManager: true, // Always available (no external dependencies)
      backgroundLoader: BackgroundLanguageLoader.isEnabled()
    };

    const performance = {
      averageExtractionTime: this.calculateAverageMetric('extractionTime'),
      cacheHitRate: this.calculateCacheHitRate(),
      backgroundLoaderUsage: this.calculateBackgroundLoaderUsage()
    };

    const healthyServices = Object.values(services).filter(Boolean).length;
    const totalServices = Object.values(services).length;

    let status: 'healthy' | 'degraded' | 'unhealthy';
    if (healthyServices === totalServices) {
      status = 'healthy';
    } else if (healthyServices >= totalServices * 0.75) {
      status = 'degraded';
    } else {
      status = 'unhealthy';
    }

    return {
      status,
      services,
      performance
    };
  }

  /**
   * Calculate cache hit rate from performance history
   */
  private static calculateCacheHitRate(): number {
    if (this.performanceHistory.length === 0) return 0;
    
    const cacheHits = this.performanceHistory.filter(entry => entry.cacheHit).length;
    return (cacheHits / this.performanceHistory.length) * 100;
  }

  /**
   * Calculate background loader usage rate
   */
  private static calculateBackgroundLoaderUsage(): number {
    if (this.performanceHistory.length === 0) return 0;
    
    const bgLoaderUsage = this.performanceHistory.filter(entry => entry.backgroundLoaderUsed).length;
    return (bgLoaderUsage / this.performanceHistory.length) * 100;
  }

  /**
   * Start background services (if not already started)
   */
  public static async startBackgroundServices(): Promise<void> {
    console.log('🚀 Starting OCR background services...');
    
    if (BackgroundLanguageLoader.isEnabled()) {
      await BackgroundLanguageLoader.startBackgroundLoading();
      console.log('✅ Background language loader started');
    } else {
      console.log('⏸️ Background language loader is disabled');
    }
  }

  /**
   * Stop background services safely
   */
  public static stopBackgroundServices(): void {
    console.log('🛑 Stopping OCR background services...');
    BackgroundLanguageLoader.stopBackgroundLoading();
    console.log('✅ Background services stopped');
  }

  /**
   * Clean up resources
   */
  public static cleanup(): void {
    this.stopBackgroundServices();
    this.performanceHistory = [];
    console.log('🧹 OCR orchestrator cleaned up');
  }
}
