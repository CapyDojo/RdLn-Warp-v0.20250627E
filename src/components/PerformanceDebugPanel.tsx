import React, { useState, useEffect } from 'react';
import { PerformanceMonitor } from '../services/PerformanceMonitor';
import type { PerformanceReport, MetricCategory } from '../types/performance-types';
import { appConfig } from '../config/appConfig';

interface PerformanceDebugPanelProps {
  isVisible?: boolean;
  onToggle?: () => void;
}

export const PerformanceDebugPanel: React.FC<PerformanceDebugPanelProps> = ({
  isVisible = false,
  onToggle
}) => {
  const [report, setReport] = useState<PerformanceReport | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<MetricCategory>('ui');
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!isVisible) return;

    const updateReport = () => {
      try {
        const perfMonitor = PerformanceMonitor.getInstance();
        const newReport = perfMonitor.getPerformanceReport(60000); // Last minute
        setReport(newReport);
      } catch (error) {
        console.warn('Failed to get performance report:', error);
      }
    };

    updateReport();
    const interval = setInterval(updateReport, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible || !appConfig.dev.DEBUGGING.SHOW_PERFORMANCE_DEBUG) {
    return null;
  }

  const categories: MetricCategory[] = ['ui', 'ocr', 'system', 'business'];

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      width: isExpanded ? '400px' : '250px',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      borderRadius: '8px',
      padding: '12px',
      fontSize: '12px',
      fontFamily: 'monospace',
      zIndex: 10000,
      border: '1px solid #333'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '8px'
      }}>
        <h4 style={{ margin: 0 }}>Performance Monitor</h4>
        <div>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            style={{ 
              background: 'none', 
              border: '1px solid #666', 
              color: 'white', 
              padding: '2px 6px',
              marginRight: '4px',
              cursor: 'pointer'
            }}
          >
            {isExpanded ? '−' : '+'}
          </button>
          <button 
            onClick={onToggle}
            style={{ 
              background: 'none', 
              border: '1px solid #666', 
              color: 'white', 
              padding: '2px 6px',
              cursor: 'pointer'
            }}
          >
            ×
          </button>
        </div>
      </div>

      {isExpanded && (
        <>
          <div style={{ marginBottom: '8px' }}>
            <label>Category: </label>
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value as MetricCategory)}
              style={{ 
                background: '#333', 
                color: 'white', 
                border: '1px solid #666',
                padding: '2px'
              }}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat.toUpperCase()}</option>
              ))}
            </select>
          </div>

          {report && (
            <div>
              <div style={{ marginBottom: '8px' }}>
                <strong>Last Minute Summary:</strong>
              </div>
              
              {/* Key Metrics */}
              <div style={{ marginBottom: '8px' }}>
                <div>Total Metrics: {report.summary?.totalMetrics || 0}</div>
                <div>Avg Collection Time: {report.summary?.averageCollectionTime?.toFixed(2) || '0.00'}ms</div>
                <div>Error Rate: {report.summary?.errorRate?.toFixed(1) || '0.0'}%</div>
              </div>

              {/* Category-specific metrics */}
              {report.metricsByCategory && report.metricsByCategory[selectedCategory] && Object.keys(report.metricsByCategory[selectedCategory]).length > 0 ? (
                <div>
                  <strong>{selectedCategory.toUpperCase()} Metrics:</strong>
                  {Object.entries(report.metricsByCategory[selectedCategory]).map(([name, data]) => (
                    <div key={name} style={{ marginLeft: '8px', fontSize: '10px' }}>
                      <div>{name}:</div>
                      <div style={{ marginLeft: '8px' }}>
                        Avg: {data.average?.toFixed(2) || '0.00'}ms | 
                        Max: {data.maximum?.toFixed(2) || '0.00'}ms | 
                        Count: {data.count || 0}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: '10px', color: '#999', fontStyle: 'italic' }}>
                  No {selectedCategory.toUpperCase()} metrics available yet.
                  <br />Use the app to generate performance data.
                </div>
              )}

              {/* Recent alerts */}
              {report.alerts && report.alerts.length > 0 && (
                <div style={{ marginTop: '8px', color: '#ff6b6b' }}>
                  <strong>Recent Alerts:</strong>
                  {report.alerts.slice(0, 3).map((alert, idx) => (
                    <div key={idx} style={{ fontSize: '10px', marginLeft: '8px' }}>
                      {alert.metricName}: {alert.message}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {!isExpanded && (
        <div style={{ fontSize: '10px' }}>
          {report ? (
            <>
              <div>Metrics: {report.summary?.totalMetrics || 0}</div>
              <div>Avg: {report.summary?.averageCollectionTime?.toFixed(1) || '0.0'}ms</div>
              {report.alerts && report.alerts.length > 0 && (
                <div style={{ color: '#ff6b6b' }}>⚠ {report.alerts.length} alerts</div>
              )}
            </>
          ) : (
            <div style={{ color: '#999', fontStyle: 'italic' }}>
              Loading performance data...
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Hook to toggle the debug panel
export const usePerformanceDebugPanel = () => {
  const [isVisible, setIsVisible] = useState(() => {
    try {
      return localStorage.getItem('performance-debug-visible') === 'true';
    } catch {
      return false;
    }
  });

  const toggle = () => {
    const newValue = !isVisible;
    setIsVisible(newValue);
    try {
      localStorage.setItem('performance-debug-visible', newValue.toString());
    } catch {
      // Ignore localStorage errors
    }
  };

  return { isVisible, toggle };
};
