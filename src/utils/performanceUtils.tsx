import React, { useCallback, useEffect, useRef } from 'react';
import { PerformanceMonitor } from '../services/PerformanceMonitor';
import { usePerformanceMonitor } from '../hooks/usePerformanceMonitor';
import { BaseComponentProps } from '../types/components';
import { appConfig } from '../config/appConfig';

/**
 * Performance monitoring utilities for React components
 * Provides seamless integration with BaseComponentProps and PerformanceMonitor
 */

/**
 * Component performance configuration options
 */
export interface ComponentPerformanceConfig {
  componentName: string;
  category?: string;
  enabled?: boolean;
  sampleRate?: number;
  metrics?: string[];
  autoTrackRender?: boolean;
  autoTrackInteractions?: boolean;
}

/**
 * Component performance tracking result
 */
export interface ComponentPerformanceTracker {
  trackRender: (renderType?: string) => void;
  trackInteraction: (interactionType: string, data?: Record<string, any>) => void;
  trackOperation: (operationName: string, operation: () => any | Promise<any>) => Promise<any>;
  trackMetric: (metricName: string, value: number | Record<string, any>) => void;
  startTiming: (operationName: string) => () => void;
  isEnabled: boolean;
}

/**
 * Extract performance configuration from BaseComponentProps
 */
export function extractPerformanceConfig(
  props: BaseComponentProps,
  componentName: string,
  defaultCategory?: string
): ComponentPerformanceConfig {
  const performance = props.performance;
  const isDevelopment = appConfig.environment.isDevelopment;
  
  return {
    componentName,
    category: performance?.category || defaultCategory || 'component',
    enabled: performance?.enabled ?? isDevelopment, // Default to enabled in development
    sampleRate: performance?.sampleRate ?? (isDevelopment ? 1.0 : 0.1), // 100% dev, 10% prod
    metrics: performance?.metrics || ['render', 'interaction'],
    autoTrackRender: true,
    autoTrackInteractions: true
  };
}

/**
 * Create a component performance tracker from props and configuration
 */
export function useComponentPerformance(
  props: BaseComponentProps,
  componentName: string,
  options: Partial<ComponentPerformanceConfig> = {}
): ComponentPerformanceTracker {
  const config = extractPerformanceConfig(props, componentName, options.category);
  const mergedConfig = { ...config, ...options };
  
  const monitor = usePerformanceMonitor({
    category: mergedConfig.category!,
    componentName: mergedConfig.componentName,
    enabled: mergedConfig.enabled!,
    sampleRate: mergedConfig.sampleRate
  });

  const renderCountRef = useRef(0);
  const lastRenderTimeRef = useRef(performance.now());

  // Track component renders automatically
  useEffect(() => {
    if (mergedConfig.enabled && mergedConfig.autoTrackRender) {
      const now = performance.now();
      const renderTime = now - lastRenderTimeRef.current;
      renderCountRef.current += 1;
      
      monitor.trackMetric('render_time', renderTime);
      monitor.trackMetric('render_count', renderCountRef.current);
      
      lastRenderTimeRef.current = now;
    }
  });

  const trackRender = useCallback((renderType = 'default') => {
    if (!mergedConfig.enabled) return;
    
    const now = performance.now();
    const renderTime = now - lastRenderTimeRef.current;
    
    monitor.trackMetric(`render_${renderType}`, renderTime);
    lastRenderTimeRef.current = now;
  }, [monitor, mergedConfig.enabled]);

  const trackInteraction = useCallback((interactionType: string, data?: Record<string, any>) => {
    if (!mergedConfig.enabled) return;
    
    monitor.trackInteraction(interactionType, {
      componentName: mergedConfig.componentName,
      ...data
    });
  }, [monitor, mergedConfig.enabled, mergedConfig.componentName]);

  const trackOperation = useCallback((operationName: string, operation: () => any | Promise<any>): Promise<any> => {
    if (!mergedConfig.enabled) {
      return Promise.resolve(operation());
    }
    
    return monitor.trackOperation(operationName, operation);
  }, [monitor, mergedConfig.enabled]);

  const trackMetric = useCallback((metricName: string, value: number | Record<string, any>) => {
    if (!mergedConfig.enabled) return;
    
    monitor.trackMetric(metricName, value);
  }, [monitor, mergedConfig.enabled]);

  const startTiming = useCallback((operationName: string) => {
    if (!mergedConfig.enabled) {
      return () => {}; // No-op function
    }
    
    const startTime = performance.now();
    
    return () => {
      const duration = performance.now() - startTime;
      monitor.trackMetric(`${operationName}_duration`, duration);
    };
  }, [monitor, mergedConfig.enabled]);

  return {
    trackRender,
    trackInteraction,
    trackOperation,
    trackMetric,
    startTiming,
    isEnabled: mergedConfig.enabled || false
  };
}

/**
 * Higher-order component for automatic performance monitoring
 */
export function withPerformanceMonitoring<TProps extends BaseComponentProps>(
  Component: React.ComponentType<TProps>,
  componentName?: string,
  defaultCategory?: string
): React.ComponentType<TProps> {
  const WrappedComponent: React.FC<TProps> = (props) => {
    const name = componentName || Component.displayName || Component.name || 'UnknownComponent';
    const tracker = useComponentPerformance(props, name, { category: defaultCategory });
    
    // Track component mount/unmount
    useEffect(() => {
      tracker.trackMetric('mount', { timestamp: Date.now() });
      
      return () => {
        tracker.trackMetric('unmount', { timestamp: Date.now() });
      };
    }, [tracker]);

    return <Component {...props} />;
  };

  WrappedComponent.displayName = `WithPerformanceMonitoring(${componentName || Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

/**
 * Performance-aware event handler wrapper
 */
export function usePerformanceAwareHandler<TArgs extends any[]>(
  handler: (...args: TArgs) => void | Promise<void>,
  handlerName: string,
  tracker: ComponentPerformanceTracker
): (...args: TArgs) => Promise<void> {
  return useCallback(async (...args: TArgs) => {
    if (!tracker.isEnabled) {
      const result = handler(...args);
      if (result instanceof Promise) {
        await result;
      }
      return;
    }

    const endTiming = tracker.startTiming(handlerName);
    
    try {
      const result = handler(...args);
      if (result instanceof Promise) {
        await result;
      }
      tracker.trackInteraction(handlerName, { success: true });
    } catch (error) {
      tracker.trackInteraction(handlerName, { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      throw error;
    } finally {
      endTiming();
    }
  }, [handler, handlerName, tracker]);
}

/**
 * Performance budget checker
 */
export interface PerformanceBudget {
  maxRenderTime: number;
  maxOperationTime: number;
  maxMemoryUsage: number;
  maxInteractionDelay: number;
}

export function createPerformanceBudgetChecker(
  budget: PerformanceBudget,
  onBudgetExceeded?: (metric: string, value: number, limit: number) => void
) {
  return {
    checkRenderTime: (renderTime: number) => {
      if (renderTime > budget.maxRenderTime) {
        onBudgetExceeded?.('render_time', renderTime, budget.maxRenderTime);
        return false;
      }
      return true;
    },
    
    checkOperationTime: (operationTime: number) => {
      if (operationTime > budget.maxOperationTime) {
        onBudgetExceeded?.('operation_time', operationTime, budget.maxOperationTime);
        return false;
      }
      return true;
    },
    
    checkMemoryUsage: (memoryUsage: number) => {
      if (memoryUsage > budget.maxMemoryUsage) {
        onBudgetExceeded?.('memory_usage', memoryUsage, budget.maxMemoryUsage);
        return false;
      }
      return true;
    },
    
    checkInteractionDelay: (delay: number) => {
      if (delay > budget.maxInteractionDelay) {
        onBudgetExceeded?.('interaction_delay', delay, budget.maxInteractionDelay);
        return false;
      }
      return true;
    }
  };
}

/**
 * Default performance budgets for different component types
 */
export const DEFAULT_PERFORMANCE_BUDGETS = {
  ui: {
    maxRenderTime: 16, // 60fps
    maxOperationTime: 100,
    maxMemoryUsage: 10 * 1024 * 1024, // 10MB
    maxInteractionDelay: 50
  },
  processing: {
    maxRenderTime: 100,
    maxOperationTime: 5000,
    maxMemoryUsage: 50 * 1024 * 1024, // 50MB
    maxInteractionDelay: 200
  },
  output: {
    maxRenderTime: 32, // 30fps for large content
    maxOperationTime: 1000,
    maxMemoryUsage: 25 * 1024 * 1024, // 25MB
    maxInteractionDelay: 100
  }
} as const;
