import { useState, useEffect } from 'react';

export type MobileTabType = 'input' | 'results' | 'both';

/**
 * Hook to manage mobile tab interface state and panel visibility
 */
export const useMobileTabInterface = () => {
  const [activeTab, setActiveTab] = useState<MobileTabType>('both');
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-switch to results when they appear (mobile UX optimization)
  const handleResultsAppear = () => {
    if (isMobile && activeTab === 'input') {
      setActiveTab('results');
      console.log('🧪 Mobile Tab Interface: Auto-switched to results tab');
    }
  };

  // Get CSS classes to show/hide panels based on active tab
  const getPanelVisibility = (panelType: 'input' | 'output') => {
    if (!isMobile) return 'block'; // Always show on desktop

    switch (activeTab) {
      case 'input':
        return panelType === 'input' ? 'block' : 'none';
      case 'results':
        return panelType === 'output' ? 'block' : 'none';
      case 'both':
        return 'block';
      default:
        return 'block';
    }
  };

  return {
    activeTab,
    setActiveTab,
    isMobile,
    handleResultsAppear,
    getPanelVisibility
  };
};
