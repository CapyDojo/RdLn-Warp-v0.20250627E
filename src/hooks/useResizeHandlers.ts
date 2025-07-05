import { useRef, useCallback, useEffect, startTransition, useState } from 'react';
import { startDragOperation, endDragOperation, calculateResizeHeight } from '../utils/mouseHandlers';

interface UseResizeHandlersConfig {
  /** Whether to use CSS-based resize (true) or React state fallback (false) */
  USE_CSS_RESIZE: boolean;
  /** Minimum height for input panels */
  minHeight: number;
  /** Minimum height for output panel */
  minOutputHeight: number;
  /** Maximum height for input panels */
  maxHeight?: number;
  /** Maximum height for output panel */
  maxOutputHeight?: number;
}

interface PanelResizeHandlers {
  /** Mouse down handler for panel resize */
  handleMouseDown: (e: React.MouseEvent) => void;
  /** Ref for desktop input panels container */
  desktopInputPanelsRef: React.RefObject<HTMLDivElement>;
  /** Ref for mobile input panels container */
  mobileInputPanelsRef: React.RefObject<HTMLDivElement>;
}

interface OutputResizeHandlers {
  /** Mouse down handler for output resize */
  handleMouseDown: (e: React.MouseEvent) => void;
  /** Ref for output resize handle */
  outputResizeHandleRef: React.RefObject<HTMLDivElement>;
}

interface UseResizeHandlersReturn {
  /** Handlers for input panel resizing */
  panelResizeHandlers: PanelResizeHandlers;
  /** Handlers for output panel resizing */
  outputResizeHandlers: OutputResizeHandlers;
  /** Fallback React state for panel height (when CSS resize disabled) */
  panelHeight: number;
  /** Fallback React state for output height (when CSS resize disabled) */
  outputHeight: number;
  /** Function to set panel height via CSS or React state */
  setPanelHeightCSS: (height: number) => void;
  /** Function to set output height via CSS or React state */
  setOutputHeightCSS: (height: number) => void;
}

/**
 * useResizeHandlers Hook
 * 
 * Manages all resize functionality for input panels and output panel.
 * Supports both CSS-based direct manipulation and React state fallback.
 * 
 * Features:
 * - CSS-first approach for performance
 * - Automatic layout detection (desktop/mobile)
 * - Proper cleanup and event management
 * - Pre-warming system for StrictMode compatibility
 */
export const useResizeHandlers = ({
  USE_CSS_RESIZE,
  minHeight,
  minOutputHeight,
  maxHeight = 800,
  maxOutputHeight = 900
}: UseResizeHandlersConfig): UseResizeHandlersReturn => {
  
  // ==================== REFS ====================
  
  // DOM refs for direct manipulation
  const desktopInputPanelsRef = useRef<HTMLDivElement>(null);
  const mobileInputPanelsRef = useRef<HTMLDivElement>(null);
  const outputResizeHandleRef = useRef<HTMLDivElement>(null);
  
  // Drag state refs
  const isDraggingRef = useRef(false);
  const isOutputDraggingRef = useRef(false);
  const dragStartY = useRef(0);
  const startHeight = useRef(0);
  const outputDragStartY = useRef(0);
  const outputStartHeight = useRef(0);
  
  // ==================== FALLBACK REACT STATE ====================
  
  const [panelHeight, setPanelHeight] = useState(400);
  const [outputHeight, setOutputHeight] = useState(500);
  
  // ==================== CSS MANIPULATION HELPERS ====================
  
  const setPanelHeightCSS = useCallback((height: number) => {
    if (!USE_CSS_RESIZE) {
      setPanelHeight(height);
      return;
    }
    
    // Direct CSS manipulation of TextInputPanel inner content - no React re-render
    // Smart visibility detection: check which ref points to a visible element
    let activeRef = null;
    
    // Check desktop ref first
    if (desktopInputPanelsRef.current && desktopInputPanelsRef.current.offsetParent !== null) {
      activeRef = desktopInputPanelsRef.current;
    }
    // If desktop is hidden, check mobile ref
    else if (mobileInputPanelsRef.current && mobileInputPanelsRef.current.offsetParent !== null) {
      activeRef = mobileInputPanelsRef.current;
    }
    
    if (activeRef) {
      // Target the actual glass-panel-inner-content divs that have the height styling
      const innerContentElements = activeRef.querySelectorAll('.glass-panel-inner-content');
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
    
    // ELEGANT FIX: Use proper data-output-panel container selector
    const outputElement = document.querySelector('[data-output-panel] .glass-panel-inner-content');
    if (outputElement) {
      (outputElement as HTMLElement).style.height = `${height - 120}px`; // Account for header/footer
    }
  }, [USE_CSS_RESIZE]);
  
  // ==================== PANEL RESIZE HANDLERS ====================
  
  const handlePanelMouseMove = useCallback((e: MouseEvent) => {
    if (!isDraggingRef.current) return;
    
    // const moveStartTime = performance.now(); // Unused
    
    // Calculate new height using utility function
    const newHeight = calculateResizeHeight(
      e.clientY,
      dragStartY.current,
      startHeight.current,
      minHeight,
      maxHeight
    );
    
    // CSS manipulation with startTransition for non-blocking operations
    startTransition(() => {
      setPanelHeightCSS(newHeight);
    });
    
    // const moveEndTime = performance.now(); // Unused
    // const moveDuration = moveEndTime - moveStartTime; // Unused
    
    // Only log slow mouse moves to identify bottlenecks
    // (Logging disabled for production)
  }, [minHeight, maxHeight, setPanelHeightCSS]);
  
  const handlePanelMouseUp = useCallback(() => {
    isDraggingRef.current = false;
    endDragOperation({ onMouseMove: handlePanelMouseMove, onMouseUp: handlePanelMouseUp });
  }, [handlePanelMouseMove]);
  
  const handlePanelMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    
    // Capture initial state - use actual DOM height instead of React state
    dragStartY.current = e.clientY;
    
    if (USE_CSS_RESIZE) {
      // Smart visibility detection: check which ref points to a visible element (same logic as setPanelHeightCSS)
      let activeRef = null;
      
      // Check desktop ref first
      if (desktopInputPanelsRef.current && desktopInputPanelsRef.current.offsetParent !== null) {
        activeRef = desktopInputPanelsRef.current;
      }
      // If desktop is hidden, check mobile ref
      else if (mobileInputPanelsRef.current && mobileInputPanelsRef.current.offsetParent !== null) {
        activeRef = mobileInputPanelsRef.current;
      }
      
      if (activeRef) {
        const firstPanel = activeRef.querySelector('.glass-panel-inner-content') as HTMLElement;
        if (firstPanel) {
          const computedHeight = firstPanel.getBoundingClientRect().height;
          startHeight.current = computedHeight;
        } else {
          startHeight.current = 400; // fallback
        }
      } else {
        startHeight.current = 400; // fallback
      }
    } else {
      // Use React state for fallback mode
      startHeight.current = panelHeight;
    }
    
    isDraggingRef.current = true;
    startDragOperation({ onMouseMove: handlePanelMouseMove, onMouseUp: handlePanelMouseUp });
  }, [handlePanelMouseMove, handlePanelMouseUp, panelHeight, USE_CSS_RESIZE]);
  
  // ==================== OUTPUT RESIZE HANDLERS ====================
  
  const handleOutputMouseMove = useCallback((e: MouseEvent) => {
    if (!isOutputDraggingRef.current) return;
    
    // Calculate new height using utility function
    const newHeight = calculateResizeHeight(
      e.clientY,
      outputDragStartY.current,
      outputStartHeight.current,
      minOutputHeight,
      maxOutputHeight
    );
    
    // CSS manipulation with startTransition for non-blocking operations
    startTransition(() => {
      setOutputHeightCSS(newHeight);
    });
  }, [minOutputHeight, maxOutputHeight, setOutputHeightCSS]);
  
  const handleOutputMouseUp = useCallback(() => {
    isOutputDraggingRef.current = false;
    endDragOperation({ onMouseMove: handleOutputMouseMove, onMouseUp: handleOutputMouseUp });
  }, [handleOutputMouseMove]);
  
  const handleOutputMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    
    // Capture initial state - use actual DOM height instead of stale React state
    outputDragStartY.current = e.clientY;
    
    if (USE_CSS_RESIZE) {
      // Get actual height from DOM for CSS-based resize - target RedlineOutput directly
      const outputElements = document.querySelectorAll('.glass-panel.glass-content-panel .glass-panel-inner-content');
      // Get the last one (output panel) since input panels are first
      const outputElement = outputElements[outputElements.length - 1];
      if (outputElement) {
        const computedHeight = outputElement.getBoundingClientRect().height;
        // Add 120px to match what setOutputHeightCSS expects (total panel height)
        outputStartHeight.current = computedHeight + 120;
      } else {
        outputStartHeight.current = 500; // fallback
      }
    } else {
      // Use React state for fallback mode
      outputStartHeight.current = outputHeight;
    }
    
    isOutputDraggingRef.current = true;
    startDragOperation({ onMouseMove: handleOutputMouseMove, onMouseUp: handleOutputMouseUp });
  }, [handleOutputMouseMove, handleOutputMouseUp, outputHeight, USE_CSS_RESIZE]);
  
  // ==================== INITIALIZATION ====================
  
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
  
  // ==================== RETURN INTERFACE ====================
  
  return {
    panelResizeHandlers: {
      handleMouseDown: handlePanelMouseDown,
      desktopInputPanelsRef,
      mobileInputPanelsRef
    },
    outputResizeHandlers: {
      handleMouseDown: handleOutputMouseDown,
      outputResizeHandleRef
    },
    panelHeight,
    outputHeight,
    setPanelHeightCSS,
    setOutputHeightCSS
  };
};
