import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface ResultsOverlayProps {
  isVisible: boolean;
  onClose: () => void;
  onForceClose?: () => void;
  children: React.ReactNode;
  className?: string;
}

/**
 * ResultsOverlay - Experimental Feature #8
 * 
 * Full-screen modal overlay for displaying results with improved visibility.
 * Addresses core UX pain point: "I have to scroll down and 'find' the output result"
 * 
 * Features:
 * - Full-screen modal with backdrop blur
 * - Smooth slide-in animation
 * - Responsive design with proper constraints
 * - Keyboard navigation (ESC to close)
 * - Accessibility support with ARIA labels
 * - Click outside to close
 * - Focus management
 */
export const ResultsOverlay: React.FC<ResultsOverlayProps> = ({
  isVisible,
  onClose,
  onForceClose,
  children,
  className = ''
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Handle keyboard navigation - ESC key triggers "Normal View" button
  useEffect(() => {
    if (!isVisible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        // ESC key should work like clicking "Normal View" button
        // Use forceClose if available for immediate response
        if (onForceClose) {
          onForceClose();
          console.log('🎯 Results Overlay: ESC key → Force close (like "Normal View" button)');
        } else {
          onClose();
          console.log('🎯 Results Overlay: ESC key → Close (like "Normal View" button)');
        }
      }
    };

    // Use capture phase to handle ESC before other handlers
    document.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => document.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [isVisible, onClose, onForceClose]);

  // Focus management
  useEffect(() => {
    if (isVisible) {
      // Focus the overlay container for keyboard navigation
      overlayRef.current?.focus();
      
      // Prevent body scroll when overlay is open
      document.body.style.overflow = 'hidden';
    } else {
      // Restore body scroll when overlay closes
      document.body.style.overflow = '';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
    };
  }, [isVisible]);

  // Handle click outside to close - works like "Normal View" button
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      onClose();
      console.log('🎯 Results Overlay: Click outside → Close (like "Normal View" button)');
    }
  };

  if (!isVisible) return null;

  // DEBUG: Log what classes are being applied
  const finalClassName = `experimental-results-overlay results-overlay ${className}`;
  console.log('🎯 ResultsOverlay DEBUG:', {
    className: finalClassName,
    documentTheme: document.documentElement.getAttribute('data-theme'),
    documentElement: document.documentElement,
    cssVariables: {
      glassPanel: getComputedStyle(document.documentElement).getPropertyValue('--glass-panel'),
      glassSubtle: getComputedStyle(document.documentElement).getPropertyValue('--glass-subtle'),
      glassStrong: getComputedStyle(document.documentElement).getPropertyValue('--glass-strong'),
      effectBackdropBlur: getComputedStyle(document.documentElement).getPropertyValue('--effect-backdropBlur')
    }
  });

  return (
    <div
      ref={overlayRef}
      className={finalClassName}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="results-overlay-title"
      aria-describedby="results-overlay-description"
      tabIndex={-1}
    >
      {/* Hidden title for screen readers */}
      <h2 id="results-overlay-title" className="sr-only">
        Document Comparison Results
      </h2>
      
      {/* Hidden description for screen readers */}
      <p id="results-overlay-description" className="sr-only">
        Full-screen view of the document comparison results. Press Escape or click outside to close.
      </p>

      {/* Direct RedlineOutput - no wrapper container */}
      <div className="results-overlay-direct-content">
        {children}
      </div>
    </div>
  );
};
