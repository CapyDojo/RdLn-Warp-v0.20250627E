import React from 'react';
import { Play, RotateCcw, ArrowLeftRight, Zap, ZapOff, Lock } from 'lucide-react';

interface MobileControlsPanelProps {
  /** Whether Quick Compare is enabled */
  quickCompareEnabled: boolean;
  /** Whether scroll lock is active */
  isScrollLocked: boolean;
  /** Whether currently processing */
  isProcessing: boolean;
  /** Original text content */
  originalText: string;
  /** Revised text content */
  revisedText: string;
  /** Callback for compare button */
  onCompare: () => void;
  /** Callback for toggle quick compare */
  onToggleQuickCompare: () => void;
  /** Callback for swap content */
  onSwapContent: () => void;
  /** Callback for toggle scroll lock */
  onToggleScrollLock: () => void;
  /** Callback for reset comparison */
  onResetComparison: () => void;
}

/**
 * Mobile Controls Panel Component
 * 
 * Contains all the control buttons for mobile layout with horizontal arrangement.
 * Extracted from ComparisonInterface for better modularity and reusability.
 */
export const MobileControlsPanel: React.FC<MobileControlsPanelProps> = ({
  quickCompareEnabled,
  isScrollLocked,
  isProcessing,
  originalText,
  revisedText,
  onCompare,
  onToggleQuickCompare,
  onSwapContent,
  onToggleScrollLock,
  onResetComparison
}) => {
  return (
    <>
      {/* Mobile Controls - Enhanced with all operation buttons */}
      <div className="lg:hidden text-center">
        <div className="inline-flex flex-wrap justify-center items-center gap-3 mt-4">
          {/* Compare Button - Only show when live compare is disabled */}
          {!quickCompareEnabled && (
            <button
              data-compare-button
              onClick={onCompare}
              disabled={isProcessing || !originalText.trim() || !revisedText.trim()}
              className="enhanced-button flex items-center gap-2 px-4 py-2.5 bg-theme-primary-600 text-white rounded-lg hover:bg-theme-primary-700 disabled:bg-theme-neutral-400 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
              title={isProcessing ? 'Processing...' : 'Click / Ctrl+Enter to compare'}
            >
              <Play className="w-4 h-4" />
              <span>{isProcessing ? 'Processing...' : 'Compare'}</span>
            </button>
          )}
          
          {/* Live Compare Toggle */}
          <button
            data-live-compare-toggle
            onClick={onToggleQuickCompare}
            className={`enhanced-button flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 shadow-lg relative overflow-visible ${
              quickCompareEnabled 
                ? 'bg-theme-accent-500 text-white hover:bg-theme-accent-600' 
                : 'bg-theme-neutral-300 text-theme-neutral-700 hover:bg-theme-neutral-400'
            }`}
            title={quickCompareEnabled ? 'Live Compare is activated' : 'Click to enable Live Compare'}
          >
            {quickCompareEnabled ? <Zap className="w-4 h-4" /> : <ZapOff className="w-4 h-4" />}
            <span>Live</span>
            {quickCompareEnabled && (
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-orange-400 rounded-full animate-pulse z-20 border-2 border-white shadow-lg"></div>
            )}
          </button>
          
          {/* Swap Content Button */}
          <button
            data-swap-content-button-mobile
            onClick={onSwapContent}
            disabled={isProcessing || (!originalText.trim() && !revisedText.trim())}
            className="enhanced-button flex items-center gap-2 px-4 py-2.5 bg-theme-secondary-500 text-white rounded-lg hover:bg-theme-secondary-600 disabled:bg-theme-neutral-400 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
            title="Swap original and revised content"
          >
            <ArrowLeftRight className="w-4 h-4" />
            <span>Swap</span>
          </button>
          
          {/* Scroll Lock Button */}
          <button
            data-scroll-lock-toggle
            onClick={onToggleScrollLock}
            className={`enhanced-button flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 shadow-lg relative overflow-visible ${
              isScrollLocked 
                ? 'bg-theme-primary-500 text-white hover:bg-theme-primary-600' 
                : 'bg-theme-neutral-300 text-theme-neutral-700 hover:bg-theme-neutral-400'
            }`}
            title={isScrollLocked ? "Unlock scroll synchronization" : "Lock scroll synchronization"}
          >
            <Lock className={`w-4 h-4 transition-all duration-300 ${isScrollLocked ? '' : 'opacity-60'}`} />
            <span>Scroll</span>
            {isScrollLocked && (
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-400 rounded-full animate-pulse z-20 border-2 border-white shadow-lg"></div>
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile Reset Button - Separated to prevent accidental clearing */}
      <div className="lg:hidden flex justify-center mt-6">
        <button
          data-reset-button
          onClick={onResetComparison}
          className="enhanced-button flex items-center gap-2 px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 shadow-lg border-2 border-red-300"
          title="⚠️ New Comparison - This will clear all content and reset the comparison"
        >
          <RotateCcw className="w-4 h-4" />
          <span>⚠️ New Comparison</span>
        </button>
      </div>
    </>
  );
};
