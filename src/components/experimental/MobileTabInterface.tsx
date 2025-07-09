import React, { useState, useEffect } from 'react';
import { FileText, Target, Grid3X3 } from 'lucide-react';
import { useExperimentalFeatures } from '../../contexts/ExperimentalLayoutContext';
import { useMobileTabInterface } from '../../hooks/useMobileTabInterface';

interface MobileTabInterfaceProps {
  /** Whether the tab interface is visible */
  isVisible: boolean;
  /** Whether results are available */
  hasResults: boolean;
  /** Callback when results appear for auto-switching */
  onResultsAppear?: () => void;
}

/**
 * Mobile Tab Interface - Experimental Feature #6
 * 
 * Provides tab-based navigation for mobile devices to switch between
 * input panels and results, addressing the mobile UX pain point of
 * "Takes cognitive work to work out which panel I'm looking at"
 * 
 * Features:
 * - [INPUT] [RESULTS] [BOTH] tab navigation
 * - Sticky positioning with backdrop blur
 * - Responsive design with proper touch targets
 * - Visual indicators for active tab
 */
export const MobileTabInterface: React.FC<MobileTabInterfaceProps> = ({
  isVisible,
  hasResults,
  onResultsAppear
}) => {
  const { mobileTabInterface } = useExperimentalFeatures();
  const { activeTab, setActiveTab, isMobile, handleResultsAppear } = useMobileTabInterface();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Call results appear handler when results become available
  useEffect(() => {
    if (hasResults) {
      handleResultsAppear();
      if (onResultsAppear) {
        onResultsAppear();
      }
    }
  }, [hasResults, handleResultsAppear, onResultsAppear]);

  // Don't render until mounted to avoid hydration issues
  if (!mounted || !isVisible || !mobileTabInterface || !isMobile) return null;

  const handleTabClick = (tab: 'input' | 'results' | 'both') => {
    console.log(`🧪 Mobile Tab Interface: Switching to ${tab} tab`);
    setActiveTab(tab);
  };

  return (
    <div className="mobile-tab-interface">
      <button
        className={`mobile-tab-button ${activeTab === 'input' ? 'active' : ''}`}
        onClick={() => handleTabClick('input')}
        aria-label="Show input panels"
      >
        <FileText className="w-4 h-4 mr-2" />
        <span>INPUT</span>
      </button>
      
      <button
        className={`mobile-tab-button ${activeTab === 'results' ? 'active' : ''}`}
        onClick={() => handleTabClick('results')}
        disabled={!hasResults}
        aria-label="Show results panel"
      >
        <Target className="w-4 h-4 mr-2" />
        <span>RESULTS</span>
      </button>
      
      <button
        className={`mobile-tab-button ${activeTab === 'both' ? 'active' : ''}`}
        onClick={() => handleTabClick('both')}
        aria-label="Show both input and results"
      >
        <Grid3X3 className="w-4 h-4 mr-2" />
        <span>BOTH</span>
      </button>
    </div>
  );
};
