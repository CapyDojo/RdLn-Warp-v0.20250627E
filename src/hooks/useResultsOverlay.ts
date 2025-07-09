import { useState, useEffect, useRef } from 'react';

interface UseResultsOverlayOptions {
  /**
   * Whether to automatically show overlay when results appear
   * @default true
   */
  autoShow?: boolean;
  
  /**
   * How long to keep the overlay open automatically before allowing user interaction
   * @default 3000 (3 seconds)
   * @deprecated Auto-show period removed - users can close immediately
   */
  autoShowDuration?: number;
  
  /**
   * Whether to disable auto-close on outside click during auto-show period
   * @default true
   * @deprecated Auto-show period removed - users can close immediately
   */
  disableAutoCloseOnOutsideClick?: boolean;
  
  /**
   * Callback when overlay is shown
   */
  onShow?: () => void;
  
  /**
   * Callback when overlay is hidden
   */
  onHide?: () => void;
}

/**
 * Custom hook for managing Results Overlay state and behavior
 * 
 * Provides:
 * - Overlay visibility state management
 * - Auto-show behavior when results appear
 * - Auto-close timer management
 * - Manual show/hide controls
 * - Integration with experimental features
 */
export const useResultsOverlay = (
  hasResults: boolean,
  isProcessing: boolean,
  options: UseResultsOverlayOptions = {}
) => {
  const {
    autoShow = true,
    autoShowDuration = 3000,
    disableAutoCloseOnOutsideClick = true,
    onShow,
    onHide
  } = options;

  const [isVisible, setIsVisible] = useState(false);
  const [wasManuallyDismissed, setWasManuallyDismissed] = useState(false);

  // Auto-show overlay when results appear
  useEffect(() => {
    if (hasResults && !isProcessing && autoShow && !wasManuallyDismissed) {
      setIsVisible(true);
      
      // Call onShow callback if provided
      if (onShow) {
        onShow();
      }
      
      console.log('🎯 Results Overlay: Auto-showed - user can close immediately');
    }
  }, [hasResults, isProcessing, autoShow, onShow, wasManuallyDismissed]);


  // Manual show/hide controls
  const showOverlay = () => {
    setIsVisible(true);
    setWasManuallyDismissed(false); // Reset dismissal flag when manually shown
    
    // Call onShow callback if provided
    if (onShow) {
      onShow();
    }
    
    console.log('🎯 Results Overlay: Manually shown - reset dismissal flag');
  };

  const hideOverlay = () => {
    setIsVisible(false);
    setWasManuallyDismissed(true); // Prevent auto-show from retriggering
    
    // Call onHide callback if provided
    if (onHide) {
      onHide();
    }
    
    console.log('🎯 Results Overlay: Hidden - marked as manually dismissed');
  };

  // Force close (same as hideOverlay now - no auto-show period protection)
  const forceHideOverlay = () => {
    setIsVisible(false);
    setWasManuallyDismissed(true); // Prevent auto-show from retriggering
    
    // Call onHide callback if provided
    if (onHide) {
      onHide();
    }
    
    console.log('🎯 Results Overlay: Force hidden - marked as manually dismissed');
  };

  return {
    isVisible,
    showOverlay,
    hideOverlay,
    forceHideOverlay
  };
};
