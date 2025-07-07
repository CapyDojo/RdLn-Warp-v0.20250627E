import React, { useEffect } from 'react';
import { BaseComponentProps } from '../types/components';
import { useComponentPerformance, usePerformanceAwareHandler } from '../utils/performanceUtils.tsx';

interface ProcessingDisplayProps extends BaseComponentProps {
  /** Chunking progress state */
  chunkingProgress: {
    progress: number;
    stage: string;
    isChunking: boolean;
    enabled: boolean;
  };
  /** Whether currently cancelling */
  isCancelling: boolean;
  /** Callback for cancellation */
  onCancel: () => void;
}

/**
 * Processing Display Component
 * 
 * Handles the display of processing states during comparison operations.
 * Extracted from ComparisonInterface for better modularity and performance.
 * 
 * Features:
 * - Progress tracking with stage information
 * - Cancel button integration
 * - Visual loading indicators
 * - Responsive design for different screen sizes
 */
export const ProcessingDisplay: React.FC<ProcessingDisplayProps> = ({
  chunkingProgress,
  isCancelling,
  onCancel,
  style,
  className,
  ...props
}) => {
  // Performance monitoring setup
  const performanceTracker = useComponentPerformance(props, 'ProcessingDisplay', {
    category: 'processing',
    autoTrackRender: true,
    autoTrackInteractions: true
  });
  
  // Track processing stage changes
  useEffect(() => {
    if (chunkingProgress.isChunking) {
      performanceTracker.trackMetric('processing_stage_change', {
        stage: chunkingProgress.stage,
        progress: chunkingProgress.progress,
        timestamp: Date.now()
      });
    }
  }, [chunkingProgress.stage, chunkingProgress.progress, chunkingProgress.isChunking, performanceTracker]);
  
  // Track cancellation response time
  useEffect(() => {
    if (isCancelling) {
      const cancelStartTime = Date.now();
      performanceTracker.trackMetric('cancellation_started', { timestamp: cancelStartTime });
      
      // Track when cancellation completes (component unmounts or isCancelling becomes false)
      return () => {
        performanceTracker.trackMetric('cancellation_duration', {
          duration: Date.now() - cancelStartTime
        });
      };
    }
  }, [isCancelling, performanceTracker]);
  
  // Performance-aware cancel handler
  const handleCancel = usePerformanceAwareHandler(() => {
    onCancel();
  }, 'cancel_operation', performanceTracker);
  return (
    <div className={`glass-panel shadow-lg transition-all duration-300 ${className || ''}`} style={style}>
      <div className="glass-panel-header-footer px-4 py-3 border-b border-theme-neutral-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-theme-primary-900">Processing Comparison...</h3>
      </div>
      <div className="glass-panel-inner-content p-6 flex flex-col items-center justify-center" style={{ minHeight: '300px' }}>
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
            {/* Cancel Button - Moved from control bar */}
            <div className="flex justify-center mt-4">
              <button
                data-cancel-button
                onClick={onCancel}
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
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-3 text-theme-primary-600">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-theme-primary-600"></div>
              <span className="text-lg font-medium">Starting comparison...</span>
            </div>
            {/* Cancel Button - Also available during initial processing */}
            <button
              data-cancel-button
              onClick={onCancel}
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
          </div>
        )}
      </div>
    </div>
  );
};
