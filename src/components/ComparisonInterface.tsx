import React, { useEffect, useState, useRef, useCallback, startTransition } from 'react';
import { Play, RotateCcw, AlertCircle, CheckCircle, Image, Globe, ArrowLeftRight, Zap, ZapOff, GripHorizontal } from 'lucide-react';
import { useComparison } from '../hooks/useComparison';
import { TextInputPanel } from './TextInputPanel';
import { RedlineOutput } from './RedlineOutput';
import { ComparisonStats } from './ComparisonStats';
// Test suites commented out for production build optimization
// import { TestSuite } from './TestSuite';
// import { AdvancedTestSuite } from '../testing/AdvancedTestSuite';
// import { ExtremeTestSuite } from '../testing/ExtremeTestSuite';
// STEP 3: Background Loading Status (Safe, Modular, Reversible)
import { BackgroundLoadingStatus } from './BackgroundLoadingStatus';
// SSMR CHUNKING: Step 3 - Import chunking progress indicator
import { ChunkingProgressIndicator } from './ChunkingProgressIndicator';

export const ComparisonInterface: React.FC = () => {
  // Performance tracking (silent in production)
  const renderStartTime = performance.now();
  
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
  
  // SSMR: DISABLED result size monitoring - was causing resize lag
  // React.useEffect(() => {
  //   if (result) {
  //     console.log('📊 RESIZE DEBUG: Result object size:', {
  //       changesCount: result.changes?.length || 0,
  //       estimatedMemorySize: JSON.stringify(result).length,
  //       timestamp: performance.now()
  //     });
  //   }
  // }, [result]);
  
  // DEBUG: Log result changes (DISABLED during resize debugging)
  React.useEffect(() => {
    // console.log('🎨 ComparisonInterface - result changed:', {
    //   hasResult: !!result,
    //   resultType: typeof result,
    //   hasChanges: !!(result?.changes),
    //   changesLength: result?.changes?.length,
    //   resultKeys: result ? Object.keys(result) : 'no result'
    // });
  }, [result]);

  // CHUNKING DEBUG: Temporarily disabled to prevent infinite loops
  // React.useEffect(() => {
  //   console.log('🏗️ ComparisonInterface chunking state:', chunkingProgress);
  // }, [chunkingProgress.progress, chunkingProgress.stage, chunkingProgress.isChunking, chunkingProgress.enabled]);

  const [copySuccess, setCopySuccess] = React.useState(false);
  const [autoCompareCountdown, setAutoCompareCountdown] = React.useState(0);
  
  // SSMR FIX: CSS-based resize to prevent React re-renders
  // SAFE: Fallback to React state if CSS manipulation fails
  // MODULAR: Can be disabled by setting USE_CSS_RESIZE = false
  // REVERSIBLE: Easy rollback to React state
  const USE_CSS_RESIZE = true; // ROLLBACK: Set to false to use React state
  
  // Fallback React state (only used if CSS resize is disabled)
  const [panelHeight, setPanelHeight] = useState(400);
  const [outputHeight, setOutputHeight] = useState(500);
  
  // DOM refs for direct manipulation
  const inputPanelsRef = useRef<HTMLDivElement>(null);
  const outputPanelRef = useRef<HTMLDivElement>(null);
  const resizeHandleRef = useRef<HTMLDivElement>(null);
  const outputResizeHandleRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const isOutputDraggingRef = useRef(false);
  const dragStartY = useRef(0);
  const startHeight = useRef(0);
  const outputDragStartY = useRef(0);
  const outputStartHeight = useRef(0);
  const minHeight = 200;
  const minOutputHeight = 300;
  
  // CSS manipulation helpers
  const setPanelHeightCSS = useCallback((height: number) => {
    if (!USE_CSS_RESIZE) {
      setPanelHeight(height);
      return;
    }
    
    // Direct CSS manipulation of TextInputPanel inner content - no React re-render
    if (inputPanelsRef.current) {
      // Target the actual glass-panel-inner-content divs that have the height styling
      const innerContentElements = inputPanelsRef.current.querySelectorAll('.glass-panel-inner-content');
      innerContentElements.forEach(element => {
        (element as HTMLElement).style.height = `${height}px`;
      });
    }
  }, [USE_CSS_RESIZE]);
  
  const setOutputHeightCSS = useCallback((height: number) => {
    if (!USE_CSS_RESIZE) {
      setOutputHeight(height);
      return;
    }
    
    // Direct CSS manipulation - no React re-render
    if (outputPanelRef.current) {
      outputPanelRef.current.style.height = `${height}px`;
    }
  }, [USE_CSS_RESIZE]);
  
  // Initialize CSS heights on mount and pre-warm the system
  // Use a ref to track if pre-warming has completed to avoid double execution
  const preWarmingCompleted = useRef(false);
  
  useEffect(() => {
    if (USE_CSS_RESIZE) {
      // Set initial CSS heights to override any default React state
      setPanelHeightCSS(400);
      setOutputHeightCSS(500);
      
      // PRE-WARM: Immediate execution to avoid StrictMode double-mounting issues
      if (!preWarmingCompleted.current) {
        // Trigger immediate adjustments to warm up the CSS manipulation system
        setPanelHeightCSS(401);
        setPanelHeightCSS(400);
        setOutputHeightCSS(501);
        setOutputHeightCSS(500);
        preWarmingCompleted.current = true;
      }
    }
  }, [USE_CSS_RESIZE, setPanelHeightCSS, setOutputHeightCSS]);

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

  // Mock document generation functions for testing different scenarios
  const createMockDocument = (size: 'small' | 'medium' | 'monster', targetLength: number, isRevised: boolean = false) => {
    const paragraphs = [
      "This legal document establishes the terms and conditions governing the relationship between the parties hereto. The agreement shall remain in effect for the duration specified herein, subject to the terms and conditions set forth below.",
      "Whereas the Company desires to engage the Contractor to provide certain services as described in Exhibit A attached hereto and incorporated by reference; and whereas the Contractor represents that it has the necessary skills, experience, and resources to perform such services;",
      "Now, therefore, in consideration of the mutual covenants and agreements contained herein, and for other good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged, the parties agree as follows:",
      "The Contractor shall perform the services described in the Statement of Work with due care and in accordance with the highest professional standards. All work shall be completed in a timely manner and shall meet or exceed industry standards.",
      "Compensation shall be paid according to the schedule set forth in Exhibit B. Payment terms are net thirty (30) days from receipt of invoice. Late payments may incur interest charges at the rate of 1.5% per month.",
      "This Agreement shall be governed by the laws of [STATE/JURISDICTION] without regard to its conflict of laws principles. Any disputes arising under this Agreement shall be resolved through binding arbitration.",
      "Either party may terminate this Agreement upon thirty (30) days written notice to the other party. Upon termination, all outstanding obligations shall survive, including but not limited to payment obligations and confidentiality provisions.",
      "The Contractor acknowledges that it may have access to confidential information of the Company. All such information shall be maintained in strict confidence and shall not be disclosed to any third party without prior written consent.",
      "This Agreement constitutes the entire agreement between the parties and supersedes all prior negotiations, representations, or agreements relating to the subject matter hereof. No modification shall be effective unless in writing and signed by both parties.",
      "If any provision of this Agreement is held to be invalid or unenforceable, the remaining provisions shall continue in full force and effect. The invalid provision shall be deemed modified to the minimum extent necessary to make it valid and enforceable."
    ];

    let content = '';
    const baseRepeats = Math.ceil(targetLength / 2000); // Estimate repeats needed
    
    for (let i = 0; i < baseRepeats; i++) {
      for (const paragraph of paragraphs) {
        if (isRevised && Math.random() > 0.7) {
          // Add some variations for revised versions
          content += paragraph.replace(/Company/g, 'Corporation')
                              .replace(/Contractor/g, 'Service Provider')
                              .replace(/thirty \(30\)/g, 'sixty (60)')
                              .replace(/1\.5%/g, '2.0%') + '\n\n';
        } else {
          content += paragraph + '\n\n';
        }
        
        if (content.length >= targetLength) break;
      }
      if (content.length >= targetLength) break;
    }
    
    // Trim to target length
    return content.substring(0, targetLength);
  };

  const createMockDiff = (complexity: 'few' | 'many' | 'extreme', originalDoc: string) => {
    let revisedDoc = originalDoc;
    
    switch (complexity) {
      case 'few':
        // Make 5-10 small changes
        revisedDoc = originalDoc.replace(/Company/g, 'Corporation')
                                .replace(/Agreement/g, 'Contract')
                                .replace(/thirty \(30\)/g, 'sixty (60)')
                                .replace(/1\.5%/g, '2.0%')
                                .replace(/binding arbitration/g, 'mediation followed by arbitration');
        break;
        
      case 'many':
        // Make 50-100 changes throughout
        revisedDoc = originalDoc.replace(/Company/g, 'Corporation')
                                .replace(/Contractor/g, 'Service Provider')
                                .replace(/Agreement/g, 'Contract')
                                .replace(/thirty \(30\)/g, 'sixty (60)')
                                .replace(/1\.5%/g, '2.0%')
                                .replace(/the parties/g, 'both parties')
                                .replace(/shall be/g, 'will be')
                                .replace(/herein/g, 'in this document')
                                .replace(/thereof/g, 'of this agreement')
                                .replace(/binding arbitration/g, 'mediation followed by arbitration')
                                .replace(/written notice/g, 'written notification')
                                .replace(/confidential information/g, 'proprietary and confidential information')
                                .replace(/in writing/g, 'in written form')
                                .replace(/full force and effect/g, 'complete force and effect')
                                .replace(/STATE\/JURISDICTION/g, 'NEW YORK');
        break;
        
      case 'extreme':
        // Massive changes - almost completely rewritten
        revisedDoc = originalDoc.replace(/Company/g, 'Enterprise Corporation')
                                .replace(/Contractor/g, 'Independent Service Provider')
                                .replace(/Agreement/g, 'Master Service Contract')
                                .replace(/thirty \(30\)/g, 'ninety (90)')
                                .replace(/1\.5%/g, '3.5%')
                                .replace(/the parties/g, 'all contracting parties')
                                .replace(/shall be/g, 'must be')
                                .replace(/will be/g, 'shall be')
                                .replace(/herein/g, 'within this comprehensive document')
                                .replace(/thereof/g, 'pertaining to this binding agreement')
                                .replace(/binding arbitration/g, 'mandatory mediation followed by binding arbitration')
                                .replace(/written notice/g, 'formal written notification via certified mail')
                                .replace(/confidential information/g, 'highly sensitive proprietary and confidential information')
                                .replace(/in writing/g, 'documented in written form with notarized signatures')
                                .replace(/full force and effect/g, 'complete and binding force and legal effect')
                                .replace(/STATE\/JURISDICTION/g, 'DELAWARE')
                                .replace(/legal document/g, 'comprehensive legal instrument')
                                .replace(/terms and conditions/g, 'detailed terms, conditions, and stipulations')
                                .replace(/services/g, 'professional consulting services')
                                .replace(/payment/g, 'monetary compensation')
                                .replace(/invoice/g, 'detailed billing statement');
        
        // Add additional content for extreme test
        revisedDoc += '\n\nADDITIONAL PROVISIONS:\n\n';
        revisedDoc += 'The parties acknowledge that this agreement represents a significant business relationship requiring ongoing communication and collaboration. Both parties commit to maintaining the highest standards of professional conduct throughout the term of this agreement.\n\n';
        revisedDoc += 'FORCE MAJEURE: Neither party shall be liable for any failure or delay in performance under this Agreement which is due to circumstances beyond the reasonable control of such party, including but not limited to acts of God, war, terrorism, pandemic, government regulations, or natural disasters.\n\n';
        revisedDoc += 'DATA PROTECTION: Both parties agree to comply with all applicable data protection laws and regulations, including but not limited to GDPR, CCPA, and any other relevant privacy legislation in effect during the term of this agreement.';
        break;
    }
    
    return revisedDoc;
  };
  
  // SSMR FIX: CSS-based resize handlers to prevent React re-renders
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDraggingRef.current) return;
    
    const moveStartTime = performance.now();
    
    // Calculate delta from initial mouse position
    const deltaY = e.clientY - dragStartY.current;
    const newHeight = Math.max(minHeight, Math.min(800, startHeight.current + deltaY));
    
    // CSS manipulation with startTransition for non-blocking operations
    startTransition(() => {
      setPanelHeightCSS(newHeight);
    });
    
    const moveEndTime = performance.now();
    const moveDuration = moveEndTime - moveStartTime;
    
    // Only log slow mouse moves to identify bottlenecks
    // (Logging disabled for production)
  }, [minHeight, setPanelHeightCSS]);
  
  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, [handleMouseMove]);
  
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    
    // Capture initial state - use actual DOM height instead of React state
    dragStartY.current = e.clientY;
    
    if (USE_CSS_RESIZE && inputPanelsRef.current) {
      // Get actual height from DOM for CSS-based resize
      const firstPanel = inputPanelsRef.current.querySelector('.glass-panel-inner-content') as HTMLElement;
      if (firstPanel) {
        const computedHeight = firstPanel.getBoundingClientRect().height;
        startHeight.current = computedHeight;
      } else {
        startHeight.current = 400; // fallback
      }
    } else {
      // Use React state for fallback mode
      startHeight.current = panelHeight;
    }
    
    isDraggingRef.current = true;
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'row-resize';
    document.body.style.userSelect = 'none';
  }, [handleMouseMove, handleMouseUp, panelHeight, USE_CSS_RESIZE]);
  
  
  // SSMR FIX: CSS-based output resize handlers to prevent React re-renders
  const handleOutputMouseMove = useCallback((e: MouseEvent) => {
    if (!isOutputDraggingRef.current) return;
    
    // Calculate delta from initial mouse position
    const deltaY = e.clientY - outputDragStartY.current;
    const newHeight = Math.max(minOutputHeight, Math.min(900, outputStartHeight.current + deltaY));
    
    // CSS manipulation with startTransition for non-blocking operations
    startTransition(() => {
      setOutputHeightCSS(newHeight);
    });
  }, [minOutputHeight, setOutputHeightCSS]);
  
  const handleOutputMouseUp = useCallback(() => {
    isOutputDraggingRef.current = false;
    document.removeEventListener('mousemove', handleOutputMouseMove);
    document.removeEventListener('mouseup', handleOutputMouseUp);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, [handleOutputMouseMove]);
  
  const handleOutputMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    
    // Capture initial state - use actual DOM height instead of stale React state
    outputDragStartY.current = e.clientY;
    
    if (USE_CSS_RESIZE && outputPanelRef.current) {
      // Get actual height from DOM for CSS-based resize
      const computedHeight = outputPanelRef.current.getBoundingClientRect().height;
      outputStartHeight.current = computedHeight;
    } else {
      // Use React state for fallback mode
      outputStartHeight.current = outputHeight;
    }
    
    isOutputDraggingRef.current = true;
    
    document.addEventListener('mousemove', handleOutputMouseMove);
    document.addEventListener('mouseup', handleOutputMouseUp);
    document.body.style.cursor = 'row-resize';
    document.body.style.userSelect = 'none';
  }, [handleOutputMouseMove, handleOutputMouseUp, outputHeight, USE_CSS_RESIZE]);

  const handleSwapContent = () => {
    const tempOriginal = originalText;
    setOriginalText(revisedText);
    setRevisedText(tempOriginal);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
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
      <div className="glass-panel border border-theme-primary-200 rounded-lg p-4 mb-6 shadow-lg transition-all duration-300">
        <div className="flex items-start gap-3">
          <div className="flex items-center gap-2">
            <Image className="w-5 h-5 text-theme-primary-600" />
            <Globe className="w-5 h-5 text-theme-secondary-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-theme-primary-900 mb-1">Advanced Multi-Language OCR</h3>
            <p className="text-sm text-theme-primary-700 mb-2">
              Take a screenshot of any document and paste it directly into the input areas. 
              The app will automatically detect the language and extract text using advanced OCR technology.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-theme-primary-600">
              <div>
                <strong>Supported Languages:</strong> English, Chinese (Simplified & Traditional), Spanish, French, German, Japanese, Korean, Arabic, Russian
              </div>
              <div>
                <strong>Features:</strong> Auto-detection, Manual selection, Legal terminology optimization, Smart formatting
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Performance Test Buttons */}
      <div className="glass-panel border border-theme-accent-200 rounded-lg p-6 mb-6 shadow-lg transition-all duration-300">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-theme-primary-900 mb-2">🚀 Performance Demo Scenarios</h3>
          <p className="text-sm text-theme-neutral-600">
            Test different rendering strategies with realistic document sizes and change complexities.
            Watch the intelligent strategy selection in action!
          </p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <button
          onClick={() => {
            const original = createMockDocument('small', 5000, false);
            handleLoadTest(original, createMockDiff('few', original));
          }}
          className="enhanced-button bg-theme-primary-600 text-white rounded-lg hover:bg-theme-primary-700 transition-all duration-200 shadow-lg px-3 py-2 text-sm"
        >
          📄 Small Doc, Few Changes
        </button>
        <button
          onClick={() => {
            const original = createMockDocument('small', 5000, false);
            handleLoadTest(original, createMockDiff('many', original));
          }}
          className="enhanced-button bg-theme-accent-600 text-white rounded-lg hover:bg-theme-accent-700 transition-all duration-200 shadow-lg px-3 py-2 text-sm"
        >
          📄 Small Doc, Many Changes
        </button>
        <button
          onClick={() => {
            const original = createMockDocument('medium', 15000, false);
            handleLoadTest(original, createMockDiff('few', original));
          }}
          className="enhanced-button bg-theme-primary-600 text-white rounded-lg hover:bg-theme-primary-700 transition-all duration-200 shadow-lg px-3 py-2 text-sm"
        >
          📑 Medium Doc, Few Changes
        </button>
        <button
          onClick={() => {
            const original = createMockDocument('medium', 15000, false);
            handleLoadTest(original, createMockDiff('many', original));
          }}
          className="enhanced-button bg-theme-accent-600 text-white rounded-lg hover:bg-theme-accent-700 transition-all duration-200 shadow-lg px-3 py-2 text-sm"
        >
          📑 Medium Doc, Many Changes
        </button>
        <button
          onClick={() => {
            const original = createMockDocument('monster', 500000, false);
            handleLoadTest(original, createMockDiff('few', original));
          }}
          className="enhanced-button bg-theme-primary-600 text-white rounded-lg hover:bg-theme-primary-700 transition-all duration-200 shadow-lg px-3 py-2 text-sm"
        >
          🏢 Monster Doc, Few Changes
        </button>
        <button
          onClick={() => {
            const original = createMockDocument('monster', 500000, false);
            handleLoadTest(original, createMockDiff('extreme', original));
          }}
          className="enhanced-button bg-theme-accent-600 text-white rounded-lg hover:bg-theme-accent-700 transition-all duration-200 shadow-lg px-3 py-2 text-sm"
        >
          🚀 Monster Doc, Crazy Changes
        </button>
        <button
          onClick={() => {
            const original = createMockDocument('large', 200000, false);
            handleLoadTest(original, createMockDiff('few', original));
          }}
          className="enhanced-button bg-theme-primary-600 text-white rounded-lg hover:bg-theme-primary-700 transition-all duration-200 shadow-lg px-3 py-2 text-sm"
        >
          📚 Large Doc, Few Changes
        </button>
        <button
          onClick={() => {
            const original = createMockDocument('large', 200000, false);
            handleLoadTest(original, createMockDiff('many', original));
          }}
          className="enhanced-button bg-theme-accent-600 text-white rounded-lg hover:bg-theme-accent-700 transition-all duration-200 shadow-lg px-3 py-2 text-sm"
        >
          📚 Large Doc, Many Changes
        </button>
        </div>
        
        <div className="mt-4 text-xs text-center text-theme-neutral-500">
          💡 <strong>Tip:</strong> Enable Auto-Compare to see real-time strategy selection and performance metrics
        </div>
      </div>

      {/* Control Bar - Enhanced with glassmorphism and Quick Compare */}
      <div className="glass-panel p-4 mb-6 shadow-lg transition-all duration-300">
        <div className="flex items-center justify-center gap-4">
          {!quickCompareEnabled && (
            <button
              onClick={() => compareDocuments()}
              disabled={isProcessing || !originalText.trim() || !revisedText.trim()}
              className="enhanced-button flex items-center gap-2 px-6 py-2.5 bg-theme-primary-600 text-white rounded-lg hover:bg-theme-primary-700 disabled:bg-theme-neutral-400 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg"
            >
              <Play className="w-4 h-4" />
              {isProcessing ? 'Processing...' : 'Compare'}
            </button>
          )}
          
          <button
            onClick={resetComparison}
            className="enhanced-button flex items-center gap-2 px-4 py-2.5 bg-theme-neutral-600 text-white rounded-lg hover:bg-theme-neutral-700 transition-all duration-200 shadow-lg"
          >
            <RotateCcw className="w-4 h-4" />
            New Comparison
          </button>
          
          
          {/* Auto-Compare Toggle */}
          <button
            onClick={toggleQuickCompare}
            className={`enhanced-button flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 shadow-lg ${
              quickCompareEnabled 
                ? 'bg-theme-accent-500 text-white hover:bg-theme-accent-600' 
                : 'bg-theme-neutral-100 text-theme-neutral-700 hover:bg-theme-neutral-200'
            }`}
            title={quickCompareEnabled ? 'Auto-Compare enabled - real-time comparison on all changes (typing, pasting, OCR)' : 'Auto-Compare disabled - manual RedLine button required'}
          >
            {quickCompareEnabled ? <Zap className="w-4 h-4" /> : <ZapOff className="w-4 h-4" />}
            <span className="hidden sm:inline">
              Auto-Compare {quickCompareEnabled ? 'On' : 'Off'}
            </span>
          </button>
          
          {/* System Protection Toggle for stress testing */}
          <button
            onClick={toggleSystemProtection}
            className={`enhanced-button flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 shadow-lg ${
              systemProtectionEnabled 
                ? 'bg-green-600 text-white hover:bg-green-700' 
                : 'bg-red-600 text-white hover:bg-red-700'
            }`}
            title={systemProtectionEnabled ? 'System protection enabled - safe mode with resource limits' : 'System protection disabled - stress testing mode (may crash browser!)'}
          >
            <span className="text-sm">🛡️</span>
            <span className="hidden sm:inline text-sm">
              {systemProtectionEnabled ? 'Safe' : 'Test'}
            </span>
          </button>
          
          {/* Cancel Button - Enhanced visibility and robustness */}
          {(isProcessing || isCancelling) && (
            <button
              onClick={cancelComparison}
              disabled={isCancelling}
              className="enhanced-button flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-700 disabled:cursor-not-allowed transition-all duration-200 shadow-lg animate-pulse"
              title={isCancelling ? "Cancelling comparison..." : "Cancel the current comparison operation (or press ESC)"}
            >
              {isCancelling ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span className="hidden sm:inline">Cancelling...</span>
                </>
              ) : (
                <>
                  <span>✕</span>
                  <span className="hidden sm:inline">Cancel</span>
                </>
              )}
            </button>
          )}
        </div>
        
        <div className="text-sm text-theme-neutral-600 text-center">
          {quickCompareEnabled ? (
            <div>
              <div className="flex items-center gap-1 text-theme-accent-600">
                <Zap className="w-3 h-3" />
                <span className="font-medium">Auto-Compare enabled</span>
              </div>
              <div className="text-xs">Real-time comparison active</div>
            </div>
          ) : (
            <div>
              <div>Press <kbd className="px-2 py-1 bg-theme-neutral-100 rounded text-xs">Ctrl+Enter</kbd> to compare</div>
              <div className="text-xs">or enable Auto-Compare</div>
            </div>
          )}
        </div>
      </div>

      {/* Input Section with Centered Swap Button - Enhanced with glassmorphism */}
      <div className="relative mb-8">
        <div ref={inputPanelsRef} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div data-input-panel>
            <TextInputPanel
              title="Original Version"
              value={originalText}
              onChange={(value: string, isPasteAction?: boolean) => setOriginalText(value, isPasteAction)}
              placeholder="Paste your original legal document text here, or paste a screenshot to extract text automatically using multi-language OCR..."
              disabled={isProcessing}
              height={USE_CSS_RESIZE ? undefined : panelHeight}
            />
          </div>
          
          <div data-input-panel>
            <TextInputPanel
              title="Revised Version"
              value={revisedText}
              onChange={(value: string, isPasteAction?: boolean) => setRevisedText(value, isPasteAction)}
              placeholder="Paste your revised legal document text here, or paste a screenshot to extract text automatically using multi-language OCR..."
              disabled={isProcessing}
              height={USE_CSS_RESIZE ? undefined : panelHeight}
            />
          </div>
        </div>
        
        {/* Resizable Panels Handle - Glassmorphic and thumb-friendly */}
        <div className="flex justify-center mt-4 mb-2">
          <div
            ref={resizeHandleRef}
            className="glass-panel flex items-center justify-center w-20 h-8 bg-theme-neutral-200/60 hover:bg-theme-neutral-300/70 cursor-row-resize rounded-lg transition-all duration-300 touch-none select-none backdrop-blur-md border border-theme-neutral-300/30 shadow-lg hover:shadow-xl hover:scale-105"
            onMouseDown={handleMouseDown}
            title="Drag to resize input panels"
          >
            <GripHorizontal className="w-6 h-6 text-theme-neutral-700" />
          </div>
        </div>

        {/* Centered Swap Button - Enhanced with hover effects */}
        <div className="hidden lg:flex absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <button
            onClick={handleSwapContent}
            disabled={isProcessing || (!originalText.trim() && !revisedText.trim())}
            className="enhanced-button flex items-center justify-center w-12 h-12 bg-theme-accent-500 text-white rounded-full hover:bg-theme-accent-600 disabled:bg-theme-neutral-400 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            title="Swap original and revised content"
          >
            <ArrowLeftRight className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Swap Button - Enhanced with hover effects */}
        <div className="lg:hidden flex justify-center mt-4">
          <button
            onClick={handleSwapContent}
            disabled={isProcessing || (!originalText.trim() && !revisedText.trim())}
            className="enhanced-button flex items-center gap-2 px-4 py-2.5 bg-theme-accent-500 text-white rounded-lg hover:bg-theme-accent-600 disabled:bg-theme-neutral-400 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
            title="Swap original and revised content"
          >
            <ArrowLeftRight className="w-4 h-4" />
            <span>Swap Content</span>
          </button>
        </div>
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
          <div className="mb-6">
            {(isProcessing && chunkingProgress.enabled && chunkingProgress.isChunking) ? (
              <div className="glass-panel overflow-hidden shadow-lg transition-all duration-300" style={{ height: `${outputHeight}px`, minHeight: '200px' }}>
                <div className="glass-panel-header-footer px-4 py-3 border-b border-theme-neutral-200 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-theme-primary-900">Processing Comparison...</h3>
                </div>
                <div className="glass-panel-inner-content p-6 overflow-y-auto flex flex-col items-center justify-center" style={{ height: `${outputHeight - 120}px` }}>
                  {chunkingProgress.enabled && chunkingProgress.isChunking ? (
                    <div className="w-full max-w-md">
                      <div className="flex items-center gap-3 text-theme-primary-600 mb-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-theme-primary-600"></div>
                        <span className="text-lg font-medium">Processing comparison...</span>
                      </div>
                      <div className="w-full bg-theme-neutral-200 rounded-full h-3 mb-2">
                        <div 
                          className="h-3 bg-theme-primary-600 rounded-full transition-all duration-300" 
                          style={{ width: `${Math.min(100, Math.max(0, chunkingProgress.progress))}%` }}
                        ></div>
                      </div>
                      <div className="text-sm text-theme-neutral-600 text-center">
                        {chunkingProgress.stage || 'Processing...'}
                      </div>
                      <div className="text-xs text-theme-neutral-500 text-center mt-2">
                        {chunkingProgress.progress}% complete
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 text-theme-primary-600">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-theme-primary-600"></div>
                      <span className="text-lg font-medium">Starting comparison...</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div 
                ref={outputPanelRef} 
                style={USE_CSS_RESIZE ? { 
                  height: `${outputHeight}px`,
                  overflow: 'hidden' // Ensure container controls height
                } : undefined}
                className={`${USE_CSS_RESIZE ? "override-redline-height" : ""} glass-panel output-panel`}
              >
                <div style={USE_CSS_RESIZE ? {
                  height: '100%',
                  overflow: 'hidden'
                } : undefined}>
                  <div 
                    style={USE_CSS_RESIZE ? {
                      height: '100%'
                    } : undefined}
                    className={USE_CSS_RESIZE ? 'redline-output-wrapper' : ''}
                  >
                    <RedlineOutput
                      changes={result.changes} 
                      onCopy={handleCopy}
                      height={USE_CSS_RESIZE ? 9999 : outputHeight} // Force RedlineOutput to use container height
                      isProcessing={false}
                      processingStatus=""
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* Output Resize Handle - Positioned at bottom center of output */}
            <div className="flex justify-center mt-4">
              <div
                ref={outputResizeHandleRef}
                className="glass-panel output-resize-handle flex items-center justify-center w-20 h-8 bg-theme-primary-200/60 hover:bg-theme-primary-300/70 cursor-row-resize rounded-lg transition-all duration-300 touch-none select-none backdrop-blur-md border border-theme-primary-300/30 shadow-lg hover:shadow-xl hover:scale-105"
                onMouseDown={handleOutputMouseDown}
                title="Drag to resize output panel"
              >
                <GripHorizontal className="w-6 h-6 text-theme-primary-700" />
              </div>
            </div>
          </div>
          
          {result && (
            <div>
              <ComparisonStats stats={result.stats} />
            </div>
          )}
        </>
      )}

      {/* Processing Indicator - Simplified without duplicate cancel button */}
      {isProcessing && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="flex items-center gap-3 text-theme-primary-600 mb-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-theme-primary-600"></div>
            <span className="text-lg font-medium">Processing comparison...</span>
          </div>
        </div>
      )}
    </div>
  );
};
