import { useState, useCallback, useEffect, useRef } from 'react';
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

  // Auto-Compare settings
  const [quickCompareEnabled, setQuickCompareEnabled] = useState(() => {
    // Default to enabled for better UX, but respect user preference if stored
    const stored = localStorage.getItem('rdln-auto-compare-enabled');
    return stored === null ? true : stored === 'true';
  });
  
  // Remove separate live typing state - it's now part of Auto-Compare
  
  // Debounce timer for auto-compare
  const autoCompareTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastCompareInputRef = useRef<string>('');
  
  // Focus preservation for all comparisons
  const preserveFocusRef = useRef<{ element: HTMLElement | null, selectionStart: number, selectionEnd: number } | null>(null);
  
  // Utility functions for focus preservation
  const captureFocus = useCallback(() => {
    const activeElement = document.activeElement as HTMLTextAreaElement;
    if (activeElement && activeElement.tagName === 'TEXTAREA') {
      preserveFocusRef.current = {
        element: activeElement,
        selectionStart: activeElement.selectionStart || 0,
        selectionEnd: activeElement.selectionEnd || 0
      };
    }
  }, []);
  
  const restoreFocus = useCallback(() => {
    if (preserveFocusRef.current && preserveFocusRef.current.element) {
      const { element, selectionStart, selectionEnd } = preserveFocusRef.current;
      // Use setTimeout to ensure DOM updates are complete
      setTimeout(() => {
        try {
          element.focus();
          if (element instanceof HTMLTextAreaElement) {
            element.setSelectionRange(selectionStart, selectionEnd);
          }
        } catch (error) {
          // Silently handle any focus restoration errors
          console.warn('Focus restoration failed:', error);
        }
      }, 0);
    }
  }, []);

  const compareDocuments = useCallback(async (isAutoCompare = false, preserveFocus = true) => {
    // Capture current focus before comparison
    if (preserveFocus) {
      captureFocus();
    }
    setState(prev => {
      if (!prev.originalText.trim() || !prev.revisedText.trim()) {
        return { 
          ...prev, 
          error: 'Please enter both original and revised text to compare.' 
        };
      }
      return { ...prev, isProcessing: true, error: null };
    });

    try {
      // Add small delay to show processing state
      // Shorter delay for auto-compare to feel more responsive
      await new Promise(resolve => setTimeout(resolve, isAutoCompare ? 50 : 100));
      
      setState(prev => {
        const result = MyersAlgorithm.compare(prev.originalText, prev.revisedText);
        return {
          ...prev,
          result,
          isProcessing: false
        };
      });
      
      // Restore focus after comparison completes
      if (preserveFocus) {
        restoreFocus();
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'An error occurred while comparing documents. Please try again.',
        isProcessing: false
      }));
      
      // Restore focus even on error
      if (preserveFocus) {
        restoreFocus();
      }
    }
  }, [captureFocus, restoreFocus]);

  // Simplified auto-compare trigger - handles all real-time updates when enabled
  const triggerAutoCompare = useCallback((originalText: string, revisedText: string, isPasteAction = false) => {
    // Clear existing timeout
    if (autoCompareTimeoutRef.current) {
      clearTimeout(autoCompareTimeoutRef.current);
    }
    
    const original = originalText.trim();
    const revised = revisedText.trim();
    const currentInput = original + '|||' + revised;
    
    // Always update if content changed (including deletions that result in empty fields)
    if (currentInput !== lastCompareInputRef.current) {
      // Unified fast debouncing for all actions
      const delay = 200; // Fast response for all input types
      
      autoCompareTimeoutRef.current = setTimeout(() => {
        lastCompareInputRef.current = currentInput;
        
        // Handle different scenarios:
        if (original && revised && original.length > 1 && revised.length > 1) {
          // Both fields have meaningful content - do comparison
          compareDocuments(true);
        } else {
          // One or both fields are empty/too short - clear results
          setState(prev => ({
            ...prev,
            result: null,
            error: null
          }));
        }
      }, delay);
    }
  }, [compareDocuments, quickCompareEnabled]);

  const setOriginalText = useCallback((text: string, isPasteAction = false) => {
    setState(prev => {
      const newState = { ...prev, originalText: text, error: null };
      
      // Trigger auto-compare for ALL changes when enabled (typing, pasting, OCR)
      if (quickCompareEnabled) {
        // Use setTimeout to ensure state is updated first
        setTimeout(() => {
          triggerAutoCompare(text, newState.revisedText || prev.revisedText, isPasteAction);
        }, 0);
      }
      
      return newState;
    });
  }, [quickCompareEnabled, triggerAutoCompare]);

  const setRevisedText = useCallback((text: string, isPasteAction = false) => {
    setState(prev => {
      const newState = { ...prev, revisedText: text, error: null };
      
      // Trigger auto-compare for ALL changes when enabled (typing, pasting, OCR)
      if (quickCompareEnabled) {
        // Use setTimeout to ensure state is updated first
        setTimeout(() => {
          triggerAutoCompare(newState.originalText || prev.originalText, text, isPasteAction);
        }, 0);
      }
      
      return newState;
    });
  }, [quickCompareEnabled, triggerAutoCompare]);

  const resetComparison = useCallback(() => {
    // Clear any pending auto-compare
    if (autoCompareTimeoutRef.current) {
      clearTimeout(autoCompareTimeoutRef.current);
      autoCompareTimeoutRef.current = null;
    }
    
    lastCompareInputRef.current = '';
    
    setState({
      originalText: '',
      revisedText: '',
      result: null,
      isProcessing: false,
      error: null
    });
    
    // Clean up old live typing setting if it exists
    localStorage.removeItem('rdln-live-typing-enabled');
    
    // Also trigger a custom event to notify TextInputPanels to clear their language detection
    window.dispatchEvent(new CustomEvent('clearLanguageDetection'));
  }, []);

  // Toggle Auto-Compare and persist preference
  const toggleQuickCompare = useCallback(() => {
    const newValue = !quickCompareEnabled;
    setQuickCompareEnabled(newValue);
    localStorage.setItem('rdln-auto-compare-enabled', newValue.toString());
  }, [quickCompareEnabled]);
  

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (autoCompareTimeoutRef.current) {
        clearTimeout(autoCompareTimeoutRef.current);
      }
    };
  }, []);

  return {
    ...state,
    setOriginalText,
    setRevisedText,
    compareDocuments,
    resetComparison,
    quickCompareEnabled,
    toggleQuickCompare
  };
};
