import { useRef, useCallback, useEffect } from 'react';

interface UseScrollSyncConfig {
  /** Whether scroll synchronization is enabled */
  isScrollLocked: boolean;
  /** External ref for output panel (optional, for direct ref passing) */
  outputRef?: React.RefObject<HTMLDivElement>;
}

interface UseScrollSyncReturn {
  /** Refs for scroll elements (input1, input2, output) */
  scrollRefs: React.MutableRefObject<{
    input1: HTMLElement | null;
    input2: HTMLElement | null;
    output: HTMLElement | null;
  }>;
  /** Function to update scroll element references */
  updateScrollRefs: () => void;
  /** Function to synchronize scroll across all panels */
  syncScroll: (sourceElement: HTMLElement, scrollTop: number) => void;
}

/**
 * useScrollSync Hook
 * 
 * Manages scroll synchronization between input panels and output panel.
 * Features elegant ref-based detection and layout adaptation.
 * 
 * Features:
 * - Automatic layout detection (desktop/mobile, Option C vs other layouts)
 * - Elegant ref-based output panel access
 * - Proper event listener management with cleanup
 * - Smooth percentage-based scroll synchronization
 * - Performance optimized with RAF and loop prevention
 */
export const useScrollSync = ({
  isScrollLocked,
  outputRef
}: UseScrollSyncConfig): UseScrollSyncReturn => {
  
  // ==================== REFS ====================
  
  // Scroll element refs
  const scrollRefs = useRef({
    input1: null as HTMLElement | null,
    input2: null as HTMLElement | null,
    output: null as HTMLElement | null
  });
  
  // Loop prevention ref
  const isScrolling = useRef(false);
  
  // ==================== SCROLL SYNCHRONIZATION ====================
  
  const syncScroll = useCallback((sourceElement: HTMLElement, scrollTop: number) => {
    if (!isScrollLocked || isScrolling.current) return;
    
    isScrolling.current = true;
    
    const sourceScrollPercentage = scrollTop / (sourceElement.scrollHeight - sourceElement.clientHeight);
    
    Object.values(scrollRefs.current).forEach(element => {
      if (element && element !== sourceElement) {
        const targetScrollTop = sourceScrollPercentage * (element.scrollHeight - element.clientHeight);
        element.scrollTop = Math.max(0, targetScrollTop);
      }
    });
    
    // Use RAF to reset flag for smooth performance
    requestAnimationFrame(() => {
      isScrolling.current = false;
    });
  }, [isScrollLocked]);
  
  // ==================== ELEMENT DETECTION ====================
  
  const updateScrollRefs = useCallback(() => {
    // OPTION C FIX: Detect actual scroll containers based on current layout
    // Option C moves scrolling from textarea to .glass-panel-inner-content
    const inputContainers = document.querySelectorAll('[data-input-panel] .glass-panel-inner-content');
    
    // Check if Option C layout is active by testing scroll behavior
    const isOptionC = inputContainers.length > 0 && 
      inputContainers[0] && 
      getComputedStyle(inputContainers[0]).overflowY === 'auto';
    
    let input1Element = null;
    let input2Element = null;
    
    if (isOptionC) {
      // Option C: Use container elements for scroll events
      input1Element = inputContainers[0] as HTMLElement || null;
      input2Element = inputContainers[1] as HTMLElement || null;
    } else {
      // Other layouts: Use textarea elements for scroll events
      const inputTextareas = document.querySelectorAll('[data-input-panel] .glass-panel-inner-content textarea');
      input1Element = inputTextareas[0] as HTMLElement || null;
      input2Element = inputTextareas[1] as HTMLElement || null;
    }
    
    // ELEGANT FIX: Use ref-based detection for output panel instead of DOM queries
    const outputPanel = outputRef?.current || null;
    
    scrollRefs.current = {
      input1: input1Element,
      input2: input2Element,
      output: outputPanel
    };
    
    // Debug logging (safe - read-only operations)
    console.log('🔄 SCROLL SYNC: Scroll elements detected via layout adaptation:', {
      input1: !!scrollRefs.current.input1,
      input2: !!scrollRefs.current.input2,
      output: !!scrollRefs.current.output,
      outputRefDirect: !!outputRef?.current,
      isScrollLocked,
      isOptionC,
      layoutDetection: isOptionC ? 'Option C (container scroll)' : 'Other layout (textarea scroll)',
      input1Type: input1Element?.tagName,
      input2Type: input2Element?.tagName,
      outputType: outputPanel?.tagName,
      outputHasOverflow: outputPanel ? getComputedStyle(outputPanel).overflowY : 'no element',
      outputScrollHeight: outputPanel?.scrollHeight,
      outputClientHeight: outputPanel?.clientHeight
    });
  }, [isScrollLocked, outputRef]);
  
  // ==================== EVENT LISTENER MANAGEMENT ====================
  
  // Event listener management (Reversible - only when locked)
  useEffect(() => {
    if (!isScrollLocked) return;
    
    updateScrollRefs();
    
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      syncScroll(target, target.scrollTop);
    };
    
    // Add listeners to all scroll areas
    Object.values(scrollRefs.current).forEach(element => {
      if (element) {
        element.addEventListener('scroll', handleScroll, { passive: true });
        console.log('🔗 SCROLL SYNC: Added scroll listener to:', element.tagName);
      }
    });
    
    return () => {
      Object.values(scrollRefs.current).forEach(element => {
        if (element) {
          element.removeEventListener('scroll', handleScroll);
          console.log('🔓 SCROLL SYNC: Removed scroll listener from:', element.tagName);
        }
      });
    };
  }, [isScrollLocked, syncScroll, updateScrollRefs]);
  
  // ==================== RETURN INTERFACE ====================
  
  return {
    scrollRefs,
    updateScrollRefs,
    syncScroll
  };
};
