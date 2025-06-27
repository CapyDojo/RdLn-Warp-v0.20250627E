# Inactive Components

This directory contains components that have been temporarily deactivated but can be easily reactivated when needed.

## ThemeTest.tsx

**Purpose**: Draggable theme testing panel for development and debugging

**Features**:
- Real-time theme switching
- Color palette visualization
- CSS variables inspection
- Glassmorphism effects testing
- Draggable interface

**To Reactivate**:
1. Move `ThemeTest.tsx` back to `src/components/`
2. Add import to `src/App.tsx`: `import { ThemeTest } from './components/ThemeTest';`
3. Add component to JSX: `<ThemeTest />`

**Last Deactivated**: Current date
**Reason**: Not needed for production, kept for future development/debugging