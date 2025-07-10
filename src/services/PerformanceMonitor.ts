/**
 * PerformanceMonitor - Centralized performance monitoring hub
 * 
 * Provides comprehensive performance monitoring across the application with
 * real-time metrics collection, analysis, and alerting capabilities.
 * 
 * Features:
 * - Real-time metrics collection and aggregation
 * - Configurable performance thresholds and alerting
 * - Historical performance data tracking
 * - Integration with existing services (OCROrchestrator, ErrorManager)
 * - Development/production mode awareness
 * - Privacy-conscious data collection
 */

import { appConfig } from '../config/appConfig';
import { ErrorFactory, ErrorCategory, ErrorSeverity } from '../utils/errorHandling';
import type { 
  PerformanceMetric, 
  PerformanceConfig, 
  MetricCategory, 
  AlertThreshold,
  PerformanceReport,
  MetricPoint
} from '../types/performance-types';

/**
 * Core performance monitoring service
 */
export class PerformanceMonitor {
  private static instance: PerformanceMonitor | null = null;
  private config: PerformanceConfig;
  private metrics: Map<string, PerformanceMetric[]> = new Map();
  private alertThresholds: Map<string, AlertThreshold> = new Map();
  private isEnabled: boolean = true;
  private bufferSize: number;
  private flushInterval: NodeJS.Timeout | null = null;

  private constructor(config?: Partial<PerformanceConfig>) {
    this.config = this.createConfig(config);
    this.bufferSize = this.config.bufferSize;
    this.setupPerformanceTracking();
    this.initializeFlushTimer();
  }

  /**
   * Get singleton instance of PerformanceMonitor
   */
  public static getInstance(config?: Partial<PerformanceConfig>): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor(config);
    }
    return PerformanceMonitor.instance;
  }

  /**
   * Record a performance metric
   */
  public recordMetric(
    name: string,
    value: number,
    category: MetricCategory,
    metadata?: Record<string, any>
  ): void {
    if (!this.isEnabled || !this.shouldSample()) {
      return;
    }

    try {
      const metric: PerformanceMetric = {
        name,
        value,
        category,
        timestamp: Date.now(),
        metadata: metadata || {}
      };

      // Store metric
      const key = `${category}:${name}`;
      if (!this.metrics.has(key)) {
        this.metrics.set(key, []);
      }

      const metricArray = this.metrics.get(key)!;
      metricArray.push(metric);

      // Maintain buffer size
      if (metricArray.length > this.bufferSize) {
        metricArray.shift(); // Remove oldest metric
      }

      // Check alerting thresholds
      this.checkAlertThresholds(metric);

    } catch (error) {
      // Don't let monitoring errors affect core functionality
      console.warn('PerformanceMonitor: Failed to record metric', error);
    }
  }

  /**
   * Record timing metric using performance.now()
   */
  public time<T>(
    name: string,
    category: MetricCategory,
    operation: () => T,
    metadata?: Record<string, any>
  ): T {
    const startTime = performance.now();
    
    try {
      const result = operation();
      
      // Handle async operations
      if (result instanceof Promise) {
        return result.then(
          (value) => {
            this.recordMetric(
              name,
              performance.now() - startTime,
              category,
              { ...metadata, status: 'success' }
            );
            return value;
          },
          (error) => {
            this.recordMetric(
              name,
              performance.now() - startTime,
              category,
              { ...metadata, status: 'error', error: error.message }
            );
            throw error;
          }
        ) as T;
      }

      // Synchronous operation
      this.recordMetric(
        name,
        performance.now() - startTime,
        category,
        { ...metadata, status: 'success' }
      );
      
      return result;
    } catch (error) {
      this.recordMetric(
        name,
        performance.now() - startTime,
        category,
        { ...metadata, status: 'error', error: (error as Error).message }
      );
      throw error;
    }
  }

  /**
   * Start timing for async operations
   */
  public startTiming(name: string, category: MetricCategory): () => void {
    const startTime = performance.now();
    
    return (metadata?: Record<string, any>) => {
      this.recordMetric(
        name,
        performance.now() - startTime,
        category,
        metadata
      );
    };
  }

  /**
   * Set alert threshold for a metric
   */
  public setAlertThreshold(
    metricName: string,
    category: MetricCategory,
    threshold: Omit<AlertThreshold, 'metricName' | 'category'>
  ): void {
    const key = `${category}:${metricName}`;
    this.alertThresholds.set(key, {
      metricName,
      category,
      ...threshold
    });
  }

  /**
   * Get performance report for a time range
   */
  public getPerformanceReport(
    timeRangeMs: number = 300000, // Default: 5 minutes
    categories?: MetricCategory[]
  ): PerformanceReport {
    const cutoffTime = Date.now() - timeRangeMs;
    const reportCategories = categories || ['system', 'ocr', 'ui', 'business'];
    const report: PerformanceReport = {
      timeRange: timeRangeMs,
      categories: reportCategories,
      metrics: new Map(),
      metricsByCategory: {} as Record<MetricCategory, Record<string, MetricStatistics>>,
      summary: {
        totalMetrics: 0,
        averageResponseTime: 0,
        errorRate: 0,
        alertsTriggered: 0,
        averageCollectionTime: 0
      },
      alerts: [],
      generatedAt: Date.now()
    };
    
    // Initialize metricsByCategory structure
    reportCategories.forEach(cat => {
      report.metricsByCategory[cat] = {};
    });

    let totalMetrics = 0;
    let totalResponseTime = 0;
    let errorCount = 0;

    // Process metrics
    for (const [key, metricArray] of this.metrics.entries()) {
      const [category, name] = key.split(':');
      
      if (categories && !categories.includes(category as MetricCategory)) {
        continue;
      }

      // Filter by time range
      const recentMetrics = metricArray.filter(m => m.timestamp >= cutoffTime);
      
      if (recentMetrics.length === 0) continue;

      // Calculate statistics
      const values = recentMetrics.map(m => m.value);
      const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
      const min = Math.min(...values);
      const max = Math.max(...values);
      const p95 = this.calculatePercentile(values, 95);

      const metricStats = {
        name,
        category: category as MetricCategory,
        count: recentMetrics.length,
        average: avg,
        minimum: min,
        maximum: max,
        p95,
        trend: this.calculateTrend(recentMetrics)
      };
      
      report.metrics.set(key, metricStats);
      
      // Also add to metricsByCategory for easier access
      if (!report.metricsByCategory[category as MetricCategory]) {
        report.metricsByCategory[category as MetricCategory] = {};
      }
      report.metricsByCategory[category as MetricCategory][name] = metricStats;

      totalMetrics += recentMetrics.length;
      
      // Aggregate response time for timing metrics
      if (category === 'system' || category === 'ocr' || category === 'ui') {
        totalResponseTime += avg;
      }

      // Count errors
      errorCount += recentMetrics.filter(m => 
        m.metadata?.status === 'error'
      ).length;
    }

    // Calculate summary
    report.summary.totalMetrics = totalMetrics;
    report.summary.averageResponseTime = totalMetrics > 0 ? totalResponseTime / report.metrics.size : 0;
    report.summary.errorRate = totalMetrics > 0 ? (errorCount / totalMetrics) * 100 : 0;
    report.summary.averageCollectionTime = totalMetrics > 0 ? totalResponseTime / totalMetrics : 0;
    
    // Collect recent alerts (placeholder for now)
    report.alerts = [];

    return report;
  }

  /**
   * Get real-time metric value
   */
  public getCurrentMetric(name: string, category: MetricCategory): MetricPoint | null {
    const key = `${category}:${name}`;
    const metrics = this.metrics.get(key);
    
    if (!metrics || metrics.length === 0) {
      return null;
    }

    const latest = metrics[metrics.length - 1];
    return {
      value: latest.value,
      timestamp: latest.timestamp,
      metadata: latest.metadata
    };
  }

  /**
   * Enable/disable performance monitoring
   */
  public setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    
    if (enabled && !this.flushInterval) {
      this.initializeFlushTimer();
    } else if (!enabled && this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
    }
  }

  /**
   * Update configuration
   */
  public updateConfig(newConfig: Partial<PerformanceConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.bufferSize = this.config.bufferSize;
    
    // Restart flush timer if interval changed
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.initializeFlushTimer();
    }
  }

  /**
   * Clear all metrics data
   */
  public clearMetrics(): void {
    this.metrics.clear();
  }

  /**
   * Dispose of the monitor and clean up resources
   */
  public dispose(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
    }
    if (this.metrics) {
      this.metrics.clear();
    }
    if (this.alertThresholds) {
      this.alertThresholds.clear();
    }
    PerformanceMonitor.instance = null;
  }

  // Private methods

  private createConfig(userConfig?: Partial<PerformanceConfig>): PerformanceConfig {
    const defaultConfig: PerformanceConfig = {
      level: (appConfig?.env?.IS_DEVELOPMENT ?? true) ? 'comprehensive' : 'standard',
      samplingRate: (appConfig?.env?.IS_DEVELOPMENT ?? true) ? 1.0 : 0.1,
      bufferSize: 1000,
      flushInterval: 60000, // 1 minute
      thresholds: {
        responseTime: 1000, // 1 second
        errorRate: 5, // 5%
        memoryUsage: 100 * 1024 * 1024 // 100MB
      },
      anonymizeData: !(appConfig?.env?.IS_DEVELOPMENT ?? true),
      optOutAvailable: true
    };

    return { ...defaultConfig, ...userConfig };
  }

  private setupPerformanceTracking(): void {
    // Set up default alert thresholds
    this.setAlertThreshold('response_time', 'system', {
      maxValue: this.config.thresholds.responseTime,
      severity: 'warning'
    });

    this.setAlertThreshold('error_rate', 'system', {
      maxValue: this.config.thresholds.errorRate,
      severity: 'error'
    });

    // Track memory usage if available
    if ('memory' in performance) {
      this.setAlertThreshold('memory_usage', 'system', {
        maxValue: this.config.thresholds.memoryUsage,
        severity: 'warning'
      });
    }
  }

  private initializeFlushTimer(): void {
    this.flushInterval = setInterval(() => {
      this.flushOldMetrics();
    }, this.config.flushInterval);
  }

  private flushOldMetrics(): void {
    const cutoffTime = Date.now() - (this.config.flushInterval * 10); // Keep 10 intervals worth
    
    for (const [key, metricArray] of this.metrics.entries()) {
      const filteredMetrics = metricArray.filter(m => m.timestamp >= cutoffTime);
      if (filteredMetrics.length !== metricArray.length) {
        this.metrics.set(key, filteredMetrics);
      }
    }
  }

  private shouldSample(): boolean {
    return Math.random() < this.config.samplingRate;
  }

  private checkAlertThresholds(metric: PerformanceMetric): void {
    const key = `${metric.category}:${metric.name}`;
    const threshold = this.alertThresholds.get(key);
    
    if (!threshold) return;

    let shouldAlert = false;
    let alertMessage = '';

    if (threshold.maxValue !== undefined && metric.value > threshold.maxValue) {
      shouldAlert = true;
      alertMessage = `${metric.name} exceeded threshold: ${metric.value} > ${threshold.maxValue}`;
    }

    if (threshold.minValue !== undefined && metric.value < threshold.minValue) {
      shouldAlert = true;
      alertMessage = `${metric.name} below threshold: ${metric.value} < ${threshold.minValue}`;
    }

    if (shouldAlert) {
      this.triggerAlert(threshold, metric, alertMessage);
    }
  }

  private triggerAlert(
    threshold: AlertThreshold,
    metric: PerformanceMetric,
    message: string
  ): void {
    try {
      // In development, log to console
      if ((appConfig?.env?.IS_DEVELOPMENT ?? true)) {
        console.warn(`Performance Alert [${threshold.severity}]:`, message, metric);
      }

      // Record alert as a metric
      this.recordMetric(
        'alert_triggered',
        1,
        'system',
        {
          severity: threshold.severity,
          metricName: metric.name,
          metricValue: metric.value,
          message
        }
      );

      // Integration point for external alerting systems
      if (threshold.callback) {
        threshold.callback(metric, message);
      }

    } catch (error) {
      console.warn('PerformanceMonitor: Failed to trigger alert', error);
    }
  }

  private calculatePercentile(values: number[], percentile: number): number {
    const sorted = [...values].sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[Math.max(0, index)];
  }

  private calculateTrend(metrics: PerformanceMetric[]): 'improving' | 'stable' | 'degrading' {
    if (metrics.length < 2) return 'stable';

    const recentValues = metrics.slice(-10).map(m => m.value);
    const olderValues = metrics.slice(-20, -10).map(m => m.value);

    if (olderValues.length === 0) return 'stable';

    const recentAvg = recentValues.reduce((sum, val) => sum + val, 0) / recentValues.length;
    const olderAvg = olderValues.reduce((sum, val) => sum + val, 0) / olderValues.length;

    const changePercent = ((recentAvg - olderAvg) / olderAvg) * 100;

    if (changePercent > 5) return 'degrading';
    if (changePercent < -5) return 'improving';
    return 'stable';
  }
}

// Default instance for easy access
export const performanceMonitor = PerformanceMonitor.getInstance();

// Convenience functions
export const recordMetric = (
  name: string,
  value: number,
  category: MetricCategory,
  metadata?: Record<string, any>
) => performanceMonitor.recordMetric(name, value, category, metadata);

export const timeFunction = <T>(
  name: string,
  category: MetricCategory,
  operation: () => T,
  metadata?: Record<string, any>
): T => performanceMonitor.time(name, category, operation, metadata);

export const startTiming = (name: string, category: MetricCategory) => 
  performanceMonitor.startTiming(name, category);
