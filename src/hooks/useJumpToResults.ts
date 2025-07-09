import { useCallback } from 'react';

/**
 * Hook for smooth scrolling to results section
 * Used by experimental features like Floating Jump Button
 */
export const useJumpToResults = () => {
  const jumpToResults = useCallback(() => {
    const outputPanel = document.querySelector('[data-output-panel]');
    
    if (outputPanel) {
      // Calculate scroll position to center results in viewport
      const rect = outputPanel.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementHeight = rect.height;
      
      // Calculate position to center the element in viewport
      const targetScrollTop = window.scrollY + rect.top - (windowHeight / 2) + (elementHeight / 2);
      
      // Smooth scroll to the calculated position
      window.scrollTo({
        top: Math.max(0, targetScrollTop),
        behavior: 'smooth'
      });
      
      // Analytics tracking
      console.log('🧪 Jump to results executed - smooth scroll to center');
    } else {
      console.warn('🧪 Jump to results failed - output panel not found');
    }
  }, []);

  return { jumpToResults };
};
