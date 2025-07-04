# 🎯 Quick Reference: Complete Component Address & Phone Book

*Your comprehensive architectural guide for all app components*

## 📍 **MAJOR PANELS** (Data Addresses)

### Input Panels
- **Container**: `[data-input-panel]` 
- **Inner Content**: `[data-input-panel] .glass-panel-inner-content`
- **Text Areas**: `[data-input-panel] .glass-panel-inner-content textarea`

### Output Panel ✨ (Elegant Architecture)
- **Container**: `[data-output-panel]`
- **Inner Content**: `[data-output-panel] .glass-panel-inner-content`

## 🎛️ **CONTROL ELEMENTS** (Data Addresses)

### Main Control Bar
- **Container**: `[data-control-bar]`
- **Compare Button**: `[data-compare-button]`
- **Reset Button**: `[data-reset-button]`
- **Auto-Compare Toggle**: `[data-auto-compare-toggle]`
- **System Protection Toggle**: `[data-system-protection-toggle]`
- **Cancel Button**: `[data-cancel-button]`

### Interactive Controls
- **Swap Content (Desktop)**: `[data-swap-content-button]`
- **Swap Content (Mobile)**: `[data-swap-content-button-mobile]`
- **Scroll Lock Toggle**: `[data-scroll-lock-toggle]`

### Resize Handles
- **Input Panels Resize**: `[data-resize-handle="input-panels"]`
- **Output Panel Resize**: `[data-resize-handle="output-panel"]`

## 📞 **DIRECT PHONE LINES** (React Refs)

### TextInputPanel Component
- **Main Text Area**: `textareaRef` → Direct textarea access
- **OCR Language Controls**: `segmentedControlRef` → Language selector

### RedlineOutput Component ✨ (Elegant Fix)
- **Scroll Container**: `scrollRef` (passed from parent)
- **Internal Scroll**: `scrollContainerRef` (internal component ref)

### ComparisonInterface (Master Controller)
- **Input Panels Container**: `inputPanelsRef` → Input panels wrapper
- **Output Panel Direct**: `redlineOutputRef` → Output scroll container
- **Input Resize Handle**: `resizeHandleRef` → Input resize control
- **Output Resize Handle**: `outputResizeHandleRef` → Output resize control

### ThemeSelector Component
- **Themes Button**: `themesButtonRef` → Theme button positioning

## 🏗️ **COMPLETE ARCHITECTURAL HOOKS** (At-a-Glance)

### 📦 **Container Selectors** (CSS/DOM Queries)
```css
/* MAJOR PANELS */
[data-input-panel]                    /* Input panel containers */
[data-output-panel]                   /* Output panel container */

/* CONTROL BAR */
[data-control-bar]                    /* Main control container */
[data-compare-button]                 /* Primary compare action */
[data-reset-button]                   /* Reset/new comparison */
[data-auto-compare-toggle]            /* Auto-compare on/off */
[data-system-protection-toggle]       /* System protection mode */
[data-cancel-button]                  /* Cancel operation */

/* INTERACTIVE CONTROLS */
[data-swap-content-button]            /* Desktop content swap */
[data-swap-content-button-mobile]     /* Mobile content swap */
[data-scroll-lock-toggle]             /* Scroll synchronization */

/* RESIZE HANDLES */
[data-resize-handle="input-panels"]    /* Input panels resize */
[data-resize-handle="output-panel"]    /* Output panel resize */

/* NESTED CONTENT AREAS */
[data-input-panel] .glass-panel-inner-content textarea  /* Input text areas */
[data-output-panel] .glass-panel-inner-content          /* Output content area */
```

### 📞 **Direct Ref Access** (JavaScript/React)
```typescript
// MAIN COMPONENT REFS
redlineOutputRef.current              // Output panel scroll container
inputPanelsRef.current                // Input panels wrapper
resizeHandleRef.current               // Input resize handle
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
