# Button System Technical Reference

## CSS Variable Architecture

### Core Button Variables

Each theme generates the following CSS variables for optimal performance:

```css
:root {
  /* Primary Buttons (Compare, Test buttons) */
  --button-primary-bg: #1e40af;
  --button-primary-border: #1d4ed8;
  --button-primary-text: #ffffff;
  --button-primary-hover: #1e3a8a;

  /* Accent Buttons (Auto-Compare toggle, action buttons) */
  --button-accent-bg: #dc2626;
  --button-accent-border: #b91c1c;
  --button-accent-text: #ffffff;
  --button-accent-hover: #b91c1c;

  /* Neutral Buttons (New Comparison, secondary actions) */
  --button-neutral-bg: #374151;
  --button-neutral-border: #4b5563;
  --button-neutral-text: #ffffff;
  --button-neutral-hover: #1f2937;

  /* Light Buttons (Auto-Compare Off state) */
  --button-light-bg: #e2e8f0;
  --button-light-border: #cbd5e1;
  --button-light-text: #1e293b;
  --button-light-hover: #cbd5e1;
  --button-light-hover-text: #0f172a;

  /* Light2 Buttons (Secondary light buttons) */
  --button-light2-bg: #cbd5e1;
  --button-light2-border: #94a3b8;
  --button-light2-text: #1e293b;
}
```

### CSS Class Mapping

```css
/* Primary buttons use bg-theme-primary-600 */
.bg-theme-primary-600 {
  background-color: var(--button-primary-bg) !important;
  border-color: var(--button-primary-border) !important;
  color: var(--button-primary-text) !important;
}

/* Accent buttons use bg-theme-accent-600 or bg-theme-accent-500 */
.bg-theme-accent-600,
.bg-theme-accent-500 {
  background-color: var(--button-accent-bg) !important;
  border-color: var(--button-accent-border) !important;
  color: var(--button-accent-text) !important;
}

/* Neutral buttons use bg-theme-neutral-600 */
.bg-theme-neutral-600 {
  background-color: var(--button-neutral-bg) !important;
  border-color: var(--button-neutral-border) !important;
  color: var(--button-neutral-text) !important;
}

/* Light buttons use bg-theme-neutral-100 */
.bg-theme-neutral-100 {
  background-color: var(--button-light-bg) !important;
  border-color: var(--button-light-border) !important;
  color: var(--button-light-text) !important;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
}

/* Light2 buttons use bg-theme-neutral-200 */
.bg-theme-neutral-200 {
  background-color: var(--button-light2-bg) !important;
  border-color: var(--button-light2-border) !important;
  color: var(--button-light2-text) !important;
}
```

## Theme-Specific Color Mappings

### Professional Theme
```typescript
'professional': {
  primary: { bg: '#1e40af', border: '#1d4ed8', text: '#ffffff', hover: '#1e3a8a' },
  accent: { bg: '#dc2626', border: '#b91c1c', text: '#ffffff', hover: '#b91c1c' },
  neutral: { bg: '#374151', border: '#4b5563', text: '#ffffff', hover: '#1f2937' },
  light: { bg: '#e2e8f0', border: '#cbd5e1', text: '#1e293b', hover: '#cbd5e1', hoverText: '#0f172a' },
  light2: { bg: '#cbd5e1', border: '#94a3b8', text: '#1e293b' }
}
```

### Bamboo Theme (Highest Contrast)
```typescript
'bamboo': {
  primary: { bg: '#1f2937', border: '#374151', text: '#fafafa', hover: '#111827' },
  accent: { bg: '#1f2937', border: '#374151', text: '#fafafa', hover: '#111827' },
  neutral: { bg: '#1f2937', border: '#374151', text: '#fafafa', hover: '#111827' },
  light: { bg: '#f4f4f5', border: '#e4e4e7', text: '#1f2937', hover: '#e4e4e7', hoverText: '#111827' },
  light2: { bg: '#e4e4e7', border: '#d4d4d8', text: '#1f2937' }
}
```

### Apple Light Theme
```typescript
'apple-light': {
  primary: { bg: '#1e40af', border: '#1d4ed8', text: '#ffffff', hover: '#1e3a8a' },
  accent: { bg: '#7c2d12', border: '#9a3412', text: '#ffffff', hover: '#7c2d12' },
  neutral: { bg: '#374151', border: '#4b5563', text: '#ffffff', hover: '#1f2937' },
  light: { bg: '#f1f5f9', border: '#e2e8f0', text: '#1e293b', hover: '#e2e8f0', hoverText: '#0f172a' },
  light2: { bg: '#e2e8f0', border: '#cbd5e1', text: '#1e293b' }
}
```

### Apple Dark Theme
```typescript
'apple-dark': {
  primary: { bg: '#3b82f6', border: '#60a5fa', text: '#ffffff', hover: '#3b82f6' },
  accent: { bg: '#dc2626', border: '#ef4444', text: '#ffffff', hover: '#dc2626' },
  neutral: { bg: '#4b5563', border: '#6b7280', text: '#ffffff', hover: '#374151' },
  light: { bg: '#374151', border: '#4b5563', text: '#f9fafb', hover: '#4b5563', hoverText: '#ffffff' },
  light2: { bg: '#4b5563', border: '#6b7280', text: '#f9fafb' }
}
```

### Kyoto Theme
```typescript
'kyoto': {
  primary: { bg: '#0f172a', border: '#1e293b', text: '#ffffff', hover: '#000000' },
  accent: { bg: '#7f1d1d', border: '#991b1b', text: '#ffffff', hover: '#7f1d1d' },
  neutral: { bg: '#0f172a', border: '#1e293b', text: '#ffffff', hover: '#000000' },
  light: { bg: '#44403c', border: '#57534e', text: '#fef7e6', hover: '#57534e', hoverText: '#ffffff' },
  light2: { bg: '#57534e', border: '#78716c', text: '#fef7e6' }
}
```

### New York Theme
```typescript
'new-york': {
  primary: { bg: '#1e40af', border: '#1d4ed8', text: '#ffffff', hover: '#1e3a8a' },
  accent: { bg: '#dc2626', border: '#b91c1c', text: '#ffffff', hover: '#b91c1c' },
  neutral: { bg: '#374151', border: '#4b5563', text: '#ffffff', hover: '#1f2937' },
  light: { bg: '#374151', border: '#4b5563', text: '#f9fafb', hover: '#4b5563', hoverText: '#ffffff' },
  light2: { bg: '#4b5563', border: '#6b7280', text: '#f9fafb' }
}
```

### Autumn Theme
```typescript
'autumn': {
  primary: { bg: '#0f172a', border: '#1e293b', text: '#ffffff', hover: '#000000' },
  accent: { bg: '#7f1d1d', border: '#991b1b', text: '#ffffff', hover: '#7f1d1d' },
  neutral: { bg: '#0f172a', border: '#1e293b', text: '#ffffff', hover: '#000000' },
  light: { bg: '#e7e5e4', border: '#d6d3d1', text: '#1c1917', hover: '#d6d3d1', hoverText: '#0c0a09' },
  light2: { bg: '#d6d3d1', border: '#a8a29e', text: '#1c1917' }
}
```

## Button Component Usage

### Enhanced Button Base Class
```jsx
// All buttons should use the enhanced-button class
<button className="enhanced-button bg-theme-primary-600 text-white">
  Primary Action
</button>

<button className="enhanced-button bg-theme-accent-500 text-white">
  Secondary Action
</button>

<button className="enhanced-button bg-theme-neutral-600 text-white">
  Neutral Action
</button>

<button className="enhanced-button bg-theme-neutral-100">
  Light Button (Auto-adjusts text color)
</button>
```

### Typography Enhancements
The `enhanced-button` class automatically applies:
- `font-weight: 700` (bold)
- `letter-spacing: 0.025em` (improved readability)
- `text-rendering: optimizeLegibility` (better font rendering)
- `text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2)` (depth)

### Disabled States
```css
.enhanced-button:disabled,
.enhanced-button.disabled {
  background-color: #9ca3af !important;
  border-color: #d1d5db !important;
  color: #374151 !important;
  text-shadow: none !important;
  cursor: not-allowed !important;
  opacity: 0.8 !important;
}
```

## Development Guidelines

### Adding New Button Variants

1. **Define CSS Variables**: Add new variables to the theme mappings
```typescript
// In generateButtonVariables()
variables.push(
  ['--button-new-bg', mapping.newType.bg],
  ['--button-new-border', mapping.newType.border],
  ['--button-new-text', mapping.newType.text]
);
```

2. **Create CSS Class**: Define the new button class
```css
.bg-theme-new-variant {
  --btn-bg: var(--button-new-bg, #default);
  --btn-border: var(--button-new-border, #default);
  --btn-text: var(--button-new-text, #default);
  background-color: var(--btn-bg) !important;
  border-color: var(--btn-border) !important;
  color: var(--btn-text) !important;
}
```

3. **Test Across All Themes**: Ensure WCAG AAA compliance (7:1 contrast ratio)

### Performance Considerations

- **CSS Variables Update**: All button colors change instantly during theme switches
- **Avoid !important Overrides**: Use CSS variable system instead
- **Minimize Specificity**: Keep selectors simple for fast updates
- **Batch Updates**: Theme context updates all variables in one operation

### Accessibility Testing

Use these tools to verify contrast ratios:
```bash
# WebAIM Contrast Checker
# https://webaim.org/resources/contrastchecker/

# Lighthouse Accessibility Audit
npx lighthouse http://localhost:3000 --only-categories=accessibility

# axe-core testing
npm install @axe-core/cli
npx axe http://localhost:3000
```

### Color Contrast Formulas

WCAG AAA requires 7:1 contrast ratio:
```javascript
// Luminance calculation
function getLuminance(rgb) {
  const [r, g, b] = rgb.map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// Contrast ratio calculation
function getContrastRatio(color1, color2) {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}
```

## Troubleshooting

### Common Issues

1. **Buttons Not Updating on Theme Change**
   - Check if CSS variables are properly generated
   - Verify theme context is calling `applyCSSVariables()`
   - Ensure button classes include `enhanced-button`

2. **Poor Contrast in Custom Themes**
   - Use contrast checker tools
   - Verify colors meet 7:1 ratio minimum
   - Test with different screen brightness levels

3. **Performance Degradation**
   - Avoid theme-specific CSS overrides
   - Use CSS variables instead of direct style modifications
   - Minimize DOM queries during theme switching

### Debug Commands

```javascript
// Check current CSS variables in browser console
const root = document.documentElement;
const style = getComputedStyle(root);
console.log('Primary BG:', style.getPropertyValue('--button-primary-bg'));
console.log('Accent BG:', style.getPropertyValue('--button-accent-bg'));

// Measure theme switch performance
const start = performance.now();
// ... theme switch code ...
const end = performance.now();
console.log(`Theme switch took ${end - start} milliseconds`);
```

---

**Last Updated**: July 2025  
**Maintainer**: Development Team  
**Review Status**: Current
