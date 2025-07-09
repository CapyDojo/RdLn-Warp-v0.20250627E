import React, { useState, useEffect } from 'react';
import { Settings, ExternalLink } from 'lucide-react';
import { useExperimentalFeatures, useHasActiveExperimentalFeatures } from '../contexts/ExperimentalLayoutContext';
import { BaseComponentProps } from '../types/components';

interface FloatingDevToggleProps extends BaseComponentProps {
  isVisible?: boolean;
}

export const FloatingDevToggle: React.FC<FloatingDevToggleProps> = ({ 
  isVisible = true, 
  style, 
  className 
}) => {
  const hasActiveExperimentalFeatures = useHasActiveExperimentalFeatures();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Auto-collapse after 3 seconds when expanded
  useEffect(() => {
    if (isExpanded) {
      const timer = setTimeout(() => {
        setIsExpanded(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isExpanded]);

  // Hide tooltip when not visible
  useEffect(() => {
    if (!isVisible) {
      setShowTooltip(false);
    }
  }, [isVisible]);

  const handleOpenDashboard = () => {
    window.open('/dev-dashboard', '_blank', 'width=1200,height=800');
  };

  const handleNavigateToDashboard = () => {
    window.location.href = '/dev-dashboard';
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed bottom-6 right-6 z-50 ${className}`} 
      style={style}
    >
      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg">
          Access developer controls, experimental features, and performance monitoring
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
        </div>
      )}

      {/* Main Toggle Button */}
      <div className="flex flex-col items-end gap-2">
        
        {/* Expanded Actions */}
        {isExpanded && (
          <div className="flex flex-col gap-1 animate-fade-in">
            <button
              onClick={handleOpenDashboard}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg shadow-lg transition-all duration-200"
              title="Open dev dashboard in new window"
            >
              <ExternalLink className="w-4 h-4" />
              New Window
            </button>
            <button
              onClick={handleNavigateToDashboard}
              className="flex items-center gap-2 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded-lg shadow-lg transition-all duration-200"
              title="Navigate to dev dashboard"
            >
              <Settings className="w-4 h-4" />
              Navigate
            </button>
          </div>
        )}

        {/* Primary Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className={`
            relative flex items-center justify-center w-12 h-12 rounded-full shadow-lg 
            transition-all duration-300 hover:scale-110 active:scale-95
            ${hasActiveExperimentalFeatures 
              ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
              : 'bg-gray-600 hover:bg-gray-700 text-white'
            }
          `}
          title={hasActiveExperimentalFeatures 
            ? 'Dev Mode (Experimental features active)' 
            : 'Developer Mode'
          }
        >
          <Settings className={`w-6 h-6 transition-transform duration-200 ${isExpanded ? 'rotate-45' : ''}`} />
          
          {/* Active Features Indicator */}
          {hasActiveExperimentalFeatures && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-white">!</span>
            </div>
          )}
        </button>
      </div>

      {/* Keyboard Shortcut Hint */}
      <div className="absolute top-full right-0 mt-1 text-xs text-gray-500">
        Ctrl+Shift+D
      </div>
    </div>
  );
};

// Global keyboard shortcut handler
export const useDevToggleKeyboard = () => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'D') {
        event.preventDefault();
        window.location.href = '/dev-dashboard';
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
};
