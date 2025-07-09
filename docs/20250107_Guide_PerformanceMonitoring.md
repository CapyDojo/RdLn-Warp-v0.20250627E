# Performance Monitoring User Guide

**Date**: 2025-07-07  
**Feature**: Integrated Performance Monitoring in Developer Mode  
**Status**: ✅ Ready for Use

## How to Access Performance Monitoring

### 1. **Developer Mode Card** (Primary Interface)

When you run the app in development mode, you'll see a "Performance Monitoring" section in the Developer Mode Card at the bottom of the page:

```
┌─────────────────────────────────────────┐
│ 🔧 Developer Mode                       │
├─────────────────────────────────────────┤
│ 📊 Performance Monitoring               │
│ [Monitoring ON] [Debug Panel OFF] [Console Report] [Console Metrics] │
│ [Clear Data] [Export JSON] [Status Check]          │
│ 📊 Console Report - Detailed analysis  📈 Console Metrics - Current data │
└─────────────────────────────────────────┘
```

**Controls:**
- **Monitoring ON/OFF**: Toggle data collection
- **Debug Panel ON/OFF**: Show/hide floating performance panel
- **Console Report**: Instantly display performance data in console
- **Console Metrics**: Show current performance metrics
- **Clear Data**: Reset all collected performance data
- **Export JSON**: Download performance report as JSON file
- **Status Check**: Show current monitor status

### 2. **Floating Debug Panel** (Real-time View)

Click "Debug Panel ON" to see a floating panel in the top-right corner:

```
┌─────────────────────────────────┐
│ Performance Monitor        [+] [×] │
├─────────────────────────────────┤
│ Last Minute Summary:            │
│ Total Metrics: 47               │
│ Avg Collection Time: 2.3ms     │
│ Error Rate: 0.0%                │
│                                 │
│ UI METRICS:                     │
│   component_render_time:        │
│     Avg: 4.2ms | Max: 67ms | Count: 23 │
│   input_lag:                    │
│     Avg: 12ms | Max: 89ms | Count: 156 │
│                                 │
│ ⚠ Recent Alerts:               │
│   text_extraction_time: Exceeded threshold │
└─────────────────────────────────┘
```

### 3. **Browser Console** (Detailed Analysis)

Press **F12** to open developer tools, then use these commands:

#### Quick Commands:
```javascript
// Show last 5 minutes of performance data  
showPerfReport()

// Show metrics for specific category
showPerfMetrics('ocr')     // OCR performance
showPerfMetrics('ui')      // UI responsiveness  
showPerfMetrics('system')  // Memory and CPU

// Clear all collected data
clearPerfData()

// Enable/disable monitoring
enablePerfDebug()
disablePerfDebug()
```

#### Example Console Output:
```
🔍 Performance Report (Last 300s)
┌──────────────────────────┬─────────┐
│ totalMetrics             │ 47      │
│ averageCollectionTime    │ 2.34ms  │
│ errorRate                │ 0%      │
└──────────────────────────┴─────────┘

📊 OCR Metrics
┌──────────────────────────┬─────────┬─────────┬───────┐
│ Metric                   │ Average │ Maximum │ Count │
├──────────────────────────┼─────────┼─────────┼───────┤
│ text_extraction_time     │ 2341ms  │ 8912ms  │ 12    │
│ language_detection_time  │ 156ms   │ 1203ms  │ 12    │
│ text_processing_time     │ 89ms    │ 234ms   │ 12    │
└──────────────────────────┴─────────┴─────────┴───────┘
```

### 4. **Clickable Buttons** (Easy Access)

All performance monitoring functions are available as buttons in the Developer Mode Card:

- **Console Report** - Show performance report in console
- **Console Metrics** - Show current metrics in console  
- **Clear Data** - Clear all performance data
- **Export JSON** - Download performance report as file
- **Status Check** - Show monitor status

## What You'll See in Real Usage

### **Text Input Performance**
When you type in the text panels:
```
📊 UI METRICS:
  input_lag: Avg: 12ms | Max: 89ms | Count: 234
  component_render_time: Avg: 4ms | Max: 67ms
```

### **OCR Processing Performance**  
When you use OCR (image to text):
```
📊 OCR METRICS:
  text_extraction_time: Avg: 2,341ms | Max: 8,912ms  
  language_detection_time: Avg: 156ms | Max: 1,203ms
  ocr_cache_hit_rate: 73% (good caching)
```

### **Document Comparison Performance**
When comparing large documents:
```
📊 SYSTEM METRICS:
  myers_algorithm_execution: Avg: 1,234ms | Max: 5,678ms
  memory_usage: Avg: 245MB | Max: 412MB
  comparison_complexity: High (50K+ changes)
```

### **Alerts When Things Go Wrong**
```
⚠️ Recent Alerts:
  text_extraction_time: Processing time exceeded 5000ms threshold  
  memory_usage: Memory usage above 80% threshold
  input_lag: User input lag detected (>100ms)
```

## Practical Use Cases

### **Scenario 1: "The app feels slow when typing"**
1. Enable debug panel
2. Type in text boxes and watch `input_lag` metric
3. If consistently >50ms, there's a performance issue
4. Use `Ctrl+Shift+M` to see detailed timing

### **Scenario 2: "OCR is taking forever"**  
1. Run OCR on an image
2. Check `text_extraction_time` in debug panel
3. Compare with `language_detection_time` 
4. Identify if it's OCR engine or language detection causing delay

### **Scenario 3: "App crashes with large documents"**
1. Monitor `memory_usage` during comparison
2. Watch for alerts when memory >80%
3. Check `comparison_complexity` metrics
4. Use data to optimize document size limits

### **Scenario 4: "Export performance report for team"**
1. Use app normally for a session
2. Press `Ctrl+Shift+R` to show report in console
3. Copy console output or use export function
4. Share performance data with team

## Configuration Options

### **Monitoring Levels**
```javascript
// In console, adjust monitoring level
window.performanceMonitor.updateConfig({
  level: 'minimal',     // Basic metrics only
  level: 'standard',    // Default comprehensive monitoring
  level: 'comprehensive' // Everything + debug data
})
```

### **Custom Thresholds**
```javascript
// Set custom performance alerts
window.performanceMonitor.setAlertThreshold('text_extraction_time', 'ocr', {
  threshold: 3000,  // Alert if OCR takes >3 seconds
  severity: 'warning',
  callback: (metric) => console.warn('OCR is slow!', metric)
})
```

## Troubleshooting

### **"I don't see Performance Monitoring section"**
- Ensure you're running in development mode (`npm run dev`)
- Check that `NODE_ENV !== 'production'`

### **"Debug panel is not showing"**  
- Click "Debug Panel ON" in Developer Mode Card
- Try `Ctrl+Shift+P` shortcut
- Check browser console for errors

### **"Console commands not working"**
- Make sure monitoring is enabled first
- Try refreshing the page
- Check that `window.performanceMonitor` exists in console

### **"No performance data appearing"**
- Verify "Monitoring ON" is enabled
- Use the app (type, OCR, compare) to generate data
- Data appears after 2-3 interactions

## Privacy & Performance

- **Zero impact on production**: Only runs in development mode
- **Privacy-conscious**: All data stays in your browser
- **Minimal overhead**: <1% performance impact when enabled
- **Memory-conscious**: Automatic cleanup and buffer limits
- **Opt-out available**: Can be completely disabled

---

## Summary

You now have comprehensive performance visibility with:

✅ **Visual Interface**: Real-time debug panel with live updates  
✅ **Console Access**: Detailed reports and metrics on demand  
✅ **Keyboard Shortcuts**: Power-user access for quick debugging  
✅ **Automatic Alerts**: Proactive notification of performance issues  
✅ **Export Capability**: Share performance data with team  
✅ **Zero Production Impact**: Development-only feature

**Next Steps**: Start the dev server and explore the Performance Monitoring section in the Developer Mode Card!
