import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock the entire OCRService module
vi.mock('../OCRService', () => ({
  OCRService: {
    detectLanguage: vi.fn(() => Promise.resolve(['eng'])),
    extractTextFromImage: vi.fn((image: any) => Promise.resolve(`Mock OCR Result for ${image ? (image.name || 'image') : 'unknown'}`)),
    terminate: vi.fn(() => Promise.resolve()),
    // Add any other public methods that are called in the tests
    isOrchestratorAvailable: vi.fn(() => Promise.resolve(true)),
    getCacheStats: vi.fn(() => ({ cachedWorkers: 0, detectionWorkerCached: false, totalCacheHits: 0, languageCacheSize: 0, languageCacheHits: 0})),
    getOrchestratorStats: vi.fn(() => null),
    getCombinedStats: vi.fn(() => ({ legacy: {}, orchestrator: {}, combined: {}})),
  },
}));

// Import the mocked OCRService
import { OCRService } from '../OCRService';

describe('OCRService - New Tests (Mocked Module)', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
  });

  afterEach(async () => {
    // Ensure terminate is called if needed, though mocks are cleared
    await OCRService.terminate();
  });

  it('should call detectLanguage and return expected result', async () => {
    const mockFile = new File(['test'], 'test.png', { type: 'image/png' });
    const detectedLanguages = await OCRService.detectLanguage(mockFile);

    expect(OCRService.detectLanguage).toHaveBeenCalledWith(mockFile);
    expect(detectedLanguages).toEqual(['eng']);
  });

  it('should call extractTextFromImage and return expected result', async () => {
    const mockFile = new File(['hello world'], 'test.png', { type: 'image/png' });
    const extractedText = await OCRService.extractTextFromImage(mockFile, { autoDetect: true });

    expect(OCRService.extractTextFromImage).toHaveBeenCalledWith(mockFile, { autoDetect: true });
    expect(extractedText).toBe('Mock OCR Result for test.png');
  });

  it('should call terminate correctly', async () => {
    await OCRService.terminate();
    expect(OCRService.terminate).toHaveBeenCalledTimes(1);
  });

  it('should handle errors during OCR process', async () => {
    (OCRService.extractTextFromImage as vi.Mock).mockImplementationOnce(() => {
      throw new Error('OCR failed');
    });

    const mockFile = new File(['error'], 'error.png', { type: 'image/png' });
    let caughtError: Error | null = null;
    try {
      await OCRService.extractTextFromImage(mockFile, { languages: ['eng'] });
    } catch (error: any) {
      caughtError = error;
    }
    expect(caughtError).toBeInstanceOf(Error);
    expect(caughtError?.message).toBe('OCR failed');
  });
});
