/**
 * PerformanceContext - React Context for centralized performance monitoring
 * 
 * Provides application-wide access to performance monitoring capabilities
 * with configuration management, real-time metrics, and development tools.
 * 
 * Features:
 * - Global performance monitoring state
 * - Configuration management via context
 * - Real-time performance metrics access
 * - Development mode debugging tools
 * - Alert management and monitoring
 * - Performance report generation
 */

import React, { createContext, useContext, useReducer, useCallback, useEffect, useMemo } from 'react';
import { performanceMonitor } from '../services/PerformanceMonitor';
import { appConfig } from '../config/appConfig';
import type { 
  PerformanceContext as IPerformanceContext,
  PerformanceMonitoringState,
  PerformanceMonitoringActions,
  PerformanceConfig,
  PerformanceAlert,
  MetricCategory,
  PerformanceReport
} from '../types/performance-types';

// Action types for the performance monitoring reducer
type PerformanceAction =
  | { type: 'ENABLE_MONITORING' }
  | { type: 'DISABLE_MONITORING' }
  | { type: 'UPDATE_CONFIG'; payload: Partial<PerformanceConfig> }
  | { type: 'ADD_ALERT'; payload: PerformanceAlert }
  | { type: 'ACKNOWLEDGE_ALERT'; payload: string }
  | { type: 'CLEAR_METRICS' }
  | { type: 'UPDATE_RECENT_METRICS'; payload: Map<string, any> }
  | { type: 'UPDATE_COMPONENT_PERFORMANCE'; payload: Map<string, any> };

// Initial state for performance monitoring
const initialState: PerformanceMonitoringState = {
  isEnabled: true,
  config: {
    level: appConfig.env.IS_DEVELOPMENT ? 'comprehensive' : 'standard',
    samplingRate: appConfig.env.IS_DEVELOPMENT ? 1.0 : 0.1,
    bufferSize: 1000,
    flushInterval: 60000,
    thresholds: {
      responseTime: 1000,
      errorRate: 5,
      memoryUsage: 100 * 1024 * 1024
    },
    anonymizeData: !appConfig.env.IS_DEVELOPMENT,
    optOutAvailable: true
  },
  alerts: [],
  recentMetrics: new Map(),
  componentPerformance: new Map()
};

// Reducer for performance monitoring state
function performanceReducer(
  state: PerformanceMonitoringState, 
  action: PerformanceAction
): PerformanceMonitoringState {
  switch (action.type) {
    case 'ENABLE_MONITORING':
      return { ...state, isEnabled: true };
    
    case 'DISABLE_MONITORING':
      return { ...state, isEnabled: false };
    
    case 'UPDATE_CONFIG':
      return { 
        ...state, 
        config: { ...state.config, ...action.payload } 
      };
    
    case 'ADD_ALERT':
      return {
        ...state,
        alerts: [...state.alerts, action.payload]
      };
    
    case 'ACKNOWLEDGE_ALERT':
      return {
        ...state,
        alerts: state.alerts.map(alert =>
          alert.id === action.payload 
            ? { ...alert, acknowledged: true }
            : alert
        )
      };
    
    case 'CLEAR_METRICS':
      return {
        ...state,
        recentMetrics: new Map(),
        componentPerformance: new Map()
      };
    
    case 'UPDATE_RECENT_METRICS':
      return {
        ...state,
        recentMetrics: action.payload
      };
    
    case 'UPDATE_COMPONENT_PERFORMANCE':
      return {
        ...state,
        componentPerformance: action.payload
      };
    
    default:
      return state;
  }
}

// Context implementation
const PerformanceContext = createContext<{
  state: PerformanceMonitoringState;
  actions: PerformanceMonitoringActions;
  context: IPerformanceContext;
} | null>(null);

// Provider component props
interface PerformanceProviderProps {
  children: React.ReactNode;
  initialConfig?: Partial<PerformanceConfig>;
  enableDevTools?: boolean;
}

/**
 * PerformanceProvider - Context provider for performance monitoring
 */
export function PerformanceProvider({
  children,
  initialConfig = {},
  enableDevTools = appConfig.env.IS_DEVELOPMENT
}: PerformanceProviderProps) {
  const [state, dispatch] = useReducer(performanceReducer, {
    ...initialState,
    config: { ...initialState.config, ...initialConfig }
  });

  // Initialize performance monitor with context config
  useEffect(() => {
    performanceMonitor.updateConfig(state.config);
    performanceMonitor.setEnabled(state.isEnabled);
  }, [state.config, state.isEnabled]);

  // Actions implementation
  const actions: PerformanceMonitoringActions = useMemo(() => ({
    enable: () => {
      dispatch({ type: 'ENABLE_MONITORING' });
      performanceMonitor.setEnabled(true);
    },

    disable: () => {
      dispatch({ type: 'DISABLE_MONITORING' });
      performanceMonitor.setEnabled(false);
    },

    updateConfig: (newConfig: Partial<PerformanceConfig>) => {
      dispatch({ type: 'UPDATE_CONFIG', payload: newConfig });
      performanceMonitor.updateConfig(newConfig);
    },

    clearMetrics: () => {
      dispatch({ type: 'CLEAR_METRICS' });
      performanceMonitor.clearMetrics();
    },

    acknowledgeAlert: (alertId: string) => {
      dispatch({ type: 'ACKNOWLEDGE_ALERT', payload: alertId });
    },

    exportReport: (format: 'json' | 'csv') => {
      const report = performanceMonitor.getPerformanceReport();
      
      if (format === 'json') {
        return JSON.stringify({
          ...report,
          metrics: Array.from(report.metrics.entries())
        }, null, 2);
      } else {
        // CSV format
        const headers = ['Metric Name', 'Category', 'Count', 'Average', 'Min', 'Max', 'P95', 'Trend'];
        const rows = Array.from(report.metrics.entries()).map(([key, stats]) => [
          stats.name,
          stats.category,
          stats.count.toString(),
          stats.average.toFixed(2),
          stats.min.toFixed(2),
          stats.max.toFixed(2),
          stats.p95.toFixed(2),
          stats.trend
        ]);
        
        return [headers, ...rows].map(row => row.join(',')).join('\n');
      }
    }
  }), []);

  // Context interface implementation
  const contextInterface: IPerformanceContext = useMemo(() => ({
    isEnabled: state.isEnabled,
    config: state.config,
    
    recordMetric: (name: string, value: number, category: MetricCategory, metadata?: Record<string, any>) => {
      if (!state.isEnabled) return;
      performanceMonitor.recordMetric(name, value, category, metadata);
    },

    startTiming: (name: string, category: MetricCategory) => {
      if (!state.isEnabled) return () => {};
      return performanceMonitor.startTiming(name, category);
    },

    getCurrentMetric: (name: string, category: MetricCategory) => {
      return performanceMonitor.getCurrentMetric(name, category);
    },

    getReport: (timeRange?: number, categories?: MetricCategory[]) => {
      return performanceMonitor.getPerformanceReport(timeRange, categories);
    }
  }), [state.isEnabled, state.config]);

  // Set up alert monitoring
  useEffect(() => {
    const alertCallback = (metric: any, message: string) => {
      const alert: PerformanceAlert = {
        id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        severity: 'warning', // Default severity
        metricName: metric.name,
        metricValue: metric.value,
        threshold: 0, // Will be set by the threshold that triggered it
        message,
        timestamp: Date.now(),
        acknowledged: false
      };
      
      dispatch({ type: 'ADD_ALERT', payload: alert });
    };

    // Set up default alert thresholds with callback
    performanceMonitor.setAlertThreshold('response_time', 'system', {
      maxValue: state.config.thresholds.responseTime,
      severity: 'warning',
      callback: alertCallback
    });

    performanceMonitor.setAlertThreshold('error_rate', 'system', {
      maxValue: state.config.thresholds.errorRate,
      severity: 'error',
      callback: alertCallback
    });

    performanceMonitor.setAlertThreshold('memory_usage', 'system', {
      maxValue: state.config.thresholds.memoryUsage,
      severity: 'warning',
      callback: alertCallback
    });
  }, [state.config.thresholds]);

  // Update recent metrics periodically
  useEffect(() => {
    if (!state.isEnabled) return;

    const updateMetrics = () => {
      const report = performanceMonitor.getPerformanceReport(60000); // Last minute
      const recentMetrics = new Map();
      
      for (const [key, stats] of report.metrics.entries()) {
        recentMetrics.set(key, {
          value: stats.average,
          timestamp: Date.now(),
          metadata: { trend: stats.trend, count: stats.count }
        });
      }
      
      dispatch({ type: 'UPDATE_RECENT_METRICS', payload: recentMetrics });
    };

    const interval = setInterval(updateMetrics, 5000); // Update every 5 seconds
    updateMetrics(); // Initial update

    return () => clearInterval(interval);
  }, [state.isEnabled]);

  // Development tools integration
  useEffect(() => {
    if (!enableDevTools || !appConfig.env.IS_DEVELOPMENT) return;

    // Expose performance tools to global scope for debugging
    (window as any).__PERFORMANCE_MONITOR__ = {
      getState: () => state,
      getReport: (timeRange?: number) => performanceMonitor.getPerformanceReport(timeRange),
      clearMetrics: () => actions.clearMetrics(),
      exportReport: (format: 'json' | 'csv' = 'json') => actions.exportReport(format),
      monitor: performanceMonitor
    };

    // Log performance warnings for development
    const checkPerformanceIssues = () => {
      const report = performanceMonitor.getPerformanceReport(60000);
      
      for (const [key, stats] of report.metrics.entries()) {
        if (stats.trend === 'degrading' && stats.average > 100) {
          console.warn(`🐌 Performance Degradation Detected: ${key}`, {
            average: stats.average,
            trend: stats.trend,
            count: stats.count
          });
        }
      }
    };

    const performanceCheckInterval = setInterval(checkPerformanceIssues, 30000); // Check every 30 seconds

    return () => {
      clearInterval(performanceCheckInterval);
      delete (window as any).__PERFORMANCE_MONITOR__;
    };
  }, [enableDevTools, state, actions]);

  const value = useMemo(() => ({
    state,
    actions,
    context: contextInterface
  }), [state, actions, contextInterface]);

  return (
    <PerformanceContext.Provider value={value}>
      {children}
    </PerformanceContext.Provider>
  );
}

/**
 * Hook to access performance monitoring context
 */
export function usePerformanceContext() {
  const context = useContext(PerformanceContext);
  
  if (!context) {
    throw new Error('usePerformanceContext must be used within a PerformanceProvider');
  }
  
  return context;
}

/**
 * Hook to access performance monitoring state only
 */
export function usePerformanceState() {
  const { state } = usePerformanceContext();
  return state;
}

/**
 * Hook to access performance monitoring actions only
 */
export function usePerformanceActions() {
  const { actions } = usePerformanceContext();
  return actions;
}

/**
 * Hook for simplified performance monitoring interface
 */
export function usePerformance() {
  const { context } = usePerformanceContext();
  return context;
}
