import React, { useState, useEffect, useRef } from 'react';
import { ArrowDown, Target } from 'lucide-react';

interface FloatingJumpButtonProps {
  /** Whether the button should be visible */
  isVisible: boolean;
  /** Callback when button is clicked */
  onJumpToResults: () => void;
  /** Whether results are currently available */
  hasResults: boolean;
}

/**
 * Floating Jump Button - Experimental Feature #7
 * 
 * A floating action button that appears when results are ready,
 * allowing users to quickly jump to the results section.
 * 
 * Features:
 * - Appears when results are generated
 * - Follows scroll position (stays visible)
 * - Smooth animations and hover effects
 * - Automatically hides when results are in view
 */
export const FloatingJumpButton: React.FC<FloatingJumpButtonProps> = ({
  isVisible,
  onJumpToResults,
  hasResults
}) => {
  const [isResultsInView, setIsResultsInView] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Monitor if results are currently in view
  useEffect(() => {
    if (!hasResults) {
      setIsResultsInView(false);
      return;
    }

    // Create intersection observer to detect when results are in view
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        setIsResultsInView(entry.isIntersecting);
      },
      {
        threshold: 0.3, // Show button when results are 30% out of view
        rootMargin: '-50px 0px'
      }
    );

    // Find and observe the output panel
    const outputPanel = document.querySelector('[data-output-panel]');
    if (outputPanel && observerRef.current) {
      observerRef.current.observe(outputPanel);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasResults]);

  // Handle button click with analytics
  const handleClick = () => {
    console.log('🧪 Floating Jump Button clicked - scrolling to results');
    onJumpToResults();
  };

  // Button should be visible if:
  // 1. Feature is enabled (isVisible)
  // 2. Results exist (hasResults)
  // 3. Results are NOT currently in view (!isResultsInView)
  const shouldShow = isVisible && hasResults && !isResultsInView;

  return (
    <button
      className={`floating-jump-button ${shouldShow ? '' : 'hidden'}`}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title="Jump to Results"
      aria-label="Jump to comparison results"
    >
      <div className="relative">
        {/* Primary icon */}
        <Target className="w-6 h-6 transition-all duration-300" />
        
        {/* Animated arrow indicator */}
        <div className={`absolute -bottom-1 -right-1 transition-all duration-300 ${
          isHovered ? 'scale-110 opacity-100' : 'scale-90 opacity-70'
        }`}>
          <ArrowDown className="w-3 h-3 text-white" />
        </div>
        
        {/* Pulse animation ring */}
        <div className={`absolute inset-0 rounded-full border-2 border-white/30 ${
          isHovered ? 'animate-ping' : ''
        }`} />
      </div>
    </button>
  );
};
