import React, { useState } from 'react';
import { Activity, BarChart3, RotateCcw } from 'lucide-react';
import { PerformanceDebugPanel, usePerformanceDebugPanel } from '../PerformanceDebugPanel';
import { BaseComponentProps } from '../../types/components';

interface PerformanceMonitoringPanelProps extends BaseComponentProps {
  // Optional props for future expansion
}

export const PerformanceMonitoringPanel: React.FC<PerformanceMonitoringPanelProps> = ({
  style,
  className
}) => {
  const { isVisible: isPerfDebugVisible, toggle: togglePerfDebug } = usePerformanceDebugPanel();
  const [perfMonitoringEnabled, setPerfMonitoringEnabled] = useState(() => {
    try {
      return localStorage.getItem('performance-monitoring-enabled') !== 'false';
    } catch {
      return true;
    }
  });

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
    <div className={`space-y-4 ${className}`} style={style}>
      
      {/* Debug Controls */}
      <div className="bg-theme-neutral-100 border border-theme-neutral-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="w-4 h-4 text-theme-primary-600" />
          <span className="text-sm font-medium text-theme-primary-800">
            Performance Monitoring
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={handleTogglePerfMonitoring}
            className={`px-3 py-2 text-sm rounded transition-all flex items-center gap-2 ${
              perfMonitoringEnabled
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-gray-500 text-white hover:bg-gray-600'
            }`}
            title="Toggle performance data collection"
          >
            <BarChart3 className="w-4 h-4" />
            Monitoring {perfMonitoringEnabled ? 'ON' : 'OFF'}
          </button>
          <button
            onClick={togglePerfDebug}
            className={`px-3 py-2 text-sm rounded transition-all flex items-center gap-2 ${
              isPerfDebugVisible
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            title="Toggle performance debug panel visibility"
          >
            <Activity className="w-4 h-4" />
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
            className="px-3 py-2 text-sm rounded transition-all flex items-center gap-2 bg-purple-200 text-purple-700 hover:bg-purple-300"
            title="Show performance report in console"
          >
            <RotateCcw className="w-4 h-4" />
            Show Report
          </button>
        </div>
      </div>

      {/* Performance Debug Panel */}
      <PerformanceDebugPanel
        isVisible={isPerfDebugVisible}
        onToggle={togglePerfDebug}
      />
    </div>
  );
};

