import React, { useEffect } from 'react';
import { Play, RotateCcw, AlertCircle, CheckCircle, Image, Globe, ArrowLeftRight } from 'lucide-react';
import { useComparison } from '../hooks/useComparison';
import { TextInputPanel } from './TextInputPanel';
import { RedlineOutput } from './RedlineOutput';
import { ComparisonStats } from './ComparisonStats';
import { TestSuite } from './TestSuite';
import { AdvancedTestSuite } from '../testing/AdvancedTestSuite';
import { ExtremeTestSuite } from '../testing/ExtremeTestSuite';

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
    resetComparison
  } = useComparison();

  const [copySuccess, setCopySuccess] = React.useState(false);

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
          <div className="glass-panel p-6 shadow-lg transition-all duration-300">
            <TextInputPanel
              title="Original Version"
              value={originalText}
              onChange={setOriginalText}
              placeholder="Paste your original legal document text here, or paste a screenshot to extract text automatically using multi-language OCR..."
              disabled={isProcessing}
            />
          </div>
          
          <div className="glass-panel p-6 shadow-lg transition-all duration-300">
            <TextInputPanel
              title="Revised Version"
              value={revisedText}
              onChange={setRevisedText}
              placeholder="Paste your revised legal document text here, or paste a screenshot to extract text automatically using multi-language OCR..."
              disabled={isProcessing}
            />
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

      {/* Control Bar - Enhanced with glassmorphism */}
      <div className="glass-panel p-4 mb-6 shadow-lg transition-all duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={compareDocuments}
              disabled={isProcessing || !originalText.trim() || !revisedText.trim()}
              className="enhanced-button flex items-center gap-2 px-6 py-2.5 bg-theme-primary-600 text-white rounded-lg hover:bg-theme-primary-700 disabled:bg-theme-neutral-400 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg"
            >
              <Play className="w-4 h-4" />
              {isProcessing ? 'Processing...' : 'Compare Documents'}
            </button>
            
            <button
              onClick={resetComparison}
              className="enhanced-button flex items-center gap-2 px-4 py-2.5 bg-theme-neutral-600 text-white rounded-lg hover:bg-theme-neutral-700 transition-all duration-200 shadow-lg"
            >
              <RotateCcw className="w-4 h-4" />
              New Comparison
            </button>
          </div>
          
          <div className="text-sm text-theme-neutral-600">
            Press <kbd className="px-2 py-1 bg-theme-neutral-100 rounded text-xs">Ctrl+Enter</kbd> to compare
          </div>
        </div>
        
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
      </div>

      {/* Results Section - Enhanced with glassmorphism */}
      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RedlineOutput 
              changes={result.changes} 
              onCopy={handleCopy}
            />
          </div>
          
          <div>
            <ComparisonStats stats={result.stats} />
          </div>
        </div>
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