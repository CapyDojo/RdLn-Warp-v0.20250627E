# 🎯 Quick Reference: Complete Component Address & Phone Book

*Your comprehensive architectural guide for all app components*

## 📍 **MAJOR PANELS** (Data Addresses)

### Input Panels (Desktop + Mobile Unified Layout)
- **Container**: `[data-input-panel]` 
- **Inner Content**: `[data-input-panel] .glass-panel-inner-content`
- **Text Areas**: `[data-input-panel] .glass-panel-inner-content textarea`
- **Desktop Layout**: Side-by-side panels (`grid grid-cols-2 gap-6`)
- **Mobile Layout**: Stacked panels with integrated resize handle between them
- **Mobile Special Classes**: `.mobile-top-panel`, `.mobile-bottom-panel` for unified corners

### Output Panel ✨ (Elegant Architecture)
- **Container**: `[data-output-panel]`
- **Inner Content**: `[data-output-panel] .glass-panel-inner-content`

## 🎛️ **CONTROL ELEMENTS** (Data Addresses)

### Status Control Bar ✨ (Simplified)
- **Container**: `[data-control-bar]`
- **Cancel Button**: `[data-cancel-button]` (only when processing)

### Consolidated Vertical Controls Array 🎯 (Primary Interface)
**Desktop**: Circular buttons in vertical center between input panels
**Mobile**: Horizontal row with same functionality + visual indicators

- **Compare Button**: `[data-compare-button]` (only when auto-compare disabled)
- **Auto-Compare Toggle**: `[data-auto-compare-toggle]` ⚡ (with animated indicator)
- **Swap Content (Desktop)**: `[data-swap-content-button]`
- **Swap Content (Mobile)**: `[data-swap-content-button-mobile]`
- **Scroll Lock Toggle**: `[data-scroll-lock-toggle]` 🔒 (with animated indicator)
- **System Protection Toggle**: `[data-system-protection-toggle]`
- **Reset Button**: `[data-reset-button]` ⚠️ (separated with gap to prevent accidents)

### Resize Handles (Smart Layout Detection)
- **Input Panels Resize**: `[data-resize-handle="input-panels"]`
  - **Desktop**: Handle below both panels with character counts
  - **Mobile**: Handle between panels with unified design (left: original chars, center: dots, right: revised chars)
- **Output Panel Resize**: `[data-resize-handle="output-panel"]`
- **Smart Functionality**: Automatically detects visible layout using `offsetParent` visibility detection

## 📞 **DIRECT PHONE LINES** (React Refs)

### TextInputPanel Component
- **Main Text Area**: `textareaRef` → Direct textarea access
- **OCR Language Controls**: `segmentedControlRef` → Language selector

### RedlineOutput Component ✨ (Elegant Fix)
- **Scroll Container**: `scrollRef` (passed from parent)
- **Internal Scroll**: `scrollContainerRef` (internal component ref)

### ComparisonInterface (Master Controller) - Enhanced Mobile Support
- **Desktop Input Panels**: `desktopInputPanelsRef` → Desktop layout wrapper
- **Mobile Input Panels**: `mobileInputPanelsRef` → Mobile layout wrapper  
- **Output Panel Direct**: `redlineOutputRef` → Output scroll container
- **Desktop Resize Handle**: `desktopResizeHandleRef` → Desktop input resize control
- **Mobile Resize Handle**: `mobileResizeHandleRef` → Mobile input resize control
- **Output Resize Handle**: `outputResizeHandleRef` → Output resize control
- **Smart Resize Logic**: Uses visibility detection to target active layout automatically

### ThemeSelector Component
- **Themes Button**: `themesButtonRef` → Theme button positioning

## 🏗️ **COMPLETE ARCHITECTURAL HOOKS** (At-a-Glance)

### 📦 **Container Selectors** (CSS/DOM Queries)
```css
/* MAJOR PANELS */
[data-input-panel]                    /* Input panel containers */
[data-output-panel]                   /* Output panel container */

/* STATUS CONTROL BAR (Simplified) */
[data-control-bar]                    /* Status display + cancel button */
[data-cancel-button]                  /* Cancel operation (when processing) */

/* CONSOLIDATED VERTICAL CONTROLS (Primary Interface) */
[data-compare-button]                 /* Compare action (when auto-compare off) */
[data-auto-compare-toggle]            /* Auto-compare toggle with indicator */
[data-swap-content-button]            /* Desktop content swap */
[data-swap-content-button-mobile]     /* Mobile content swap */
[data-scroll-lock-toggle]             /* Scroll sync with indicator */
[data-system-protection-toggle]       /* System protection mode */
[data-reset-button]                   /* Reset/new comparison (isolated) */

/* RESIZE HANDLES */
[data-resize-handle="input-panels"]    /* Input panels resize */
[data-resize-handle="output-panel"]    /* Output panel resize */

/* NESTED CONTENT AREAS */
[data-input-panel] .glass-panel-inner-content textarea  /* Input text areas */
[data-output-panel] .glass-panel-inner-content          /* Output content area */
```

### 📞 **Direct Ref Access** (JavaScript/React)
```typescript
// MAIN COMPONENT REFS (Enhanced Mobile Support)
redlineOutputRef.current              // Output panel scroll container
desktopInputPanelsRef.current         // Desktop input panels wrapper
mobileInputPanelsRef.current          // Mobile input panels wrapper
desktopResizeHandleRef.current        // Desktop input resize handle
mobileResizeHandleRef.current         // Mobile input resize handle
outputResizeHandleRef.current         // Output resize handle

// TEXTINPUTPANEL REFS
textareaRef.current                   // Direct textarea access
segmentedControlRef.current           // OCR language selector

// REDLINEOUTPUT REFS  
scrollRef.current                     // Scroll container (passed from parent)
scrollContainerRef.current            // Internal scroll container

// THEMESELECTOR REFS
themesButtonRef.current               // Theme button container
```

## 🗣️ Perfect Prompting Phrases

### When Something Works on Input But Not Output
✅ **"This works on input panels (data-input-panel) but not output panel (data-output-panel)"**

### When You Need Panel Modifications
✅ **"Can you modify the [input/output] panel using the [ref/container] approach?"**

### When You Want Me to Choose the Best Method
✅ **"Given our ref-based architecture, what's the best way to [specific task]?"**

### When Panel Detection Fails
✅ **"The [input/output] panel detection is failing - should we check the ref or container selector?"**

## 🎯 Component Architecture Summary

```typescript
// INPUT PANELS (Well-established pattern)
<div data-input-panel>
  <TextInputPanel textareaRef={textareaRef} />
</div>

// OUTPUT PANEL (New elegant pattern)
<div data-output-panel>
  <RedlineOutput scrollRef={redlineOutputRef} />
</div>

// PARENT CONTROLLER
const redlineOutputRef = useRef<HTMLDivElement>(null);
const textareaRef = useRef<HTMLTextAreaElement>(null);
```

## 🔧 Access Methods Quick Guide

| Need | Use This | Example |
|------|----------|---------|
| **CSS Styling** | Container address | `[data-output-panel] .glass-panel` |
| **Direct DOM Access** | Phone line (ref) | `redlineOutputRef.current` |
| **Scroll Operations** | Phone line (ref) | `scrollRef.current.scrollTop` |
| **General Queries** | Container address | `document.querySelector('[data-input-panel]')` |
| **Performance Critical** | Phone line (ref) | Always use refs for speed |

## 🚨 Red Flag Phrases (Tell Me Immediately!)

- *"Panel detection is unreliable"*
- *"Works on input but not output"*
- *"Need to hunt for the output panel"*
- *"Complex DOM queries required"*

## 🎉 Magic Words for Future Success

- **"Use our established panel pattern"**
- **"Check both ref and container approaches"**
- **"Given our architectural fix..."**
- **"Should this use the direct ref or container selector?"**

## 📋 Quick Diagnostic Questions

**When things go wrong, ask:**
1. Which panel? (input = `data-input-panel`, output = `data-output-panel`)
2. What access method? (ref for direct, container for queries)
3. Is this performance critical? (yes = use refs)
4. Does it work on input panels? (if yes, architectural difference)

---

**Remember**: You don't need to memorize this - just mention which panel and what you want to do. I'll automatically use our elegant architectural patterns! 🎯
