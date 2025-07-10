import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './styles/themes/themes.css';
import { ThemeProvider } from './contexts/ThemeContext';
// STEP 1: Import Background Language Loader (Safe, Modular)
import { BackgroundLanguageLoader } from './services/BackgroundLanguageLoader';

// Development console control - set to false for quiet development
const ENABLE_DEV_LOGS = true; // Toggle this for clean development console

if (process.env.NODE_ENV === 'development' && !ENABLE_DEV_LOGS) {
  // Suppress all development noise for a clean console
  const originalLog = console.log;
  const originalWarn = console.warn;
  
  console.log = (...args) => {
    // Only show critical app logs
    if (args[0]?.includes?.('🚀') || args[0]?.includes?.('❌') || args[0]?.includes?.('🧹')) {
      originalLog.apply(console, args);
    }
  };
  
  console.warn = (...args) => {
    // Suppress Tesseract warnings and other noise
    if (args[0]?.includes?.('Parameter not found:') || 
        args[0]?.includes?.('Download the React DevTools') ||
        args[0]?.includes?.('🎯 CSS OUTPUT RESIZE')) {
      return;
    }
    originalWarn.apply(console, args);
  };
}

// Conditional StrictMode - only in development
const AppWithProvider = (
  <ThemeProvider>
    <App />
  </ThemeProvider>
);

createRoot(document.getElementById('root')!).render(
  process.env.NODE_ENV === 'development' 
    ? <StrictMode>{AppWithProvider}</StrictMode>
    : AppWithProvider
);

// STEP 1b: Safe Background Language Loading (SSMR Implementation)
// Initialize after a short delay to ensure app is fully loaded
setTimeout(async () => {
  try {
    if (process.env.NODE_ENV === 'development') {
      // console.log('🚀 Initializing background language loading...');
    }
    await BackgroundLanguageLoader.startBackgroundLoading();
    if (process.env.NODE_ENV === 'development') {
      // console.log('✅ Background language loading started successfully');
    }
  } catch (error) {
    console.warn('⚠️ Background language loading failed (non-critical):', error);
    // Graceful degradation - app continues to work normally
  }
}, 2000); // 2 second delay ensures app is ready

// STEP 1c: Safe Cleanup (Reversible)
// Cleanup background loader on page unload
window.addEventListener('beforeunload', async () => {
  try {
    await BackgroundLanguageLoader.cleanup();
  } catch (error) {
    console.warn('Background loader cleanup error (non-critical):', error);
  }
});
