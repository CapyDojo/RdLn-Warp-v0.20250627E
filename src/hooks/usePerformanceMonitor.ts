/**
 * usePerformanceMonitor - React hook for component-level performance tracking
 * 
 * Provides easy-to-use performance monitoring capabilities for React components
 * with automatic lifecycle tracking, render time measurement, and user interaction monitoring.
 * 
 * Features:
 * - Automatic component render time tracking
 * - Mount/unmount performance measurement
 * - User interaction timing
 * - Memory usage monitoring
 * - Integration with centralized PerformanceMonitor
 * - Development-mode debugging helpers
 */

import { useEffect, useRef, useCallback, useMemo } from 'react';
import { performanceMonitor } from '../services/PerformanceMonitor';
import { appConfig } from '../config/appConfig';
import type { 
  UsePerformanceMonitorResult, 
  ComponentPerformanceData,
  MetricCategory 
} from '../types/performance-types';

interface UsePerformanceMonitorOptions {
  componentName?: string;
  category?: MetricCategory;
  trackRenders?: boolean;
  trackMounts?: boolean;
  trackUpdates?: boolean;
  trackMemory?: boolean;
  enabled?: boolean;
}

/**
 * React hook for component-level performance monitoring
 */
export function usePerformanceMonitor(
  options: UsePerformanceMonitorOptions = {}
): UsePerformanceMonitorResult {
  const {
    componentName = 'Unknown',
    category = 'ui',
    trackRenders = true,
    trackMounts = true,
    trackUpdates = true,
    trackMemory = false,
    enabled = true
  } = options;

  // Refs for tracking performance data
  const renderStartTime = useRef<number>(0);
  const mountStartTime = useRef<number>(0);
  const renderCount = useRef<number>(0);
  const componentStats = useRef<ComponentPerformanceData>({
    componentName,
    renderTime: 0,
    mountTime: 0,
    updateTime: 0,
    memoryUsage: 0,
    propsCount: 0,
    childrenCount: 0
  });

  // Track mount time
  useEffect(() => {
    if (!enabled || !trackMounts) return;

    const mountTime = performance.now() - mountStartTime.current;
    componentStats.current.mountTime = mountTime;

    performanceMonitor.recordMetric(
      `${componentName}_mount`,
      mountTime,
      category,
      {
        componentName,
        type: 'mount',
        renderCount: renderCount.current
      }
    );

    // Cleanup tracking on unmount
    return () => {
      if (trackMounts) {
        performanceMonitor.recordMetric(
          `${componentName}_unmount`,
          performance.now(),
          category,
          {
            componentName,
            type: 'unmount',
            totalRenders: renderCount.current,
            finalStats: componentStats.current
          }
        );
      }
    };
  }, []); // Empty dependency array for mount/unmount only

  // Track render performance
  const trackRender = useCallback((phase: 'start' | 'end') => {
    if (!enabled || !trackRenders) return;

    if (phase === 'start') {
      renderStartTime.current = performance.now();
    } else if (phase === 'end') {
      const renderTime = performance.now() - renderStartTime.current;
      renderCount.current += 1;
      componentStats.current.renderTime = renderTime;

      const isFirstRender = renderCount.current === 1;
      const metricName = isFirstRender ? `${componentName}_first_render` : `${componentName}_render`;

      performanceMonitor.recordMetric(
        metricName,
        renderTime,
        category,
        {
          componentName,
          type: isFirstRender ? 'first-render' : 'render',
          renderCount: renderCount.current,
          memoryUsage: trackMemory ? getMemoryUsage() : undefined
        }
      );

      // Track update performance separately
      if (!isFirstRender && trackUpdates) {
        componentStats.current.updateTime = renderTime;
        performanceMonitor.recordMetric(
          `${componentName}_update`,
          renderTime,
          category,
          {
            componentName,
            type: 'update',
            renderCount: renderCount.current
          }
        );
      }
    }
  }, [enabled, trackRenders, trackUpdates, trackMemory, componentName, category]);

  // Initialize render tracking on first render
  useMemo(() => {
    if (enabled && trackRenders) {
      mountStartTime.current = performance.now();
      trackRender('start');
    }
  }, []); // Empty deps to run only on mount

  // Track render end on each render
  useEffect(() => {
    if (enabled && trackRenders) {
      trackRender('end');
    }
  });

  // Core monitoring functions
  const recordMetric = useCallback((
    name: string, 
    value: number, 
    metadata?: Record<string, any>
  ) => {
    if (!enabled) return;
    
    performanceMonitor.recordMetric(
      `${componentName}_${name}`,
      value,
      category,
      {
        componentName,
        ...metadata
      }
    );
  }, [enabled, componentName, category]);

  const timeFunction = useCallback(<T>(
    name: string,
    operation: () => T,
    metadata?: Record<string, any>
  ): T => {
    if (!enabled) {
      return operation();
    }

    return performanceMonitor.time(
      `${componentName}_${name}`,
      category,
      operation,
      {
        componentName,
        ...metadata
      }
    );
  }, [enabled, componentName, category]);

  const startTiming = useCallback((
    name: string
  ) => {
    if (!enabled) {
      return () => {};
    }

    return performanceMonitor.startTiming(
      `${componentName}_${name}`,
      category
    );
  }, [enabled, componentName, category]);

  // Component-specific tracking functions
  const trackComponentRender = useCallback((overrideComponentName?: string) => {
    if (!enabled) return;
    
    const name = overrideComponentName || componentName;
    performanceMonitor.recordMetric(
      `${name}_manual_render`,
      performance.now(),
      category,
      {
        componentName: name,
        type: 'manual-render',
        renderCount: renderCount.current
      }
    );
  }, [enabled, componentName, category]);

  const trackComponentMount = useCallback((overrideComponentName?: string) => {
    if (!enabled) return;
    
    const name = overrideComponentName || componentName;
    performanceMonitor.recordMetric(
      `${name}_manual_mount`,
      performance.now(),
      category,
      {
        componentName: name,
        type: 'manual-mount'
      }
    );
  }, [enabled, componentName, category]);

  const trackComponentUpdate = useCallback((overrideComponentName?: string) => {
    if (!enabled) return;
    
    const name = overrideComponentName || componentName;
    performanceMonitor.recordMetric(
      `${name}_manual_update`,
      performance.now(),
      category,
      {
        componentName: name,
        type: 'manual-update',
        renderCount: renderCount.current
      }
    );
  }, [enabled, componentName, category]);

  // Data access functions
  const getCurrentMetric = useCallback((name: string) => {
    return performanceMonitor.getCurrentMetric(`${componentName}_${name}`, category);
  }, [componentName, category]);

  const getComponentStats = useCallback((): ComponentPerformanceData[] => {
    return [{ ...componentStats.current }];
  }, []);

  // Configuration access
  const config = useMemo(() => {
    return (performanceMonitor as any).config;
  }, []);

  return {
    // Core tracking functions
    recordMetric,
    timeFunction,
    startTiming,
    
    // Component-specific tracking
    trackRender: trackComponentRender,
    trackMount: trackComponentMount,
    trackUpdate: trackComponentUpdate,
    
    // Data access
    getCurrentMetric,
    getComponentStats,
    
    // Status and configuration
    isEnabled: enabled,
    config
  };
}

/**
 * Hook for tracking user interactions with performance monitoring
 */
export function useInteractionTracking(componentName: string = 'Unknown') {
  const trackInteraction = useCallback((
    interactionType: 'click' | 'scroll' | 'input' | 'drag' | 'resize',
    elementName: string,
    metadata?: Record<string, any>
  ) => {
    const startTime = performance.now();
    
    // Return a function to call when interaction completes
    return (additionalMetadata?: Record<string, any>) => {
      const responseTime = performance.now() - startTime;
      
      performanceMonitor.recordMetric(
        `${componentName}_interaction_${interactionType}`,
        responseTime,
        'ui',
        {
          componentName,
          interactionType,
          elementName,
          responseTime,
          ...metadata,
          ...additionalMetadata
        }
      );
    };
  }, [componentName]);

  const trackClick = useCallback((elementName: string, metadata?: Record<string, any>) => {
    return trackInteraction('click', elementName, metadata);
  }, [trackInteraction]);

  const trackScroll = useCallback((elementName: string, metadata?: Record<string, any>) => {
    return trackInteraction('scroll', elementName, metadata);
  }, [trackInteraction]);

  const trackInput = useCallback((elementName: string, metadata?: Record<string, any>) => {
    return trackInteraction('input', elementName, metadata);
  }, [trackInteraction]);

  const trackDrag = useCallback((elementName: string, metadata?: Record<string, any>) => {
    return trackInteraction('drag', elementName, metadata);
  }, [trackInteraction]);

  const trackResize = useCallback((elementName: string, metadata?: Record<string, any>) => {
    return trackInteraction('resize', elementName, metadata);
  }, [trackInteraction]);

  return {
    trackInteraction,
    trackClick,
    trackScroll,
    trackInput,
    trackDrag,
    trackResize
  };
}

/**
 * Hook for performance debugging in development mode
 */
export function usePerformanceDebugger(componentName: string = 'Unknown') {
  const isEnabled = appConfig.env.IS_DEVELOPMENT;

  useEffect(() => {
    if (!isEnabled) return;

    // Log component mount
    console.group(`🔍 Performance Debug: ${componentName}`);
    console.log('Component mounted at:', new Date().toISOString());
    
    return () => {
      // Log component unmount and stats
      const report = performanceMonitor.getPerformanceReport(300000, ['ui']); // 5 minutes
      const componentMetrics = Array.from(report.metrics.entries())
        .filter(([key]) => key.includes(componentName));
      
      if (componentMetrics.length > 0) {
        console.log(`📊 Performance stats for ${componentName}:`, componentMetrics);
      }
      console.groupEnd();
    };
  }, [isEnabled, componentName]);

  const logMetric = useCallback((name: string, value: number, metadata?: any) => {
    if (!isEnabled) return;
    
    console.log(`📈 ${componentName}.${name}:`, value, metadata);
  }, [isEnabled, componentName]);

  const logPerformanceWarning = useCallback((message: string, data?: any) => {
    if (!isEnabled) return;
    
    console.warn(`⚠️ Performance Warning [${componentName}]:`, message, data);
  }, [isEnabled, componentName]);

  return {
    isEnabled,
    logMetric,
    logPerformanceWarning
  };
}

// Helper function to get memory usage
function getMemoryUsage(): number {
  if ('memory' in performance) {
    return (performance as any).memory.usedJSHeapSize;
  }
  return 0;
}
