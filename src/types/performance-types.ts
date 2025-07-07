/**
 * Performance monitoring type definitions
 * 
 * Defines comprehensive types for performance monitoring, metrics collection,
 * alerting, and reporting across the application.
 */

/**
 * Categories for organizing performance metrics
 */
export type MetricCategory = 'system' | 'ocr' | 'ui' | 'business';

/**
 * Alert severity levels
 */
export type AlertSeverity = 'info' | 'warning' | 'error' | 'critical';

/**
 * Performance trend indicators
 */
export type PerformanceTrend = 'improving' | 'stable' | 'degrading';

/**
 * Core performance metric data structure
 */
export interface PerformanceMetric {
  name: string;
  value: number;
  category: MetricCategory;
  timestamp: number;
  metadata: Record<string, any>;
}

/**
 * Configuration for performance monitoring behavior
 */
export interface PerformanceConfig {
  // Monitoring levels
  level: 'minimal' | 'standard' | 'comprehensive';
  
  // Data collection settings
  samplingRate: number; // 0.0 to 1.0
  bufferSize: number; // Max metrics to keep in memory
  flushInterval: number; // Milliseconds between data flushes
  
  // Alert thresholds
  thresholds: {
    responseTime: number; // Milliseconds
    errorRate: number; // Percentage (0-100)
    memoryUsage: number; // Bytes
  };
  
  // Privacy settings
  anonymizeData: boolean;
  optOutAvailable: boolean;
}

/**
 * Alert threshold configuration
 */
export interface AlertThreshold {
  metricName: string;
  category: MetricCategory;
  maxValue?: number;
  minValue?: number;
  severity: AlertSeverity;
  callback?: (metric: PerformanceMetric, message: string) => void;
}

/**
 * Single metric data point
 */
export interface MetricPoint {
  value: number;
  timestamp: number;
  metadata: Record<string, any>;
}

/**
 * Aggregated metric statistics
 */
export interface MetricStatistics {
  name: string;
  category: MetricCategory;
  count: number;
  average: number;
  min: number;
  max: number;
  p95: number; // 95th percentile
  trend: PerformanceTrend;
}

/**
 * Performance report summary
 */
export interface PerformanceReportSummary {
  totalMetrics: number;
  averageResponseTime: number;
  errorRate: number;
  alertsTriggered: number;
}

/**
 * Comprehensive performance report
 */
export interface PerformanceReport {
  timeRange: number; // Milliseconds
  categories: MetricCategory[];
  metrics: Map<string, MetricStatistics>;
  summary: PerformanceReportSummary;
  generatedAt: number;
}

/**
 * Web Vitals specific metrics
 */
export interface WebVitalsMetrics {
  // Core Web Vitals
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  
  // Additional metrics
  fcp?: number; // First Contentful Paint
  ttfb?: number; // Time to First Byte
  inp?: number; // Interaction to Next Paint
}

/**
 * Component performance tracking data
 */
export interface ComponentPerformanceData {
  componentName: string;
  renderTime: number;
  mountTime?: number;
  updateTime?: number;
  memoryUsage?: number;
  propsCount?: number;
  childrenCount?: number;
}

/**
 * OCR-specific performance metrics
 */
export interface OCRPerformanceMetrics {
  // Processing times
  textExtractionTime: number;
  languageDetectionTime: number;
  textProcessingTime: number;
  totalProcessingTime: number;
  
  // Quality metrics
  confidence: number;
  wordsDetected: number;
  charactersDetected: number;
  
  // Resource usage
  workerInitTime?: number;
  memoryUsage?: number;
  cacheHitRate?: number;
  
  // Context
  language?: string;
  imageSize?: { width: number; height: number };
  processingMode?: string;
}

/**
 * User interaction metrics
 */
export interface UserInteractionMetrics {
  type: 'click' | 'scroll' | 'input' | 'drag' | 'resize';
  element: string;
  timestamp: number;
  responseTime?: number;
  payload?: Record<string, any>;
}

/**
 * Network request performance data
 */
export interface NetworkPerformanceData {
  url: string;
  method: string;
  status: number;
  responseTime: number;
  requestSize?: number;
  responseSize?: number;
  cached?: boolean;
}

/**
 * Memory usage snapshot
 */
export interface MemorySnapshot {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
  timestamp: number;
}

/**
 * Performance budget configuration
 */
export interface PerformanceBudget {
  metrics: {
    [key: string]: {
      budget: number;
      unit: 'ms' | 'bytes' | 'percent' | 'count';
      threshold: 'warning' | 'error';
    };
  };
}

/**
 * Performance monitoring context for React components
 */
export interface PerformanceContext {
  isEnabled: boolean;
  config: PerformanceConfig;
  recordMetric: (name: string, value: number, category: MetricCategory, metadata?: Record<string, any>) => void;
  startTiming: (name: string, category: MetricCategory) => () => void;
  getCurrentMetric: (name: string, category: MetricCategory) => MetricPoint | null;
  getReport: (timeRange?: number, categories?: MetricCategory[]) => PerformanceReport;
}

/**
 * Performance monitoring hooks interface
 */
export interface UsePerformanceMonitorResult {
  // Core tracking
  recordMetric: (name: string, value: number, metadata?: Record<string, any>) => void;
  timeFunction: <T>(name: string, operation: () => T, metadata?: Record<string, any>) => T;
  startTiming: (name: string) => (metadata?: Record<string, any>) => void;
  
  // Component tracking
  trackRender: (componentName: string) => void;
  trackMount: (componentName: string) => void;
  trackUpdate: (componentName: string) => void;
  
  // Data access
  getCurrentMetric: (name: string) => MetricPoint | null;
  getComponentStats: () => ComponentPerformanceData[];
  
  // Status
  isEnabled: boolean;
  config: PerformanceConfig;
}

/**
 * Performance alert data
 */
export interface PerformanceAlert {
  id: string;
  severity: AlertSeverity;
  metricName: string;
  metricValue: number;
  threshold: number;
  message: string;
  timestamp: number;
  acknowledged: boolean;
}

/**
 * Performance monitoring state
 */
export interface PerformanceMonitoringState {
  isEnabled: boolean;
  config: PerformanceConfig;
  alerts: PerformanceAlert[];
  recentMetrics: Map<string, MetricPoint>;
  componentPerformance: Map<string, ComponentPerformanceData>;
}

/**
 * Performance monitoring actions
 */
export interface PerformanceMonitoringActions {
  enable: () => void;
  disable: () => void;
  updateConfig: (config: Partial<PerformanceConfig>) => void;
  clearMetrics: () => void;
  acknowledgeAlert: (alertId: string) => void;
  exportReport: (format: 'json' | 'csv') => string;
}

/**
 * Comprehensive performance monitoring hook return type
 */
export interface UsePerformanceMonitoringResult {
  state: PerformanceMonitoringState;
  actions: PerformanceMonitoringActions;
  recordMetric: (name: string, value: number, category: MetricCategory, metadata?: Record<string, any>) => void;
  timeFunction: <T>(name: string, category: MetricCategory, operation: () => T, metadata?: Record<string, any>) => T;
  getReport: (timeRange?: number, categories?: MetricCategory[]) => PerformanceReport;
}
