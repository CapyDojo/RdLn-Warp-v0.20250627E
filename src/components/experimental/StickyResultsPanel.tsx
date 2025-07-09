import React, { useState, useEffect, useRef } from 'react';
import { Pin, PinOff, Minimize2, Maximize2 } from 'lucide-react';
import { useExperimentalFeatures } from '../../contexts/ExperimentalLayoutContext';

interface StickyResultsPanelProps {
  /** Whether the sticky panel is visible */
  isVisible: boolean;
  /** Whether results are available */
  hasResults: boolean;
  /** Content to display in the sticky panel */
  children: React.ReactNode;
  /** Callback when panel is pinned/unpinned */
  onTogglePin?: (isPinned: boolean) => void;
  /** Callback when panel is minimized/maximized */
  onToggleMinimize?: (isMinimized: boolean) => void;
}

/**
 * Sticky Results Panel - Experimental Feature #16
 * 
 * Makes the results panel sticky on scroll, addressing the mobile UX pain point of
 * "After scrolling down to read results, I lose context of which comparison I'm viewing"
 * 
 * Features:
 * - Sticky positioning that activates on scroll
 * - Pin/unpin functionality for user control
 * - Minimize/maximize for space management
 * - Smooth animations and transitions
 * - Accessibility support with proper ARIA labels
 */
export const StickyResultsPanel: React.FC<StickyResultsPanelProps> = ({
  isVisible,
  hasResults,
  children,
  onTogglePin,
  onToggleMinimize
}) => {
  const { stickyResultsPanel } = useExperimentalFeatures();
  const [isPinned, setIsPinned] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle scroll detection for sticky activation
  useEffect(() => {
    if (!mounted || !stickyResultsPanel || !hasResults) return;

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const shouldBeSticky = scrollTop > 200; // Activate after 200px scroll
      
      if (shouldBeSticky !== isScrolled) {
        setIsScrolled(shouldBeSticky);
        console.log(`🧪 Sticky Results Panel: Scroll state changed to ${shouldBeSticky ? 'sticky' : 'normal'}`);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mounted, stickyResultsPanel, hasResults, isScrolled]);

  // Don't render until mounted to avoid hydration issues
  if (!mounted || !isVisible || !hasResults) return null;

  const handleTogglePin = () => {
    const newPinned = !isPinned;
    setIsPinned(newPinned);
    console.log(`🧪 Sticky Results Panel: ${newPinned ? 'Pinned' : 'Unpinned'}`);
    if (onTogglePin) {
      onTogglePin(newPinned);
    }
  };

  const handleToggleMinimize = () => {
    const newMinimized = !isMinimized;
    setIsMinimized(newMinimized);
    console.log(`🧪 Sticky Results Panel: ${newMinimized ? 'Minimized' : 'Maximized'}`);
    if (onToggleMinimize) {
      onToggleMinimize(newMinimized);
    }
  };

  // Apply sticky styling based on state
  const stickyClasses = (isScrolled || isPinned) ? 'sticky-results-panel active' : 'sticky-results-panel';
  const minimizedClasses = isMinimized ? 'minimized' : '';

  return (
    <div 
      ref={panelRef}
      className={`${stickyClasses} ${minimizedClasses}`}
      role="region"
      aria-label="Sticky results panel"
    >
      {/* Control Bar */}
      <div className="sticky-controls">
        <button
          onClick={handleTogglePin}
          className={`sticky-control-button ${isPinned ? 'active' : ''}`}
          aria-label={isPinned ? 'Unpin results panel' : 'Pin results panel'}
          title={isPinned ? 'Unpin panel' : 'Pin panel'}
        >
          {isPinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
        </button>
        
        <button
          onClick={handleToggleMinimize}
          className="sticky-control-button"
          aria-label={isMinimized ? 'Maximize results panel' : 'Minimize results panel'}
          title={isMinimized ? 'Maximize panel' : 'Minimize panel'}
        >
          {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Panel Content */}
      <div className="sticky-content">
        {children}
      </div>
    </div>
  );
};
