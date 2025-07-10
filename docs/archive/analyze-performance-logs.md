# Performance Analysis Guide

## Test Setup
- Large document: ~634k characters with ~41k changes
- Performance logging is comprehensive and already in place
- Files: large-test-original.txt and large-test-revised.txt

## Key Performance Markers to Monitor

### 1. Algorithm Performance (MyersAlgorithm.ts)
Look for these console logs:
- `🎯 POST-PROCESSING PERFORMANCE ANALYSIS:`
- `📊 Algorithm completed, starting return phase...`
- `🎯 Return preparation completed in XXXms`
- `📊 Result object size analysis:`

### 2. React State Update Performance (useComparison.ts)
Critical markers:
- `🚨 ABOUT TO UPDATE STATE WITH RESULT - THIS MAY CAUSE LAG`
- `🎯 STATE UPDATE START TIME:`
- `🎯 STATE UPDATE COMPLETED: XXXms`
- `🚨 POST-STATE UPDATE TIME:`

### 3. Component Rendering Performance (RedlineOutput.tsx)
Watch for:
- `🎨 RedlineOutput COMPONENT RENDER START:`
- `🎨 RedlineOutput LAYOUT EFFECT START:`
- `🎨 DOM LAYOUT START:` / `🎨 DOM LAYOUT END:`
- `⚠️ Large change set detected - enabling progressive rendering:`

### 4. Browser Thread Blocking Detection
Critical alerts:
- `🚨 MAIN THREAD BLOCKING DETECTED:` (>50ms blocks)
- Memory usage tracking
- Animation frame timing

## Test Steps

1. Open browser to http://localhost:5174/
2. Open Browser Dev Tools → Console
3. Clear console
4. Paste original document (634k chars) into first text area
5. Monitor console for initial processing
6. Paste revised document (633k chars) into second text area
7. **Watch for lag during paste and processing**
8. Monitor console output for performance bottlenecks
9. Look for mouse lag correlation with specific log entries

## Expected Performance Issues

Based on the code analysis, mouse lag is most likely occurring during:

1. **React State Update** - When large result object is set in state
2. **DOM Rendering** - When 40k+ changes are processed into DOM elements  
3. **Progressive Rendering** - If component rendering blocks main thread

## Analysis Pattern

```
Algorithm completes → React setState → Component re-render → DOM update
     (fast)              (lag?)        (lag?)          (lag?)
```

The comprehensive logging will pinpoint exactly where the 10+ second lag occurs.

## Next Steps After Testing

1. Identify the specific bottleneck from console logs
2. Implement targeted optimization (e.g., virtualization, chunking, web workers)
3. Test fix with same large document
4. Verify mouse responsiveness improvement
