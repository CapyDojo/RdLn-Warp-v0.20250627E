# Themes Structure Reference

## Theme System Overview

Based on my exploration, here's the comprehensive structure of your theming system:

### **Core Theme Architecture**

1. **Theme Definitions** (`src/themes/definitions/`):
   - 8 themes available: `professional`, `bamboo`, `apple-dark`, `kyoto`, `new-york`, `autumn`, `classic-light`, `classic-dark`
   - Each theme defines color palettes (primary, secondary, accent, neutral) with 50-900 shades
   - Glassmorphism effects configuration (blur, opacity, shadows, animations)

2. **Theme Context System** (`src/contexts/ThemeContext.tsx`):
   - Centralized theme management with React context
   - CSS variable generation and application
   - Performance-optimized theme switching
   - LocalStorage persistence

3. **CSS Variable Architecture** (`src/themes/utils/cssVariables.ts`):
   - Dynamic CSS variable generation for optimal performance
   - Button-specific variable mapping for each theme
   - Glassmorphism effect variables
   - Color transformation utilities

### **UI Component Structure**

1. **Core Components**:
   - `Header.tsx` - Navigation and theme selector
   - `ComparisonInterface.tsx` - Main interface with performance demos
   - `TextInputPanel.tsx` - Input areas with OCR support
   - `RedlineOutput.tsx` - Results display
   - `ThemeSelector.tsx` - Theme switching dropdown

2. **Styling System**:
   - `src/styles/glassmorphism.css` - Advanced glassmorphism effects for each theme
   - Theme-aware Tailwind classes (`bg-theme-primary-600`, `text-theme-neutral-500`, etc.)
   - Enhanced button system with WCAG AAA compliance (7:1 contrast ratios)

### **Theme-Specific Elements for Fine-Tuning**

Here are the key areas where you can fine-tune UI elements for each theme:

#### **1. Button System** (Optimized for Instant Switching)
```typescript
// Location: src/themes/utils/cssVariables.ts
const buttonMappings = {
  'theme-name': {
    primary: { bg: '#color', border: '#color', text: '#color', hover: '#color' },
    accent: { bg: '#color', border: '#color', text: '#color', hover: '#color' },
    neutral: { bg: '#color', border: '#color', text: '#color', hover: '#color' },
    light: { bg: '#color', border: '#color', text: '#color', hover: '#color' },
    light2: { bg: '#color', border: '#color', text: '#color', hover: '#color' }
  }
}
```

#### **2. Glassmorphism Effects** (Per Theme)
```css
/* Location: src/styles/glassmorphism.css */
[data-theme="theme-name"] .glass-panel {
  background: rgba(colors, opacity) !important;
  border: 1px solid rgba(border-color, opacity);
  box-shadow: themed shadows;
  backdrop-filter: blur(theme-specific-blur);
}
```

#### **3. Text Hierarchy** (Theme-Specific)
```css
/* Each theme has specific text color overrides for optimal readability */
[data-theme="theme-name"] .text-body { color: #specific-color !important; }
[data-theme="theme-name"] h1, h2, h3 { color: #header-color !important; }
[data-theme="theme-name"] .text-secondary { color: #secondary-color !important; }
```

#### **4. Theme Color Palettes** (Core Definitions)
```typescript
// Location: src/themes/definitions/theme-name.ts
export const themeConfig: ThemeConfig = {
  colors: {
    primary: { 50: '#lightest', 500: '#base', 900: '#darkest' },
    secondary: { /* supporting colors */ },
    accent: { /* highlight colors */ },
    neutral: { /* text and backgrounds */ }
  },
  effects: GLASSMORPHISM_EFFECTS.premium // or standard/enhanced
}
```

### **Key Files for Theme Fine-Tuning**

1. **Individual Theme Definitions**: `src/themes/definitions/[theme-name].ts`
2. **Button Color Mappings**: `src/themes/utils/cssVariables.ts` (lines 37-130)
3. **Glassmorphism Styling**: `src/styles/glassmorphism.css`
4. **Theme Effects**: `src/themes/utils/effects.ts`
5. **Background Styles**: `src/themes/backgrounds/styles.ts`

### **Theme-Specific Customization Points**

For each theme, you can fine-tune:

- **Color Palettes**: All 4 color groups (primary, secondary, accent, neutral) with 10 shades each
- **Button Appearances**: 5 button types with theme-optimized colors
- **Glassmorphism Effects**: Blur levels, opacity, shadows, animations
- **Text Hierarchies**: Body text, headers, secondary text, interactive elements
- **Background Treatments**: Solid colors, gradients, or glassmorphic overlays
- **Border Styles**: Colors, opacity, and glassmorphic treatments
- **Hover Effects**: Smooth transitions with theme-appropriate feedback

### **Performance Optimizations**

The system is built for performance with:
- CSS variables for instant theme switching (< 50ms)
- Batch DOM updates via `requestAnimationFrame`
- Optimized button system with pre-computed color mappings
- WCAG AAA compliance (7:1 contrast ratios) across all themes

This architecture allows you to fine-tune any aspect of each theme while maintaining excellent performance and accessibility standards.

## **Recent Fixes Applied**

### **Uniform Glassmorphic Panel Hover Effects (SSMR)**

**Issue Resolved**: Inconsistent hover effects across themes where some themes (Professional Blue, Bamboo Morning, NYC Dusk) had borders changing to white instead of intensifying the original theme colors.

**Solution**: Copied the working hover effect pattern from Classic Light/Dark themes and adapted colors for each theme:

```css
/* Standard Pattern Applied to All Themes */
[data-theme="theme-name"] .glass-panel:hover {
  background: rgba(theme-bg, var(--glass-focus));
  box-shadow: 0 12px 40px 0 rgba(accent-color, var(--glass-strong)), 0 4px 16px 0 rgba(14, 165, 233, var(--glass-panel)) !important;
  border-color: rgba(theme-border-color, var(--glass-strong));
}
```

**Key Improvements**:
- ✅ Uniform shadow intensification across all themes
- ✅ Border colors now properly intensify original theme colors (no more white flash)
- ✅ Consistent visual feedback matching Classic Light/Dark reference standards
- ✅ Maintained theme-specific color palettes and identities

**Themes Fixed**: Professional Blue, Bamboo Morning, NYC Dusk
**Reference Standards**: Classic Light, Classic Dark (working correctly)
