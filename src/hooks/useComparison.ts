import { useState, useCallback } from 'react';
import { MyersAlgorithm } from '../algorithms/MyersAlgorithm';
import { ComparisonState } from '../types';

export const useComparison = () => {
  const [state, setState] = useState<ComparisonState>({
    originalText: '',
    revisedText: '',
    result: null,
    isProcessing: false,
    error: null
  });

  const setOriginalText = useCallback((text: string) => {
    setState(prev => ({ ...prev, originalText: text, error: null }));
  }, []);

  const setRevisedText = useCallback((text: string) => {
    setState(prev => ({ ...prev, revisedText: text, error: null }));
  }, []);

  const compareDocuments = useCallback(async () => {
    if (!state.originalText.trim() || !state.revisedText.trim()) {
      setState(prev => ({ 
        ...prev, 
        error: 'Please enter both original and revised text to compare.' 
      }));
      return;
    }

    setState(prev => ({ ...prev, isProcessing: true, error: null }));

    try {
      // Add small delay to show processing state
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const result = MyersAlgorithm.compare(state.originalText, state.revisedText);
      
      setState(prev => ({
        ...prev,
        result,
        isProcessing: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'An error occurred while comparing documents. Please try again.',
        isProcessing: false
      }));
    }
  }, [state.originalText, state.revisedText]);

  const resetComparison = useCallback(() => {
    setState({
      originalText: '',
      revisedText: '',
      result: null,
      isProcessing: false,
      error: null
    });
    
    // Also trigger a custom event to notify TextInputPanels to clear their language detection
    window.dispatchEvent(new CustomEvent('clearLanguageDetection'));
  }, []);

  return {
    ...state,
    setOriginalText,
    setRevisedText,
    compareDocuments,
    resetComparison
  };
};