import React, { useEffect, useState, useRef } from 'react';
import { AlertCircle, CheckCircle, GripHorizontal } from 'lucide-react';
import { useComparison } from '../hooks/useComparison';
import { TextInputPanel } from './TextInputPanel';
import { RedlineOutput } from './RedlineOutput';
import { ProcessingDisplay } from './ProcessingDisplay';
import { OutputLayout } from './OutputLayout';
import { OCRFeatureCard } from './OCRFeatureCard';
import { PerformanceDemoCard } from './PerformanceDemoCard';
import { DesktopControlsPanel } from './DesktopControlsPanel';
import { MobileControlsPanel } from './MobileControlsPanel';
import { DesktopInputLayout } from './DesktopInputLayout';
import { MobileInputLayout } from './MobileInputLayout';
// Background Loading Status
import { BackgroundLoadingStatus } from './BackgroundLoadingStatus';
// Resize and scroll handlers
import { useResizeHandlers } from '../hooks/useResizeHandlers';
import { useScrollSync } from '../hooks/useScrollSync';

import { BaseComponentProps } from '../types/components';

interface ComparisonInterfaceProps extends BaseComponentProps {
  showAdvancedOcrCard?: boolean;
  showPerformanceDemoCard?: boolean;
}

export const ComparisonInterface: React.FC<ComparisonInterfaceProps> = ({
  showAdvancedOcrCard = true,
  showPerformanceDemoCard = true,
  style,
  className,
}) => {
  
  
  const {
    originalText,
    revisedText,
    result,
    isProcessing,
    error,
    setOriginalText,
    setRevisedText,
    compareDocuments,
    resetComparison,
    quickCompareEnabled,
    toggleQuickCompare,
    chunkingProgress,
    // SSMR: Cancellation support
    cancelComparison,
    isCancelling,
    // System Protection for stress testing
    systemProtectionEnabled,
    toggleSystemProtection
  } = useComparison();
  
  

  const redlineOutputRef = useRef<HTMLDivElement>(null);

  const [copySuccess, setCopySuccess] = React.useState(false);
  
  // SSMR Step 1: Scroll lock state (Safe - no functionality yet)
  const [isScrollLocked, setIsScrollLocked] = useState(false);
  
  // DEBUG: Immediate logging to verify component initialization
  console.log('🔧 SCROLL LOCK DEBUG: Component initialized, isScrollLocked:', isScrollLocked);
  
  // SSMR STEP 6: Extracted scroll sync logic into custom hook
  const {
    scrollRefs,
    updateScrollRefs,
    syncScroll
  } = useScrollSync({
    isScrollLocked,
    outputRef: redlineOutputRef
  });
  
  // SSMR STEP 6: Scroll sync logic now handled by useScrollSync hook
  // Test element detection when scroll lock state changes (safe testing)
  // TIMING FIX: Also update when result changes so scroll lock works if already on before output
  useEffect(() => {
    console.log('🔧 SCROLL LOCK DEBUG: useEffect triggered - updating refs. Triggers:', {
      isScrollLocked,
      hasResult: !!result,
      resultChanges: result?.changes?.length || 0
    });
    // Only run element detection for testing purposes (no event listeners yet)
    updateScrollRefs();
  }, [isScrollLocked, updateScrollRefs, result]);
  
  // SSMR FIX: CSS-based resize to prevent React re-renders
  // SAFE: Fallback to React state if CSS manipulation fails
  // MODULAR: Can be disabled by setting USE_CSS_RESIZE = false
  // REVERSIBLE: Easy rollback to React state
  const USE_CSS_RESIZE = true; // ROLLBACK: Set to false to use React state
  
  // SSMR STEP 5: Extracted resize logic into custom hook
  const {
    panelResizeHandlers,
    outputResizeHandlers,
    panelHeight,
    outputHeight,
    setPanelHeightCSS,
    setOutputHeightCSS
  } = useResizeHandlers({
    USE_CSS_RESIZE,
    minHeight: 200,
    minOutputHeight: 300
  });
  
  // Local refs for resize handles (not managed by hook)
  const desktopResizeHandleRef = useRef<HTMLDivElement>(null);
  const mobileResizeHandleRef = useRef<HTMLDivElement>(null);
  
  
  // FIX: Apply output height CSS constraint when result changes
  useEffect(() => {
    if (result && USE_CSS_RESIZE) {
      // Apply proper height constraint after new comparison result
      // Use setTimeout to ensure DOM is ready after component renders
      setTimeout(() => {
        setOutputHeightCSS(500); // Reset to default constrained height
      }, 10);
    }
  }, [result, USE_CSS_RESIZE, setOutputHeightCSS]);

  // Keyboard shortcuts and global cancellation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        // Global ESC key cancellation - highest priority
        if (e.key === 'Escape') {
          e.preventDefault();
          e.stopPropagation();
          if (isProcessing && !isCancelling) {
            cancelComparison();
          }
          return;
        }
      
      // Ctrl+Enter comparison shortcut
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        compareDocuments();
      }
    };

    // Use capture phase for ESC to ensure it works regardless of focus
    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [compareDocuments, isProcessing, isCancelling, cancelComparison]);

  const handleCopy = () => {
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleLoadTest = (originalText: string, revisedText: string) => {
    // SSMR: Clear inputs first to prevent persistence issues
    setOriginalText('');
    setRevisedText('');
    
    // Cancel any ongoing operations
    if (isProcessing) {
      cancelComparison();
    }
    
    // Use setTimeout to ensure state is cleared before loading new content
    setTimeout(() => {
      setOriginalText(originalText);
      setRevisedText(revisedText);
      
      // Auto-compare if enabled - use manual operation flag to ensure cancellation works
      if (quickCompareEnabled) {
        setTimeout(() => {
          compareDocuments(false, true, originalText, revisedText);
        }, 200);
      }
    }, 100);
  };
  
  // SSMR STEP 5: Mouse handlers now provided by useResizeHandlers hook

  const handleSwapContent = () => {
    const tempOriginal = originalText;
    setOriginalText(revisedText);
    setRevisedText(tempOriginal);
  };

  return (
    <div className="comparison-interface-container">
      {/* Test Suite - DISABLED FOR PRODUCTION */}
      {/* <TestSuite onLoadTest={handleLoadTest} /> */}

      {/* Advanced Test Suite - Segregated Testing Module - DISABLED FOR PRODUCTION */}
      {/* <AdvancedTestSuite onLoadTest={handleLoadTest} /> */}

      {/* Extreme Test Suite - Ultra-Complex Testing Module - DISABLED FOR PRODUCTION */}
      {/* <ExtremeTestSuite onLoadTest={handleLoadTest} /> */}

      {/* STEP 3b: Background Loading Status (Safe, Optional, Reversible) */}
      <BackgroundLoadingStatus 
        enabled={true} // ROLLBACK: Set to false to hide completely
        compact={true} 
        className="mb-4" 
      />
      
      
      {/* SSMR CHUNKING: Progress now shown in output area during processing */}
      
      
      {/* Enhanced OCR Feature Notice - Enhanced with glassmorphism */}
{showAdvancedOcrCard && <OCRFeatureCard visible={true} />}

      {/* Demo Performance Test Buttons */}
      <PerformanceDemoCard 
        visible={showPerformanceDemoCard}
        onLoadTest={handleLoadTest}
      />


      {/* Input Section with Centered Swap Button - Enhanced with glassmorphism */}
      <div className="relative mb-8">
        {/* Desktop Input Layout Component */}
        <DesktopInputLayout
          originalText={originalText}
          revisedText={revisedText}
          isProcessing={isProcessing}
          panelHeight={panelHeight}
          USE_CSS_RESIZE={USE_CSS_RESIZE}
          onOriginalTextChange={(value: string, isPasteAction?: boolean) => setOriginalText(value, isPasteAction)}
          onRevisedTextChange={(value: string, isPasteAction?: boolean) => setRevisedText(value, isPasteAction)}
          panelResizeHandlers={panelResizeHandlers}
          desktopResizeHandleRef={desktopResizeHandleRef}
        />
        
        {/* Mobile Input Layout Component */}
        <MobileInputLayout
          originalText={originalText}
          revisedText={revisedText}
          isProcessing={isProcessing}
          panelHeight={panelHeight}
          USE_CSS_RESIZE={USE_CSS_RESIZE}
          onOriginalTextChange={(value: string, isPasteAction?: boolean) => setOriginalText(value, isPasteAction)}
          onRevisedTextChange={(value: string, isPasteAction?: boolean) => setRevisedText(value, isPasteAction)}
          panelResizeHandlers={panelResizeHandlers}
          mobileResizeHandleRef={mobileResizeHandleRef}
        />


        {/* Consolidated Vertical Controls Panel - Centered between input panels */}
        <DesktopControlsPanel
          quickCompareEnabled={quickCompareEnabled}
          isScrollLocked={isScrollLocked}
          systemProtectionEnabled={systemProtectionEnabled}
          isProcessing={isProcessing}
          originalText={originalText}
          revisedText={revisedText}
          onCompare={() => compareDocuments()}
          onToggleQuickCompare={toggleQuickCompare}
          onSwapContent={handleSwapContent}
          onToggleScrollLock={() => {
            console.log('🔧 SCROLL LOCK DEBUG: Button clicked, toggling from', isScrollLocked, 'to', !isScrollLocked);
            setIsScrollLocked(!isScrollLocked);
          }}
          onToggleSystemProtection={toggleSystemProtection}
          onResetComparison={resetComparison}
        />

        {/* Mobile Controls - Enhanced with all operation buttons */}
        <MobileControlsPanel
          quickCompareEnabled={quickCompareEnabled}
          isScrollLocked={isScrollLocked}
          isProcessing={isProcessing}
          originalText={originalText}
          revisedText={revisedText}
          onCompare={() => compareDocuments()}
          onToggleQuickCompare={toggleQuickCompare}
          onSwapContent={handleSwapContent}
          onToggleScrollLock={() => setIsScrollLocked(!isScrollLocked)}
          onResetComparison={resetComparison}
        />
      </div>


      {/* Error and Success Messages */}
      {error && (
        <div className="mt-3 flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}
      
      {copySuccess && (
        <div className="mt-3 flex items-center gap-2 text-theme-secondary-600 text-sm">
          <CheckCircle className="w-4 h-4" />
          Redlined text copied to clipboard!
        </div>
      )}

      {(result || (isProcessing && chunkingProgress.enabled && chunkingProgress.isChunking)) && (
        <>
          {isProcessing && chunkingProgress.enabled && chunkingProgress.isChunking && (
            <ProcessingDisplay 
              chunkingProgress={chunkingProgress} 
              isCancelling={isCancelling} 
              onCancel={cancelComparison} 
            />
          )}
          {result && !isProcessing && (
            <OutputLayout
              changes={result.changes}
              stats={result.stats}
              USE_CSS_RESIZE={USE_CSS_RESIZE}
              outputHeight={outputHeight}
              onCopy={handleCopy}
              outputResizeHandlers={outputResizeHandlers}
              scrollRef={redlineOutputRef}
            />
          )}
        </>
      )}

    </div>
  );
};
