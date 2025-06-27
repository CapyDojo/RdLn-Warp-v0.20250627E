import { useState, useCallback } from 'react';
import { OCRService, OCROptions, OCRLanguage, SUPPORTED_LANGUAGES } from '../utils/OCRService';

export interface OCRState {
  isProcessing: boolean;
  progress: number;
  error: string | null;
  detectedLanguages: OCRLanguage[];
  selectedLanguages: OCRLanguage[];
  autoDetect: boolean;
}

export const useOCR = () => {
  const [state, setState] = useState<OCRState>({
    isProcessing: false,
    progress: 0,
    error: null,
    detectedLanguages: [],
    selectedLanguages: ['eng'],
    autoDetect: true
  });

  const setSelectedLanguages = useCallback((languages: OCRLanguage[]) => {
    setState(prev => ({ ...prev, selectedLanguages: languages }));
  }, []);

  const setAutoDetect = useCallback((autoDetect: boolean) => {
    setState(prev => ({ ...prev, autoDetect }));
  }, []);

  const extractTextFromImage = useCallback(async (imageFile: File | Blob): Promise<string> => {
    setState(prev => ({
      ...prev,
      isProcessing: true,
      progress: 0,
      error: null,
      detectedLanguages: []
    }));

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setState(prev => ({
          ...prev,
          progress: Math.min(prev.progress + 5, 85)
        }));
      }, 300);

      const options: OCROptions = {
        autoDetect: state.autoDetect,
        languages: state.autoDetect ? undefined : state.selectedLanguages,
        primaryLanguage: state.selectedLanguages[0]
      };

      // If auto-detect is enabled, first detect languages
      let detectedLanguages: OCRLanguage[] = [];
      if (state.autoDetect) {
        setState(prev => ({ ...prev, progress: 20 }));
        detectedLanguages = await OCRService.detectLanguage(imageFile);
        setState(prev => ({ 
          ...prev, 
          progress: 40,
          detectedLanguages 
        }));
      }

      const extractedText = await OCRService.extractTextFromImage(imageFile, options);
      
      clearInterval(progressInterval);
      
      setState(prev => ({
        ...prev,
        isProcessing: false,
        progress: 100,
        error: null,
        detectedLanguages: state.autoDetect ? detectedLanguages : []
      }));

      // Reset progress after a short delay
      setTimeout(() => {
        setState(prev => ({ ...prev, progress: 0 }));
      }, 1500);

      return extractedText;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isProcessing: false,
        progress: 0,
        error: error instanceof Error ? error.message : 'OCR processing failed'
      }));
      throw error;
    }
  }, [state.autoDetect, state.selectedLanguages]);

  const resetOCRState = useCallback(() => {
    setState(prev => ({
      ...prev,
      isProcessing: false,
      progress: 0,
      error: null,
      detectedLanguages: []
    }));
  }, []);

  // New function to clear detected languages when content is cleared
  const clearDetectedLanguages = useCallback(() => {
    setState(prev => ({
      ...prev,
      detectedLanguages: []
    }));
  }, []);

  return {
    ...state,
    extractTextFromImage,
    resetOCRState,
    clearDetectedLanguages,
    setSelectedLanguages,
    setAutoDetect,
    supportedLanguages: SUPPORTED_LANGUAGES
  };
};