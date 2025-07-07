/**
 * Tests for OCROrchestrator
 * 
 * Validates the service composition pattern and workflow coordination
 * from Phase 3.2 of the SSMR OCR refactor.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { OCROrchestrator } from '../OCROrchestrator';
import { OCRLanguage } from '../../types/ocr-types';

// Import the services to mock
import { TextProcessingService } from '../TextProcessingService';
import { LanguageDetectionService } from '../LanguageDetectionService';
import { OCRCacheManager } from '../OCRCacheManager';
import { BackgroundLanguageLoader } from '../BackgroundLanguageLoader';

// Mock the external services for testing
vi.mock('../TextProcessingService');
vi.mock('../LanguageDetectionService');
vi.mock('../OCRCacheManager');
vi.mock('../BackgroundLanguageLoader');

// Mock tesseract.js
vi.mock('tesseract.js', () => ({
  createWorker: vi.fn(() => Promise.resolve({
    recognize: vi.fn(() => Promise.resolve({
      data: { text: 'Mock extracted text' }
    })),
    terminate: vi.fn()
  }))
}));

// Create typed mocks for better type safety
const mockTextProcessingService = vi.mocked(TextProcessingService);
const mockLanguageDetectionService = vi.mocked(LanguageDetectionService);
const mockOCRCacheManager = vi.mocked(OCRCacheManager);
const mockBackgroundLanguageLoader = vi.mocked(BackgroundLanguageLoader);

describe('OCROrchestrator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup default mocks

    mockTextProcessingService.processText = vi.fn().mockResolvedValue({
      processedText: 'Processed mock text',
      processingTime: 50,
      language: 'eng',
      appliedProcessors: ['english-processing', 'universal-preservation']
    });

    mockLanguageDetectionService.detectLanguage = vi.fn().mockResolvedValue(['eng']);

    mockOCRCacheManager.initializeWorker = vi.fn().mockResolvedValue({
      recognize: vi.fn().mockResolvedValue({
        data: { text: 'Mock extracted text' }
      })
    });

    mockOCRCacheManager.getCachedWorker = vi.fn().mockReturnValue({
      useCount: 1
    });

    mockOCRCacheManager.getCacheStats = vi.fn().mockReturnValue({
      cachedWorkers: 2,
      totalCacheHits: 5
    });

    mockBackgroundLanguageLoader.isEnabled = vi.fn().mockReturnValue(true);
    mockBackgroundLanguageLoader.isLanguageReady = vi.fn().mockReturnValue(false);
    mockBackgroundLanguageLoader.getLoadedWorker = vi.fn().mockReturnValue(null);
    mockBackgroundLanguageLoader.getStats = vi.fn().mockReturnValue({
      total: 5,
      ready: 2,
      loading: 1,
      pending: 2
    });
  });

  describe('extractText', () => {
    it('should orchestrate full OCR workflow successfully', async () => {
      const mockImage = new File(['test'], 'test.png', { type: 'image/png' });
      
      const result = await OCROrchestrator.extractText(mockImage);

      expect(result.text).toBe('Processed mock text');
      expect(result.detectedLanguages).toEqual(['eng']);
      expect(result.extractionTime).toBeGreaterThan(0);
      expect(result.processingTime).toBe(50);
      expect(result.totalTime).toBeGreaterThan(0);
      expect(result.appliedProcessors).toContain('english-processing');
      expect(result.performanceMetrics).toHaveProperty('languageDetectionMs');
      expect(result.performanceMetrics).toHaveProperty('workerInitializationMs');
      expect(result.performanceMetrics).toHaveProperty('ocrExtractionMs');
      expect(result.performanceMetrics).toHaveProperty('textProcessingMs');
    });

    it('should use specified languages when autoDetect is false', async () => {
      const mockImage = new File(['test'], 'test.png', { type: 'image/png' });
      const options = {
        autoDetect: false,
        languages: ['fra', 'deu'] as OCRLanguage[]
      };

      const result = await OCROrchestrator.extractText(mockImage, options);

      expect(result.detectedLanguages).toEqual(['fra', 'deu']); // Languages should preserve order when specified
      
      expect(mockLanguageDetectionService.detectLanguage).not.toHaveBeenCalled();
    });

    it('should prioritize primary language when specified', async () => {
      mockLanguageDetectionService.detectLanguage.mockResolvedValue(['eng', 'fra', 'deu']);

      const mockImage = new File(['test'], 'test.png', { type: 'image/png' });
      const options = {
        primaryLanguage: 'fra' as OCRLanguage
      };

      const result = await OCROrchestrator.extractText(mockImage, options);

      expect(result.detectedLanguages[0]).toBe('fra'); // Primary language should be first
      expect(result.detectedLanguages).toContain('eng');
      expect(result.detectedLanguages).toContain('deu');
    });

    it('should use background loader when available', async () => {
      const mockBgWorker = {
        recognize: vi.fn().mockResolvedValue({
          data: { text: 'Background loader text' }
        })
      };

      mockBackgroundLanguageLoader.isLanguageReady.mockReturnValue(true);
      mockBackgroundLanguageLoader.getLoadedWorker.mockReturnValue(mockBgWorker);

      const mockImage = new File(['test'], 'test.png', { type: 'image/png' });
      const result = await OCROrchestrator.extractText(mockImage);

      expect(result.backgroundLoaderUsed).toBe(true);
      expect(mockBgWorker.recognize).toHaveBeenCalledWith(mockImage);
    });

    it('should handle errors gracefully with fallback', async () => {
      mockLanguageDetectionService.detectLanguage.mockRejectedValue(new Error('Detection failed'));

      const mockImage = new File(['test'], 'test.png', { type: 'image/png' });
      const result = await OCROrchestrator.extractText(mockImage);

      // Language detection fails but OCR still succeeds with fallback language
      expect(result.text).toBe('Processed mock text');
      expect(result.appliedProcessors).toContain('english-processing');
      expect(result.detectedLanguages).toEqual(['eng']); // Fallback language used
    });

    it('should pass text processing options correctly', async () => {
      const mockImage = new File(['test'], 'test.png', { type: 'image/png' });
      const options = {
        textProcessing: {
          applyLegalTermFixes: false,
          enhancedPunctuation: true
        }
      };

      await OCROrchestrator.extractText(mockImage, options);

      expect(mockTextProcessingService.processText).toHaveBeenCalledWith(
        'Mock extracted text',
        ['eng'],
        options.textProcessing
      );
    });

    it('should disable performance tracking when requested', async () => {
      // Clear performance history before test
      OCROrchestrator.clearPerformanceHistory();
      
      const mockImage = new File(['test'], 'test.png', { type: 'image/png' });
      const options = {
        performanceTracking: false
      };

      const result = await OCROrchestrator.extractText(mockImage, options);

      // Should still return performance metrics but not record them internally
      expect(result.performanceMetrics).toBeDefined();
      expect(OCROrchestrator.getPerformanceStats().recentExtractions).toBe(0);
    });
  });

  describe('Performance and Health Monitoring', () => {
    it('should return performance statistics', () => {
      const stats = OCROrchestrator.getPerformanceStats();

      expect(stats).toHaveProperty('cacheStats');
      expect(stats).toHaveProperty('backgroundLoaderStats');
      expect(stats).toHaveProperty('recentExtractions');
      expect(stats).toHaveProperty('averageExtractionTime');
      expect(stats).toHaveProperty('averageProcessingTime');
    });

    it('should return health status', async () => {
      const health = await OCROrchestrator.getHealthStatus();

      expect(health.status).toMatch(/healthy|degraded|unhealthy/);
      expect(health.services).toHaveProperty('textProcessing');
      expect(health.services).toHaveProperty('languageDetection');
      expect(health.services).toHaveProperty('cacheManager');
      expect(health.services).toHaveProperty('backgroundLoader');
      expect(health.performance).toHaveProperty('averageExtractionTime');
      expect(health.performance).toHaveProperty('cacheHitRate');
      expect(health.performance).toHaveProperty('backgroundLoaderUsage');
    });

    it('should report healthy status when all services available', async () => {
      const health = await OCROrchestrator.getHealthStatus();

      expect(health.status).toBe('healthy');
      expect(health.services.textProcessing).toBe(true);
      expect(health.services.languageDetection).toBe(true);
      expect(health.services.cacheManager).toBe(true);
      expect(health.services.backgroundLoader).toBe(true);
    });

    it('should report degraded status when background loader disabled', async () => {
      mockBackgroundLanguageLoader.isEnabled.mockReturnValue(false);

      const health = await OCROrchestrator.getHealthStatus();

      expect(health.status).toBe('degraded');
      expect(health.services.backgroundLoader).toBe(false);
    });
  });

  describe('Background Services Management', () => {
    it('should start background services', async () => {
      mockBackgroundLanguageLoader.startBackgroundLoading = vi.fn().mockResolvedValue(undefined);

      await OCROrchestrator.startBackgroundServices();

      expect(mockBackgroundLanguageLoader.startBackgroundLoading).toHaveBeenCalled();
    });

    it('should stop background services', () => {
      mockBackgroundLanguageLoader.stopBackgroundLoading = vi.fn();

      OCROrchestrator.stopBackgroundServices();

      expect(mockBackgroundLanguageLoader.stopBackgroundLoading).toHaveBeenCalled();
    });

    it('should cleanup resources', () => {
      mockBackgroundLanguageLoader.stopBackgroundLoading = vi.fn();

      OCROrchestrator.cleanup();

      expect(mockBackgroundLanguageLoader.stopBackgroundLoading).toHaveBeenCalled();
    });
  });

  describe('getSupportedLanguages', () => {
    it('should return array of supported languages', () => {
      const supportedLanguages = OCROrchestrator.getSupportedLanguages();
      
      expect(Array.isArray(supportedLanguages)).toBe(true);
      expect(supportedLanguages.length).toBeGreaterThan(0);
      expect(supportedLanguages).toContain('eng');
    });
  });
});
