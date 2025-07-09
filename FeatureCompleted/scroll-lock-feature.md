# Scroll Lock Feature PRD

## Overview
Implement a scroll lock button that synchronizes scrolling across the two input panels and the output panel, allowing users to review aligned content simultaneously.

## User Story
As a user comparing two documents, I want to lock the scroll position across all three panels so that when I scroll in one panel, the other panels scroll proportionally to maintain visual alignment and facilitate easier comparison.

## Current Architecture Analysis

### Panel Structure
1. **Input Panel 1**: `TextInputPanel` component with `<textarea>` in `.glass-panel-inner-content`
2. **Input Panel 2**: `TextInputPanel` component with `<textarea>` in `.glass-panel-inner-content`  
3. **Output Panel**: `RedlineOutput` component with `<div>` content in `.glass-panel-inner-content`

### Scroll Areas
- **Input Panels**: `<textarea>` elements with `overflow-y-auto` (line 270 in TextInputPanel.tsx)
- **Output Panel**: `<div>` with chunked content and `overflow-y-auto` (lines 74-80 in RedlineOutput.tsx)

### Button Placement ✨ (Updated)
**Desktop**: Consolidated vertical controls array - circular button in center between input panels  
**Mobile**: Horizontal controls row with visual indicator dot when active  
**Position**: Part of the minimalist operation buttons array for streamlined UX

## Technical Implementation Plan

### 1. State Management (SSMR Safe)
```typescript
// Add to ComparisonInterface.tsx state
const [isScrollLocked, setIsScrollLocked] = useState(false);
const scrollRefs = useRef({
  input1: null as HTMLElement | null,
  input2: null as HTMLElement | null,
  output: null as HTMLElement | null
});
const isScrolling = useRef(false); // Prevent infinite loops
```

### 2. Scroll Lock Button Component ✨ (Updated)

#### Desktop (Circular Button in Vertical Array)
```jsx
{/* Scroll Lock Button - Part of consolidated vertical controls */}
<button
  data-scroll-lock-toggle
  onClick={() => setIsScrollLocked(!isScrollLocked)}
  className={`enhanced-button flex items-center justify-center w-12 h-12 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl relative ${
    isScrollLocked 
      ? 'bg-theme-primary-500 text-white hover:bg-theme-primary-600' 
      : 'bg-theme-neutral-300 text-theme-neutral-700 hover:bg-theme-neutral-400'
  }`}
  title={isScrollLocked ? "Unlock scroll synchronization" : "Lock scroll synchronization"}
>
  <Lock className={`w-5 h-5 transition-all duration-300 ${isScrollLocked ? '' : 'opacity-60'}`} />
  {isScrollLocked && (
    <div className="absolute -top-1 -right-1 w-3 h-3 bg-theme-primary-300 rounded-full animate-pulse"></div>
  )}
</button>
```

#### Mobile (Horizontal Row with Enhanced Indicator)
```jsx
{/* Scroll Lock Button - Mobile version with larger indicator */}
<button
  data-scroll-lock-toggle
  onClick={() => setIsScrollLocked(!isScrollLocked)}
  className={`enhanced-button flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 shadow-lg relative overflow-visible ${
    isScrollLocked 
      ? 'bg-theme-primary-500 text-white hover:bg-theme-primary-600' 
      : 'bg-theme-neutral-300 text-theme-neutral-700 hover:bg-theme-neutral-400'
  }`}
  title={isScrollLocked ? "Unlock scroll synchronization" : "Lock scroll synchronization"}
>
  <Lock className={`w-4 h-4 transition-all duration-300 ${isScrollLocked ? '' : 'opacity-60'}`} />
  <span>Scroll</span>
  {isScrollLocked && (
    <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-400 rounded-full animate-pulse z-20 border-2 border-white shadow-lg"></div>
  )}
</button>
```

### 3. Scroll Synchronization Logic

#### Element Detection Strategy
```typescript
const updateScrollRefs = useCallback(() => {
  // Safe selector strategy with fallbacks
  const inputPanels = document.querySelectorAll('[data-input-panel] .glass-panel-inner-content textarea');
  const outputPanel = document.querySelector('.glass-panel.glass-content-panel:not([data-input-panel]) .glass-panel-inner-content');
  
  scrollRefs.current = {
    input1: inputPanels[0] as HTMLElement || null,
    input2: inputPanels[1] as HTMLElement || null,
    output: outputPanel as HTMLElement || null
  };
}, []);
```

#### Percentage-Based Sync (Recommended Approach)
```typescript
const syncScroll = useCallback((sourceElement: HTMLElement, scrollTop: number) => {
  if (!isScrollLocked || isScrolling.current) return;
  
  isScrolling.current = true;
  
  const sourceScrollPercentage = scrollTop / (sourceElement.scrollHeight - sourceElement.clientHeight);
  
  Object.values(scrollRefs.current).forEach(element => {
    if (element && element !== sourceElement) {
      const targetScrollTop = sourceScrollPercentage * (element.scrollHeight - element.clientHeight);
      element.scrollTop = Math.max(0, targetScrollTop);
    }
  });
  
  // Use RAF to reset flag for smooth performance
  requestAnimationFrame(() => {
    isScrolling.current = false;
  });
}, [isScrollLocked]);
```

#### Event Listener Management
```typescript
useEffect(() => {
  if (!isScrollLocked) return;
  
  updateScrollRefs();
  
  const handleScroll = (e: Event) => {
    const target = e.target as HTMLElement;
    syncScroll(target, target.scrollTop);
  };
  
  // Add listeners to all scroll areas
  Object.values(scrollRefs.current).forEach(element => {
    if (element) {
      element.addEventListener('scroll', handleScroll, { passive: true });
    }
  });
  
  return () => {
    Object.values(scrollRefs.current).forEach(element => {
      if (element) {
        element.removeEventListener('scroll', handleScroll);
      }
    });
  };
}, [isScrollLocked, syncScroll, updateScrollRefs]);
```

### 4. Implementation Steps (SSMR)

#### Step 1: Add State and Button (Safe)
- Add scroll lock state to ComparisonInterface
- Add button UI without functionality
- Test visual integration

#### Step 2: Add Element Detection (Modular)
- Implement safe element selection
- Add ref management
- Test element detection

#### Step 3: Add Sync Logic (Reversible)
- Implement percentage-based scroll sync
- Add event listeners with cleanup
- Test with USE_CSS_RESIZE flag

#### Step 4: Enhancement and Polish
- Add visual feedback
- Optimize performance
- Add keyboard shortcuts (optional)

## Solution Priorities

### 1. Simplest: Percentage-Based Sync ⭐ **Recommended**
- **Pros**: Works with all content types, reliable, simple to implement
- **Cons**: May not align exact lines for different content structures
- **Use Case**: General scrolling alignment for visual comparison

### 2. Enhanced: Line-Based Sync
- **Pros**: More precise alignment for text content
- **Cons**: Complex, requires content analysis, may break with dynamic content
- **Use Case**: Precise line-by-line comparison

### 3. Advanced: Smart Adaptive Sync
- **Pros**: Handles dynamic content loading, optimal user experience
- **Cons**: Most complex, potential performance impact
- **Use Case**: Production-ready advanced feature

## Technical Considerations

### Performance
- Use `requestAnimationFrame` for smooth scrolling
- Implement passive event listeners
- Debounce rapid scroll events

### Reliability
- Safe element selection with fallbacks
- Graceful degradation if elements not found
- Cleanup on component unmount

### User Experience
- Clear visual feedback for lock state
- Smooth transitions
- Preserve scroll lock state during resizing

### Browser Compatibility
- Uses standard scroll APIs
- Fallback for older browsers
- Touch device compatibility

## Success Criteria
1. ✅ Button toggles scroll lock state visually
2. ✅ All three panels scroll proportionally when locked
3. ✅ No infinite scroll loops or performance issues
4. ✅ Works with both CSS and React resize modes
5. ✅ Graceful handling of dynamic content changes
6. ✅ Accessible keyboard navigation
7. ✅ **NEW**: Consolidated into minimalist vertical button array
8. ✅ **NEW**: Mobile support with enhanced visual indicators
9. ✅ **NEW**: Animated indicator dots for clear active state feedback
10. ✅ **NEW**: Consistent design language across desktop and mobile

## Future Enhancements
- Keyboard shortcut (Ctrl+L) for toggle
- Smart scroll alignment for matching content
- Scroll position memory between lock/unlock
- ~~Visual indicators showing synchronized positions~~ ✅ **IMPLEMENTED**

## Recent Enhancements ✨ (2025-07-04)

### Mobile Optimization
- **Enhanced indicator dots**: Larger size (4x4 vs 3x3) for better visibility
- **Better positioning**: Improved top-right placement with overflow handling
- **Visual contrast**: White borders and shadows for clarity
- **Touch-friendly**: Meets accessibility guidelines for touch targets

### Design Consolidation
- **Minimalist approach**: Part of unified vertical controls array
- **Consistent styling**: Matches other operational buttons
- **Safety considerations**: Logical grouping away from destructive actions
- **Responsive design**: Graceful degradation from circular to rectangular buttons

### Technical Improvements
- **Layout adaptation**: Automatic detection of Option C vs other layouts
- **Ref-based architecture**: Uses elegant output panel ref detection
- **Performance optimized**: RequestAnimationFrame for smooth scrolling
- **Cross-platform**: Works consistently across desktop and mobile

---

*Created: 2025-07-04*  
*Status: ✅ Fully Implemented & Enhanced*  
*Priority: Enhancement*  
*Complexity: Medium*
