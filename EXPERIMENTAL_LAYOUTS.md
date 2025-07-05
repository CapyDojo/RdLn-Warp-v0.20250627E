# Experimental Layout System

## Overview
This document describes the experimental layout system built to test different responsive approaches for the legal document redlining application. All layouts are designed to be easily removable before production.

## Implementation
- **Safe & Modular**: All experimental code is contained in separate files
- **Reversible**: Easy to remove by deleting layout files and context
- **Non-disruptive**: Current production layout is preserved as fallback

## Layout Options

### Current (Production Backup)
- **CSS Class**: `layout-current`
- **Max Width**: 90rem (1440px) - current production state
- **Approach**: Fixed max-width with centered containers
- **Use Case**: Proven, stable layout for production

### Option A: Traditional Responsive
- **CSS Class**: `layout-option-a`  
- **Max Width**: 95vw with 1440px maximum
- **Approach**: Traditional breakpoint-based responsive design
- **Benefits**: 
  - Works on all browsers (even IE11)
  - Predictable behavior
  - Industry standard
- **Best For**: Legal professionals using older systems

### Option B: Container Queries
- **CSS Class**: `layout-option-b`
- **Max Width**: 90rem (1440px)
- **Approach**: Modern container-based responsive logic
- **Benefits**:
  - Each component decides its own layout intelligently
  - Future-proof approach
  - More logical than viewport-based breakpoints
- **Requirements**: Modern browsers only (2023+)
- **Fallback**: Automatically falls back to current layout if unsupported

### Option C: Fluid Scaling
- **CSS Class**: `layout-option-c`
- **Max Width**: clamp(20rem, 95vw, 90rem)
- **Approach**: Mathematical scaling using CSS clamp()
- **Benefits**:
  - Smooth scaling on any screen size
  - Typography scales proportionally
  - No sudden layout jumps
- **Best For**: Modern displays with varied screen sizes

## Developer Controls

### Access
The layout testing controls are available in the **Developer Mode Card** which appears below the main interface.

### Controls Available
1. **Individual Layout Buttons**: Switch directly to any layout
2. **Quick Cycle Button**: Automatically cycle through all available layouts
3. **Browser Support Indicator**: Shows if container queries are supported
4. **Active Layout Display**: Shows which layout is currently active

### Testing Instructions
1. Open the application in your browser
2. Locate the "Developer Mode" card with layout controls
3. Click any layout button to switch layouts instantly
4. Use "Quick Cycle Layouts" to rapidly compare all options
5. Resize your browser window to test responsive behavior

## File Structure

```
src/
├── contexts/
│   └── LayoutContext.tsx          # Layout state management
├── styles/layouts/
│   ├── current-layout.css         # Production backup
│   ├── option-a-responsive.css    # Traditional responsive
│   ├── option-b-container-queries.css # Container queries
│   └── option-c-fluid-scaling.css # Fluid scaling
└── components/
    └── DeveloperModeCard.tsx      # Testing interface
```

## How It Works

1. **LayoutProvider** wraps the app and manages layout state
2. **Body classes** are applied (`layout-current`, `layout-option-a`, etc.)
3. **CSS imports** in `index.css` load all layout styles
4. **CSS specificity** ensures only the active layout's styles apply
5. **Container classes** target specific layout containers:
   - `.comparison-interface-container` - Main app container
   - `.floating-header` - Fixed header
   - `.footer-container` - Footer container
   - `.input-grid` - Input panel grid
   - `.glass-panel` - All bento boxes

## Browser Support

| Layout | IE11 | Chrome | Firefox | Safari | Edge |
|--------|------|--------|---------|--------|------|
| Current | ✅ | ✅ | ✅ | ✅ | ✅ |
| Option A | ✅ | ✅ | ✅ | ✅ | ✅ |
| Option B | ❌ | 2023+ | 2023+ | 2023+ | 2023+ |
| Option C | ❌ | ✅ | ✅ | ✅ | ✅ |

## Removal Instructions

To remove the experimental layout system before production:

1. **Delete Layout Files**:
   ```bash
   rm -rf src/styles/layouts/
   rm src/contexts/LayoutContext.tsx
   ```

2. **Remove Imports**:
   - Remove layout imports from `src/index.css`
   - Remove LayoutProvider from `src/App.tsx`

3. **Revert Container Classes**:
   - Change `.comparison-interface-container` back to `max-w-7xl mx-auto px-3 py-4`
   - Change `.footer-container` back to `max-w-7xl mx-auto px-3 py-6`
   - Change `.input-grid` back to `grid grid-cols-1 lg:grid-cols-2 gap-6`

4. **Remove Developer Controls**:
   - Remove layout controls from `DeveloperModeCard.tsx`

## Testing Recommendations

1. **Test on Multiple Devices**: Mobile, tablet, desktop, ultrawide
2. **Test Browser Compatibility**: Especially for legal professionals using older systems
3. **Test with Real Content**: Use actual legal documents of varying lengths
4. **Test Performance**: Monitor rendering performance on each layout
5. **User Testing**: Get feedback from legal professionals on usability

## Architecture Benefits

- **SSMR Compliance**: Safe, Step-by-step, Modular, Reversible
- **Zero Risk**: Production layout is unchanged
- **Easy Comparison**: Switch between layouts instantly
- **Clean Removal**: No traces left after deletion
- **Documented**: Clear instructions for maintenance

## Next Steps

1. **Test Each Layout** thoroughly in different scenarios
2. **Gather User Feedback** from legal professionals
3. **Performance Testing** on various devices
4. **Choose Final Approach** based on test results
5. **Clean Removal** of unused experimental code
6. **Production Deploy** with chosen layout approach
