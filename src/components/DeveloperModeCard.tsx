import React, { useState, useEffect } from 'react';
import { Settings, Zap, Image, Monitor, Activity, BarChart3, Beaker, Target, Eye, Smartphone, ArrowUp, Layers, ExternalLink, Cog, Pin } from 'lucide-react';
import { BaseComponentProps } from '../types/components';
import { PerformanceDebugPanel, usePerformanceDebugPanel } from './PerformanceDebugPanel';
import { setupPerformanceDebugUtils } from '../utils/performanceDebugUtils';
import { appConfig } from '../config/appConfig';
import { useExperimentalFeatures, useHasActiveExperimentalFeatures } from '../contexts/ExperimentalLayoutContext';

interface DeveloperModeCardProps extends BaseComponentProps {
  showAdvancedOcrCard?: boolean;
  showPerformanceDemoCard?: boolean;
  onToggleAdvancedOcr?: () => void;
  onTogglePerformanceDemo?: () => void;
}

export const DeveloperModeCard: React.FC<DeveloperModeCardProps> = ({
  showAdvancedOcrCard = true,
  showPerformanceDemoCard = true,
  onToggleAdvancedOcr,
  onTogglePerformanceDemo,
  style,
  className
}) => {
  const { isVisible: isPerfDebugVisible, toggle: togglePerfDebug } = usePerformanceDebugPanel();
  const { features, toggleFeature, resetAllFeatures, enableTestGroup } = useExperimentalFeatures();
  const hasActiveExperimentalFeatures = useHasActiveExperimentalFeatures();
  const [perfMonitoringEnabled, setPerfMonitoringEnabled] = useState(() => {
    try {
      return localStorage.getItem('performance-monitoring-enabled') !== 'false';
    } catch {
      return true;
    }
  });
  

  // Setup performance debugging utilities on mount
  useEffect(() => {
    if (appConfig.dev.DEBUGGING.SHOW_PERFORMANCE_DEBUG) {
      setupPerformanceDebugUtils();
    }
  }, []);


  const handleTogglePerfMonitoring = () => {
    const newValue = !perfMonitoringEnabled;
    setPerfMonitoringEnabled(newValue);
    try {
      localStorage.setItem('performance-monitoring-enabled', newValue.toString());
      if (newValue) {
        console.log('✅ Performance monitoring enabled');
      } else {
        console.log('❌ Performance monitoring disabled');
      }
    } catch (error) {
      console.warn('Failed to toggle performance monitoring:', error);
    }
  };
  
  return (
    <div className="glass-panel border border-theme-neutral-300 rounded-lg p-4 shadow-lg transition-all duration-300">
      <h3 className="text-lg font-semibold text-theme-primary-900 mb-2 flex items-center gap-2">
        <Settings className="w-5 h-5 text-theme-primary-900" aria-label="Developer Mode" />
        Developer Mode
      </h3>
      
{/* Layout Section - Moved to Developer Dashboard */}
      <div className="mb-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="text-sm text-blue-800">
            <div className="font-medium mb-1">🔧 Layout Controls</div>
            <div className="text-xs">Layout controls moved to Developer Dashboard for better organization.</div>
            <div className="text-xs mt-1 opacity-75">Access via floating dev toggle or Ctrl+Shift+D</div>
          </div>
        </div>
      </div>
      
      {/* Performance Monitoring Section */}
      {appConfig.dev.DEBUGGING.SHOW_PERFORMANCE_DEBUG && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-theme-neutral-700 mb-2 flex items-center gap-1">
            <Activity className="w-4 h-4" />
            Performance Monitoring
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            <button
              onClick={handleTogglePerfMonitoring}
              className={`px-2 py-1.5 text-xs rounded transition-all flex items-center gap-1 ${
                perfMonitoringEnabled
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-gray-500 text-white hover:bg-gray-600'
              }`}
              title="Toggle performance data collection"
            >
              <BarChart3 className="w-3 h-3" />
              Monitoring {perfMonitoringEnabled ? 'ON' : 'OFF'}
            </button>
            
            <button
              onClick={togglePerfDebug}
              className={`px-2 py-1.5 text-xs rounded transition-all flex items-center gap-1 ${
                isPerfDebugVisible
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              title="Toggle performance debug panel visibility"
            >
              <Monitor className="w-3 h-3" />
              Debug Panel {isPerfDebugVisible ? 'ON' : 'OFF'}
            </button>
            
            <button
              onClick={() => {
                try {
                  if (window.showPerfReport) {
                    window.showPerfReport(60000); // Last minute
                  } else {
                    console.warn('Performance utilities not available. Enable monitoring first.');
                  }
                } catch (error) {
                  console.warn('Failed to show performance report:', error);
                }
              }}
              className="px-2 py-1.5 text-xs rounded transition-all flex items-center gap-1 bg-purple-200 text-purple-700 hover:bg-purple-300"
              title="Show performance report in console (Ctrl+Shift+R)"
            >
              <Activity className="w-3 h-3" />
              Show Report
            </button>
          </div>
          
          {/* Performance Shortcuts Info */}
          <div className="mt-2 text-xs text-theme-neutral-600">
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              <span>📊 <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Ctrl+Shift+R</kbd> Report</span>
              <span>📈 <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Ctrl+Shift+M</kbd> Metrics</span>
              <span>🔧 <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Ctrl+Shift+P</kbd> Panel</span>
              <span>🗑️ <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Ctrl+Shift+C</kbd> Clear</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Experimental UX Features Section */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-theme-neutral-700 mb-2 flex items-center gap-1">
          <Beaker className="w-4 h-4" />
          🧪 Experimental UX Features
          {hasActiveExperimentalFeatures && (
            <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full">
              ACTIVE
            </span>
          )}
        </h4>
        
        {/* Test Group Buttons */}
        <div className="mb-3">
          <div className="text-xs text-theme-neutral-600 mb-1">Quick Test Groups:</div>
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => enableTestGroup('visual-only')}
              className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700 hover:bg-blue-200 transition-all"
              title="Enable: Results Spotlight + Auto-Scroll"
            >
              Visual Only
            </button>
            <button
              onClick={() => enableTestGroup('navigation-enhanced')}
              className="px-2 py-1 text-xs rounded bg-green-100 text-green-700 hover:bg-green-200 transition-all"
              title="Enable: Results Spotlight + Auto-Scroll + Jump Button + Mobile Tabs"
            >
              Navigation Enhanced
            </button>
            <button
              onClick={() => enableTestGroup('results-first')}
              className="px-2 py-1 text-xs rounded bg-purple-100 text-purple-700 hover:bg-purple-200 transition-all"
              title="Enable: Results Spotlight + Auto-Scroll + Results First Animation"
            >
              Results First
            </button>
            <button
              onClick={() => enableTestGroup('mobile-optimized')}
              className="px-2 py-1 text-xs rounded bg-orange-100 text-orange-700 hover:bg-orange-200 transition-all"
              title="Enable: Mobile Tabs + Results Overlay"
            >
              Mobile Optimized
            </button>
            <button
              onClick={resetAllFeatures}
              className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
              title="Reset all experimental features to OFF"
            >
              Reset All
            </button>
          </div>
        </div>
        
        {/* Individual Feature Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {/* Visual Enhancement Features */}
          <button
            onClick={() => toggleFeature('resultsSpotlight')}
            className={`px-2 py-1.5 text-xs rounded transition-all flex items-center gap-1 ${
              features.resultsSpotlight
                ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            title="#1: Animated entrance with gold border and contextual header"
          >
            <Target className="w-3 h-3" />
            #1 Spotlight {features.resultsSpotlight ? 'ON' : 'OFF'}
          </button>
          
          
          <button
            onClick={() => toggleFeature('autoScrollToResults')}
            className={`px-2 py-1.5 text-xs rounded transition-all flex items-center gap-1 ${
              features.autoScrollToResults
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            title="#2: Automatically scroll to results when generated"
          >
            <ArrowUp className="w-3 h-3" />
            #2 Auto-Scroll {features.autoScrollToResults ? 'ON' : 'OFF'}
          </button>
          
          <button
            onClick={() => toggleFeature('mobileTabInterface')}
            className={`px-2 py-1.5 text-xs rounded transition-all flex items-center gap-1 ${
              features.mobileTabInterface
                ? 'bg-purple-500 text-white hover:bg-purple-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            title="#6: [INPUT] [RESULTS] [BOTH] tabs for mobile"
          >
            <Smartphone className="w-3 h-3" />
            #6 Mobile Tabs {features.mobileTabInterface ? 'ON' : 'OFF'}
          </button>
          
          <button
            onClick={() => toggleFeature('floatingJumpButton')}
            className={`px-2 py-1.5 text-xs rounded transition-all flex items-center gap-1 ${
              features.floatingJumpButton
                ? 'bg-indigo-500 text-white hover:bg-indigo-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            title="#7: Follows scroll, appears when results ready"
          >
            <Monitor className="w-3 h-3" />
            #7 Jump Button {features.floatingJumpButton ? 'ON' : 'OFF'}
          </button>
          
          <button
            onClick={() => toggleFeature('resultsFirstAnimation')}
            className={`px-2 py-1.5 text-xs rounded transition-all flex items-center gap-1 ${
              features.resultsFirstAnimation
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            title="#9: Output replaces input position with smooth animation"
          >
            <Layers className="w-3 h-3" />
            #9 Results First {features.resultsFirstAnimation ? 'ON' : 'OFF'}
          </button>
          
          <button
            onClick={() => toggleFeature('refinedResultsFirst')}
            className={`px-2 py-1.5 text-xs rounded transition-all flex items-center gap-1 ${
              features.refinedResultsFirst
                ? 'bg-violet-500 text-white hover:bg-violet-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            title="#10: 2-second overlay then animate to top position"
          >
            <Layers className="w-3 h-3" />
            #10 Refined First {features.refinedResultsFirst ? 'ON' : 'OFF'}
          </button>
          
          <button
            onClick={() => toggleFeature('resultsOverlay')}
            className={`px-2 py-1.5 text-xs rounded transition-all flex items-center gap-1 ${
              features.resultsOverlay
                ? 'bg-teal-500 text-white hover:bg-teal-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            title="#8: Full-screen modal overlay for results visibility"
          >
            <Eye className="w-3 h-3" />
            #8 Results Overlay {features.resultsOverlay ? 'ON' : 'OFF'}
          </button>
          
          <button
            onClick={() => toggleFeature('popoutResultsWindow')}
            className={`px-2 py-1.5 text-xs rounded transition-all flex items-center gap-1 ${
              features.popoutResultsWindow
                ? 'bg-pink-500 text-white hover:bg-pink-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            title="#12: Results open in separate browser window"
          >
            <ExternalLink className="w-3 h-3" />
            #12 Pop-out {features.popoutResultsWindow ? 'ON' : 'OFF'}
          </button>
          
          <button
            onClick={() => toggleFeature('userConfigurableOrder')}
            className={`px-2 py-1.5 text-xs rounded transition-all flex items-center gap-1 ${
              features.userConfigurableOrder
                ? 'bg-cyan-500 text-white hover:bg-cyan-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            title="#13: Save user's preferred layout order"
          >
            <Cog className="w-3 h-3" />
            #13 User Config {features.userConfigurableOrder ? 'ON' : 'OFF'}
          </button>
          
          <button
            onClick={() => toggleFeature('stickyResultsPanel')}
            className={`px-2 py-1.5 text-xs rounded transition-all flex items-center gap-1 ${
              features.stickyResultsPanel
                ? 'bg-orange-500 text-white hover:bg-orange-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            title="#16: Fixed position panel with pin/unpin and minimize controls"
          >
            <Pin className="w-3 h-3" />
            #16 Sticky Panel {features.stickyResultsPanel ? 'ON' : 'OFF'}
          </button>
        </div>
        
        {/* Feature Status Info */}
        <div className="mt-2 text-xs text-theme-neutral-600">
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <span>🎯 Addresses: "Can't find results" + "Panel confusion"</span>
            <span>📊 {Object.values(features).filter(f => f).length}/13 features active</span>
            <span>💾 Settings persist across sessions</span>
          </div>
        </div>
      </div>
      
      <div className="flex gap-2">
        {onToggleAdvancedOcr && (
          <button
            onClick={onToggleAdvancedOcr}
            className={`px-2 py-1 text-xs rounded transition-all ${
              showAdvancedOcrCard 
                ? 'bg-green-500 text-white hover:bg-green-600' 
                : 'bg-gray-500 text-white hover:bg-gray-600'
            }`}
            title="Toggle Advanced OCR card visibility"
            aria-label={`Toggle Advanced OCR card visibility ${showAdvancedOcrCard ? 'ON' : 'OFF'}`}
          >
            <Zap className="w-4 h-4" />
            <span className="ml-1">OCR {showAdvancedOcrCard ? 'ON' : 'OFF'}</span>
          </button>
        )}
        {onTogglePerformanceDemo && (
          <button
            onClick={onTogglePerformanceDemo}
            className={`px-2 py-1 text-xs rounded transition-all ${
              showPerformanceDemoCard 
                ? 'bg-green-500 text-white hover:bg-green-600' 
                : 'bg-gray-500 text-white hover:bg-gray-600'
            }`}
            title="Toggle Performance Demo card visibility"
            aria-label={`Toggle Performance Demo card visibility ${showPerformanceDemoCard ? 'ON' : 'OFF'}`}
          >
            <Image className="w-4 h-4" />
            <span className="ml-1">Demo {showPerformanceDemoCard ? 'ON' : 'OFF'}</span>
          </button>
        )}
        <a 
          href="/logo-test" 
          className="px-3 py-2 bg-theme-primary-100/50 hover:bg-theme-primary-200/50 text-theme-primary-700 hover:text-theme-primary-800 text-sm font-medium rounded-lg border border-theme-primary-200/50 transition-all duration-200"
          title="View logo concept designs"
          aria-label="View logo concept designs"
        >
          Logo Test
        </a>
        <a 
          href="/cupping-test" 
          className="px-3 py-2 bg-theme-accent-100/50 hover:bg-theme-accent-200/50 text-theme-accent-700 hover:text-theme-accent-800 text-sm font-medium rounded-lg border border-theme-accent-200/50 transition-all duration-200"
          title="View cupping effect investigations"
          aria-label="View cupping effect investigations"
        >
          Cupping Test
        </a>
      </div>
      
      {/* Performance Debug Panel */}
      <PerformanceDebugPanel 
        isVisible={isPerfDebugVisible && appConfig.dev.DEBUGGING.SHOW_PERFORMANCE_DEBUG} 
        onToggle={togglePerfDebug}
      />
    </div>
  );
};
