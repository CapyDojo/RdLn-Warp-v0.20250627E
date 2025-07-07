/**
 * Performance debugging utilities and global access helpers
 */

import { PerformanceMonitor } from '../services/PerformanceMonitor';
import type { PerformanceReport, MetricCategory } from '../types/performance-types';

declare global {
  interface Window {
    performanceMonitor: PerformanceMonitor;
    showPerfReport: (timeRangeMs?: number) => void;
    showPerfMetrics: (category?: MetricCategory) => void;
    clearPerfData: () => void;
    enablePerfDebug: () => void;
    disablePerfDebug: () => void;
  }
}

/**
 * Setup global performance debugging utilities
 */
export function setupPerformanceDebugUtils(): void {
  if (typeof window === 'undefined') return;

  // Expose performance monitor globally
  window.performanceMonitor = PerformanceMonitor.getInstance();

  // Helper functions for console debugging
  window.showPerfReport = (timeRangeMs: number = 300000) => {
    const report = window.performanceMonitor.getPerformanceReport(timeRangeMs);
    console.group(`🔍 Performance Report (Last ${timeRangeMs / 1000}s)`);
    console.table(report.summary);
    
    Object.entries(report.metricsByCategory).forEach(([category, metrics]) => {
      if (Object.keys(metrics).length > 0) {
        console.group(`📊 ${category.toUpperCase()} Metrics`);
        console.table(metrics);
        console.groupEnd();
      }
    });

    if (report.alerts && report.alerts.length > 0) {
      console.group('⚠️ Recent Alerts');
      report.alerts.forEach(alert => {
        console.warn(`${alert.metricName}: ${alert.message}`, alert);
      });
      console.groupEnd();
    }

    console.groupEnd();
    return report;
  };

  window.showPerfMetrics = (category?: MetricCategory) => {
    const monitor = window.performanceMonitor;
    const categories: MetricCategory[] = category ? [category] : ['ui', 'ocr', 'system', 'business'];
    
    console.group('📈 Current Performance Metrics');
    
    categories.forEach(cat => {
      try {
        const metrics = monitor.getMetrics(cat);
        if (metrics && Object.keys(metrics).length > 0) {
          console.group(`${cat.toUpperCase()}`);
          Object.entries(metrics).forEach(([name, data]) => {
            console.log(`${name}:`, {
              recent: data.slice(-5), // Last 5 measurements
              average: data.reduce((sum, m) => sum + m.value, 0) / data.length,
              count: data.length
            });
          });
          console.groupEnd();
        }
      } catch (error) {
        console.warn(`Failed to get ${cat} metrics:`, error);
      }
    });
    
    console.groupEnd();
  };

  window.clearPerfData = () => {
    try {
      const monitor = window.performanceMonitor;
      monitor.clearMetrics?.();
      console.log('✅ Performance data cleared');
    } catch (error) {
      console.error('❌ Failed to clear performance data:', error);
    }
  };

  window.enablePerfDebug = () => {
    try {
      localStorage.setItem('performance-debug-visible', 'true');
      localStorage.setItem('performance-monitoring-enabled', 'true');
      console.log('✅ Performance debugging enabled. Refresh page to see debug panel.');
    } catch (error) {
      console.warn('Failed to enable performance debugging:', error);
    }
  };

  window.disablePerfDebug = () => {
    try {
      localStorage.setItem('performance-debug-visible', 'false');
      localStorage.setItem('performance-monitoring-enabled', 'false');
      console.log('✅ Performance debugging disabled. Refresh page to hide debug panel.');
    } catch (error) {
      console.warn('Failed to disable performance debugging:', error);
    }
  };

  // Keyboard shortcuts
  setupKeyboardShortcuts();
}

/**
 * Setup keyboard shortcuts for performance debugging
 */
function setupKeyboardShortcuts(): void {
  document.addEventListener('keydown', (event) => {
    // Ctrl+Shift+P: Toggle performance debug panel
    if (event.ctrlKey && event.shiftKey && event.key === 'P') {
      event.preventDefault();
      const currentState = localStorage.getItem('performance-debug-visible') === 'true';
      localStorage.setItem('performance-debug-visible', (!currentState).toString());
      console.log(`🔧 Performance debug panel ${!currentState ? 'enabled' : 'disabled'}`);
      window.location.reload(); // Refresh to apply changes
    }

    // Ctrl+Shift+R: Show performance report in console
    if (event.ctrlKey && event.shiftKey && event.key === 'R') {
      event.preventDefault();
      window.showPerfReport();
    }

    // Ctrl+Shift+M: Show current metrics in console
    if (event.ctrlKey && event.shiftKey && event.key === 'M') {
      event.preventDefault();
      window.showPerfMetrics();
    }

    // Ctrl+Shift+C: Clear performance data
    if (event.ctrlKey && event.shiftKey && event.key === 'C') {
      event.preventDefault();
      window.clearPerfData();
    }
  });
}

/**
 * Format performance data for easy reading
 */
export function formatPerformanceData(report: PerformanceReport): string {
  const lines = [
    `Performance Report (${new Date().toLocaleTimeString()})`,
    '='.repeat(50),
    `Total Metrics: ${report.summary.totalMetrics}`,
    `Average Collection Time: ${report.summary.averageCollectionTime?.toFixed(2)}ms`,
    `Error Rate: ${report.summary.errorRate?.toFixed(1)}%`,
    '',
    'Metrics by Category:',
    '-'.repeat(30)
  ];

  Object.entries(report.metricsByCategory).forEach(([category, metrics]) => {
    lines.push(`\n${category.toUpperCase()}:`);
    Object.entries(metrics).forEach(([name, data]) => {
      lines.push(`  ${name}:`);
      lines.push(`    Avg: ${data.average.toFixed(2)}ms`);
      lines.push(`    Max: ${data.maximum.toFixed(2)}ms`);
      lines.push(`    Count: ${data.count}`);
    });
  });

  if (report.alerts && report.alerts.length > 0) {
    lines.push('\nRecent Alerts:');
    lines.push('-'.repeat(20));
    report.alerts.forEach(alert => {
      lines.push(`⚠️  ${alert.metricName}: ${alert.message}`);
    });
  }

  return lines.join('\n');
}

/**
 * Export performance data to downloadable format
 */
export function exportPerformanceData(report: PerformanceReport): void {
  const data = formatPerformanceData(report);
  const blob = new Blob([data], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `performance-report-${new Date().toISOString().slice(0, 19)}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  console.log('📁 Performance report downloaded');
}
