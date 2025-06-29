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
  
  // Flag to prevent auto-compare interference during manual operations
  const manualOperationRef = useRef(false);
  
  // SSMR CHUNKING: Add separate progress tracking for large text processing
  // MODULAR: Separate from existing isProcessing state
  // REVERSIBLE: Can be disabled by setting enabled=false
  const [chunkingProgress, setChunkingProgress] = useState({
    progress: 0,
    stage: '',
    isChunking: false,
    enabled: true // ROLLBACK: Set to false to disable chunking progress
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

  const compareDocuments = useCallback(async (isAutoCompare = false, preserveFocus = true, overrideOriginal?: string, overrideRevised?: string) => {
    // Prevent concurrent operations
    if (isAutoCompare && manualOperationRef.current) {
      console.log('⚠️ Auto-compare blocked - manual operation in progress');
      return;
    }
    
    // Set manual operation flag if overrides are provided
    if (overrideOriginal || overrideRevised) {
      manualOperationRef.current = true;
      console.log('🔒 Manual operation started - blocking auto-compare');
    }
    // PHASE 1 DEBUG: Track duplicate calls
    const callId = Math.random().toString(36).substr(2, 9);
    console.log(`🔍 CALL START [${callId}] compareDocuments called:`, {
      isAutoCompare,
      preserveFocus,
      originalLength: state.originalText.length,
      revisedLength: state.revisedText.length,
      timestamp: new Date().toISOString()
    });
    
    // Use override texts if provided, otherwise use state
    const actualOriginal = overrideOriginal ?? state.originalText;
    const actualRevised = overrideRevised ?? state.revisedText;
    
    // DEBUG: Critical state validation at start of comparison
    console.log('🚨 CRITICAL STATE DEBUG at compareDocuments start:', {
      stateOriginalLength: state.originalText.length,
      stateRevisedLength: state.revisedText.length,
      actualOriginalLength: actualOriginal.length,
      actualRevisedLength: actualRevised.length,
      overrideOriginal: !!overrideOriginal,
      overrideRevised: !!overrideRevised,
      stateOriginalFirst100: state.originalText.substring(0, 100),
      stateRevisedFirst100: state.revisedText.substring(0, 100),
      actualOriginalFirst100: actualOriginal.substring(0, 100),
      actualRevisedFirst100: actualRevised.substring(0, 100),
      stateExists: !!state,
      stateKeys: Object.keys(state)
    });
    
    // Capture current focus before comparison
    if (preserveFocus) {
      captureFocus();
    }
    setState(prev => {
      if (!actualOriginal.trim() || !actualRevised.trim()) {
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
      
      // SSMR CHUNKING: Progress callback for large text processing
      // SAFE: Always create callback, use functional update to avoid stale closure
      // MODULAR: Define callback to avoid closure issues
      const progressCallback = (progress: number, stage: string) => {
        console.log(`🔄 CHUNKING PROGRESS: ${progress}% - ${stage}`); // Debug log
        setChunkingProgress(prev => {
          console.log('🎯 Progress callback setState called:', { progress, stage, prevEnabled: prev.enabled });
          if (!prev.enabled) {
            console.log('⚠️ Progress callback called but chunking disabled');
            return prev; // Don't update if disabled
          }
          const newState = {
            ...prev,
            progress,
            stage,
            isChunking: progress > 0 && progress < 100
          };
          console.log('🚀 Updating chunking progress state:', newState);
          return newState;
        });
      };
      
      console.log('🧪 Starting comparison with progressCallback:', !!progressCallback); // Debug log
      console.log('🔍 About to call MyersAlgorithm.compare with args:', {
        originalLength: state.originalText.length,
        revisedLength: state.revisedText.length,
        hasProgressCallback: !!progressCallback
      });
      
      // PRIORITY 3A: Handle async MyersAlgorithm.compare for streaming support
      console.log('🔬 About to call async MyersAlgorithm.compare...'); // Debug log
      
      // DEBUG: Log the exact texts being compared
      console.log('🔍 USECOMPARISON DEBUG - Texts being passed to algorithm:', {
        originalLength: actualOriginal.length,
        revisedLength: actualRevised.length,
        originalFirst50: actualOriginal.substring(0, 50),
        revisedFirst50: actualRevised.substring(0, 50),
        originalLast50: actualOriginal.substring(Math.max(0, actualOriginal.length - 50)),
        revisedLast50: actualRevised.substring(Math.max(0, actualRevised.length - 50)),
        areTextsIdentical: actualOriginal === actualRevised
      });
      
      // Use actual texts for comparison (either from state or overrides)
      const result = await MyersAlgorithm.compare(actualOriginal, actualRevised, progressCallback);
      console.log('✅ MyersAlgorithm.compare completed, result:', result);
      console.log('🔍 Result structure:', {
        hasResult: !!result,
        hasChanges: !!(result?.changes),
        changesLength: result?.changes?.length,
        hasStats: !!(result?.stats),
        resultKeys: result ? Object.keys(result) : 'no result',
        fullResult: result
      });
      
      // CRITICAL: Test if result is valid for UI
      if (result && result.changes && result.changes.length > 0) {
        console.log('✅ RESULT IS VALID FOR UI - has changes:', result.changes.length);
        console.log('✅ First few changes:', result.changes.slice(0, 3));
      } else {
        console.log('❌ RESULT IS NOT VALID FOR UI:', {
          hasResult: !!result,
          hasChanges: !!(result?.changes),
          changesLength: result?.changes?.length
        });
      }
      
      // 🎯 CRITICAL PERFORMANCE LOGGING FOR STATE UPDATE THAT CAUSES LAG
      console.log('🚨 ABOUT TO UPDATE STATE WITH RESULT - THIS MAY CAUSE LAG');
      const stateUpdateStartTime = performance.now();
      
      setState(prev => {
        console.log('🔬 Inside setState, updating with result...');
        console.log('🔍 Previous state result:', !!prev.result);
        console.log('🔍 New result being set:', !!result);
        console.log('🎯 STATE UPDATE START TIME:', stateUpdateStartTime);
        
        // TESTING: Keep progress bar visible for debugging
        // TODO: Restore auto-hide after testing
        // Using functional update to access current chunking state
        setChunkingProgress(prev => {
          console.log('🔧 Post-comparison chunking state update:', prev);
          if (prev.enabled) {
            // Comment out auto-hide for testing
            // setTimeout(() => {
            //   setChunkingProgress({
            //     progress: 0,
            //     stage: '',
            //     isChunking: false,
            //     enabled: true
            //   });
            // }, 1500);
          }
          return prev; // No change for now
        });
        
        const newState = {
          ...prev,
          result,
          isProcessing: false
        };
        
        console.log('🔍 New state being returned:', {
          hasResult: !!newState.result,
          isProcessing: newState.isProcessing,
          error: newState.error
        });
        
        const stateUpdateEndTime = performance.now();
        console.log('🎯 STATE UPDATE COMPLETED:', {
          stateDuration: (stateUpdateEndTime - stateUpdateStartTime).toFixed(2) + 'ms',
          endTime: stateUpdateEndTime
        });
        
        return newState;
      });
      
      const postStateUpdateTime = performance.now();
      console.log('🚨 POST-STATE UPDATE TIME:', {
        totalPostAlgorithmTime: (postStateUpdateTime - stateUpdateStartTime).toFixed(2) + 'ms',
        timestamp: postStateUpdateTime
      });
      
      // Restore focus after comparison completes
      if (preserveFocus) {
        restoreFocus();
      }
      
      // Clear manual operation flag after completion
      if (overrideOriginal || overrideRevised) {
        setTimeout(() => {
          manualOperationRef.current = false;
          console.log('🔓 Manual operation completed - auto-compare re-enabled');
        }, 500); // Give enough time for any pending auto-compare calls to be blocked
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'An error occurred while comparing documents. Please try again.',
        isProcessing: false
      }));
      
      // SAFE: Reset chunking progress on error
      setChunkingProgress(prev => {
        if (prev.enabled) {
          return {
            progress: 0,
            stage: '',
            isChunking: false,
            enabled: true
          };
        }
        return prev;
      });
      
      // Restore focus even on error
      if (preserveFocus) {
        restoreFocus();
      }
      
      // Clear manual operation flag even on error
      if (overrideOriginal || overrideRevised) {
        manualOperationRef.current = false;
        console.log('🔓 Manual operation failed - auto-compare re-enabled');
      }
    }
  }, [state, captureFocus, restoreFocus]); // Added state to dependencies to ensure fresh state is captured

  // Simplified auto-compare trigger - handles all real-time updates when enabled
  const triggerAutoCompare = useCallback((originalText: string, revisedText: string, isPasteAction = false) => {
    console.log('🔍 triggerAutoCompare called:', { quickCompareEnabled, originalLength: originalText.length, revisedLength: revisedText.length });
    
    // Don't trigger auto-compare if manual operation is in progress
    if (manualOperationRef.current) {
      console.log('⚠️ Auto-compare blocked by manual operation');
      return;
    }
    
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
        // Double-check that manual operation isn't in progress when timeout fires
        if (manualOperationRef.current) {
          console.log('⚠️ Auto-compare timeout blocked by manual operation');
          return;
        }
        
        lastCompareInputRef.current = currentInput;
        
        // Handle different scenarios:
        if (original && revised && original.length > 1 && revised.length > 1) {
          // Both fields have meaningful content - do comparison with explicit texts
          // CRITICAL: Pass the explicit texts to avoid stale state closure issues
          compareDocuments(true, true, originalText, revisedText);
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
    console.log('📝 setOriginalText called:', { textLength: text.length, isPasteAction, quickCompareEnabled });
    console.log('📝 setOriginalText - text preview:', text.substring(0, 100));
    setState(prev => {
      console.log('📝 setOriginalText - prev state:', {
        prevOriginalLength: prev.originalText.length,
        prevRevisedLength: prev.revisedText.length
      });
      const newState = { ...prev, originalText: text, error: null };
      console.log('📝 setOriginalText - new state:', {
        newOriginalLength: newState.originalText.length,
        newRevisedLength: newState.revisedText.length
      });
      
      // Trigger auto-compare for ALL changes when enabled (typing, pasting, OCR)
      if (quickCompareEnabled) {
        console.log('⚡ Auto-compare enabled, triggering...');
        // Use setTimeout to ensure state is updated first
        setTimeout(() => {
          triggerAutoCompare(text, newState.revisedText || prev.revisedText, isPasteAction);
        }, 0);
      } else {
        console.log('❌ Auto-compare disabled');
      }
      
      return newState;
    });
  }, [quickCompareEnabled, triggerAutoCompare]);

  const setRevisedText = useCallback((text: string, isPasteAction = false) => {
    console.log('📝 setRevisedText called:', { textLength: text.length, isPasteAction, quickCompareEnabled });
    console.log('📝 setRevisedText - text preview:', text.substring(0, 100));
    setState(prev => {
      console.log('📝 setRevisedText - prev state:', {
        prevOriginalLength: prev.originalText.length,
        prevRevisedLength: prev.revisedText.length
      });
      const newState = { ...prev, revisedText: text, error: null };
      console.log('📝 setRevisedText - new state:', {
        newOriginalLength: newState.originalText.length,
        newRevisedLength: newState.revisedText.length
      });
      
      // Trigger auto-compare for ALL changes when enabled (typing, pasting, OCR)
      if (quickCompareEnabled) {
        console.log('⚡ Auto-compare enabled, triggering...');
        // Use setTimeout to ensure state is updated first
        setTimeout(() => {
          triggerAutoCompare(newState.originalText || prev.originalText, text, isPasteAction);
        }, 0);
      } else {
        console.log('❌ Auto-compare disabled');
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
    toggleQuickCompare,
    // SSMR CHUNKING: Export chunking progress state
    // MODULAR: Separate namespace to avoid conflicts
    chunkingProgress: {
      progress: chunkingProgress.progress,
      stage: chunkingProgress.stage,
      isChunking: chunkingProgress.isChunking,
      enabled: chunkingProgress.enabled
    }
  };
};
