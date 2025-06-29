import React, { useEffect, useState, useRef, useCallback } from 'react';
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
    // SSMR CHUNKING: Extract chunking progress state
    chunkingProgress
  } = useComparison();

  // CHUNKING DEBUG: Temporarily disabled to prevent infinite loops
  // React.useEffect(() => {
  //   console.log('🏗️ ComparisonInterface chunking state:', chunkingProgress);
  // }, [chunkingProgress.progress, chunkingProgress.stage, chunkingProgress.isChunking, chunkingProgress.enabled]);

  const [copySuccess, setCopySuccess] = React.useState(false);
  const [autoCompareCountdown, setAutoCompareCountdown] = React.useState(0);
  
  // Resizable panels state
  const [panelHeight, setPanelHeight] = useState(400);
  const [outputHeight, setOutputHeight] = useState(500);
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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        compareDocuments();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [compareDocuments]);

  const handleCopy = () => {
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleLoadTest = (originalText: string, revisedText: string) => {
    setOriginalText(originalText);
    setRevisedText(revisedText);
  };
  
  // Resize handlers for synchronized input panels
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDraggingRef.current) return;
    
    // Calculate delta from initial mouse position
    const deltaY = e.clientY - dragStartY.current;
    const newHeight = Math.max(minHeight, Math.min(800, startHeight.current + deltaY));
    setPanelHeight(newHeight);
  }, [minHeight]);
  
  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, [handleMouseMove]);
  
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    
    // Capture initial state
    dragStartY.current = e.clientY;
    startHeight.current = panelHeight;
    isDraggingRef.current = true;
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'row-resize';
    document.body.style.userSelect = 'none';
  }, [handleMouseMove, handleMouseUp, panelHeight]);
  
  
  // Output resize handlers
  const handleOutputMouseMove = useCallback((e: MouseEvent) => {
    if (!isOutputDraggingRef.current) return;
    
    // Calculate delta from initial mouse position
    const deltaY = e.clientY - outputDragStartY.current;
    const newHeight = Math.max(minOutputHeight, Math.min(900, outputStartHeight.current + deltaY));
    setOutputHeight(newHeight);
  }, [minOutputHeight]);
  
  const handleOutputMouseUp = useCallback(() => {
    isOutputDraggingRef.current = false;
    document.removeEventListener('mousemove', handleOutputMouseMove);
    document.removeEventListener('mouseup', handleOutputMouseUp);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, [handleOutputMouseMove]);
  
  const handleOutputMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    
    // Capture initial state
    outputDragStartY.current = e.clientY;
    outputStartHeight.current = outputHeight;
    isOutputDraggingRef.current = true;
    
    document.addEventListener('mousemove', handleOutputMouseMove);
    document.addEventListener('mouseup', handleOutputMouseUp);
    document.body.style.cursor = 'row-resize';
    document.body.style.userSelect = 'none';
  }, [handleOutputMouseMove, handleOutputMouseUp, outputHeight]);

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
      
      {/* SSMR CHUNKING: Step 3 - Chunking Progress Indicator (Option 2: Separate from OCR) */}
      <ChunkingProgressIndicator
        progress={chunkingProgress.progress}
        stage={chunkingProgress.stage}
        isChunking={chunkingProgress.isChunking}
        enabled={chunkingProgress.enabled} // ROLLBACK: Set to false to hide completely
        className="mb-4"
      />
      
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

      {/* Input Section with Centered Swap Button - Enhanced with glassmorphism */}
      <div className="relative mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TextInputPanel
            title="Original Version"
            value={originalText}
            onChange={setOriginalText}
            placeholder="Paste your original legal document text here, or paste a screenshot to extract text automatically using multi-language OCR..."
            disabled={isProcessing}
            height={panelHeight}
          />
          
          <TextInputPanel
            title="Revised Version"
            value={revisedText}
            onChange={setRevisedText}
            placeholder="Paste your revised legal document text here, or paste a screenshot to extract text automatically using multi-language OCR..."
            disabled={isProcessing}
            height={panelHeight}
          />
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

      {/* Results Section - Enhanced with glassmorphism */}
      {result && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <RedlineOutput 
                changes={result.changes} 
                onCopy={handleCopy}
                height={outputHeight}
              />
              
              {/* Output Resize Handle - Positioned at bottom center of output */}
              <div className="flex justify-center mt-4">
                <div
                  ref={outputResizeHandleRef}
                  className="glass-panel flex items-center justify-center w-20 h-8 bg-theme-primary-200/60 hover:bg-theme-primary-300/70 cursor-row-resize rounded-lg transition-all duration-300 touch-none select-none backdrop-blur-md border border-theme-primary-300/30 shadow-lg hover:shadow-xl hover:scale-105"
                  onMouseDown={handleOutputMouseDown}
                  title="Drag to resize output panel"
                >
                  <GripHorizontal className="w-6 h-6 text-theme-primary-700" />
                </div>
              </div>
            </div>
            
            <div>
              <ComparisonStats stats={result.stats} />
            </div>
          </div>
        </>
      )}

      {/* Processing Indicator */}
      {isProcessing && (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3 text-theme-primary-600">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-theme-primary-600"></div>
            <span className="text-lg font-medium">Processing comparison...</span>
          </div>
        </div>
      )}
    </div>
  );
};